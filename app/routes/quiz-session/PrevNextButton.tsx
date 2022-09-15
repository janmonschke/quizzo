import type { Question, QuizSession } from "@prisma/client";
import { Form, useResolvedPath } from "@remix-run/react";
import { Button } from "~/components/Buttons";

export default function ({
  questions,
  quizSession,
  direction,
}: {
  questions: Question[];
  quizSession: QuizSession;
  direction: -1 | 1;
}) {
  const { pathname } = useResolvedPath("update-position");
  const newPosition = quizSession.currentPosition + direction;
  const canGoDirection =
    direction === 1 ? newPosition <= questions.length - 1 : newPosition >= 0;
  const text = direction === 1 ? "Next" : "Previous";

  return (
    <Form method="post" action={pathname}>
      <Button
        type="submit"
        name="newPosition"
        value={newPosition}
        disabled={!canGoDirection}
        size="sm"
      >
        {text}
      </Button>
    </Form>
  );
}
