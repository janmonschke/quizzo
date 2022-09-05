import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { QuestionType, QuizWithQuestions } from "~/types";
import { db } from "~/db.server";

type LoaderData = {
  quiz: QuizWithQuestions | null;
};

export const loader: LoaderFunction = async ({ params }) => {
  const { quizId } = params;
  const data: LoaderData = {
    quiz: await db.quiz.findFirst({
      where: {
        id: quizId,
      },
      include: {
        Questions: true,
      },
    }),
  };
  return json(data);
};

export default function Index() {
  const { quiz } = useLoaderData<LoaderData>();
  console.log(quiz);
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>{quiz?.name}</h1>

      <p>This quiz has {quiz?.Questions.length} question(s)</p>
      {quiz?.Questions && (
        <ul>
          {quiz.Questions.map((question) => (
            <li key={question.id}>{question.questionText}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
