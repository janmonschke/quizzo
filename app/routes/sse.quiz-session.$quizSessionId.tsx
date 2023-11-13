import type { LoaderFunctionArgs } from "@remix-run/node";
import { eventStream } from "remix-utils/sse/server";
import { interval } from "remix-utils/timers";

export async function loader({ request }: LoaderFunctionArgs) {
  return eventStream(request.signal, function setup(send) {
    async function run() {
      for await (let _ of interval(10000, { signal: request.signal })) {
        send({ event: "time", data: new Date().toISOString() });
      }
    }

    run();

    return () => {
      console.log("cleaining up");
    };
  });
}
