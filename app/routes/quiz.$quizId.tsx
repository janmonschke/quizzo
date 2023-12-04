import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData, useResolvedPath } from "@remix-run/react";
import { H1 } from "~/components/Headlines";
import { Button } from "~/components/Buttons";
import { ensureHasAccessToQuiz } from "~/helpers/authorization";
import { Navigation } from "~/components/navigation";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const { quiz } = await ensureHasAccessToQuiz(params.quizId, request);
  return json({ quiz });
};

export default function Index() {
  const { quiz } = useLoaderData<typeof loader>();
  const exportPath = useResolvedPath("export").pathname;

  return (
    <div>
      <Navigation />
      <div className="flex flex-row items-center justify-between gap-2">
        <H1>{quiz.name}</H1>

        <div className="flex gap-2 items-center">
          <Button as="link" to={exportPath} reloadDocument kind="ghost">
            Export
          </Button>
          <Button as="link" to={`/quiz-session/new/${quiz.id}`}>
            New session
          </Button>
        </div>
      </div>

      <Outlet />
    </div>
  );
}
