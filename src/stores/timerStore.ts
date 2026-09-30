import { create } from "zustand";

import type {
    ActiveTimerMode,
    TimerStatus,
} from "../types/timer";

import { useSettingsStore } from "./settingsStore";

interface TimerStore {
    status: TimerStatus;
    previousMode: ActiveTimerMode | null;
    endsAt: number | null;
    remainingSeconds: number;
    start: () => void;
    pause: () => void;
    reset: () => void;
    updateRemaining: () => void;
    startWork: () => void;
    startBreak: () => void;
    syncWithSettings: () => void;
}

export const useTimerStore = create<TimerStore>((set, get) => ({
    status: "idle",
    previousMode: null,
    endsAt: null,

    // Valor inicial mientras todavía no se cargan los settings.
    remainingSeconds: 20 * 60,

    start: () => {
        const { status, remainingSeconds, previousMode, } = get();

        // Primera vez que se inicia
        if (status === "idle") {
            const { workDuration } = useSettingsStore.getState();

            set({ status: "working", previousMode: null, endsAt: Date.now() + workDuration * 1000, remainingSeconds: workDuration, });

            return;
        }

        // Reanudar después de pausa
        if (status === "paused" && previousMode) {
            set({ status: previousMode, previousMode: null, endsAt: Date.now() + remainingSeconds * 1000, });
        }
    },

    pause: () => {
        const { endsAt, status, } = get();

        if (!endsAt) {
            return;
        }

        if (status !== "working" && status !== "break") {
            return;
        }

        const remainingSeconds = Math.max(0, Math.ceil((endsAt - Date.now()) / 1000));

        set({ status: "paused", previousMode: status, endsAt: null, remainingSeconds, });
    },

    reset: () => {
        const { workDuration } = useSettingsStore.getState();

        set({ status: "idle", previousMode: null, endsAt: null, remainingSeconds: workDuration, });
    },

    startWork: () => {
        const { workDuration } = useSettingsStore.getState();

        set({ status: "working", previousMode: null, remainingSeconds: workDuration, endsAt: Date.now() + workDuration * 1000, });
    },

    startBreak: () => {
        const { breakDuration } = useSettingsStore.getState();

        set({ status: "break", previousMode: null, remainingSeconds: breakDuration, endsAt: Date.now() + breakDuration * 1000, });
    },

    updateRemaining: () => {
        const { endsAt, status, startWork, startBreak, } = get();

        if (!endsAt) {
            return;
        }

        if (status !== "working" && status !== "break") {
            return;
        }

        const remainingSeconds = Math.max(0, Math.ceil((endsAt - Date.now()) / 1000));

        // Todavía queda tiempo
        if (remainingSeconds > 0) {
            set({ remainingSeconds, });

            return;
        }

        // Terminó tiempo de trabajo
        if (status === "working") {
            startBreak();
            return;
        }

        // Terminó descanso
        if (status === "break") {
            const { workDuration } = useSettingsStore.getState();

            set({ status: "idle", previousMode: null, endsAt: null, remainingSeconds: workDuration, });

            return;
        }
    },

    // Actualiza el contador inicial después
    // de cargar settings.json
    syncWithSettings: () => {
        const { status } = get();

        // No modificar un temporizador que
        // ya está corriendo o pausado.
        if (status !== "idle") {
            return;
        }

        const { workDuration } = useSettingsStore.getState();

        set({ remainingSeconds: workDuration, });
    },
}));