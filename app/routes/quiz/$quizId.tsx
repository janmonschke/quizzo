import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import type { QuizWithQuestionCount } from "~/types";
import { db } from "~/db.server";

type LoaderData = {
  quiz: QuizWithQuestionCount | null;
};

export const loader: LoaderFunction = async ({ params }) => {
  const { quizId } = params;
  const data: LoaderData = {
    quiz: await db.quiz.findFirst({
      where: {
        id: quizId,
      },
      include: {
        _count: {
          select: {
            Questions: true,
          },
        },
      },
    }),
  };
  return json(data);
};

export default function Index() {
  const { quiz } = useLoaderData<LoaderData>();

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>{quiz?.name}</h1>

      <Link to={`/quiz-session/new/${quiz?.id}`}>New session from quiz</Link>

      <p>This quiz has {quiz?._count.Questions} question(s)</p>

      <Outlet />
    </div>
  );
}
