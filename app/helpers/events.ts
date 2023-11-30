export function updatePosition(quizSessionId: string) {
  return `${quizSessionId}/updatePosition`;
}

export function updateAnswer(quizSessionId: string) {
  return `${quizSessionId}/answer`;
}

export function updateTeamAnswer(quizSessionId: string, teamId: string) {
  return `${quizSessionId}/answer/${teamId}`;
}

export function updateName(quizSessionId: string) {
  return `${quizSessionId}/updateName`;
}
