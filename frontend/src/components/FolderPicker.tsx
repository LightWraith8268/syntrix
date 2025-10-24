interface Props {
  label: string;
  value?: string;
  onChange: (path: string) => void;
}

declare global {
  interface Window {
    __TAURI__?: {
      dialog?: {
        open: (options: { directory: boolean }) => Promise<string | string[] | null>;
      };
    };
  }
}

export function FolderPicker({ label, value, onChange }: Props) {
  const isTauri = Boolean(window.__TAURI__);

  const handlePick = async () => {
    if (isTauri && window.__TAURI__?.dialog?.open) {
      const result = await window.__TAURI__.dialog.open({ directory: true });
      if (typeof result === "string") {
        onChange(result);
      } else if (Array.isArray(result) && result.length > 0) {
        onChange(result[0]!);
      }
      return;
    }

    const fallback = window.prompt("Enter absolute path to the library folder", value ?? "");
    if (fallback) {
      onChange(fallback);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold uppercase tracking-widest text-white/60">{label}</label>
      <div className="flex items-center gap-3">
        <input
          type="text"
          value={value ?? ""}
          onChange={(event) => onChange(event.target.value)}
          placeholder="D:\\Media\\Movies"
          className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40"
        />
        <button
          type="button"
          onClick={handlePick}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold uppercase tracking-wide text-white"
        >
          Browse
        </button>
      </div>
      {!isTauri ? (
        <p className="text-xs text-white/40">Desktop app enables folder picker automatically via Tauri.</p>
      ) : null}
    </div>
  );
}
