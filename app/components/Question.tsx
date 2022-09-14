import type { Question } from "@prisma/client";
import { parseArrayString } from "~/helpers/string_arrays";

// This one is required because the serialized version of Question
// does not 100% match the non-serialized version coming from the types.
export type MinimalQuestion = Pick<
  Question,
  "questionText" | "answer" | "answerOptions" | "points" | "position"
>;

export default function QuestionComponent({
  answer,
  answerOptions,
  questionText,
  points,
}: MinimalQuestion) {
  return (
    <div>
      <div>
        {questionText} ({points}p)
      </div>
      <div>
        <strong>{answer}</strong>
      </div>
      {answerOptions && (
        <ol>
          {parseArrayString(answerOptions).map((option) => (
            <li key={option}>{option}</li>
          ))}
        </ol>
      )}
    </div>
  );
}
