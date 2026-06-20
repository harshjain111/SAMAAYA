import { cn } from "@/lib/cn";

export type IconName =
  | "leaf"
  | "package"
  | "truck"
  | "shield"
  | "sun"
  | "cloud"
  | "moon"
  | "arrow-right"
  | "check"
  | "star";

const PATHS: Record<IconName, React.ReactNode> = {
  leaf: (
    <>
      <path d="M5 21c0-7.5 4.5-13.5 15-15-1 10-5.5 15.5-15 15Z" />
      <path d="M5 21c2.8-5 6.5-8 11-9.5" />
    </>
  ),
  package: (
    <>
      <path d="M3 7.5 12 3l9 4.5v9L12 21 3 16.5v-9Z" />
      <path d="M3 7.5 12 12l9-4.5M12 12v9" />
    </>
  ),
  truck: (
    <>
      <path d="M3 6.5h11v8.5H3z" />
      <path d="M14 9.5h3.5L21 13v2h-7z" />
      <circle cx="7.5" cy="17" r="1.6" />
      <circle cx="16.5" cy="17" r="1.6" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3l7 3v6c0 4.8-7 9-7 9s-7-4.2-7-9V6l7-3Z" />
      <path d="M9 12l2 2 4-4.5" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.2 5.2l1.4 1.4M17.4 17.4l1.4 1.4M18.8 5.2l-1.4 1.4M6.6 17.4l-1.4 1.4" />
    </>
  ),
  cloud: <path d="M7 18a4 4 0 0 1-.4-8A5.5 5.5 0 0 1 17.5 11 3.5 3.5 0 0 1 17 18H7Z" />,
  moon: <path d="M20.5 13.5A8 8 0 1 1 10.5 3.5a6.5 6.5 0 0 0 10 10Z" />,
  "arrow-right": <path d="M5 12h13M12.5 6l6 6-6 6" />,
  check: <path d="M5 12.5l4.5 4.5L19 7" />,
  star: <path d="M12 3.5l2.6 5.3 5.9.9-4.25 4.15 1 5.85L12 17l-5.25 2.75 1-5.85L3.5 9.7l5.9-.9L12 3.5Z" />,
};

export interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
  /** Fill the shape (for star ratings). Default: stroke only. */
  filled?: boolean;
}

/** Minimal line-icon set (currentColor). Replaces emoji across the UI. */
export function Icon({ name, size = 20, className, filled = false }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("shrink-0", className)}
      aria-hidden="true"
    >
      {PATHS[name]}
    </svg>
  );
}
