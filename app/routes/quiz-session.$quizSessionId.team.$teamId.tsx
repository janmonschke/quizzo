import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  useFetcher,
  useLoaderData,
  useResolvedPath,
  useRevalidator,
} from "@remix-run/react";
import { useEffect } from "react";
import { useEventSource } from "remix-utils/sse/react";
import { H1, H2 } from "~/components/Headlines";
import { Input } from "~/components/Input";
import TeamQuestion from "~/components/TeamQuestion";
import { db } from "~/db.server";

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

  return (
    <div className="flex flex-col gap-2">
      <H1>{quizSession.quiz.name}</H1>
      <aside>
        <nameChangeFetcher.Form method="post" action={teamNameUpdatePath}>
          <Input
            name="name"
            key={team.name}
            defaultValue={team.name}
            className="w-40"
          />
        </nameChangeFetcher.Form>
      </aside>
      <H2>
        Question {quizSession.currentPosition + 1} of{" "}
        {quizSession.quiz.Questions.length}
      </H2>
      <div className="my-8">
        <TeamQuestion {...question} />
      </div>
      <div className="my-8">
        <div className="flex items-center gap-4">
          <answerFetcher.Form method="post" action={createAnswerPath}>
            <Input type="hidden" name="questionId" value={question.id} />
            <Input type="hidden" name="teamId" value={team.id} />
            {answer ? (
              <>
                <Input type="hidden" name="answerId" value={answer.id} />
                <Input
                  type="text"
                  key={answer.updatedAt}
                  defaultValue={answer.answer}
                  name="answer"
                />
              </>
            ) : (
              <Input type="text" name="answer" placeholder="Answer" required />
            )}
          </answerFetcher.Form>
        </div>
      </div>
    </div>
  );
}
