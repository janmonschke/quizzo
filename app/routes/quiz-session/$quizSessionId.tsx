import type {
  Answer,
  AwardedPoints,
  Host,
  Question,
  Quiz,
  QuizSession,
  Team,
} from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { H1, H2 } from "~/components/Headlines";
import QuestionComponent from "~/components/Question";
import { Timer } from "~/components/Timer";
import { db } from "~/db.server";
import PrevNextButton from "./PrevNextButton";
import TeamAnswer from "./TeamAnswer";
import Teams from "./Teams";

type TeamWithPoints = Team & { AwardedPoints: AwardedPoints[] };

type LoaderData = {
  quizSession: QuizSession & { Answers: Answer[] } & {
    Teams: TeamWithPoints[];
  } & { host: Host } & {
    quiz: Quiz & { Questions: Question[] };
  };
};

export const loader: LoaderFunction = async ({ params }) => {
  const { quizSessionId } = params;
  if (!quizSessionId) {
    throw new Error("quizSessionId missing");
  }

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
  const { quizSession } = useLoaderData<LoaderData>();
  const question = quizSession.quiz.Questions[quizSession.currentPosition];

  return (
    <div className="flex flex-col gap-2">
      <H1>{quizSession.quiz.name}</H1>
      <Teams teams={quizSession.Teams} />
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <H2>
            Question {quizSession.currentPosition + 1} of{" "}
            {quizSession.quiz.Questions.length}
          </H2>
          <div className="flex gap-2 my-2">
            <PrevNextButton
              questions={quizSession.quiz.Questions}
              direction={-1}
              quizSession={quizSession}
            />
            <PrevNextButton
              questions={quizSession.quiz.Questions}
              direction={1}
              quizSession={quizSession}
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
