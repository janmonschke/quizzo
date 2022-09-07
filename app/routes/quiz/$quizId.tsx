import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { QuestionType } from "~/types";
import type { QuizWithQuestions } from "~/types";
import { db } from "~/db.server";
import QuestionForm from "./QuestionForm";

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

export const action: ActionFunction = async ({ request, params }) => {
  const { quizId } = params;
  const body = await request.formData();
  const questionText = body.get("questionText");
  const answer = body.get("answer");
  const points = body.get("points");
  // TODO: add answeroptions
  const answerOptions = body.get("answerOptions");

  if (
    !quizId ||
    typeof questionText !== "string" ||
    typeof answer !== "string" ||
    typeof points !== "string"
  ) {
    throw new Error(
      `Not all required fields were passed. ${JSON.stringify(
        {
          questionText,
          answer,
          points,
          quizId,
        },
        null,
        2
      )}`
    );
  }

  const question = await db.question.create({
    data: {
      answer,
      points: parseInt(points),
      questionText,
      type: QuestionType.freeForm,
      position: 1,
      quizId,
    },
  });

  console.log(question);
  return redirect(`/quiz/${quizId}`);
};

export default function Index() {
  const { quiz } = useLoaderData<LoaderData>();
  console.log(quiz);
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>{quiz?.name}</h1>

      <p>This quiz has {quiz?.Questions.length} question(s)</p>
      {quiz?.Questions && (
        <ol>
          {quiz.Questions.map((question) => (
            <li key={question.id}>
              <div>{question.questionText}</div>
              <div>
                <strong>{question.answer}</strong> ({question.points}p)
              </div>
              {question.answerOptions && (
                <ol>
                  {question.answerOptions.split("||").map((option) => (
                    <li key={option}>{option}</li>
                  ))}
                </ol>
              )}
            </li>
          ))}
        </ol>
      )}

      <h2>Add a new question</h2>
      <QuestionForm />
    </div>
  );
}
