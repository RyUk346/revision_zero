import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AdminHeader, Field } from "@/components/admin/FormField";
import SubmitButton from "@/components/admin/SubmitButton";
import { saveJob } from "@/actions/careers";

export default async function CareerFormPage({ params }: { params: { id: string } }) {
  const isNew = params.id === "new";
  const job = isNew ? null : await prisma.jobPosting.findUnique({ where: { id: params.id } });
  if (!isNew && !job) notFound();

  return (
    <>
      <Link href="/admin/careers" className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-steel-500 hover:text-steel-800">
        <ArrowLeft className="h-4 w-4" /> Back to careers
      </Link>
      <AdminHeader title={isNew ? "New job posting" : "Edit job posting"} />

      <form action={saveJob} className="card max-w-3xl space-y-5 p-6">
        {!isNew && <input type="hidden" name="id" value={job!.id} />}

        <Field label="Title *" htmlFor="title">
          <input id="title" name="title" className="input" defaultValue={job?.title ?? ""} required />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Slug" htmlFor="slug" hint="Auto from title if blank.">
            <input id="slug" name="slug" className="input" defaultValue={job?.slug ?? ""} />
          </Field>
          <Field label="Department" htmlFor="department">
            <input id="department" name="department" className="input" defaultValue={job?.department ?? ""} />
          </Field>
          <Field label="Location" htmlFor="location">
            <input id="location" name="location" className="input" defaultValue={job?.location ?? "Manila, Philippines"} />
          </Field>
          <Field label="Type" htmlFor="type">
            <select id="type" name="type" className="input" defaultValue={job?.type ?? "Full-time"}>
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Contract</option>
              <option>Internship</option>
            </select>
          </Field>
        </div>

        <Field label="Summary" htmlFor="summary" hint="One-line summary shown in the list.">
          <textarea id="summary" name="summary" rows={2} className="input" defaultValue={job?.summary ?? ""} />
        </Field>

        <Field label="Description" htmlFor="description">
          <textarea id="description" name="description" rows={5} className="input" defaultValue={job?.description ?? ""} />
        </Field>

        <Field label="Requirements" htmlFor="requirements" hint="Separate each requirement with a new line or a semicolon.">
          <textarea id="requirements" name="requirements" rows={4} className="input" defaultValue={job?.requirements ?? ""} />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Order" htmlFor="order" hint="Lower numbers appear first.">
            <input id="order" name="order" type="number" className="input" defaultValue={job?.order ?? 0} />
          </Field>
          <label className="flex items-end gap-2 pb-2.5 text-sm font-medium text-steel-700">
            <input type="checkbox" name="published" defaultChecked={job?.published ?? true} className="h-4 w-4 rounded border-steel-300" />
            Open / published
          </label>
        </div>

        <div className="flex gap-3 border-t border-steel-100 pt-5">
          <SubmitButton>{isNew ? "Create posting" : "Save changes"}</SubmitButton>
          <Link href="/admin/careers" className="btn-outline">Cancel</Link>
        </div>
      </form>
    </>
  );
}
