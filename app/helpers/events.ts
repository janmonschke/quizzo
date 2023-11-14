export function updatePosition(quizSessionId: string) {
  return `${quizSessionId}/updatePosition`;
}

export function updateAnswer(quizSessionId: string) {
  return `${quizSessionId}/answer`;
}
