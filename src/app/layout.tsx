import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "QK Notes - Rangkuman Kajian & Catatan Penting",
  description: "Aplikasi pencatat rangkuman kajian, ceramah, dan podcast dengan tipografi ayat yang indah dan penyimpanan database cloud.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="bg-slate-100 min-h-screen text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
        <main className="mobile-frame min-h-screen shadow-lg">
          {children}
        </main>
      </body>
    </html>
  );
}

