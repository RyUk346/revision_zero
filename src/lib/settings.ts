import { prisma } from "@/lib/prisma";
import type { SiteSetting } from "@prisma/client";

/**
 * Fetch the singleton site settings row, creating it with defaults the first
 * time it is requested. Cached per-request by Next's data layer.
 */
export async function getSettings(): Promise<SiteSetting> {
  const existing = await prisma.siteSetting.findUnique({ where: { id: "site" } });
  if (existing) return existing;
  return prisma.siteSetting.create({ data: { id: "site" } });
}
