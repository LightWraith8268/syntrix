import { exec } from "node:child_process";
import { promisify } from "node:util";

const execAsync = promisify(exec);

export interface TailscaleStatus {
  ok: boolean;
  hostname?: string;
  tailnet?: string;
  address?: string;
  raw?: any;
  error?: string;
}

export async function getTailscaleStatus(): Promise<TailscaleStatus> {
  const command = process.env.TAILSCALE_STATUS_COMMAND ?? "tailscale status --json";

  try {
    const { stdout } = await execAsync(command);
    const data = JSON.parse(stdout);

    const self = data.Self ?? data.SelfNode;
    const addresses: string[] = self?.TailscaleIPs ?? self?.Addresses ?? [];

    return {
      ok: true,
      hostname: self?.HostName ?? self?.Hostinfo?.Hostname,
      tailnet: data?.MagicDNSSuffix ?? data?.CurrentTailnet?.Name,
      address: addresses[0],
      raw: data,
    };
  } catch (error) {
    return {
      ok: false,
      error: (error as Error).message,
    };
  }
}
