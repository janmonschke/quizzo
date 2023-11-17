import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Form,
  useLoaderData,
  useResolvedPath,
  useRevalidator,
} from "@remix-run/react";
import { useEventSource } from "remix-utils/sse/react";
import type { FormEvent } from "react";
import { useEffect } from "react";
import { H1, H2 } from "~/components/Headlines";
import QuestionComponent from "~/components/Question";
import { Timer } from "~/components/Timer";
import { db } from "~/db.server";
import PrevNextButton from "~/components/quiz-session/PrevNextButton";
import TeamAnswer from "~/components/quiz-session/TeamAnswer";
import Teams from "~/components/quiz-session/Teams";
import { Button } from "~/components/Buttons";
import { ensureHasAccessToQuizSession } from "~/helpers/authorization";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const { quizSessionId } = params;
  const { host } = await ensureHasAccessToQuizSession(quizSessionId, request);

  const quizSession = await db.quizSession.findFirst({
    where: {
      id: quizSessionId,
      hostId: host.id,
    },
    include: {
      Answers: true,
      Teams: {
        include: {
          AwardedPoints: true,
        },
      },
      host: true,
      quiz: {
        include: {
          Questions: {
            orderBy: {
              position: "asc",
            },
          },
        },
      },
    },
  });

  if (!quizSession) {
    throw new Response("Not Found", { status: 404 });
  }

  return json({ quizSession });
};

export default function QuizSessionComponent() {
  const revalidator = useRevalidator();
  const { quizSession } = useLoaderData<typeof loader>();
  const { pathname: deleteSessionPath } = useResolvedPath("delete");

  const answered = useEventSource(
    `/sse/quiz-session/${quizSession.id}/answer`,
    {
      event: "answer",
    }
  );

  // Need to revalidate when a new answer comes in, otherwise SSE gets out of sync.
  useEffect(() => {
    const parsedAnswer = JSON.parse(answered || '{"id":null,"answer":null}');
    // Checking if we already have the answer, to prevent infinite revalidation
    const hasAnswer = quizSession.Answers.find(
      (answer) =>
        answer.id === parsedAnswer.id && answer.answer === parsedAnswer.answer
    );
    if (answered !== null && !hasAnswer && revalidator.state === "idle") {
      revalidator.revalidate();
    }
  }, [revalidator, answered, quizSession]);

  const updatedName = useEventSource(
    `/sse/quiz-session/${quizSession.id}/update-name`,
    {
      event: "updateName",
    }
  );

  // Need to revalidate when a new name comes in, otherwise SSE gets out of sync.
  useEffect(() => {
    // Checking if we already have the name, to prevent infinite revalidation
    const hasName = quizSession.Teams.find((team) => team.name === updatedName);
    if (updatedName !== null && !hasName && revalidator.state === "idle") {
      revalidator.revalidate();
    }
  }, [revalidator, updatedName, quizSession]);

  const question = quizSession.quiz.Questions[quizSession.currentPosition];
  const questionsCount = quizSession.quiz.Questions.length - 1;
  const currentPosition = quizSession.currentPosition;

  return (
    <div className="flex flex-col gap-2">
      <header className="flex flex-row justify-between items-center">
        <H1>{quizSession.quiz.name}</H1>
        <Form
          method="delete"
          action={deleteSessionPath}
          onSubmit={confirmDeletion}
        >
          <Button kind="alert" type="submit" name="newPosition">
            Delete
          </Button>
        </Form>
      </header>
      <Teams teams={quizSession.Teams} sessionId={quizSession.id} />
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <H2>
            Question {currentPosition + 1} of{" "}
            {quizSession.quiz.Questions.length}
          </H2>
          <div className="flex gap-2 my-2">
            <PrevNextButton
              questionsCount={questionsCount}
              direction={-1}
              currentPosition={currentPosition}
            />
            <PrevNextButton
              questionsCount={questionsCount}
              direction={1}
              currentPosition={currentPosition}
            />
          </div>
        </div>
        <Timer />
      </div>
      <div className="my-8">
        <QuestionComponent {...question} />
      </div>
      <table>
        {quizSession.Teams.map((team) => {
          const answer = quizSession.Answers.find(
            (answer) =>
              answer.teamId === team.id && answer.questionId == question.id
          );
          const awardedPoints =
            answer &&
            team.AwardedPoints.find((awp) => answer.id === awp.answerId);
          return (
            <TeamAnswer
              key={`${team.id}-${team.name}-${question.id}`}
              answer={answer}
              awardedPoints={awardedPoints}
              team={team}
              question={question}
            />
          );
        })}
      </table>
    </div>
  );
}

function confirmDeletion(event: FormEvent<HTMLFormElement>) {
  if (!confirm("Are you sure you want to delete the session?")) {
    event.preventDefault();
  }
}
