import type { Host, Quiz, QuizSession } from "@prisma/client";

export enum QuestionType {
  multipleChoice = "multipleChoice",
  guesstimation = "guesstimation",
  yesOrNo = "yesOrNo",
  freeForm = "freeForm",

  // Nice to have
  audio = "audio",
  video = "video",
  picture = "picture",
}

export type QuizWithQuestionCount = Quiz & { _count: { Questions: number } };

export type HostWithQuizzes = Host & {
  Quizzes: Quiz[];
  QuizSessions: QuizSession[];
};
