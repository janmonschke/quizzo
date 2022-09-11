import { ANSWER_OPTION_SPLITTER } from "./constants";

export function parserAnswerOptions(answerOptions?: string): string[] {
  if (!answerOptions) {
    return [];
  }
  return answerOptions.split(ANSWER_OPTION_SPLITTER);
}

export function serializeAnswerOptions(answerOptions: string[]): string {
  return answerOptions.join(ANSWER_OPTION_SPLITTER);
}
