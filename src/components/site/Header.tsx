"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, Phone } from "lucide-react";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/who-we-are", label: "Who We Are" },
  { href: "/projects", label: "Projects" },
  { href: "/services", label: "Services" },
  { href: "/news", label: "News" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact" },
];

export default function Header({
  companyName = "Revision Zero",
  tagline = "Steel Detailers",
  logo,
  logoLight,
}: {
  companyName?: string;
  tagline?: string;
  logo?: string | null;
  logoLight?: string | null;
}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Transparent-over-hero treatment only on the homepage.
  const overlay = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Solid (white) appearance when: not on homepage, scrolled down, or menu open.
  const solid = !overlay || scrolled || open;

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const activeLogo = solid ? logo : logoLight ?? logo;

  return (
    <header
      className={`${overlay ? "fixed" : "sticky"} inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid
          ? "border-b border-steel-100 bg-white/95 backdrop-blur"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="container-page flex h-20 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          {activeLogo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={activeLogo}
              alt={companyName}
              className="h-12 w-auto transition-opacity duration-300"
            />
          ) : (
            <>
              <span className="flex h-10 w-10 items-center justify-center rounded bg-steel-900 font-display text-lg font-extrabold text-white">
                R0
              </span>
              <span className="leading-tight">
                <span
                  className={`block font-display text-lg font-extrabold ${
                    solid ? "text-steel-900" : "text-white"
                  }`}
                >
                  {companyName}
                </span>
                <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-500">
                  {tagline}
                </span>
              </span>
            </>
          )}
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded px-3 py-2 text-sm font-semibold transition-colors ${
                  active
                    ? solid
                      ? "text-accent-600"
                      : "text-accent-300"
                    : solid
                      ? "text-steel-700 hover:text-accent-600"
                      : "text-white/90 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:block">
          <Link href="/schedule-a-call" className="btn-primary">
            <Phone className="h-4 w-4" />
            Schedule A Call
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          aria-label="Toggle menu"
          className={`rounded p-2 lg:hidden ${solid ? "text-steel-800" : "text-white"}`}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-steel-100 bg-white lg:hidden">
          <nav className="container-page flex flex-col py-3">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`rounded px-2 py-3 text-base font-semibold ${
                  isActive(item.href)
                    ? "text-accent-600"
                    : "text-steel-800 hover:text-accent-600"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/schedule-a-call"
              onClick={() => setOpen(false)}
              className="btn-primary mt-2"
            >
              <Phone className="h-4 w-4" />
              Schedule A Call
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
