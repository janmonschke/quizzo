import type { Answer, AwardedPoints, Question, Team } from "@prisma/client";
import { Form, useResolvedPath } from "@remix-run/react";
import { Input } from "~/components/Input";

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
          <Input type="text" value={answer.answer} readOnly disabled />
          {awardedPoints ? (
            <Input type="text" value={awardedPoints.points} readOnly disabled />
          ) : (
            <Form method="post" action={awardPointsPath}>
              <Input type="hidden" name="answerId" value={answer.id} />
              <Input type="hidden" name="teamId" value={team.id} />
              <label>
                <Input
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
          <Input type="hidden" name="questionId" value={question.id} />
          <Input type="hidden" name="teamId" value={team.id} />
          <label>
            <Input type="text" name="answer" placeholder="Answer" required />
          </label>
        </Form>
      )}
    </div>
  );
}
