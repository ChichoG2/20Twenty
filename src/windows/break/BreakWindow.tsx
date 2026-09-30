import { useEffect, useState } from "react";
import { listen } from "@tauri-apps/api/event";
import { formatTime } from "../../utils/formatTime";
import { WINDOW_EVENTS } from "../../services/windowEvents";
import type { BreakTimerPayload } from "../../types/windowEvents";
import { useSettingsStore } from "../../stores/settingsStore";

const INITIAL_BREAK_STATE: BreakTimerPayload = {
    status: "break",
    remainingSeconds: 20,
};

export function BreakWindow() {
    const [timerState, setTimerState,] = useState<BreakTimerPayload>(INITIAL_BREAK_STATE);
    const workDuration = useSettingsStore((state) => state.workDuration);
    const workMinutes = Math.round(workDuration / 60);
    const workTimeLabel = workMinutes === 1 ? "1 minuto" : `${workMinutes} minutos`;
    const loadSettings = useSettingsStore((state) => state.load);

    useEffect(() => {
        loadSettings();
    }, [loadSettings]);

    useEffect(() => {
        let unlisten: | (() => void) | undefined;

        const setup = async () => {
            unlisten = await listen<BreakTimerPayload>(WINDOW_EVENTS.BREAK_TIMER_UPDATE, (event) => {
                setTimerState(event.payload);
            });
        };

        setup();

        return () => {
            unlisten?.();
        };
    }, []);

    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#11151c] text-slate-100">
            <div className="pointer-events-none absolute -left-24 top-1/3 h-72 w-72 rounded-full bg-sky-300/10 blur-3xl" />
            <div className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-violet-400/10 blur-3xl" />

            {/* Contenido */}
            <div className="relative z-10 flex max-w-xl flex-col items-center px-8 text-center">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/6 bg-white/4 px-3 py-1.5">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-sky-300 shadow-[0_0_12px_rgba(125,211,252,.35)]" />

                    <span className="text-[11px] font-medium text-sky-200">
                        Hora de descansar la vista
                    </span>
                </div>

                {/* Título */}
                <h1 className="max-w-lg text-3xl font-semibold tracking-tight text-white">
                    Se acabaron los {workTimeLabel} de trabajo
                </h1>

                <p className="mt-3 text-lg font-medium text-slate-300">
                    Dale un pequeño descanso a tus ojos.
                </p>

                <p className="mt-1 max-w-md text-sm leading-relaxed text-slate-500">
                    Mira un objeto a unos 6 metros de distancia y deja que tu vista
                    cambie de enfoque durante unos segundos.
                </p>

                {/* Timer */}
                <div className="mt-7 flex flex-col items-center">
                    <div className="text-[72px] font-semibold leading-none tracking-[-0.06em] text-sky-100 tabular-nums timer-break">
                        {formatTime(timerState.remainingSeconds)}
                    </div>

                    <span className="mt-2 text-xs font-medium text-slate-500">
                        segundos de descanso
                    </span>
                </div>

                <div className="mt-7 flex items-center gap-2 text-xs text-slate-500">
                    <span className="rounded-full bg-white/4 px-3 py-1.5">
                        Parpadea
                    </span>

                    <span className="rounded-full bg-white/4 px-3 py-1.5">
                        Mira lejos
                    </span>

                    <span className="rounded-full bg-white/4 px-3 py-1.5">
                        Relájate
                    </span>
                </div>
            </div>
        </main>
    );
}