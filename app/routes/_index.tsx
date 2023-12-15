import { json } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { db } from "~/db.server";
import { authenticator } from "~/services/auth.server";
import { H1, H2 } from "~/components/Headlines";
import { Link } from "~/components/Link";
import { Button } from "~/components/Buttons";
import { getPreferredLanguage } from "~/helpers/language.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const host = await authenticator.isAuthenticated(request);
  const preferredLanguage = getPreferredLanguage(
    request.headers.get("accept-language")
  );

  if (!host) {
    return json({ host: null, preferredLanguage });
  }

  const data = {
    preferredLanguage,
    host: await db.host.findUnique({
      where: {
        name: host.name,
      },
      include: {
        Quizzes: true,
        QuizSessions: {
          include: {
            quiz: true,
          },
        },
      },
    }),
  };

  return json(data);
};

export default function Index() {
  const { host, preferredLanguage } = useLoaderData<typeof loader>();

  return (
    <div>
      <H1>Welcome to Quizzo</H1>

      {!host ? (
        <AnonymousIndex />
      ) : (
        <LoggedInIndex host={host} preferredLanguage={preferredLanguage} />
      )}
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
        <Link to="/register">Register</Link>
      </li>
    </ul>
  );
}
function LoggedInIndex({
  host,
  preferredLanguage,
}: {
  host: NonNullable<ReturnType<typeof useLoaderData<typeof loader>>["host"]>;
  preferredLanguage: string;
}) {
  return (
    <section>
      <section className="md:flex md:justify-between">
        <section className="mt-4 mb-8">
          <H2 className="flex justify-between mb-3">
            <span className="inline-block mr-4">Quizzes</span>{" "}
            <Button to="/quiz/new" as="link" size="sm">
              New quiz
            </Button>
          </H2>
          {host.Quizzes.length ? (
            <ul className="my-2">
              {host.Quizzes.map((quiz) => (
                <li key={quiz.id} className="mb-2">
                  <Link to={`/quiz/${quiz.id}`}>{quiz.name}</Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>No quizzes so far. Create one with the button above.</p>
          )}
        </section>
        <section className="my-4">
          <H2 className="mb-3">Quiz Sessions</H2>
          {host.QuizSessions.length ? (
            <ul>
              {host.QuizSessions.map((session) => (
                <li key={session.id} className="mb-2">
                  <Link to={`/quiz-session/${session.id}/admin`}>
                    {new Date(session.createdAt).toLocaleDateString(
                      preferredLanguage
                    )}
                    : {session.quiz.name}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              No quiz sessions so far. Go to a quiz page to start a new session.
            </p>
          )}
        </section>
      </section>
      <footer className="my-4 flex justify-end">
        <details>
          <summary className="my-2 text-right hover:cursor-pointer">
            {host.name}
          </summary>
          <Button as="link" to="/logout" size="sm" kind="ghost">
            Logout
          </Button>
        </details>
      </footer>
    </section>
  );
}
