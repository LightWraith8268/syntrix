export function buildRemoteUrl(hostname: string, tailnet: string, port: number) {
  if (!hostname || !tailnet) {
    return null;
  }
  return `http://${hostname}.${tailnet}.ts.net:${port}`;
}

export function detectConnectionType(): "local" | "remote" {
  const hostname = window.location.hostname;
  if (hostname.endsWith(".ts.net")) {
    return "remote";
  }
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return "local";
  }
  return "local";
}
