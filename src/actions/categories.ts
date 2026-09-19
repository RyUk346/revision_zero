"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/session";
import { field, intField, slugify } from "@/lib/utils";

export async function saveCategory(formData: FormData) {
  await requireAuth();
  const id = field(formData, "id");
  const name = field(formData, "name");
  if (!name) throw new Error("Name is required");

  const slug = slugify(field(formData, "slug") || name);
  const data = {
    name,
    slug,
    description: field(formData, "description") ?? null,
    image: field(formData, "image") ?? null,
    order: intField(formData, "order", 0),
  };

  if (id) {
    await prisma.projectCategory.update({ where: { id }, data });
  } else {
    await prisma.projectCategory.create({ data });
  }

  revalidatePath("/admin/categories");
  revalidatePath("/", "layout");
  redirect("/admin/categories");
}

export async function deleteCategory(id: string) {
  await requireAuth();
  // Deleting a category cascades to its projects (see schema onDelete: Cascade).
  await prisma.projectCategory.delete({ where: { id } });
  revalidatePath("/admin/categories");
  revalidatePath("/", "layout");
}
