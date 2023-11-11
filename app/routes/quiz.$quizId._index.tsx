import type { ActionFunction, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { db } from "~/db.server";
import QuestionForm from "~/components/quiz/QuestionForm";
import QuestionList from "~/components/quiz/QuestionList";
import { H2 } from "~/components/Headlines";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { quizId } = params;
  const data = {
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
  const { questions } = useLoaderData<typeof loader>();

  if (!questions) {
    return <>Something went wrong</>;
  }

  return (
    <div>
      <QuestionList questions={questions} />
      <H2>Add a new question</H2>
      <QuestionForm questions={questions} />
    </div>
  );
}
