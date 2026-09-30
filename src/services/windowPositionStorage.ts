import { LazyStore } from "@tauri-apps/plugin-store";

interface WindowPosition {
    x: number;
    y: number;
}

const store = new LazyStore("window-state.json");

export async function saveWidgetPosition(position: WindowPosition) {
    await store.set("widget-position", position);
}

export async function loadWidgetPosition():
    Promise<WindowPosition | null> {

    return (await store.get<WindowPosition>("widget-position")) ?? null;
}