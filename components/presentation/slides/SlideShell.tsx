import type { SlideDesign } from "@/lib/slides/types";

type SlideShellProps = {
  design: SlideDesign;
  children: React.ReactNode;
  className?: string;
  backgroundUrl?: string | null;
};

export function SlideShell({ design, children, className = "", backgroundUrl }: SlideShellProps) {
  const isDark = design.overlay === "dark" || design.backgroundColor === "#1A1A1A";

  return (
    <div
      className={`relative flex min-h-screen overflow-hidden px-6 py-16 md:px-14 lg:px-20 ${className}`}
      style={{ backgroundColor: design.backgroundColor || "#FFFFFF", color: isDark ? "#FFFFFF" : "#1A1A1A" }}
    >
      {backgroundUrl ? (
        <div className="absolute inset-0">
          <img src={backgroundUrl} alt="" className="h-full w-full object-cover" />
          <div className={`absolute inset-0 ${isDark ? "bg-[#1A1A1A]/55" : "bg-white/35"}`} />
        </div>
      ) : null}
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
}
