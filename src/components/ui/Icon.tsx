import type { SVGProps } from "react";

const paths: Record<string, string> = {
  home: "M3 10.5 12 3l9 7.5V21h-6v-6H9v6H3z",
  user: "M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm-8 9a8 8 0 0 1 16 0",
  pkg: "m12 2 9 5v10l-9 5-9-5V7zm0 0v20M3 7l9 5 9-5",
  git: "M6 3v12m0 0a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm12-9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm0 0a9 9 0 0 1-9 9",
  folder: "M3 6a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
  server: "M4 4h16v6H4zm0 10h16v6H4zM8 7h.01M8 17h.01",
  trophy: "M8 21h8m-4-4v4M7 4h10v5a5 5 0 0 1-10 0zM7 6H4a3 3 0 0 0 3 4m10-4h3a3 3 0 0 1-3 4",
  mail: "M3 5h18v14H3zm0 0 9 7 9-7",
  github: "M9 19c-4 1.5-4-2-6-2.5m12 5v-3.5a3 3 0 0 0-.8-2.3c2.7-.3 5.6-1.3 5.6-6a4.6 4.6 0 0 0-1.3-3.2 4.3 4.3 0 0 0-.1-3.2s-1-.3-3.4 1.3a11.6 11.6 0 0 0-6 0C6.6 2.2 5.6 2.5 5.6 2.5a4.3 4.3 0 0 0-.1 3.2A4.6 4.6 0 0 0 4.2 9c0 4.6 2.9 5.6 5.6 6a3 3 0 0 0-.8 2.3V21",
  linkedin: "M4 9h4v12H4zM6 3a2 2 0 1 1 0 4 2 2 0 0 1 0-4Zm6 6h3.8v1.7h.1A4.2 4.2 0 0 1 19.6 8.7c4 0 4.4 2.6 4.4 6V21h-4v-5.6c0-1.3 0-3-1.9-3s-2.1 1.4-2.1 2.9V21h-4z",
  globe: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm-9 9h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3Z",
  download: "M12 3v12m0 0-4-4m4 4 4-4M4 17v3h16v-3",
  copy: "M8 8h12v12H8zM4 16V4h12",
  arrow: "M5 12h14m-6-6 6 6-6 6",
  external: "M14 4h6v6m0-6-9 9M10 6H4v14h14v-6",
  close: "M6 6l12 12M18 6 6 18",
  menu: "M4 7h16M4 12h16M4 17h10",
  terminal: "m4 17 6-5-6-5m8 12h8",
  search: "m21 21-4.3-4.3M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z",
  sun: "M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0-15v2m0 16v2M4.2 4.2l1.4 1.4m12.8 12.8 1.4 1.4M2 12h2m16 0h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4",
  moon: "M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z",
  branch: "M6 3v12M18 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm12-12a9 9 0 0 1-9 9",
  play: "M7 4v16l13-8z",
};

export type IconName = keyof typeof paths;

export function Icon({ name, size = 16, ...props }: { name: IconName | string; size?: number } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <path d={paths[name] ?? paths.terminal} />
    </svg>
  );
}
