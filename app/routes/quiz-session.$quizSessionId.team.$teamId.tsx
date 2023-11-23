import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  useFetcher,
  useLoaderData,
  useResolvedPath,
  useRevalidator,
} from "@remix-run/react";
import { useCallback, useEffect } from "react";
import { useEventSource } from "remix-utils/sse/react";
import cx from "classnames";
import { H1, H2, H3 } from "~/components/Headlines";
import { Input } from "~/components/Input";
import TeamQuestion from "~/components/TeamQuestion";
import { db } from "~/db.server";
import { Button } from "~/components/Buttons";
import { QuestionType } from "~/types";
import { parseArrayString } from "~/helpers/string_arrays";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { quizSessionId, teamId } = params;

  const quizSession = await db.quizSession.findFirst({
    where: {
      id: quizSessionId,
    },
    include: {
      Teams: {
        where: {
          id: teamId,
        },
      },
      Answers: {
        where: {
          teamId,
        },
      },
      quiz: {
        include: {
          Questions: {
            select: {
              answerOptions: true,
              questionText: true,
              type: true,
              id: true,
            },
            orderBy: {
              position: "asc",
            },
          },
        },
      },
    },
  });

  const team = quizSession?.Teams[0];

  if (!quizSession || !team || !teamId) {
    throw new Response("Not Found", {
      status: 404,
    });
  }

  return json({ teamId, team, quizSession });
};

export default function QuizSessionComponent() {
  const { quizSession, team } = useLoaderData<typeof loader>();
  const revalidator = useRevalidator();
  const answerFetcher = useFetcher();
  const nameChangeFetcher = useFetcher();

  const isSubmitting = answerFetcher.state === "submitting";

  const question = quizSession.quiz.Questions[quizSession.currentPosition];
  const answer = quizSession.Answers.find((a) => a.questionId === question.id);

  const { pathname: createAnswerPath } = useResolvedPath(
    `answer/${question.id}`
  );
  const { pathname: teamNameUpdatePath } = useResolvedPath(`update-name`);

  const latestPosition = useEventSource(
    `/sse/quiz-session/${quizSession.id}/update-position`,
    {
      event: "updatePosition",
    }
  );

  // Need to revalidate when the position changes, otherwise SSE gets out of sync.
  useEffect(() => {
    if (
      latestPosition !== null &&
      // Only revalidate when we are at a different position
      quizSession.currentPosition !== parseInt(latestPosition) &&
      revalidator.state === "idle"
    ) {
      revalidator.revalidate();
    }
  }, [revalidator, latestPosition, quizSession]);

  const submitAnswer = useCallback(
    (event: React.FormEvent<HTMLLabelElement>) => {
      answerFetcher.submit(event.currentTarget.form, {
        method: "POST",
      });
    },
    [answerFetcher]
  );

  return (
    <div className={cx("flex", "flex-col", "gap-2")}>
      <H1>{quizSession.quiz.name}</H1>
      <aside className="flex gap-3 mb-4">
        <H3>Team name:</H3>
        <nameChangeFetcher.Form
          method="post"
          action={teamNameUpdatePath}
          className="flex items-center gap-2"
        >
          <Input
            name="name"
            key={team.name}
            defaultValue={team.name}
            className="w-40"
            disabled={nameChangeFetcher.state === "submitting"}
          />
          {isSetOrSubmitting(
            team.name,
            nameChangeFetcher.state === "submitting"
          )}
        </nameChangeFetcher.Form>
      </aside>
      <H2>
        Question {quizSession.currentPosition + 1} of{" "}
        {quizSession.quiz.Questions.length}
      </H2>
      <div className="my-6">
        <TeamQuestion {...question} />
      </div>
      <div>
        <answerFetcher.Form
          key={question.id}
          method="post"
          action={createAnswerPath}
          className="flex items-center gap-2"
        >
          <Input type="hidden" name="questionId" value={question.id} />
          <Input type="hidden" name="teamId" value={team.id} />
          {answer ? (
            <Input type="hidden" name="answerId" value={answer.id} />
          ) : null}

          {question.type === QuestionType.multipleChoice &&
            question.answerOptions && (
              <div key={answer?.updatedAt} className="flex flex-col gap-4">
                {parseArrayString(question.answerOptions).map(
                  (answerOption) => {
                    const isChecked = answer?.answer === answerOption;
                    return (
                      <label
                        key={answerOption + isChecked}
                        className={cx(
                          "border-2",
                          "rounded-md",
                          "p-3",
                          "hover:border-slate-400",
                          "hover:cursor-pointer",
                          isChecked && "border-cyan-400"
                        )}
                        onChange={submitAnswer}
                      >
                        <input
                          type="radio"
                          name="answer"
                          value={answerOption}
                          defaultChecked={isChecked}
                          className="mr-2"
                        />
                        {answerOption}
                      </label>
                    );
                  }
                )}
              </div>
            )}

          {question.type === QuestionType.freeForm && (
            <>
              <Input
                type="text"
                key={answer?.updatedAt}
                name="answer"
                defaultValue={answer?.answer}
                disabled={isSubmitting}
                placeholder="Answer"
                required
              />
              <Button as="button" type="submit" disabled={isSubmitting}>
                Answer
              </Button>
            </>
          )}

          {isSetOrSubmitting(answer, isSubmitting)}
        </answerFetcher.Form>
      </div>
    </div>
  );
}

function isSetOrSubmitting<T>(thing: T | undefined, isSubmitting: boolean) {
  return isSubmitting ? (
    <span className="animate-spin">↻</span>
  ) : thing ? (
    "👍"
  ) : null;
}
