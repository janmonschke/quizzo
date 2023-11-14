import type { LoaderFunctionArgs } from "@remix-run/node";
import { eventStream } from "remix-utils/sse/server";
import { emitter } from "~/services/emitter.server";
import * as events from "~/helpers/events";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { quizSessionId } = params;
  if (!quizSessionId) {
    throw new Response("Not Found", { status: 404 });
  }

  return eventStream(request.signal, function setup(send) {
    function onUpdate(position: string) {
      send({ event: "updatePosition", data: position });
    }
    emitter.on(events.updatePosition(quizSessionId), onUpdate);

    return () => {
      emitter.off(events.updatePosition(quizSessionId), onUpdate);
    };
  });
}
