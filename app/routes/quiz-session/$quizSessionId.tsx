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
import QuestionComponent from "~/components/Question";
import { db } from "~/db.server";
import Teams from "./Teams";

type LoadedTeam = Team & { AwardedPoints: AwardedPoints[] };

type LoaderData = {
  quizSession: QuizSession & { Answers: Answer[] } & {
    Teams: LoadedTeam[];
  } & { host: Host } & { quiz: Quiz & { Questions: Question[] } };
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
        include: { Questions: true },
      },
    },
  });
  console.log(quizSession);

  return json({ quizSession });
};

export default function QuizSessionComponent() {
  const { quizSession } = useLoaderData<LoaderData>();
  console.log(quizSession);
  const question = quizSession.quiz.Questions[quizSession.currentPosition];

  return (
    <div>
      <h1>{quizSession.quiz.name}</h1>
      <QuestionComponent {...question} />
      <Teams teams={quizSession.Teams} />
      <pre>{JSON.stringify(quizSession, null, 2)}</pre>
    </div>
  );
}
