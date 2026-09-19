import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AdminHeader, Field } from "@/components/admin/FormField";
import SubmitButton from "@/components/admin/SubmitButton";
import { saveTeamMember } from "@/actions/team";

export default async function TeamFormPage({ params }: { params: { id: string } }) {
  const isNew = params.id === "new";
  const member = isNew ? null : await prisma.teamMember.findUnique({ where: { id: params.id } });
  if (!isNew && !member) notFound();

  return (
    <>
      <Link href="/admin/team" className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-steel-500 hover:text-steel-800">
        <ArrowLeft className="h-4 w-4" /> Back to team
      </Link>
      <AdminHeader title={isNew ? "New team member" : "Edit team member"} />

      <form action={saveTeamMember} className="card max-w-3xl space-y-5 p-6">
        {!isNew && <input type="hidden" name="id" value={member!.id} />}

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Name *" htmlFor="name">
            <input id="name" name="name" className="input" defaultValue={member?.name ?? ""} required />
          </Field>
          <Field label="Role *" htmlFor="role">
            <input id="role" name="role" className="input" defaultValue={member?.role ?? ""} required />
          </Field>
          <Field label="Email" htmlFor="email">
            <input id="email" name="email" type="email" className="input" defaultValue={member?.email ?? ""} />
          </Field>
          <Field label="LinkedIn URL" htmlFor="linkedin">
            <input id="linkedin" name="linkedin" className="input" defaultValue={member?.linkedin ?? ""} />
          </Field>
        </div>

        <Field label="Bio" htmlFor="bio">
          <textarea id="bio" name="bio" rows={5} className="input" defaultValue={member?.bio ?? ""} />
        </Field>

        <Field label="Photo URL" htmlFor="image" hint="Headshot. Leave blank to show coloured initials.">
          <input id="image" name="image" className="input" defaultValue={member?.image ?? ""} placeholder="https://…" />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Avatar colour" htmlFor="imageColor" hint="Used behind the initials when no photo is set.">
            <input id="imageColor" name="imageColor" type="color" className="h-11 w-full rounded-md border border-steel-300" defaultValue={member?.imageColor ?? "#2d3c50"} />
          </Field>
          <Field label="Order" htmlFor="order" hint="Lower numbers appear first.">
            <input id="order" name="order" type="number" className="input" defaultValue={member?.order ?? 0} />
          </Field>
        </div>

        <label className="flex items-center gap-2 text-sm font-medium text-steel-700">
          <input type="checkbox" name="published" defaultChecked={member?.published ?? true} className="h-4 w-4 rounded border-steel-300" />
          Visible on site
        </label>

        <div className="flex gap-3 border-t border-steel-100 pt-5">
          <SubmitButton>{isNew ? "Create member" : "Save changes"}</SubmitButton>
          <Link href="/admin/team" className="btn-outline">Cancel</Link>
        </div>
      </form>
    </>
  );
}
