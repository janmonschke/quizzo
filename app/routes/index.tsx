import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import type { Host, Quiz } from "@prisma/client";
import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";

import { db } from "~/db.server";

type HostWithQuizzes = Host & {
  Quizzes: Quiz[];
};

type LoaderData = {
  host: HostWithQuizzes | null;
};

export const loader: LoaderFunction = async () => {
  const data: LoaderData = {
    host: await db.host.findFirst({
      include: {
        Quizzes: true,
      },
    }),
  };
  return json(data);
};

export default function Index() {
  const { host } = useLoaderData<LoaderData>();
  console.log(host);
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>Welcome to Quizzo</h1>

      {host && host.name}

      {host && <pre>{JSON.stringify(host.Quizzes, null, 2)}</pre>}
    </div>
  );
}
