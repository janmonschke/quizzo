import type { Question } from "@prisma/client";
import { parseArrayString } from "~/helpers/string_arrays";

// This one is required because the serialized version of Question
// does not 100% match the non-serialized version coming from the types.
export type MinimalQuestion = Pick<
  Question,
  "id" | "questionText" | "answer" | "answerOptions" | "points" | "position"
>;

export default function QuestionComponent({
  answer,
  answerOptions,
  questionText,
  points,
}: MinimalQuestion) {
  return (
    <div className="flex flex-col gap-2">
      <div>
        <span className="text-lg leading-relaxed">{questionText}</span>
      </div>
      <div>
        <div className="rounded-full bg-teal-400 text-white inline-block px-2 py-1 text-sm">
          {points} {points === 1 ? "point" : "points"}
        </div>
      </div>
      {answerOptions && (
        <>
          Options:
          <ol className="list-decimal ml-8">
            {parseArrayString(answerOptions).map((option) => (
              <li key={option}>{option}</li>
            ))}
          </ol>
        </>
      )}
      <div>
        Answer: <strong>{answer}</strong>
      </div>
    </div>
  );
}
