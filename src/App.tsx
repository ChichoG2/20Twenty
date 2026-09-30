import { getCurrentWindow } from "@tauri-apps/api/window";

import { WidgetWindow } from "./windows/widget/WidgetWindow";
import { BreakWindow } from "./windows/break/BreakWindow";
import { SettingsWindow } from "./windows/settings/SettingsWindow";
import { useDisableContextMenu } from "./hooks/useDisableContextMenu";
import { ExitWindow } from "./windows/exit/ExitWindow";

function App() {
    useDisableContextMenu();
    const label = getCurrentWindow().label;

    if (label === "settings") {
        return <SettingsWindow />;
    }

    if (label === "break") {
        return <BreakWindow />;
    }

    if (label === "exit") {
        return <ExitWindow />;
    }

    return <WidgetWindow />;
}

export default App;