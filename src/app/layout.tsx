import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout";

const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  variable: "--font-heebo",
});

export const metadata: Metadata = {
  title: "בית יעקב - ניהול פיננסי",
  description: "מערכת ניהול פיננסי לעמותת בית יעקב",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" suppressHydrationWarning>
      <body className={`${heebo.variable} font-sans antialiased`}>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
          {/* Sidebar - Desktop */}
          <div className="hidden lg:block">
            <Sidebar />
          </div>

          {/* Main Content */}
          <main className="lg:mr-72">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
