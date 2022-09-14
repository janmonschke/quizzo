import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import type { HostWithQuizzes } from "~/types";
import { db } from "~/db.server";
import { H1, H2 } from "~/components/Headlines";

type LoaderData = {
  host: HostWithQuizzes | null;
};

export const loader: LoaderFunction = async () => {
  const data: LoaderData = {
    host: await db.host.findFirst({
      include: {
        Quizzes: true,
        QuizSessions: true,
      },
    }),
  };
  return json(data);
};

export default function Index() {
  const { host } = useLoaderData<LoaderData>();

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <H1>Welcome to Quizzo</H1>

      {host && host.name}

      {host?.Quizzes && (
        <>
          <H2>Quizzes</H2>
          <ul>
            {host.Quizzes.map((quiz) => (
              <li key={quiz.id}>
                <Link to={`/quiz/${quiz.id}`}>{quiz.name}</Link>
              </li>
            ))}
          </ul>
        </>
      )}

      {host?.QuizSessions && (
        <>
          <H2>Quiz Sessions</H2>
          <ul>
            {host.QuizSessions.map((session) => (
              <li key={session.id}>
                <Link to={`/quiz-session/${session.id}`}>{session.id}</Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
