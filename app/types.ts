export type DatabaseEntry = {
  id: string;
  createdAt: number;
  changedAt: number;
};

export interface Host extends DatabaseEntry {
  name: string;
}

export interface Quiz extends DatabaseEntry {
  name: string;
  description: string;
}

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

export interface Question extends DatabaseEntry {
  quizId: string;
  type: QuestionType;
  position: number;
}

export interface MultipleChoiceQuestion extends Question {
  type: QuestionType.multipleChoice;
  answerOptions: string[];
  answer: number;
}

export interface GuesstimationQuestion extends Question {
  type: QuestionType.guesstimation;
  answer: number;
}

export interface YesOrNoQuestion extends Question {
  type: QuestionType.yesOrNo;
  answer: boolean;
}

export interface FreeFormQuestion extends Question {
  type: QuestionType.freeForm;
  answer: string;
}

export interface QuizSession extends DatabaseEntry {
  quizzId: string;
  currentPosition: number;
}

export interface Team extends DatabaseEntry {
  name: string;

  // nice to have
  members: string[];
}

export interface Answer extends DatabaseEntry {
  quizSessionId: string;
  questionId: string;
  teamId: string;
  answer: string | number | boolean;
}
