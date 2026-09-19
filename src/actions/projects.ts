"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/session";
import { boolField, field, intField, slugify } from "@/lib/utils";

export async function saveProject(formData: FormData) {
  await requireAuth();
  const id = field(formData, "id");
  const title = field(formData, "title");
  const categoryId = field(formData, "categoryId");
  if (!title) throw new Error("Title is required");
  if (!categoryId) throw new Error("Category is required");

  const slug = slugify(field(formData, "slug") || title);
  const data = {
    title,
    slug,
    categoryId,
    summary: field(formData, "summary") ?? null,
    description: field(formData, "description") ?? null,
    client: field(formData, "client") ?? null,
    location: field(formData, "location") ?? null,
    year: field(formData, "year") ?? null,
    image: field(formData, "image") ?? null,
    videoUrl: field(formData, "videoUrl") ?? null,
    imageColor: field(formData, "imageColor") || "#34465e",
    featured: boolField(formData, "featured"),
    published: boolField(formData, "published"),
    order: intField(formData, "order", 0),
  };

  if (id) {
    await prisma.project.update({ where: { id }, data });
  } else {
    await prisma.project.create({ data });
  }

  revalidatePath("/admin/projects");
  revalidatePath("/", "layout");
  redirect("/admin/projects");
}

export async function deleteProject(id: string) {
  await requireAuth();
  await prisma.project.delete({ where: { id } });
  revalidatePath("/admin/projects");
  revalidatePath("/", "layout");
}
