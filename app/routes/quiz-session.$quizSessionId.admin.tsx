import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { H1, H2 } from "~/components/Headlines";
import QuestionComponent from "~/components/Question";
import { Timer } from "~/components/Timer";
import { db } from "~/db.server";
import PrevNextButton from "~/components/quiz-session/PrevNextButton";
import TeamAnswer from "~/components/quiz-session/TeamAnswer";
import Teams from "~/components/quiz-session/Teams";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { quizSessionId } = params;

  const quizSession = await db.quizSession.findFirst({
    where: {
      id: quizSessionId,
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

  return json({ quizSession });
};

export default function QuizSessionComponent() {
  const { quizSession } = useLoaderData<typeof loader>();

  if (!quizSession) {
    return <H1>Could not find quiz session</H1>;
  }

  const question = quizSession.quiz.Questions[quizSession.currentPosition];
  const questionsCount = quizSession.quiz.Questions.length - 1;
  const currentPosition = quizSession.currentPosition;

  return (
    <div className="flex flex-col gap-2">
      <H1>{quizSession.quiz.name}</H1>
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
            key={`${team.id}-${question.id}`}
            answer={answer}
            awardedPoints={awardedPoints}
            team={team}
            question={question}
          />
        );
      })}
    </div>
  );
}
