import { useEffect } from "react";
import { emitTo, listen } from "@tauri-apps/api/event";
import { useTimerStore } from "../../stores/timerStore";
import { useSettingsStore } from "../../stores/settingsStore";
import { useTimerTicker } from "../../hooks/useTimerTicker";
import { formatTime } from "../../utils/formatTime";
import { showBreakWindow, hideBreakWindow, showSettingsWindow, showExitWindow } from "../../services/windowManager";
import { Settings, X, Play, Pause, RotateCcw, Eye } from "lucide-react";
import { BreakTimerPayload } from "../../types/windowEvents";
import { WINDOW_EVENTS } from "../../services/windowEvents";
import { getCurrentWindow, PhysicalPosition } from "@tauri-apps/api/window";
import { loadWidgetPosition, saveWidgetPosition } from "../../services/windowPositionStorage";

export function WidgetWindow() {
    useTimerTicker();

    const status = useTimerStore((state) => state.status);
    const remainingSeconds = useTimerStore((state) => state.remainingSeconds);
    const start = useTimerStore((state) => state.start);
    const pause = useTimerStore((state) => state.pause);
    const reset = useTimerStore((state) => state.reset);
    const syncWithSettings = useTimerStore((state) => state.syncWithSettings);
    const loadSettings = useSettingsStore((state) => state.load);
    const settingsLoaded = useSettingsStore((state) => state.loaded);

    // Cargar configuración persistente cuando se inicia el widget. 
    useEffect(() => {
        loadSettings();
    }, [loadSettings]);

    // Sincronizar el timer con la configuración una vez settings.json esté cargado. 
    useEffect(() => {
        if (!settingsLoaded) {
            return;
        }

        syncWithSettings();
    }, [settingsLoaded, syncWithSettings]);

    // Restaurar la posición del widget al iniciar. 
    useEffect(() => {
        const restorePosition = async () => {
            const savedPosition = await loadWidgetPosition();

            if (!savedPosition) {
                return;
            }

            const window = getCurrentWindow();

            await window.setPosition(new PhysicalPosition(savedPosition.x, savedPosition.y));
        };

        restorePosition();
    }, []);

    // Inicializar la ventana del widget 
    useEffect(() => {
        const initializeWindow = async () => {
            const appWindow = getCurrentWindow();

            try {
                const savedPosition = await loadWidgetPosition();

                if (savedPosition) {
                    await appWindow.setPosition(new PhysicalPosition(savedPosition.x, savedPosition.y));
                } else {
                    // Primera ejecución: si todavía no existe posición guardada, podemos centrarla.
                    await appWindow.center();
                }

                // Solo mostrar cuando la posición ya está lista.
                await appWindow.show();
            } catch (error) {
                console.error(
                    "Error inicializando posición del widget:",
                    error
                );

                // Aunque falle la restauración, mostramos la ventana igualmente.
                await appWindow.show();
            }
        };

        initializeWindow();
    }, []);

    // Guardar la última posición de la app
    useEffect(() => {
        let unlisten: | (() => void) | undefined;

        const setup = async () => {
            const window = getCurrentWindow();

            unlisten = await window.onMoved(async ({ payload: position, }) => {
                await saveWidgetPosition({ x: position.x, y: position.y });
            });
        };

        setup();

        return () => {
            unlisten?.();
        };
    }, []);

    // SettingsWindow vive en otro WebView. Cuando cambie una configuración, volvemos a cargar settings.json. 
    useEffect(() => {
        let unlisten: | (() => void) | undefined;

        const setup = async () => {
            unlisten = await listen("settings:updated", async () => {
                await loadSettings();

                // syncWithSettings solamente modifica el contador cuando status === idle. 
                syncWithSettings();
            }
            );
        };

        setup();

        return () => { unlisten?.(); };
    }, [loadSettings, syncWithSettings]);

    // Controlar BreakWindow dependiendo del estado real del timer. 
    useEffect(() => {
        const updateBreakWindow = async () => {
            try {
                if (status === "break") {
                    await showBreakWindow();

                    return;
                }

                await hideBreakWindow();
            } catch (error) {
                console.error("Error controlando BreakWindow:", error);
            }
        };

        updateBreakWindow();
    }, [status]);

    useEffect(() => {
        const syncBreakTimer = async () => {
            const payload: BreakTimerPayload = { status, remainingSeconds };

            try {
                await emitTo("break", WINDOW_EVENTS.BREAK_TIMER_UPDATE, payload);
            } catch (error) {
                console.error("Error sincronizando BreakWindow:", error);
            }
        };

        syncBreakTimer();
    }, [status, remainingSeconds]);

    if (!settingsLoaded) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#11151c] text-sky-200">
                <div className="flex items-center gap-2 text-xs">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-sky-300" />
                    Cargando 20Twenty...
                </div>
            </main>
        );
    }

    const statusLabel =
        status === "working" ? "En marcha" : status === "break" ? "Descanso" : status === "paused" ? "En pausa" : "Listo";

    return (
        <main className="relative flex min-h-screen flex-col overflow-hidden bg-[#11151c] text-slate-100 selection:bg-sky-300/20">
            {/* Halos suaves */}
            <div className="pointer-events-none absolute -left-12 -top-16 h-40 w-40 rounded-full bg-sky-300/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 -right-10 h-40 w-40 rounded-full bg-violet-400/10 blur-3xl" />

            {/* Topbar */}
            <div className="relative flex h-10 items-center px-3">
                <div
                    data-tauri-drag-region
                    className="absolute inset-y-0 left-0 right-20 cursor-move"
                />

                <div className="relative z-10 flex items-center gap-2 pointer-events-none">
                    <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-sky-300/10 text-sky-200">
                        <Eye className="h-3.5 w-3.5" />
                    </div>

                    <span className="text-[11px] font-medium tracking-tight text-slate-400">
                        20Twenty
                    </span>
                </div>

                <div className="relative z-20 ml-auto flex items-center gap-1">
                    <button
                        onClick={showSettingsWindow}
                        className="group flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 transition-all duration-200 hover:bg-white/5 hover:text-slate-200"
                        title="Configuración">
                        <Settings className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-45" />
                    </button>

                    <button
                        onClick={showExitWindow}
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 transition-all duration-200 hover:bg-rose-400/10 hover:text-rose-300"
                        title="Cerrar aplicación">
                        <X className="h-3.5 w-3.5" />
                    </button>
                </div>
            </div>

            {/* Contenido */}
            <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 pb-4">
                {/* Estado */}
                <div className={`mb-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium transition-all duration-300 ${status === "working"
                    ? "bg-emerald-300/10 text-emerald-200" : status === "break" ? "bg-sky-300/10 text-sky-200" : status === "paused" ? "bg-amber-300/10 text-amber-200" :
                        "bg-white/5 text-slate-400"}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${status === "working" ? "bg-emerald-300" : status === "break" ? "bg-sky-300" : status === "paused"
                        ? "bg-amber-300" : "bg-slate-500"}`} />

                    {statusLabel}
                </div>

                {/* Tiempo */}
                <div
                    className={`text-[44px] font-semibold leading-none tracking-tighter tabular-nums transition-all duration-300 ${status === "break" ? "text-sky-100 timer-break" :
                        status === "working" ? "text-slate-50" : "text-slate-200"}`}>
                    {formatTime(remainingSeconds)}
                </div>

                {/* Subtexto */}
                <p className="mt-1 text-[10px] text-slate-500">
                    {status === "working" ? "Hasta tu próximo descanso visual" : status === "break" ? "Mira algo a unos 6 metros" : status === "paused" ? "El temporizador está pausado" : "Listo cuando tú quieras"}
                </p>

                {/* Acciones */}
                <div className="mt-3 flex items-center gap-2">
                    {(status === "idle" || status === "paused") && (
                        <button
                            onClick={start}
                            className="flex items-center gap-1.5 rounded-full bg-sky-200 px-3 py-1.5 text-[11px] font-medium text-slate-950 shadow-[0_8px_24px_rgba(125,211,252,0.12)] transition-all duration-200 hover:scale-[1.02] hover:bg-sky-100 active:scale-95">
                            <Play className="h-3.5 w-3.5 fill-current" />

                            {status === "paused" ? "Continuar" : "Iniciar"}
                        </button>
                    )}

                    {(status === "working" || status === "break") && (
                        <button
                            onClick={pause}
                            className="flex items-center gap-1.5 rounded-full border border-white/7 bg-white/4 px-3 py-1.5 text-[11px] font-medium text-slate-300 transition-all duration-200 hover:bg-white/7 hover:text-white active:scale-95">
                            <Pause className="h-3.5 w-3.5" />
                            Pausar
                        </button>
                    )}

                    <button
                        onClick={reset}
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-white/6 bg-white/3 text-slate-500 transition-all duration-200 hover:bg-white/6 hover:text-slate-200 active:rotate-[-30deg]"
                        title="Reiniciar">
                        <RotateCcw className="h-3.5 w-3.5" />
                    </button>
                </div>
            </div>
        </main>
    );
}