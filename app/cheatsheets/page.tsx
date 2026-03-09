import Link from "next/link";
import { getTopCheatSheetCommands, libraries } from "@/lib/content";

export default function CheatSheetsPage() {
  return (
    <div className="space-y-5">
      <section className="panel p-5">
        <h1 className="text-3xl font-semibold tracking-tight">Cheat Sheets</h1>
        <p className="mt-2 text-sm subtle">
          Highest-utility commands per library, optimized for quick coding lookup.
        </p>
      </section>

      {libraries.map((library) => {
        const commands = getTopCheatSheetCommands(library.library);
        return (
          <section key={library.library} className="panel overflow-hidden">
            <header className="border-b border-[var(--border)] bg-[var(--surface-alt)] p-4">
              <h2 className="text-xl font-semibold">{library.title}</h2>
              <p className="mt-1 text-sm subtle">
                {commands.length} commands selected from official docs-focused coverage.
              </p>
            </header>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)] text-left">
                    <th className="px-4 py-2 font-semibold">Command</th>
                    <th className="px-4 py-2 font-semibold">Syntax</th>
                    <th className="px-4 py-2 font-semibold">Use Case</th>
                    <th className="px-4 py-2 font-semibold">Docs</th>
                  </tr>
                </thead>
                <tbody>
                  {commands.map((command) => (
                    <tr key={command.id} className="border-b border-[var(--border)] align-top">
                      <td className="px-4 py-3">
                        <Link
                          href={`/command/${command.slug}`}
                          className="font-medium text-[var(--accent-strong)] hover:underline"
                        >
                          {command.name}
                        </Link>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs md:text-sm">{command.syntax}</td>
                      <td className="px-4 py-3">{command.summary}</td>
                      <td className="px-4 py-3">
                        <a
                          href={command.docs[0]?.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[var(--accent-strong)] hover:underline"
                        >
                          {command.docs[0]?.label ?? "Docs"}
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        );
      })}
    </div>
  );
}
