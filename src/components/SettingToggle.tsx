interface SettingToggleProps {
    label: string;
    description: string;
    checked: boolean;
    onChange: (checked: boolean) => void | Promise<void>;
}

export function SettingToggle({ label, description, checked, onChange }: SettingToggleProps) {
    return (
        <label className="flex cursor-pointer items-center justify-between gap-6 py-4 first:pt-0 last:pb-0">
            <div>
                <span className="block text-sm font-medium text-slate-200">
                    {label}
                </span>

                <span className="mt-1 block text-xs text-slate-500">
                    {description}
                </span>
            </div>

            <button
                type="button"
                role="switch"
                aria-checked={checked}
                onClick={() => onChange(!checked)}
                className={`relative h-7 w-12 shrink-0 rounded-full border transition-all duration-300 ${checked ? "border-sky-300/20 bg-sky-300/15" :
                    "border-white/7 bg-white/4"}`}>
                <span
                    className={`absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full shadow-sm transition-all duration-300 
                        ${checked ? "left-6 bg-sky-200 shadow-[0_4px_14px_rgba(125,211,252,0.2)]" : "left-1 bg-slate-500"}`}
                />
            </button>
        </label>
    );
}