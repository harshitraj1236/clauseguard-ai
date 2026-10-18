import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ClauseGuard AI — Privacy-First Freelancer Contract Auditor",
  description: "Detect predatory clauses, Net-90 traps, and IP forfeiture in your freelance contracts with 100% private open-weight AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-brand-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
