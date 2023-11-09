import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useEffect } from "react";
import { H1, H2 } from "~/components/Headlines";
import TeamQuestion from "~/components/TeamQuestion";
import { db } from "~/db.server";

export const loader = async ({ params, request }: LoaderArgs) => {
  const { quizSessionId } = params;
  const url = new URL(request.url);
  const teamId = url.searchParams.get("teamId");

  if (!quizSessionId) {
    throw new Error("quizSessionId missing");
  }
  if (!teamId) {
    throw new Error("teamId missing");
  }

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

  return json({ quizSession });
};

export default function QuizSessionComponent() {
  const { quizSession: _session } = useLoaderData<typeof loader>();
  const quizSession = _session!;

  // useEffect(() => {
  //   setTimeout(() => {
  //     window.location.reload();
  //   }, 5000);
  // });

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
