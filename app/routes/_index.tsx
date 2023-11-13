import { json } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { db } from "~/db.server";
import { authenticator } from "~/services/auth.server";
import { H1, H2 } from "~/components/Headlines";
import { Link } from "~/components/Link";
import { Button } from "~/components/Buttons";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const host = await authenticator.isAuthenticated(request);

  if (!host) {
    return json({ host: null });
  }

  const data = {
    host: await db.host.findUnique({
      where: {
        name: host.name,
      },
      include: {
        Quizzes: true,
        QuizSessions: true,
      },
    }),
  };
  return json(data);
};

export default function Index() {
  const { host } = useLoaderData<typeof loader>();

  return (
    <div>
      <H1>Welcome to Quizzo</H1>

      {!host ? <AnonymousIndex /> : <LoggedInIndex host={host} />}
    </div>
  );
}

function AnonymousIndex() {
  return (
    <ul>
      <li>
        <Link to="/login">Login</Link>
      </li>
      <li>
        <Link to="/login">Register</Link>
      </li>
    </ul>
  );
}
function LoggedInIndex({
  host,
}: {
  host: NonNullable<ReturnType<typeof useLoaderData<typeof loader>>["host"]>;
}) {
  return (
    <>
      {host.name}

      {host.Quizzes && (
        <>
          <H2>Quizzes</H2>
          <Button to="/quiz/new" as="link">
            Create new quiz
          </Button>
          <ul className="my-2">
            {host.Quizzes.map((quiz) => (
              <li key={quiz.id}>
                <Link to={`/quiz/${quiz.id}`}>{quiz.name}</Link>
              </li>
            ))}
          </ul>
        </>
      )}

      {host.QuizSessions && (
        <>
          <H2>Quiz Sessions</H2>
          <ul>
            {host.QuizSessions.map((session) => (
              <li key={session.id}>
                <Link to={`/quiz-session/${session.id}/admin`}>
                  {session.id}
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
