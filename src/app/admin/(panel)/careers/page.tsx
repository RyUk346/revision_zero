import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AdminHeader, EmptyRow } from "@/components/admin/FormField";
import DeleteButton from "@/components/admin/DeleteButton";
import { deleteJob } from "@/actions/careers";

export default async function AdminCareersPage() {
  const jobs = await prisma.jobPosting.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { applications: true } } },
  });

  return (
    <>
      <AdminHeader
        title="Careers"
        description="Job postings shown on the careers page."
        action={
          <Link href="/admin/careers/new" className="btn-primary">
            <Plus className="h-4 w-4" /> New posting
          </Link>
        }
      />

      <div className="card overflow-hidden">
        <div className="admin-scroll overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="bg-steel-50 text-xs uppercase tracking-wider text-steel-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Title</th>
                <th className="px-4 py-3 font-semibold">Location</th>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">Applications</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-steel-100">
              {jobs.length === 0 && <EmptyRow colSpan={6} label="No job postings yet." />}
              {jobs.map((j) => (
                <tr key={j.id} className="hover:bg-steel-50/50">
                  <td className="px-4 py-3 font-medium text-steel-900">{j.title}</td>
                  <td className="px-4 py-3 text-steel-600">{j.location}</td>
                  <td className="px-4 py-3 text-steel-600">{j.type}</td>
                  <td className="px-4 py-3 text-steel-600">{j._count.applications}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${j.published ? "bg-green-100 text-green-700" : "bg-steel-100 text-steel-500"}`}>
                      {j.published ? "Open" : "Closed"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/admin/careers/${j.id}`} className="inline-flex h-8 w-8 items-center justify-center rounded-md text-steel-600 hover:bg-steel-100" aria-label="Edit" title="Edit">
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <DeleteButton action={deleteJob} id={j.id} iconOnly />
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
