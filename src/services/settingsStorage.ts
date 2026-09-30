import { LazyStore } from "@tauri-apps/plugin-store";
import type { AppSettings } from "../types/settings";
import { DEFAULT_SETTINGS } from "../types/settings";

const store = new LazyStore("settings.json");

export async function loadSettings(): Promise<AppSettings> {
    const settings = await store.get<AppSettings>("settings");

    return settings ?? DEFAULT_SETTINGS;
}

export async function saveSettings(settings: AppSettings): Promise<void> {
    await store.set("settings", settings);
}