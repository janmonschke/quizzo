import type { Answer, AwardedPoints, Question, Team } from "@prisma/client";
import { Form, useFetcher, useResolvedPath } from "@remix-run/react";
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
  const fetcher = useFetcher();
  const { pathname: createAnswerPath } = useResolvedPath("answer/create");
  const { pathname: awardPointsPath } = useResolvedPath("answer/award-points");

  return (
    <div className="flex items-center gap-4">
      <fetcher.Form method="post" action={`/teams/${team.id}/changeName`}>
        <input name="name" defaultValue={team.name} className="w-40" />
      </fetcher.Form>
      <Form method="post" action={createAnswerPath}>
        <Input type="hidden" name="questionId" value={question.id} />
        <Input type="hidden" name="teamId" value={team.id} />
        {answer ? (
          <>
            <Input type="hidden" name="answerId" value={answer.id} />
            <Input type="text" defaultValue={answer.answer} name="answer" />
          </>
        ) : (
          <Input type="text" name="answer" placeholder="Answer" required />
        )}
      </Form>

      {answer && (
        <Form method="post" action={awardPointsPath}>
          <Input type="hidden" name="questionId" value={question.id} />
          <Input type="hidden" name="teamId" value={team.id} />
          <Input type="hidden" name="answerId" value={answer.id} />
          {awardedPoints ? (
            <>
              <Input
                type="hidden"
                name="awardedPointsId"
                value={awardedPoints.id}
              />
              <Input
                type="number"
                name="points"
                defaultValue={awardedPoints.points}
                step="0.1"
                required
              />{" "}
              ☑️
            </>
          ) : (
            <Input
              type="number"
              name="points"
              placeholder="Points"
              defaultValue={question.points}
              step="0.1"
              required
            />
          )}
        </Form>
      )}
    </div>
  );
}
