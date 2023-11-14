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

  if (!quizSession || !teamId) {
    throw new Response("Not Found", {
      status: 404,
    });
  }

  return json({ teamId, quizSession });
};

export default function QuizSessionComponent() {
  const { quizSession, teamId } = useLoaderData<typeof loader>();
  const revalidator = useRevalidator();
  const answerFetcher = useFetcher();

  const question = quizSession.quiz.Questions[quizSession.currentPosition];
  const answer = quizSession.Answers.find((a) => a.questionId === question.id);

  const { pathname: createAnswerPath } = useResolvedPath(
    `answer/${question.id}`
  );

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
      <div className="my-8">
        <div className="flex items-center gap-4">
          <answerFetcher.Form method="post" action={createAnswerPath}>
            <Input type="hidden" name="questionId" value={question.id} />
            <Input type="hidden" name="teamId" value={teamId} />
            {answer ? (
              <>
                <Input type="hidden" name="answerId" value={answer.id} />
                <Input type="text" defaultValue={answer.answer} name="answer" />
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
