"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAuth, type FormResult } from "@/lib/session";
import { field } from "@/lib/utils";

/** Public: handle a contact form submission. */
export async function submitContact(formData: FormData): Promise<FormResult> {
  const name = field(formData, "name");
  const email = field(formData, "email");
  const message = field(formData, "message");

  if (!name || !email || !message) {
    return { ok: false, error: "Please fill in your name, email and message." };
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return { ok: false, error: "Please enter a valid email address." };
  }

  await prisma.contactSubmission.create({
    data: {
      name,
      email,
      phone: field(formData, "phone"),
      company: field(formData, "company"),
      subject: field(formData, "subject"),
      message,
    },
  });

  revalidatePath("/admin/messages");
  return { ok: true, message: "Thanks for reaching out — we'll be in touch soon." };
}

/** Admin: toggle read state. */
export async function toggleMessageRead(id: string, read: boolean) {
  await requireAuth();
  await prisma.contactSubmission.update({ where: { id }, data: { read } });
  revalidatePath("/admin/messages");
}

/** Admin: delete a message. */
export async function deleteMessage(id: string) {
  await requireAuth();
  await prisma.contactSubmission.delete({ where: { id } });
  revalidatePath("/admin/messages");
}
