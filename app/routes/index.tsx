import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import type { HostWithQuizzes } from "~/types";
import { db } from "~/db.server";

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
      <h1>Welcome to Quizzo</h1>

      {host && host.name}

      {host?.Quizzes && (
        <>
          <h2>Quizezs</h2>
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
          <h2>Quiz Sessions</h2>
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
