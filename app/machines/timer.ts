import { assign, createMachine } from "xstate";

export const timerMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QBcCWBbMAnAdKiANmAMQDKyAhlsgARqZaKgAOA9rKmqwHZMgAeiALQA2HAFYATJIDMABnEyZARjkBOOQHYZ4gDQgAnohXKcIzeIAcItSIAsNzcvEBfF-vrYcaAMYBrVG4oYgAlODBaT0YkEDYOLl4YwQRVOxx5aUs1NU0FZxEZfSMU5zM5ctUZTTtlC0lNNw8ML18AoOIAFWasGjBuCEg+OM5UHj5k8TtNMzsZNXFnSVU5GyLjSTTpOZlJLWdNedd3ECjvVH9A4IAFCgBXWDA6bqH2EbGkxBqxJxFxbOy5LtxAo1gh6mJLDJzAo5HZJpYpo0Tt0zhd2vxYJRkGAcBQAGbYrAACmWcgAlMRTq1Li94qNEqBkpJLJYcGopn8ZHYNCIlppQbNJDh8jplBtlppJEjTn0BhBQuFIs8YsMEuNEJJ5ukRMoRPY5NY5DojaChOIxBo1JC7JIdZUrNKUcw7g95WFYLdME8GLS3gyBBq7KydLsappLBYFrJQeCcJDocC4UHEcdTs77pAFQ8lT6Va81R8wVqobrchsnFC9IZA2yCpqqgblAjpHY3MduKwBvAYqd8ERfQXGYhxOJhUaWTs7OVZtYY2ktJZyhpLMomxHbI6GKi2lAB-T1QgQ+kHIC4dlgX9QSpWVt2dzNHqdpIjk0t7LBnm6e8hwhzWocEa4gPpMVh6vy1ZgvOmgHDkai6jYfxqFKqZOi6H4sPm+6Flyo7MiuCwjpYfzhqCyhqDIODaDkOxWtBtRQpu2B7t+AYIEI8gSFsChKKoGjaFWxRCGKrKWpCsK2rMU4NG2QA */
  createMachine(
    {
      context: { remainingSeconds: 0 },
      tsTypes: {} as import("./timer.typegen").Typegen0,
      schema: {
        context: {} as { remainingSeconds: number },
        events: {} as
          | { type: "Start timer"; seconds: number }
          | { type: "Reset timer" }
          | { type: "Timer ended" }
          | { type: "Pause timer" }
          | { type: "Resume timer" }
          | { type: "Second passed" },
      },
      initial: "idle",
      states: {
        idle: {
          on: {
            "Start timer": {
              actions: "setRemainingSeconds",
              target: "ticking",
            },
          },
        },
        ticking: {
          always: {
            target: "ended",
            cond: "hasEnded",
          },
          after: {
            "1000": {
              actions: "updateRemainingSeconds",
              target: "ticking",
              internal: false,
            },
          },
          on: {
            "Reset timer": {
              actions: "resetRemainingSeconds",
              target: "idle",
            },
            "Timer ended": {
              target: "ended",
            },
            "Pause timer": {
              target: "paused",
            },
          },
        },
        ended: {
          on: {
            "Reset timer": {
              actions: "resetRemainingSeconds",
              target: "idle",
            },
          },
        },
        paused: {
          on: {
            "Resume timer": {
              target: "ticking",
            },
            "Reset timer": {
              actions: "resetRemainingSeconds",
              target: "idle",
            },
          },
        },
      },
      id: "timer",
    },
    {
      actions: {
        setRemainingSeconds: assign({
          remainingSeconds: (_, event) => event.seconds,
        }),
        resetRemainingSeconds: assign({
          remainingSeconds: () => 0,
        }),
        updateRemainingSeconds: assign({
          remainingSeconds: (ctx) => ctx.remainingSeconds - 1,
        }),
      },
      guards: {
        hasEnded: (ctx) => ctx.remainingSeconds === 0,
      },
    }
  );
