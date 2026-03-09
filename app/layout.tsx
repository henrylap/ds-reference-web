import type { Metadata } from "next";
import { libraries } from "@/lib/content";
import { AppProviders } from "@/components/app-providers";
import { SidebarNav } from "@/components/sidebar-nav";
import { TopHeader } from "@/components/top-header";
import "./globals.css";

export const metadata: Metadata = {
  title: "DS Reference",
  description:
    "Interactive data science reference for Python, SQL, R Studio, NumPy, Pandas, scikit-learn, Matplotlib, and Seaborn."
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <AppProviders>
          <div className="app-shell">
            <SidebarNav libraries={libraries} />
            <div className="main-pane">
              <TopHeader />
              <main className="mx-auto w-full max-w-[1240px] p-4 md:p-6">{children}</main>
            </div>
          </div>
        </AppProviders>
      </body>
    </html>
  );
}

