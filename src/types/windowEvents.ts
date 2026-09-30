import type { TimerStatus } from "./timer";

export interface BreakTimerPayload {
    status: TimerStatus;
    remainingSeconds: number;
}