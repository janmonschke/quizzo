import type { LoaderFunctionArgs } from "@remix-run/node";
import { eventStream } from "remix-utils/sse/server";
import { emitter } from "~/services/emitter.server";

export async function loader({ request, params }: LoaderFunctionArgs) {
  return eventStream(request.signal, function setup(send) {
    function onUpdate(position: string) {
      send({ event: "updatePosition", data: position });
    }
    emitter.on(`${params.quizSessionId}/updatePosition`, onUpdate);

    return () => {
      emitter.off(`${params.quizSessionId}/updatePosition`, onUpdate);
    };
  });
}
