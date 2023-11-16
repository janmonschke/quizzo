import { db } from "~/db.server";
import { authenticator } from "~/services/auth.server";

async function getQuiz(quizId: string, hostId: string) {
  return await db.quiz.findFirst({
    where: {
      id: quizId,
      hostId: hostId,
    },
  });
}

export async function ensureHasAccessToQuiz(
  quizId: string | undefined,
  request: Request
) {
  const host = await authenticator.isAuthenticated(request);

  if (!host || !quizId) {
    throw new Response("Forbidden", {
      status: 403,
    });
  }

  const quiz = await getQuiz(quizId, host.id);

  if (!quiz) {
    throw new Response("Not Found", {
      status: 404,
    });
  }

  return { quiz, host };
}

export async function ensureHasAccessToQuizSession(
  quizSessionId: string | undefined,
  request: Request
) {
  const host = await authenticator.isAuthenticated(request);

  if (!host || !quizSessionId) {
    throw new Response("Forbidden", {
      status: 403,
    });
  }

  const quizSession = await db.quizSession.findFirst({
    where: {
      id: quizSessionId,
      hostId: host.id,
    },
  });

  if (!quizSession) {
    throw new Response("Not Found", {
      status: 404,
    });
  }

  return { quizSession, host };
}
