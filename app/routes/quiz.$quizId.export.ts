import type { LoaderFunctionArgs } from "@remix-run/node";
import { db } from "~/db.server";
import { ensureHasAccessToQuiz } from "~/helpers/authorization";
import { parseArrayString } from "~/helpers/string_arrays";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const { quiz } = await ensureHasAccessToQuiz(params.quizId, request);

  const fullQuiz = await db.quiz.findFirst({
    where: {
      id: quiz.id,
    },
    include: {
      Questions: true,
    },
  });

  if (!fullQuiz) {
    return new Response("Not Found", { status: 404 });
  }

  const content = `
# ${fullQuiz.name}

  ${fullQuiz.Questions.map(
    (question, index) => `
## ${index + 1}

${question.questionText}

${
  question.answerOptions
    ? parseArrayString(question.answerOptions)
        .map((answerOption) => `- ${answerOption}`)
        .join("\n")
    : ""
}

Answer: ${question.answer}

Points: ${question.points}
`
  ).join("\n")}
  
  `;

  return new Response(content, {
    status: 200,
    headers: {
      "Content-Type": "plain/text",
      "Content-Disposition": `attachment; filename="${quiz.name}.md"`,
    },
  });
};
