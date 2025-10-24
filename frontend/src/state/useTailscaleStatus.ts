import { useCallback, useEffect } from "react";
import { api } from "../utils/api";
import { useSyntrixStore } from "./store";
import type { Settings, TailscaleInfo } from "../types";

interface SettingsResponse {
  settings: Settings;
  tailscale: TailscaleInfo | null;
}

export function useTailscaleStatus(autoRefresh = true) {
  const settings = useSyntrixStore((state) => state.settings);
  const tailscale = useSyntrixStore((state) => state.tailscale ?? null);
  const { setSettings, setTailscale } = useSyntrixStore((state) => state.actions);

  const refresh = useCallback(async () => {
    const { data } = await api.get<SettingsResponse>("/api/settings");
    setSettings(data.settings);
    setTailscale(data.tailscale ?? null);
    return data;
  }, [setSettings, setTailscale]);

  useEffect(() => {
    if (autoRefresh) {
      void refresh();
    }
  }, [autoRefresh, refresh]);

  return { settings, tailscale, refresh };
}
