import type { Question } from "@prisma/client";
import { Form } from "@remix-run/react";

export default function QuestionComponent({
  id,
  answer,
  answerOptions,
  questionText,
  points,
}: Pick<
  Question,
  "id" | "questionText" | "answer" | "answerOptions" | "points"
>) {
  return (
    <div>
      <div>{questionText}</div>
      <div>
        <strong>{answer}</strong> ({points}p)
      </div>
      {answerOptions && (
        <ol>
          {answerOptions.split("||").map((option) => (
            <li key={option}>{option}</li>
          ))}
        </ol>
      )}
      <Form method="post" replace>
        <input type="hidden" name="questionId" value={id} />
        <input type="hidden" name="_method" value="delete" />
        <button type="submit">Delete</button>
      </Form>
    </div>
  );
}
