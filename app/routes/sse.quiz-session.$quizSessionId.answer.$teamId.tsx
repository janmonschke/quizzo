import type { LoaderFunctionArgs } from "@remix-run/node";
import { eventStream } from "remix-utils/sse/server";
import { emitter } from "~/services/emitter.server";
import * as events from "~/helpers/events";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { quizSessionId, teamId } = params;
  if (!quizSessionId || !teamId) {
    throw new Response("Not Found", { status: 404 });
  }

  return eventStream(request.signal, function setup(send) {
    function onUpdate(data: string) {
      send({ event: "answer", data });
    }
    emitter.on(events.updateTeamAnswer(quizSessionId, teamId), onUpdate);

    return () => {
      emitter.off(events.updateTeamAnswer(quizSessionId, teamId), onUpdate);
    };
  });
}
