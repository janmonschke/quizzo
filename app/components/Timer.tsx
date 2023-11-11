import { useMachine } from "@xstate/react";
import { useState } from "react";
import cx from "classnames";
import { timeString } from "../helpers/time_string";
import { timerMachine } from "../machines/timer";
import { Button } from "./Buttons";

export function Timer() {
  const [durationS, setDurationS] = useState(120);
  const [current, send] = useMachine(timerMachine);

  const remainingTimeText = timeString(current.context.remainingSeconds);
  const percentage = (100 * current.context.remainingSeconds) / durationS;

  let content = null;
  if (current.matches("idle")) {
    content = (
      <>
        {timeString(durationS)}
        <Button
          size="sm"
          onClick={() => send({ type: "Start timer", seconds: durationS })}
        >
          Start
        </Button>
      </>
    );
  } else if (current.matches("ticking")) {
    content = (
      <>
        {remainingTimeText}
        <Button size="sm" onClick={() => send({ type: "Pause timer" })}>
          Pause
        </Button>
        <Button
          size="sm"
          kind="alert"
          onClick={() => send({ type: "Reset timer" })}
        >
          Reset
        </Button>
      </>
    );
  } else if (current.matches("paused")) {
    content = (
      <>
        {remainingTimeText}
        <Button size="sm" onClick={() => send({ type: "Resume timer" })}>
          Resume
        </Button>
        <Button
          size="sm"
          kind="alert"
          onClick={() => send({ type: "Reset timer" })}
        >
          Reset
        </Button>
      </>
    );
  } else if (current.matches("ended")) {
    content = (
      <>
        {remainingTimeText}
        <Button
          size="sm"
          kind="alert"
          onClick={() => send({ type: "Reset timer" })}
        >
          Reset
        </Button>
      </>
    );
  }

  return (
    <div
      className={cx(
        "relative",
        "flex",
        "items-center",
        "gap-1",
        "tabular-nums",
        current.matches("ended") && "animate-pulse"
      )}
    >
      {content}
      <div
        className="absolute bottom-0 left-0 bg-cyan-400 rounded-lg transition-all"
        style={{ height: 2, width: `${percentage}%`, marginBottom: -4 }}
      ></div>
    </div>
  );
}
