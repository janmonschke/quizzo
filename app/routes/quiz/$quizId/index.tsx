import type { Question } from "@prisma/client";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { QuestionType } from "~/types";
import { db } from "~/db.server";
import QuestionForm from "../QuestionForm";

type LoaderData = {
  questions: Question[] | null;
};

export const loader: LoaderFunction = async ({ params }) => {
  const { quizId } = params;
  const data: LoaderData = {
    questions: await db.question.findMany({
      where: {
        quizId,
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
  const answerOptions = body.get("answerOptions") || "";

  if (
    !quizId ||
    typeof questionText !== "string" ||
    typeof answer !== "string" ||
    typeof points !== "string" ||
    typeof answerOptions !== "string"
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

  await db.question.create({
    data: {
      answer,
      answerOptions,
      points: parseInt(points),
      questionText,
      type: QuestionType.freeForm,
      position: 1,
      quizId,
    },
  });

  return redirect(`/quiz/${quizId}`);
};

export default function Questions() {
  const { questions } = useLoaderData<LoaderData>();

  return (
    <div>
      <ol>
        {questions?.map((question) => (
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
      <div>
        <QuestionForm />
      </div>
    </div>
  );
}
