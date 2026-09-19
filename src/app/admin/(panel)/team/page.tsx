import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AdminHeader, EmptyRow } from "@/components/admin/FormField";
import DeleteButton from "@/components/admin/DeleteButton";
import { deleteTeamMember } from "@/actions/team";

export default async function AdminTeamPage() {
  const team = await prisma.teamMember.findMany({ orderBy: { order: "asc" } });

  return (
    <>
      <AdminHeader
        title="Team"
        description="Members shown on the Who We Are page."
        action={
          <Link href="/admin/team/new" className="btn-primary">
            <Plus className="h-4 w-4" /> New member
          </Link>
        }
      />

      <div className="card overflow-hidden">
        <div className="admin-scroll overflow-x-auto">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead className="bg-steel-50 text-xs uppercase tracking-wider text-steel-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Role</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Order</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-steel-100">
              {team.length === 0 && <EmptyRow colSpan={5} label="No team members yet." />}
              {team.map((m) => (
                <tr key={m.id} className="hover:bg-steel-50/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 font-medium text-steel-900">
                      <span className="h-7 w-7 shrink-0 rounded-full" style={{ backgroundColor: m.imageColor }} />
                      {m.name}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-steel-600">{m.role}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${m.published ? "bg-green-100 text-green-700" : "bg-steel-100 text-steel-500"}`}>
                      {m.published ? "Visible" : "Hidden"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-steel-600">{m.order}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/admin/team/${m.id}`} className="inline-flex h-8 w-8 items-center justify-center rounded-md text-steel-600 hover:bg-steel-100" aria-label="Edit" title="Edit">
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <DeleteButton action={deleteTeamMember} id={m.id} iconOnly />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
