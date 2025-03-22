import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Sidebar } from "@/components/Sidebar";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lovable - AI Workflow Builder",
  description: "Build and manage AI-powered financial workflows",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#1a1b23] text-white`}>
        <Sidebar />
        <div className="pl-64">
          <main className="p-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
