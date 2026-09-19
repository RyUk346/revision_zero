import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AdminHeader, Field } from "@/components/admin/FormField";
import SubmitButton from "@/components/admin/SubmitButton";
import { savePartner } from "@/actions/partners";

export default async function PartnerFormPage({ params }: { params: { id: string } }) {
  const isNew = params.id === "new";
  const partner = isNew ? null : await prisma.partner.findUnique({ where: { id: params.id } });
  if (!isNew && !partner) notFound();

  return (
    <>
      <Link href="/admin/partners" className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-steel-500 hover:text-steel-800">
        <ArrowLeft className="h-4 w-4" /> Back to partners
      </Link>
      <AdminHeader title={isNew ? "New partner" : "Edit partner"} />

      <form action={savePartner} className="card max-w-2xl space-y-5 p-6">
        {!isNew && <input type="hidden" name="id" value={partner!.id} />}

        <Field label="Name *" htmlFor="name">
          <input id="name" name="name" className="input" defaultValue={partner?.name ?? ""} required />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Category" htmlFor="category">
            <select id="category" name="category" className="input" defaultValue={partner?.category ?? "Software"}>
              <option>Software</option>
              <option>Accreditation</option>
            </select>
          </Field>
          <Field label="Order" htmlFor="order" hint="Lower numbers appear first.">
            <input id="order" name="order" type="number" className="input" defaultValue={partner?.order ?? 0} />
          </Field>
        </div>

        <Field label="Logo URL" htmlFor="logo" hint="Logo image shown on the home page / footer.">
          <input id="logo" name="logo" className="input" defaultValue={partner?.logo ?? ""} placeholder="https://…" />
        </Field>

        <Field label="Website URL" htmlFor="url">
          <input id="url" name="url" className="input" defaultValue={partner?.url ?? ""} placeholder="https://" />
        </Field>

        <label className="flex items-center gap-2 text-sm font-medium text-steel-700">
          <input type="checkbox" name="published" defaultChecked={partner?.published ?? true} className="h-4 w-4 rounded border-steel-300" />
          Visible on site
        </label>

        <div className="flex gap-3 border-t border-steel-100 pt-5">
          <SubmitButton>{isNew ? "Create partner" : "Save changes"}</SubmitButton>
          <Link href="/admin/partners" className="btn-outline">Cancel</Link>
        </div>
      </form>
    </>
  );
}
