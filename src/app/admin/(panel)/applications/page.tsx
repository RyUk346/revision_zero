import { Mail, Phone, Link2, Briefcase, Clock } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AdminHeader } from "@/components/admin/FormField";
import DeleteButton from "@/components/admin/DeleteButton";
import StatusSelect from "@/components/admin/StatusSelect";
import { deleteApplication, updateApplicationStatus } from "@/actions/applications";
import { formatDate } from "@/lib/utils";

const STATUSES = ["new", "reviewing", "interviewed", "rejected", "hired"];

export default async function AdminApplicationsPage() {
  const apps = await prisma.jobApplication.findMany({
    orderBy: { createdAt: "desc" },
    include: { job: true },
  });

  return (
    <>
      <AdminHeader
        title="Job applications"
        description="Applications submitted through the careers pages."
      />

      <div className="space-y-4">
        {apps.length === 0 && (
          <div className="card p-10 text-center text-steel-400">No applications yet.</div>
        )}

        {apps.map((a) => (
          <div key={a.id} className="card p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-bold text-steel-900">{a.name}</h2>
                <p className="inline-flex items-center gap-1.5 text-sm font-medium text-steel-700">
                  <Briefcase className="h-3.5 w-3.5 text-accent-500" />
                  {a.job?.title ?? "General application"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <StatusSelect id={a.id} value={a.status} options={STATUSES} action={updateApplicationStatus} />
                <DeleteButton action={deleteApplication} id={a.id} iconOnly />
              </div>
            </div>

            {a.message && <p className="mt-3 whitespace-pre-line text-sm text-steel-600">{a.message}</p>}

            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 border-t border-steel-100 pt-3 text-xs text-steel-500">
              <a href={`mailto:${a.email}`} className="inline-flex items-center gap-1.5 hover:text-accent-600">
                <Mail className="h-3.5 w-3.5" /> {a.email}
              </a>
              {a.phone && (
                <span className="inline-flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5" /> {a.phone}
                </span>
              )}
              {a.linkedin && (
                <a href={a.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-accent-600">
                  <Link2 className="h-3.5 w-3.5" /> Profile / portfolio
                </a>
              )}
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" /> {formatDate(a.createdAt)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
