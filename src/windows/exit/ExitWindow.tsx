import { invoke } from "@tauri-apps/api/core";
import { hideExitWindow } from "../../services/windowManager";

export function ExitWindow() {
    const handleQuit = async () => {
        await invoke("quit_app");
    };

    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#11151c] text-slate-100">
            <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-rose-300/10 blur-3xl" />

            <div className="relative z-10 w-full px-5 backdrop-blur-sm shadow-[0_16px_50px_rgba(0,0,0,0.18)]">
                <div className="rounded-2xl p-8">
                    <div className="mb-5">
                        <div className="mb-3 flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-rose-300" />

                            <span className="text-xs font-medium text-rose-200">
                                Cerrar 20Twenty
                            </span>
                        </div>

                        <h2 className="text-lg font-semibold tracking-tight text-white">
                            ¿Seguro que quieres salir?
                        </h2>

                        <p className="mt-2 text-sm leading-relaxed text-slate-500">
                            El temporizador se detendrá y 20Twenty se cerrará por completo.
                        </p>
                    </div>

                    <div className="flex justify-end gap-2">
                        <button
                            onClick={hideExitWindow}
                            className="rounded-xl border border-white/6 bg-white/3 px-4 py-2 text-sm font-medium text-slate-400 transition-all duration-200 hover:bg-white/6 hover:text-slate-100 active:scale-95">
                            Cancelar
                        </button>

                        <button
                            onClick={handleQuit}
                            className="rounded-xl border border-rose-300/15 bg-rose-300/8 px-4 py-2 text-sm font-medium text-rose-200 transition-all duration-200 hover:border-rose-300/25 hover:bg-rose-300/12 active:scale-95">
                            Salir
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}