import type { Question } from "@prisma/client";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { QuestionType } from "~/types";
import { db } from "~/db.server";
import QuestionForm from "../QuestionForm";
import QuestionComponent from "./Question";

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

  if (body.get("_method") === "delete") {
    const questionId = body.get("questionId");
    if (typeof questionId !== "string" || questionId.length === 0) {
      throw new Error("No id provided for DELETE question request");
    }
    await db.question.delete({
      where: {
        id: questionId,
      },
    });
  } else {
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
  }

  return null;
};

export default function Questions() {
  const { questions } = useLoaderData<LoaderData>();

  return (
    <div>
      <ol>
        {questions?.map((question) => (
          <li key={question.id}>
            <QuestionComponent {...question} />
          </li>
        ))}
      </ol>
      <div>
        <h2>Add a new question</h2>
        <QuestionForm />
      </div>
    </div>
  );
}
