import { showSettingsWindow } from "../services/windowManager";

export function DragRegion() {
    return (
        <div className="relative h-7 w-full">
            <div
                data-tauri-drag-region
                className="absolute inset-0 cursor-move"
            />

            <button
                onClick={showSettingsWindow}
                className="absolute right-2 top-1/2 z-10 -translate-y-1/2"
            >
                ⚙
            </button>
        </div>
    );
}