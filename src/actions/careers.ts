"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/session";
import { boolField, field, intField, slugify } from "@/lib/utils";

export async function saveJob(formData: FormData) {
  await requireAuth();
  const id = field(formData, "id");
  const title = field(formData, "title");
  if (!title) throw new Error("Title is required");

  const slug = slugify(field(formData, "slug") || title);
  const data = {
    title,
    slug,
    location: field(formData, "location") || "Manila, Philippines",
    type: field(formData, "type") || "Full-time",
    department: field(formData, "department") ?? null,
    summary: field(formData, "summary") ?? null,
    description: field(formData, "description") ?? null,
    requirements: field(formData, "requirements") ?? null,
    published: boolField(formData, "published"),
    order: intField(formData, "order", 0),
  };

  if (id) {
    await prisma.jobPosting.update({ where: { id }, data });
  } else {
    await prisma.jobPosting.create({ data });
  }

  revalidatePath("/admin/careers");
  revalidatePath("/", "layout");
  redirect("/admin/careers");
}

export async function deleteJob(id: string) {
  await requireAuth();
  await prisma.jobPosting.delete({ where: { id } });
  revalidatePath("/admin/careers");
  revalidatePath("/", "layout");
}
