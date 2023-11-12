import { Form, useResolvedPath } from "@remix-run/react";
import { Button } from "../Buttons";

export default function PrevNextButton({
  questionsCount,
  currentPosition,
  direction,
}: {
  questionsCount: number;
  currentPosition: number;
  direction: -1 | 1;
}) {
  const { pathname } = useResolvedPath("update-position");
  const newPosition = currentPosition + direction;
  const canGoDirection =
    direction === 1 ? newPosition <= questionsCount : newPosition >= 0;
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
