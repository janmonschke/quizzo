import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useEffect } from "react";
import { useEventSource } from "remix-utils/sse/react";
import { H1, H2 } from "~/components/Headlines";
import TeamQuestion from "~/components/TeamQuestion";
import { db } from "~/db.server";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { quizSessionId, teamId } = params;

  const quizSession = await db.quizSession.findFirst({
    where: {
      id: quizSessionId,
    },
    include: {
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
            },
            orderBy: {
              position: "asc",
            },
          },
        },
      },
    },
  });

  if (!quizSession) {
    throw new Response("Not Found", {
      status: 404,
    });
  }

  return json({ teamId, quizSession });
};

export default function QuizSessionComponent() {
  const { quizSession } = useLoaderData<typeof loader>();

  const time = useEventSource(`/sse/quiz-session/${quizSession.id}`, {
    event: "time",
  });

  console.log(time);

  const question = quizSession.quiz.Questions[quizSession.currentPosition];

  return (
    <div className="flex flex-col gap-2">
      <H1>{quizSession.quiz.name}</H1>
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <H2>
            Question {quizSession.currentPosition + 1} of{" "}
            {quizSession.quiz.Questions.length}
          </H2>
        </div>
      </div>
      <div className="my-8">
        <TeamQuestion {...question} />
      </div>
    </div>
  );
}
