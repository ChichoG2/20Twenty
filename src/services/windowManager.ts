import { currentMonitor, PhysicalPosition, Window } from "@tauri-apps/api/window";

async function getWindow(label: string) {
    const window = await Window.getByLabel(label);

    if (!window) {
        console.warn(`Window "${label}" not found`);
    }

    return window;
}

export async function showSettingsWindow() {
    const widget = await Window.getByLabel("widget");
    const settings = await Window.getByLabel("settings");

    if (!widget || !settings) {
        return;
    }

    try {
        const widgetPosition = await widget.outerPosition();
        const widgetSize = await widget.outerSize();
        const settingsSize = await settings.outerSize();
        const monitor = await currentMonitor();
        const gap = 12;

        let x = widgetPosition.x + widgetSize.width + gap;

        let y = widgetPosition.y;

        if (monitor) {
            const { position, size, } = monitor.workArea;
            const left = position.x;
            const top = position.y;
            const right = left + size.width;
            const bottom = top + size.height;

            // Si no cabe a la derecha, probar al lado izquierdo.
            if (x + settingsSize.width > right) {
                x = widgetPosition.x - settingsSize.width - gap;
            }

            // Evitar salirse horizontalmente.
            x = Math.max(left, Math.min(x, right - settingsSize.width));

            // Evitar salirse verticalmente.
            y = Math.max(top, Math.min(y, bottom - settingsSize.height));
        }

        await settings.setPosition(
            new PhysicalPosition(x, y)
        );
    } catch (error) {
        console.error("No se pudo posicionar SettingsWindow:", error);
    }

    // Aunque falle el posicionamiento, intentar mostrar Settings. 
    await settings.show();
    await settings.setFocus();
}


export async function hideSettingsWindow() {
    const window = await getWindow("settings");
    await window?.hide();
}

export async function showBreakWindow() {
    const window = await getWindow("break");

    if (!window) {
        return;
    }

    await window.show();
}

export async function hideBreakWindow() {
    const window = await getWindow("break");
    await window?.hide();
}

export async function showExitWindow() {
    const window = await Window.getByLabel("exit");

    if (!window) {
        return;
    }

    await window.center();
    await window.show();
    await window.setFocus();
}

export async function hideExitWindow() {
    const window = await Window.getByLabel("exit");
    await window?.hide();
}