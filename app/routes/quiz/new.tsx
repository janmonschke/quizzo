import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { db } from "~/db.server";

export const action: ActionFunction = async ({ request }) => {
  const body = await request.formData();
  const name = body.get("name");
  if (typeof name !== "string") {
    throw new Error("Not all required values were passed");
  }

  const quiz = await db.quiz.create({
    data: {
      name,
      hostId: "1",
    },
  });

  return redirect(`/quiz/${quiz.id}`);
};

export default function NewQuiz() {
  return (
    <div>
      <h1>Create a new quiz</h1>
      <Form method="post" replace>
        <label>
          Quiz name: <input type="text" name="name" required />
        </label>
        <button type="submit">Create</button>
      </Form>
    </div>
  );
}
