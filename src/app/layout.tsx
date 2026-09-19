import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/components/providers/AuthProvider";

export const metadata: Metadata = {
  title: {
    default: "Revision Zero, Steel Detailers | Low Cost Steel & Structural Detailing",
    template: "%s | Revision Zero",
  },
  description:
    "Revision Zero are steel detailers undertaking all steel detailing projects, including bridges, commercial and light industrial, health and education, and mining and resources.",
  metadataBase: new URL("http://localhost:3000"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
