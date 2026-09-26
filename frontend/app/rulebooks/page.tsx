import Link from "next/link";
import { FileText, ArrowUpRight } from "lucide-react";
import { existsSync } from "fs";
import path from "path";

import Navbar from "@/components/layout/Navbar";
import { api } from "@/lib/api";

function getSportSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default async function RulebooksPage() {
  const sports = await api.sports.getActive();

  const orderedSports = [...sports].sort(
    (a, b) => a.displayOrder - b.displayOrder
  );

  const sportsWithRulebooks = orderedSports.filter((sport) => {
    const slug = getSportSlug(sport.name);

    const filePath = path.join(
      process.cwd(),
      "public",
      "rulebooks",
      `${slug}.pdf`
    );

    return existsSync(filePath);
  });

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#063b32] pt-20 text-[#f4f0e5]">
      <Navbar />

      {/* Header */}
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-[1600px] px-5 pb-12 pt-12 sm:px-8 sm:pb-14 sm:pt-16 lg:px-10 lg:pb-16 lg:pt-20">
          <p className="mono-font mb-4 text-xs font-bold uppercase tracking-[0.18em] text-[#ff625b] sm:text-sm">
            IIITG FRESHERS&apos; CUP
          </p>

          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="display-font text-6xl leading-[0.88] tracking-tight sm:text-7xl md:text-8xl lg:text-9xl">
                Rulebooks
              </h1>

              <p className="mono-font mt-6 max-w-2xl text-sm leading-7 text-white/60 sm:text-base">
                Official rules and regulations for every sport in the
                Freshers&apos; Cup.
              </p>
            </div>

            <span className="mono-font text-xs font-bold uppercase tracking-[0.14em] text-white/40 sm:text-sm">
              {sportsWithRulebooks.length} Rulebooks
            </span>
          </div>
        </div>
      </section>

      {/* Rulebooks */}
      <section>
        <div className="mx-auto max-w-[1600px] px-5 py-10 sm:px-8 sm:py-14 lg:px-10 lg:py-16">
          {sportsWithRulebooks.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {sportsWithRulebooks.map((sport) => {
                const slug = getSportSlug(sport.name);
                const pdfPath = `/rulebooks/${slug}.pdf`;

                return (
                  <div
                    key={sport.id}
                    className="group relative border border-white/15 bg-[#0a443a] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#ff625b] hover:bg-[#0d4b40] sm:p-7"
                  >
                    {/* Corner decorations */}
                    <span className="absolute left-0 top-0 h-4 w-4 border-l-2 border-t-2 border-[#ff625b]" />
                    <span className="absolute right-0 top-0 h-4 w-4 border-r-2 border-t-2 border-[#f4b93f]" />
                    <span className="absolute bottom-0 left-0 h-4 w-4 border-b-2 border-l-2 border-[#f4b93f]" />
                    <span className="absolute bottom-0 right-0 h-4 w-4 border-b-2 border-r-2 border-[#ff625b]" />

                    <div className="flex items-start justify-between gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-white/15 bg-[#063b32] text-[#ff625b]">
                        <FileText size={22} />
                      </div>

                      <span className="mono-font text-[10px] font-bold uppercase tracking-[0.15em] text-white/30">
                        PDF
                      </span>
                    </div>

                    <p className="mono-font mt-6 text-[11px] font-bold uppercase tracking-[0.16em] text-white/35">
                      SPORT {String(sport.id).padStart(2, "0")}
                    </p>

                    <h2 className="mt-2 text-3xl font-black uppercase tracking-tight text-[#f4f0e5]">
                      {sport.name}
                    </h2>

                    {sport.description && (
                      <p className="mono-font mt-3 line-clamp-2 text-xs leading-6 text-white/45">
                        {sport.description}
                      </p>
                    )}

                    <a
                      href={pdfPath}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mono-font mt-6 flex items-center justify-between border border-white/15 bg-[#063b32] px-4 py-3 text-xs font-bold uppercase tracking-[0.08em] text-[#f4f0e5] transition-colors hover:border-[#ff625b] hover:text-[#ff625b]"
                    >
                      <span>View Rulebook</span>
                      <ArrowUpRight size={16} />
                    </a>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="border border-white/15 bg-[#0a443a] px-6 py-16 text-center">
              <p className="mono-font text-sm font-bold uppercase tracking-[0.12em] text-white/40">
                No rulebooks available right now.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}