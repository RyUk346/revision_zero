"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAuth, type FormResult } from "@/lib/session";
import { field } from "@/lib/utils";

/** Public: submit a job application. */
export async function submitApplication(formData: FormData): Promise<FormResult> {
  const name = field(formData, "name");
  const email = field(formData, "email");
  const jobId = field(formData, "jobId");

  if (!name || !email) {
    return { ok: false, error: "Please provide your name and email." };
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return { ok: false, error: "Please enter a valid email address." };
  }

  await prisma.jobApplication.create({
    data: {
      name,
      email,
      phone: field(formData, "phone"),
      linkedin: field(formData, "linkedin"),
      message: field(formData, "message"),
      jobId: jobId ?? null,
    },
  });

  revalidatePath("/admin/applications");
  return { ok: true, message: "Application received — thank you for your interest!" };
}

/** Admin: update application status. */
export async function updateApplicationStatus(id: string, status: string) {
  await requireAuth();
  await prisma.jobApplication.update({ where: { id }, data: { status } });
  revalidatePath("/admin/applications");
}

/** Admin: delete an application. */
export async function deleteApplication(id: string) {
  await requireAuth();
  await prisma.jobApplication.delete({ where: { id } });
  revalidatePath("/admin/applications");
}
