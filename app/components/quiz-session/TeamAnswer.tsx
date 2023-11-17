import type { Answer, AwardedPoints, Question, Team } from "@prisma/client";
import { Form, useResolvedPath } from "@remix-run/react";
import { Input } from "../Input";

export default function TeamAnswer({
  team,
  question,
  answer,
  awardedPoints,
}: {
  team: Pick<Team, "id" | "name">;
  question: Pick<Question, "id" | "points">;
  answer?: Pick<Answer, "id" | "answer">;
  awardedPoints?: Pick<AwardedPoints, "id" | "points">;
}) {
  const { pathname: createAnswerPath } = useResolvedPath("answer/create");
  const { pathname: awardPointsPath } = useResolvedPath("answer/award-points");

  return (
    <tr className="gap-4">
      <td>{team.name}</td>
      <td className="px-4">
        <Form method="post" action={createAnswerPath}>
          <Input type="hidden" name="questionId" value={question.id} />
          <Input type="hidden" name="teamId" value={team.id} />
          {answer ? (
            <>
              <Input type="hidden" name="answerId" value={answer.id} />
              <Input
                type="text"
                key={answer.answer}
                defaultValue={answer.answer}
                name="answer"
                className="w-full"
              />
            </>
          ) : (
            <Input
              type="text"
              name="answer"
              placeholder="Answer"
              required
              className="w-full"
            />
          )}
        </Form>
      </td>
      <td>
        {answer && (
          <Form
            method="post"
            action={awardPointsPath}
            className="flex items-center gap-2"
          >
            <Input type="hidden" name="questionId" value={question.id} />
            <Input type="hidden" name="teamId" value={team.id} />
            <Input type="hidden" name="answerId" value={answer.id} />
            {awardedPoints ? (
              <Input
                type="hidden"
                name="awardedPointsId"
                value={awardedPoints.id}
              />
            ) : null}
            <Input
              key={awardedPoints?.id || question.id}
              type="number"
              name="points"
              placeholder="Points"
              defaultValue={
                awardedPoints ? awardedPoints.points : question.points
              }
              step="1"
              required
            />
            {awardedPoints ? <span>👍</span> : null}
          </Form>
        )}
      </td>
    </tr>
  );
}
