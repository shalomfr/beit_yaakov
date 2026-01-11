import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/layout";
import { Providers } from "./providers";

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
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Heebo:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <Providers>
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
        </Providers>
      </body>
    </html>
  );
}
