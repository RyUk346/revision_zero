"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/session";
import { boolField, field, slugify } from "@/lib/utils";

export async function saveNews(formData: FormData) {
  await requireAuth();
  const id = field(formData, "id");
  const title = field(formData, "title");
  if (!title) throw new Error("Title is required");

  const slug = slugify(field(formData, "slug") || title);
  const dateStr = field(formData, "publishedAt");
  const data = {
    title,
    slug,
    excerpt: field(formData, "excerpt") ?? null,
    content: field(formData, "content") ?? null,
    author: field(formData, "author") || "Revision Zero",
    image: field(formData, "image") ?? null,
    imageColor: field(formData, "imageColor") || "#516b8c",
    published: boolField(formData, "published"),
    publishedAt: dateStr ? new Date(dateStr) : new Date(),
  };

  if (id) {
    await prisma.newsPost.update({ where: { id }, data });
  } else {
    await prisma.newsPost.create({ data });
  }

  revalidatePath("/admin/news");
  revalidatePath("/", "layout");
  redirect("/admin/news");
}

export async function deleteNews(id: string) {
  await requireAuth();
  await prisma.newsPost.delete({ where: { id } });
  revalidatePath("/admin/news");
  revalidatePath("/", "layout");
}
