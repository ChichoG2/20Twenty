export interface AppSettings {
    workDuration: number;
    breakDuration: number;

    alwaysOnTop: boolean;
    startWithWindows: boolean;
    startAutomatically: boolean;

    soundEnabled: boolean;
}

export const DEFAULT_SETTINGS: AppSettings = {
    workDuration: 20 * 60,
    breakDuration: 20,

    alwaysOnTop: true,
    startWithWindows: false,
    startAutomatically: false,

    soundEnabled: true,
};