import { PrismaClient } from "@prisma/client";
import { QuestionType } from "../app/types";
const db = new PrismaClient();

async function seed() {
  console.log("seeding");
  // Create the host
  const host = await db.host.create({
    data: {
      name: "The Quiz Host",
    },
  });
  console.log(host);

  // Create a quiz
  const quiz = await db.quiz.create({
    data: {
      name: "the best quiz",
      hostId: host.id,
    },
  });
  console.log(quiz);

  // Create some questions
  const question = await db.question.create({
    data: {
      points: 1,
      type: QuestionType.freeForm,
      position: 0,
      quizId: quiz.id,
      questionText:
        "What year did the German football team win the world championship for the first time?",
    },
  });
  console.log(question);

  console.log("Created all documents!");
}

seed();
