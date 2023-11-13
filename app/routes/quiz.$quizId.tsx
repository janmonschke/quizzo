import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { db } from "~/db.server";
import { H1 } from "~/components/Headlines";
import { Button } from "~/components/Buttons";
import { authenticator } from "~/services/auth.server";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const { quizId } = params;

  const host = await authenticator.isAuthenticated(request);

  if (!host) {
    throw new Response("Forbidden", {
      status: 403,
    });
  }

  const quiz = await db.quiz.findFirst({
    where: {
      id: quizId,
      hostId: host.id,
    },
    include: {
      _count: {
        select: {
          Questions: true,
        },
      },
    },
  });

  if (!quiz) {
    throw new Response("Not Found", {
      status: 404,
    });
  }

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

      <p>This quiz has {quiz._count.Questions} question(s)</p>

      <Outlet />
    </div>
  );
}
