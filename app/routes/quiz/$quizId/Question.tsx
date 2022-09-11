import type { Question } from "@prisma/client";
import { Form } from "@remix-run/react";
import { parserAnswerOptions } from "~/helpers/answer_options";

// This one is required because the serialized version of Question
// does not 100% match the non-serialized version coming from the types.
export type MinimalQuestion = Pick<
  Question,
  "id" | "questionText" | "answer" | "answerOptions" | "points" | "position"
>;

export default function QuestionComponent({
  id,
  answer,
  answerOptions,
  questionText,
  points,
}: MinimalQuestion) {
  return (
    <div>
      <div>{questionText}</div>
      <div>
        <strong>{answer}</strong> ({points}p)
      </div>
      {answerOptions && (
        <ol>
          {parserAnswerOptions(answerOptions).map((option) => (
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
