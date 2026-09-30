import { useEffect } from "react";
import { useSettingsStore } from "../../stores/settingsStore";
import { hideSettingsWindow } from "../../services/windowManager";
import { SettingToggle } from "../../components/SettingToggle";
import { Settings } from "lucide-react";

export function SettingsWindow() {
    const loaded = useSettingsStore((state) => state.loaded);
    const load = useSettingsStore((state) => state.load);
    const workDuration = useSettingsStore((state) => state.workDuration);
    const breakDuration = useSettingsStore((state) => state.breakDuration);
    const alwaysOnTop = useSettingsStore((state) => state.alwaysOnTop);
    const startWithWindows = useSettingsStore((state) => state.startWithWindows);
    const startAutomatically = useSettingsStore((state) => state.startAutomatically);
    const soundEnabled = useSettingsStore((state) => state.soundEnabled);
    const updateSetting = useSettingsStore((state) => state.updateSetting);
    const resetSettings = useSettingsStore((state) => state.resetSettings);

    // Cada WebView tiene su propiainstancia de Zustand.Por eso SettingsWindow tambiéncarga settings.jso
    useEffect(() => {
        load();
    }, [load]);

    const update = async <K extends | "workDuration" | "breakDuration" | "alwaysOnTop" | "startWithWindows" | "startAutomatically" | "soundEnabled">(key: K, value: Parameters<typeof updateSetting<K>>[1]) => {
        await updateSetting(key, value);
    };

    if (!loaded) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#11151c] text-sky-200">
                <div className="flex items-center gap-2 text-sm">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-sky-300" />
                    Cargando configuración...
                </div>
            </main>
        );
    }

    return (
        <main className="relative h-full overflow-y-auto overflow-x-hidden bg-[#11151c] text-slate-100">
            <div className="pointer-events-none absolute -left-24 -top-28 h-72 w-72 rounded-full bg-sky-300/8 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -right-20 h-72 w-72 rounded-full bg-violet-400/8 blur-3xl" />

            <div className="relative z-10 mx-auto flex min-h-full max-w-3xl flex-col p-8">
                <header className="mb-8 flex items-start justify-between">
                    <div>
                        <div className="mb-3 flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-300/10 text-sky-200">
                                <Settings className="h-4 w-4" />
                            </div>

                            <span className="text-xs font-medium text-slate-400">
                                20Twenty
                            </span>
                        </div>

                        <h1 className="text-2xl font-semibold tracking-tight text-white">
                            Configuración
                        </h1>

                        <p className="mt-1 text-sm text-slate-500">
                            Personaliza tus descansos y el comportamiento de la app.
                        </p>
                    </div>

                    <button
                        onClick={hideSettingsWindow}
                        className="rounded-xl border border-white/6 bg-white/3 px-3 py-2 text-sm text-slate-400 transition-all duration-200 hover:bg-white/6 hover:text-slate-100 active:scale-95">
                        Cerrar
                    </button>
                </header>

                <div className="flex flex-col gap-6">
                    {/* Timer */}
                    <section className="rounded-2xl border border-white/6 bg-white/3 p-5 shadow-[0_16px_50px_rgba(0,0,0,0.12)] backdrop-blur-sm">
                        <div className="mb-5">
                            <div className="mb-2 flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-sky-300" />
                                <span className="text-xs font-medium text-sky-200">
                                    Temporizador
                                </span>
                            </div>

                            <h2 className="text-lg font-semibold text-slate-100">
                                Ritmo de trabajo
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Ajusta cuánto tiempo quieres trabajar y cuánto descansar la vista.
                            </p>
                        </div>

                        <div className="flex flex-col gap-3">
                            {/* Duración del trabajo */}
                            <label className="group flex items-center justify-between gap-6 rounded-xl bg-black/10 px-4 py-4 transition-colors duration-200 hover:bg-white/3">
                                <div>
                                    <span className="block text-sm font-medium text-slate-200">
                                        Tiempo de trabajo
                                    </span>

                                    <span className="mt-1 block text-xs text-slate-500">
                                        Minutos hasta tu próximo descanso.
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        min={1}
                                        value={Math.round(workDuration / 60)}
                                        onChange={async (event) => {
                                            const minutes = Number(event.target.value);

                                            if (minutes <= 0) {
                                                return;
                                            }

                                            await update("workDuration", minutes * 60);
                                        }}
                                        className="w-20 rounded-xl border border-white/6 bg-[#151b24] px-3 py-2 text-center text-sm font-medium text-sky-100 outline-none transition-all duration-200 focus:border-sky-300/25 focus:ring-4 focus:ring-sky-300/5"
                                    />

                                    <span className="text-xs text-slate-500">
                                        min
                                    </span>
                                </div>
                            </label>

                            {/* Duración Break */}
                            <label className="group flex items-center justify-between gap-6 rounded-xl bg-black/10 px-4 py-4 transition-colors duration-200 hover:bg-white/3">
                                <div>
                                    <span className="block text-sm font-medium text-slate-200">
                                        Descanso visual
                                    </span>

                                    <span className="mt-1 block text-xs text-slate-500">
                                        Tiempo para mirar a unos 6 metros.
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        min={1}
                                        value={breakDuration}
                                        onChange={async (event) => {
                                            const seconds = Number(event.target.value);

                                            if (seconds <= 0) {
                                                return;
                                            }

                                            await update("breakDuration", seconds);
                                        }}
                                        className="w-20 rounded-xl border border-white/6 bg-[#151b24] px-3 py-2 text-center text-sm font-medium text-violet-100 outline-none transition-all duration-200 focus:border-violet-300/25 focus:ring-4 focus:ring-violet-300/5"
                                    />

                                    <span className="text-xs text-slate-500">
                                        seg
                                    </span>
                                </div>
                            </label>
                        </div>
                    </section>

                    {/* Comportamiento */}
                    <section className="rounded-2xl border border-white/6 bg-white/3 p-5 shadow-[0_16px_50px_rgba(0,0,0,0.12)] backdrop-blur-sm">
                        <div className="mb-5">
                            <div className="mb-2 flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-violet-300" />

                                <span className="text-xs font-medium text-violet-200">
                                    Comportamiento
                                </span>
                            </div>

                            <h2 className="text-lg font-semibold text-slate-100">
                                Preferencias de la app
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Decide cómo quieres que 20Twenty se comporte mientras trabajas.
                            </p>
                        </div>

                        <div className="flex flex-col divide-y divide-white/5">
                            <SettingToggle
                                label="Siempre visible"
                                description="Mantiene el widget por encima de otras aplicaciones."
                                checked={alwaysOnTop}
                                onChange={(checked) => update("alwaysOnTop", checked)}
                            />

                            <SettingToggle
                                label="Iniciar con Windows"
                                description="Abre 20Twenty al iniciar sesión."
                                checked={startWithWindows}
                                onChange={(checked) => update("startWithWindows", checked)}
                            />

                            <SettingToggle
                                label="Inicio automático"
                                description="Comienza el temporizador al abrir la app."
                                checked={startAutomatically}
                                onChange={(checked) => update("startAutomatically", checked)}
                            />

                            <SettingToggle
                                label="Sonido"
                                description="Reproduce una señal al comenzar el descanso."
                                checked={soundEnabled}
                                onChange={(checked) => update("soundEnabled", checked)}
                            />
                        </div>
                    </section>

                    {/* Reset */}
                    <section className="flex items-center justify-between rounded-2xl border border-rose-300/8 bg-rose-300/3 p-5">
                        <div>
                            <h3 className="text-sm font-medium text-slate-200">
                                Restaurar configuración
                            </h3>

                            <p className="mt-1 text-xs text-slate-500">
                                Vuelve a los valores predeterminados de 20Twenty.
                            </p>
                        </div>

                        <button
                            onClick={resetSettings}
                            className="rounded-xl border border-rose-300/12 bg-rose-300/5 px-3 py-2 text-xs font-medium text-rose-200 transition-all duration-200 hover:border-rose-300/20 hover:bg-rose-300/10 active:scale-95">
                            Restaurar
                        </button>
                    </section>
                </div>
            </div>
        </main>
    );
}