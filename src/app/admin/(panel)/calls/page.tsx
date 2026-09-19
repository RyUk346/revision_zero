import { Mail, Phone, Building, CalendarDays, Clock } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AdminHeader } from "@/components/admin/FormField";
import DeleteButton from "@/components/admin/DeleteButton";
import StatusSelect from "@/components/admin/StatusSelect";
import { deleteCallRequest, updateCallStatus } from "@/actions/calls";
import { formatDate } from "@/lib/utils";

const STATUSES = ["new", "scheduled", "done", "cancelled"];

export default async function AdminCallsPage() {
  const calls = await prisma.callRequest.findMany({
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
  });

  return (
    <>
      <AdminHeader
        title="Call requests"
        description="Requests submitted through the Schedule a Call page."
      />

      <div className="space-y-4">
        {calls.length === 0 && (
          <div className="card p-10 text-center text-steel-400">No call requests yet.</div>
        )}

        {calls.map((c) => (
          <div key={c.id} className="card p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-bold text-steel-900">{c.name}</h2>
                {c.topic && <p className="text-sm font-medium text-steel-700">{c.topic}</p>}
              </div>
              <div className="flex items-center gap-2">
                <StatusSelect id={c.id} value={c.status} options={STATUSES} action={updateCallStatus} />
                <DeleteButton action={deleteCallRequest} id={c.id} iconOnly />
              </div>
            </div>

            {c.message && <p className="mt-3 whitespace-pre-line text-sm text-steel-600">{c.message}</p>}

            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 border-t border-steel-100 pt-3 text-xs text-steel-500">
              <a href={`mailto:${c.email}`} className="inline-flex items-center gap-1.5 hover:text-accent-600">
                <Mail className="h-3.5 w-3.5" /> {c.email}
              </a>
              {c.phone && (
                <span className="inline-flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5" /> {c.phone}
                </span>
              )}
              {c.company && (
                <span className="inline-flex items-center gap-1.5">
                  <Building className="h-3.5 w-3.5" /> {c.company}
                </span>
              )}
              {(c.preferredDate || c.preferredTime) && (
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {c.preferredDate} {c.preferredTime}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" /> {formatDate(c.createdAt)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
