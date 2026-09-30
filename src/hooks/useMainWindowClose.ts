import { useEffect } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";

export function useMainWindowClose() {
    useEffect(() => {
        let unlisten: (() => void) | undefined;

        const setup = async () => {
            const window = getCurrentWindow();

            unlisten = await window.onCloseRequested(async (event) => {
                // Evitar que Tauri destruya MainWindow
                event.preventDefault();

                // Solo la ocultamos
                await window.hide();
            });
        };

        setup();

        return () => { unlisten?.(); };
    }, []);
}