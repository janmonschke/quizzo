import type { Host, Question, Quiz } from "@prisma/client";

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

export type QuizWithQuestions = Quiz & {
  Questions: Question[];
};

export type HostWithQuizzes = Host & {
  Quizzes: QuizWithQuestions[];
};
