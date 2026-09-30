import { create } from "zustand";
import { emit } from "@tauri-apps/api/event";
import type { AppSettings } from "../types/settings";
import { DEFAULT_SETTINGS } from "../types/settings";
import { loadSettings, saveSettings } from "../services/settingsStorage";

interface SettingsStore extends AppSettings {
    loaded: boolean;
    load: () => Promise<void>;
    updateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => Promise<void>;
    resetSettings: () => Promise<void>;
}

export const useSettingsStore = create<SettingsStore>((set, get) => ({
    ...DEFAULT_SETTINGS,
    loaded: false,

    load: async () => {
        const settings = await loadSettings();
        set({ ...settings, loaded: true });
    },

    updateSetting: async (key, value) => {
        // Actualizar inmediatamente Zustand en esta ventana. 
        set({ [key]: value } as Pick<SettingsStore, typeof key>);
        const state = get();

        // Persistir settings.json 
        await saveSettings({
            workDuration: state.workDuration,
            breakDuration: state.breakDuration,
            alwaysOnTop: state.alwaysOnTop,
            startWithWindows: state.startWithWindows,
            startAutomatically: state.startAutomatically,
            soundEnabled: state.soundEnabled,
        });

        // Avisar al resto de WebViews que la configuración cambió. 
        await emit("settings:updated");
    },

    resetSettings: async () => {
        // Restaurar defaults localmente.
        set({ ...DEFAULT_SETTINGS, loaded: true, });

        // Guardarlos también persistentemente.
        await saveSettings(DEFAULT_SETTINGS);

        // Avisar a WidgetWindow, etc.
        await emit("settings:updated");
    },
}));