"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAuth, type FormResult } from "@/lib/session";
import { field } from "@/lib/utils";

export async function saveSettings(formData: FormData): Promise<FormResult> {
  await requireAuth();

  const data = {
    companyName: field(formData, "companyName") || "Revision Zero",
    tagline: field(formData, "tagline") || "Steel Detailers",
    heroHeadline: field(formData, "heroHeadline") || "Steel Detailers",
    heroSubtext: field(formData, "heroSubtext") || "",
    heroImage: field(formData, "heroImage") ?? null,
    heroImages: field(formData, "heroImages") ?? null,
    logoLight: field(formData, "logoLight") ?? null,
    logoDark: field(formData, "logoDark") ?? null,
    aboutTitle: field(formData, "aboutTitle") || "Welcome",
    aboutText: field(formData, "aboutText") || "",
    aboutImage: field(formData, "aboutImage") ?? null,
    email: field(formData, "email") || "info@revisionzero.local",
    phone: field(formData, "phone") || "",
    address: field(formData, "address") || "",
    facebook: field(formData, "facebook") ?? null,
    linkedin: field(formData, "linkedin") ?? null,
    brochureUrl: field(formData, "brochureUrl") ?? null,
    footerNote: field(formData, "footerNote") || "",
  };

  await prisma.siteSetting.upsert({
    where: { id: "site" },
    update: data,
    create: { id: "site", ...data },
  });

  revalidatePath("/", "layout");
  return { ok: true, message: "Settings saved." };
}
