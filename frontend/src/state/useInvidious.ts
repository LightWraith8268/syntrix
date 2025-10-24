import { useCallback } from "react";
import { api } from "../utils/api";
import { useSyntrixStore } from "./store";

export function useInvidious() {
  const settings = useSyntrixStore((state) => state.settings);
  const { setSettings } = useSyntrixStore((state) => state.actions);

  const setEnabled = useCallback(
    async (enabled: boolean) => {
      const { data } = await api.put("/api/settings", { invidiousEnabled: enabled });
      setSettings(data);
      return data;
    },
    [setSettings],
  );

  const setInstance = useCallback(
    async (instance: string) => {
      const { data } = await api.put("/api/settings", { invidiousInstance: instance });
      setSettings(data);
      return data;
    },
    [setSettings],
  );

  return {
    enabled: settings?.invidiousEnabled ?? true,
    instance: settings?.invidiousInstance ?? "https://yewtu.be",
    setEnabled,
    setInstance,
  };
}
