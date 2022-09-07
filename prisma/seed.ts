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
  const questions = await Promise.all([
    db.question.create({
      data: {
        points: 10,
        type: QuestionType.freeForm,
        position: 0,
        quizId: quiz.id,
        questionText:
          "What year did the German football team win the world championship for the first time?",
        answer: "1954",
      },
    }),
    db.question.create({
      data: {
        points: 5,
        type: QuestionType.multipleChoice,
        position: 0,
        quizId: quiz.id,
        questionText: "When did Elastic go public?",
        answer: "2018",
        answerOptions: "2016||2017||2018||2019",
      },
    }),
  ]);
  console.log(questions);

  console.log("Created all documents!");
}

seed();
