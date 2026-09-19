"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/session";
import { boolField, field, intField, slugify } from "@/lib/utils";

export async function saveService(formData: FormData) {
  await requireAuth();
  const id = field(formData, "id");
  const title = field(formData, "title");
  if (!title) throw new Error("Title is required");

  const slug = slugify(field(formData, "slug") || title);
  const data = {
    title,
    slug,
    summary: field(formData, "summary") ?? null,
    description: field(formData, "description") ?? null,
    icon: field(formData, "icon") || "Wrench",
    image: field(formData, "image") ?? null,
    imageColor: field(formData, "imageColor") || "#3f5573",
    published: boolField(formData, "published"),
    order: intField(formData, "order", 0),
  };

  if (id) {
    await prisma.service.update({ where: { id }, data });
  } else {
    await prisma.service.create({ data });
  }

  revalidatePath("/admin/services");
  revalidatePath("/", "layout");
  redirect("/admin/services");
}

export async function deleteService(id: string) {
  await requireAuth();
  await prisma.service.delete({ where: { id } });
  revalidatePath("/admin/services");
  revalidatePath("/", "layout");
}
