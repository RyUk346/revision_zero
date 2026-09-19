"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/session";
import { boolField, field, intField } from "@/lib/utils";

export async function savePartner(formData: FormData) {
  await requireAuth();
  const id = field(formData, "id");
  const name = field(formData, "name");
  if (!name) throw new Error("Name is required");

  const data = {
    name,
    category: field(formData, "category") || "Software",
    logo: field(formData, "logo") ?? null,
    url: field(formData, "url") ?? null,
    order: intField(formData, "order", 0),
    published: boolField(formData, "published"),
  };

  if (id) {
    await prisma.partner.update({ where: { id }, data });
  } else {
    await prisma.partner.create({ data });
  }

  revalidatePath("/admin/partners");
  revalidatePath("/", "layout");
  redirect("/admin/partners");
}

export async function deletePartner(id: string) {
  await requireAuth();
  await prisma.partner.delete({ where: { id } });
  revalidatePath("/admin/partners");
  revalidatePath("/", "layout");
}
