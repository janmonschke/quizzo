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
  console.log(host.QuizSessions.length);
  return (
    <>
      {host.Quizzes.length && (
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

      <H2>Quiz Sessions</H2>
      {host.QuizSessions.length ? (
        <ul>
          {host.QuizSessions.map((session) => (
            <li key={session.id}>
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
    </>
  );
}
