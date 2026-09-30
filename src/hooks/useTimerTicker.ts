import { useEffect } from "react";
import { useTimerStore } from "../stores/timerStore";

export function useTimerTicker() {
    const status = useTimerStore((state) => state.status);

    const updateRemaining = useTimerStore((state) => state.updateRemaining);

    useEffect(() => {
        if (status !== "working" && status !== "break") {
            return;
        }

        updateRemaining();

        const interval = window.setInterval(() => {
            updateRemaining();
        }, 250);

        return () => {
            window.clearInterval(interval);
        };
    }, [status, updateRemaining]);
}