import type { Question } from "@prisma/client";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { QuestionType } from "~/types";
import { db } from "~/db.server";
import QuestionForm from "./QuestionForm";
import QuestionList from "./QuestionList";

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
      orderBy: {
        position: "asc",
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
    const answerOptions = body.get("answerOptions") || "";
    const position = body.get("position");
    const type = body.get("type");

    if (
      !quizId ||
      typeof questionText !== "string" ||
      typeof answer !== "string" ||
      typeof points !== "string" ||
      typeof answerOptions !== "string" ||
      typeof type !== "string" ||
      typeof position !== "string"
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
        type,
        position: parseFloat(position),
        quizId,
      },
    });
  }

  return null;
};

export default function Questions() {
  const { questions } = useLoaderData<LoaderData>();

  if (!questions || questions.length === 0) {
    return <span>No questions yet</span>;
  }

  return (
    <div>
      <QuestionList questions={questions} />
      <h2>Add a new question</h2>
      <QuestionForm questions={questions} />
    </div>
  );
}
