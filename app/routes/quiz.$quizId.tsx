import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { H1 } from "~/components/Headlines";
import { Button } from "~/components/Buttons";
import { ensureHasAccessToQuiz } from "~/helpers/authorization";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const { quiz } = await ensureHasAccessToQuiz(params.quizId, request);
  return json({ quiz });
};

export default function Index() {
  const { quiz } = useLoaderData<typeof loader>();

  return (
    <div>
      <div className="flex flex-row items-center justify-between gap-2">
        <H1>{quiz.name}</H1>

        <Button as="link" to={`/quiz-session/new/${quiz.id}`} kind="ghost">
          New session
        </Button>
      </div>

      <Outlet />
    </div>
  );
}
