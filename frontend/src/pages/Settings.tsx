import { FormEvent, useState } from "react";
import { LibraryManager } from "../components/LibraryManager";
import { useTailscaleStatus } from "../state/useTailscaleStatus";
import { useInvidious } from "../state/useInvidious";
import { api } from "../utils/api";
import { buildRemoteUrl } from "../utils/network";

export function SettingsPage() {
  const { settings, tailscale, refresh } = useTailscaleStatus(true);
  const { enabled: invidiousEnabled, setEnabled, instance, setInstance } = useInvidious();
  const [port, setPort] = useState(settings?.port ?? 37915);

  const updatePort = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await api.put("/api/settings", { port });
    await refresh();
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-sm text-white/60">
          Configure remote access, Invidious integration, library paths, and secure streaming tunneling.
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={updatePort} className="space-y-4 rounded-2xl bg-white/5 p-6">
          <header>
            <h2 className="text-xl font-semibold">Server Port</h2>
            <p className="text-sm text-white/60">
              Syntrix listens on <code>0.0.0.0:{settings?.port ?? 37915}</code> to enable Tailscale streaming.
            </p>
          </header>
          <input
            type="number"
            min={1024}
            max={65535}
            value={port}
            onChange={(event) => setPort(Number(event.target.value))}
            className="w-32 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-white"
          >
            Update Port
          </button>
        </form>

        <div className="space-y-4 rounded-2xl bg-white/5 p-6">
          <header>
            <h2 className="text-xl font-semibold">Remote Access (Tailscale)</h2>
            <p className="text-sm text-white/60">
              Securely stream your media across devices without exposing public ports.
            </p>
          </header>

          {tailscale?.ok ? (
            <dl className="grid gap-3 text-sm text-white/70">
              <div className="flex items-center justify-between">
                <dt className="text-white/40">Hostname</dt>
                <dd>{tailscale.hostname}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-white/40">Tailnet</dt>
                <dd>{tailscale.tailnet}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-white/40">Tunnel IP</dt>
                <dd>{tailscale.address}</dd>
              </div>
              <div className="flex flex-col gap-1">
                <dt className="text-white/40">Remote URL</dt>
                <dd className="font-semibold">
                  {tailscale.hostname && tailscale.tailnet
                    ? buildRemoteUrl(tailscale.hostname, tailscale.tailnet, settings?.port ?? 37915)
                    : "Unavailable"}
                </dd>
              </div>
            </dl>
          ) : (
            <p className="text-sm text-red-400">Tailscale status unavailable: {tailscale?.error}</p>
          )}
          <button
            type="button"
            className="rounded-lg border border-white/20 px-3 py-2 text-xs uppercase tracking-[0.3em]"
            onClick={() => refresh()}
          >
            Refresh Status
          </button>
        </div>
      </section>

      <section className="space-y-4 rounded-2xl bg-white/5 p-6">
        <header>
          <h2 className="text-xl font-semibold">Invidious Integration</h2>
          <p className="text-sm text-white/60">
            Switch between ad-free Invidious proxy and official YouTube API for fetching metadata and streams.
          </p>
        </header>
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <label className="flex items-center gap-3 text-sm font-semibold">
            <input
              type="checkbox"
              checked={invidiousEnabled}
              onChange={(event) => setEnabled(event.target.checked)}
              className="h-4 w-4 rounded border-white/20 bg-transparent accent-accent"
            />
            Enable Invidious
          </label>
          <input
            type="url"
            value={instance}
            onChange={(event) => setInstance(event.target.value)}
            className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40"
            placeholder="https://yewtu.be"
          />
        </div>
      </section>

      <LibraryManager />
    </div>
  );
}
