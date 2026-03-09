import Link from "next/link";
import { GlobalSearch } from "@/components/global-search";

const links = [
  { href: "/", label: "Home" },
  { href: "/recipes", label: "Recipes" },
  { href: "/cheatsheets", label: "Cheat Sheets" },
  { href: "/compare", label: "Compare" }
];

export function TopHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[color:var(--surface-glass)]/85 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-3 p-4 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            {links.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="chip-link rounded-full border border-[var(--border)] px-3 py-1.5 font-medium"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <p className="text-xs subtle">Doc-driven coding companion</p>
        </div>
        <GlobalSearch />
      </div>
    </header>
  );
}
