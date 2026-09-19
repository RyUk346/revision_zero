import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <p className="font-display text-7xl font-extrabold text-steel-900">404</p>
      <h1 className="mt-2 text-2xl font-bold text-steel-800">Page not found</h1>
      <p className="mt-2 max-w-md text-steel-500">
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
      </p>
      <Link href="/" className="btn-primary mt-6">
        Back to home
      </Link>
    </div>
  );
}
