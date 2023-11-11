import type { Question } from "@prisma/client";
import { parseArrayString } from "../helpers/string_arrays";

type Props = Pick<Question, "questionText" | "answerOptions">;

export default function TeamQuestion({ answerOptions, questionText }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <div>
        <span className="text-lg leading-relaxed">{questionText}</span>
      </div>
      <div></div>
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
    </div>
  );
}
