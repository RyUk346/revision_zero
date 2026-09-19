import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AdminHeader, Field } from "@/components/admin/FormField";
import SubmitButton from "@/components/admin/SubmitButton";
import { ICON_NAMES } from "@/components/ui/Icon";
import { saveService } from "@/actions/services";

export default async function ServiceFormPage({ params }: { params: { id: string } }) {
  const isNew = params.id === "new";
  const service = isNew ? null : await prisma.service.findUnique({ where: { id: params.id } });
  if (!isNew && !service) notFound();

  return (
    <>
      <Link href="/admin/services" className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-steel-500 hover:text-steel-800">
        <ArrowLeft className="h-4 w-4" /> Back to services
      </Link>
      <AdminHeader title={isNew ? "New service" : "Edit service"} />

      <form action={saveService} className="card max-w-3xl space-y-5 p-6">
        {!isNew && <input type="hidden" name="id" value={service!.id} />}

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Title *" htmlFor="title" className="sm:col-span-2">
            <input id="title" name="title" className="input" defaultValue={service?.title ?? ""} required />
          </Field>

          <Field label="Slug" htmlFor="slug" hint="Leave blank to auto-generate.">
            <input id="slug" name="slug" className="input" defaultValue={service?.slug ?? ""} />
          </Field>

          <Field label="Icon" htmlFor="icon">
            <select id="icon" name="icon" className="input" defaultValue={service?.icon ?? "Wrench"}>
              {ICON_NAMES.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </Field>

          <Field label="Placeholder colour" htmlFor="imageColor">
            <input id="imageColor" name="imageColor" type="color" className="h-11 w-full rounded-md border border-steel-300" defaultValue={service?.imageColor ?? "#3f5573"} />
          </Field>

          <Field label="Order" htmlFor="order" hint="Lower numbers appear first.">
            <input id="order" name="order" type="number" className="input" defaultValue={service?.order ?? 0} />
          </Field>
        </div>

        <Field label="Image URL" htmlFor="image" hint="Optional image. Falls back to the icon + colour.">
          <input id="image" name="image" className="input" defaultValue={service?.image ?? ""} placeholder="https://…" />
        </Field>

        <Field label="Summary" htmlFor="summary" hint="Short text used on cards.">
          <textarea id="summary" name="summary" rows={2} className="input" defaultValue={service?.summary ?? ""} />
        </Field>

        <Field label="Description" htmlFor="description">
          <textarea id="description" name="description" rows={5} className="input" defaultValue={service?.description ?? ""} />
        </Field>

        <label className="flex items-center gap-2 text-sm font-medium text-steel-700">
          <input type="checkbox" name="published" defaultChecked={service?.published ?? true} className="h-4 w-4 rounded border-steel-300" />
          Published
        </label>

        <div className="flex gap-3 border-t border-steel-100 pt-5">
          <SubmitButton>{isNew ? "Create service" : "Save changes"}</SubmitButton>
          <Link href="/admin/services" className="btn-outline">Cancel</Link>
        </div>
      </form>
    </>
  );
}
