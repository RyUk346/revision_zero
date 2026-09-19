import type { ReactNode } from "react";

/** Labelled wrapper for a form control. */
export function Field({
  label,
  htmlFor,
  hint,
  children,
  className = "",
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="label" htmlFor={htmlFor}>
        {label}
      </label>
      {children}
      {hint && <p className="mt-1 text-xs text-steel-400">{hint}</p>}
    </div>
  );
}

/** Page header used at the top of each admin screen. */
export function AdminHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-steel-900">{title}</h1>
        {description && <p className="mt-1 text-sm text-steel-500">{description}</p>}
      </div>
      {action}
    </div>
  );
}

/** Empty-state row for tables. */
export function EmptyRow({ colSpan, label }: { colSpan: number; label: string }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-4 py-10 text-center text-sm text-steel-400">
        {label}
      </td>
    </tr>
  );
}
