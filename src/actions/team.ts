"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/session";
import { boolField, field, intField } from "@/lib/utils";

export async function saveTeamMember(formData: FormData) {
  await requireAuth();
  const id = field(formData, "id");
  const name = field(formData, "name");
  const role = field(formData, "role");
  if (!name) throw new Error("Name is required");
  if (!role) throw new Error("Role is required");

  const data = {
    name,
    role,
    bio: field(formData, "bio") ?? null,
    email: field(formData, "email") ?? null,
    linkedin: field(formData, "linkedin") ?? null,
    image: field(formData, "image") ?? null,
    imageColor: field(formData, "imageColor") || "#2d3c50",
    order: intField(formData, "order", 0),
    published: boolField(formData, "published"),
  };

  if (id) {
    await prisma.teamMember.update({ where: { id }, data });
  } else {
    await prisma.teamMember.create({ data });
  }

  revalidatePath("/admin/team");
  revalidatePath("/", "layout");
  redirect("/admin/team");
}

export async function deleteTeamMember(id: string) {
  await requireAuth();
  await prisma.teamMember.delete({ where: { id } });
  revalidatePath("/admin/team");
  revalidatePath("/", "layout");
}
