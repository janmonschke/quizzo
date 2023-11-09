// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "": { type: "" };
    "xstate.after(1000)#timer.ticking": {
      type: "xstate.after(1000)#timer.ticking";
    };
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {};
  missingImplementations: {
    actions: never;
    delays: never;
    guards: never;
    services: never;
  };
  eventsCausingActions: {
    resetRemainingSeconds: "Reset timer";
    setRemainingSeconds: "Start timer";
    updateRemainingSeconds: "xstate.after(1000)#timer.ticking";
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {
    hasEnded: "";
  };
  eventsCausingServices: {};
  matchesStates: "ended" | "idle" | "paused" | "ticking";
  tags: never;
}
