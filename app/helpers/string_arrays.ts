import { STRING_ARRAY_SPLITTER } from "./constants";

export function parseArrayString(arrayString?: string): string[] {
  if (!arrayString) {
    return [];
  }
  return arrayString.split(STRING_ARRAY_SPLITTER);
}

export function serializeArrayString(answerOptions: string[]): string {
  return answerOptions.join(STRING_ARRAY_SPLITTER);
}
