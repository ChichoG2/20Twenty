import type { ActiveTimerMode, TimerStatus } from "./timer";

export interface TimerStatePayload {
    status: TimerStatus;
    previousMode: ActiveTimerMode | null;
    remainingSeconds: number;
    endsAt: number | null;
}

export type TimerAction = | "start" | "pause" | "reset";