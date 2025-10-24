import { prisma } from "../prisma.js";

export async function getSettings() {
  let settings = await prisma.setting.findUnique({ where: { id: 1 } });
  if (!settings) {
    settings = await prisma.setting.create({ data: { id: 1 } });
  }
  return settings;
}

export async function updateSettings(
  data: Partial<{
    port: number;
    tailscaleEnabled: boolean;
    invidiousEnabled: boolean;
    invidiousInstance: string;
    accessToken: string | null;
  }>,
) {
  await getSettings();
  return prisma.setting.update({
    where: { id: 1 },
    data,
  });
}
