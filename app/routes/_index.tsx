import { json } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { db } from "~/db.server";
import { authenticator } from "~/services/auth.server";
import { H1, H2 } from "~/components/Headlines";
import { Link } from "~/components/Link";
import { Button } from "~/components/Buttons";
import { getPreferredLanguage } from "~/helpers/language.server";
import quiz from "~/images/quiz.png";

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
      <H1 className="text-center">Welcome to Quizzo</H1>

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
    <>
      <H2 className="text-center">
        Quizzo is a tool to manage (remote-) quizzes!
      </H2>

      <section className="md:w-3/4 mx-auto flex flex-col items-center">
        <img
          src={quiz}
          className="p-8 rounded-lg shadow-2xl mt-4 mb-8"
          alt=""
        />

        <ul className="list-disc ml-6 w-1/2">
          <li>Lets you create quizzes up front</li>
          <li>Supports multiple types of questions</li>
          <li>Adds up points automatically</li>
          <li>Lets quiz teams submit answers in real time (optional)</li>
        </ul>
      </section>
      <ul className="flex gap-4 m-8 justify-center">
        <li>
          <Button as="link" to="/login">
            Login
          </Button>
        </li>
        <li>
          <Button as="link" to="/register">
            Register
          </Button>
        </li>
      </ul>
    </>
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
      <section className="md:flex md:justify-between gap-8">
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
      <footer className="mt-8 mb-4 flex justify-end">
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
