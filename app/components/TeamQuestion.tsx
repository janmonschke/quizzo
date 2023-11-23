import type { Question } from "@prisma/client";

type Props = Pick<Question, "questionText" | "answerOptions">;

export default function TeamQuestion({ questionText }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <div>
        <span className="text-lg leading-relaxed">{questionText}</span>
      </div>
    </div>
  );
}
