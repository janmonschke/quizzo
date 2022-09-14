import type { Answer, AwardedPoints, Question, Team } from "@prisma/client";
import { Form, useResolvedPath } from "@remix-run/react";

export default function TeamAnswer({
  team,
  question,
  answer,
  awardedPoints,
}: {
  team: Team;
  question: Question;
  answer?: Answer;
  awardedPoints?: AwardedPoints;
}) {
  const { pathname: newAnswerPath } = useResolvedPath("answer/new");
  const { pathname: awardPointsPath } = useResolvedPath("answer/award-points");

  return (
    <div>
      Team {team.name}:{" "}
      {answer ? (
        <>
          <input type="text" value={answer.answer} readOnly disabled />
          {awardedPoints ? (
            <input type="text" value={awardedPoints.points} readOnly disabled />
          ) : (
            <Form method="post" action={awardPointsPath}>
              <input type="hidden" name="answerId" value={answer.id} />
              <input type="hidden" name="teamId" value={team.id} />
              <label>
                <input
                  type="number"
                  name="points"
                  placeholder="Points"
                  defaultValue={question.points}
                  step="0.1"
                  required
                />
              </label>
            </Form>
          )}
        </>
      ) : (
        <Form method="post" action={newAnswerPath}>
          <input type="hidden" name="questionId" value={question.id} />
          <input type="hidden" name="teamId" value={team.id} />
          <label>
            <input type="text" name="answer" placeholder="Answer" required />
          </label>
        </Form>
      )}
    </div>
  );
}
