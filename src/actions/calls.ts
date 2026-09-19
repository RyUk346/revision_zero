"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAuth, type FormResult } from "@/lib/session";
import { field } from "@/lib/utils";

/** Public: handle a "schedule a call" request. */
export async function submitCallRequest(formData: FormData): Promise<FormResult> {
  const name = field(formData, "name");
  const email = field(formData, "email");

  if (!name || !email) {
    return { ok: false, error: "Please provide your name and email." };
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return { ok: false, error: "Please enter a valid email address." };
  }

  await prisma.callRequest.create({
    data: {
      name,
      email,
      phone: field(formData, "phone"),
      company: field(formData, "company"),
      preferredDate: field(formData, "preferredDate"),
      preferredTime: field(formData, "preferredTime"),
      topic: field(formData, "topic"),
      message: field(formData, "message"),
    },
  });

  revalidatePath("/admin/calls");
  return { ok: true, message: "Request received — we'll confirm a time by email." };
}

/** Admin: update status. */
export async function updateCallStatus(id: string, status: string) {
  await requireAuth();
  await prisma.callRequest.update({ where: { id }, data: { status } });
  revalidatePath("/admin/calls");
}

/** Admin: delete a call request. */
export async function deleteCallRequest(id: string) {
  await requireAuth();
  await prisma.callRequest.delete({ where: { id } });
  revalidatePath("/admin/calls");
}
