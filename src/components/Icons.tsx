import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

const base = (p: P): P => ({
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.1,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  ...p,
});

/** 站点专属 Logo 徽章：手绘墨线法槌 + 唯一橙色重点圆点 */
export function BrandMark(p: P) {
  return (
    <svg width={28} height={28} viewBox="0 0 32 32" fill="none" aria-hidden {...p}>
      <rect x="2" y="2" width="28" height="28" rx="9" fill="#FFF" stroke="#1c1917" strokeWidth="2.4" />
      <circle cx="23.5" cy="8.5" r="3" fill="#F97316" />
      <path d="M9.5 13.5l5-5 4 4-5 5-4-4Z" fill="#1c1917" stroke="#1c1917" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M15.5 14.5l6 6" stroke="#1c1917" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M8 23h9" stroke="#1c1917" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

export function IconGavel(p: P) {
  return (
    <svg {...base(p)}>
      <path d="m14 13-7.5 7.5c-.83.83-2.17.83-3 0a2.12 2.12 0 0 1 0-3L11 10" />
      <path d="m16 16 6-6" />
      <path d="m8 8 6-6" />
      <path d="m9 7 8 8" />
      <path d="m21 11-8-8" />
    </svg>
  );
}

export function IconBody(p: P) {
  return (
    <svg {...base(p)}>
      <circle cx="12" cy="5" r="2.5" />
      <path d="M6 10.5c2-1 4-1.5 6-1.5s4 .5 6 1.5" />
      <path d="M12 9v6" />
      <path d="m9 21 3-6 3 6" />
    </svg>
  );
}

export function IconArchive(p: P) {
  return (
    <svg {...base(p)}>
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" />
      <path d="M8 7h8" />
      <path d="M8 11h5" />
    </svg>
  );
}

export function IconEvidence(p: P) {
  return (
    <svg {...base(p)}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
      <path d="m8.5 11 1.7 1.7 3.3-3.4" />
    </svg>
  );
}

export function IconPodcast(p: P) {
  return (
    <svg {...base(p)}>
      <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
      <rect x="3" y="14" width="4" height="6" rx="1.5" />
      <rect x="17" y="14" width="4" height="6" rx="1.5" />
    </svg>
  );
}

export function IconSmash(p: P) {
  return (
    <svg {...base(p)}>
      <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8Z" />
    </svg>
  );
}

export function IconFlame(p: P) {
  return (
    <svg {...base(p)}>
      <path d="M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4" />
    </svg>
  );
}

export function IconBolt(p: P) {
  return (
    <svg {...base(p)}>
      <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />
    </svg>
  );
}

export function IconHeart(p: P) {
  return (
    <svg {...base(p)}>
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}

export function IconVolume({ muted, ...p }: P & { muted: boolean }) {
  return muted ? (
    <svg {...base(p)}>
      <path d="M11 5 6 9H2v6h4l5 4V5Z" />
      <path d="m22 9-6 6" />
      <path d="m16 9 6 6" />
    </svg>
  ) : (
    <svg {...base(p)}>
      <path d="M11 5 6 9H2v6h4l5 4V5Z" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7" />
      <path d="M18.5 5.5a9 9 0 0 1 0 13" />
    </svg>
  );
}

export function IconArrowRight(p: P) {
  return (
    <svg {...base(p)}>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

/** 身体器官/机制统一细线图标（完全替代廉价系统 emoji） */
export function RoleIcon({ slug, ...p }: P & { slug: string }) {
  switch (slug) {
    case "adrenal":
      return (
        <svg {...base(p)}>
          <path d="M12 3v3" />
          <path d="M6 15a6 6 0 0 1 12 0v3H6v-3Z" />
          <path d="M4 18h16" />
          <path d="m5.5 7.5 1.8 1.8" />
          <path d="m18.5 7.5-1.8 1.8" />
        </svg>
      );
    case "cholesterol":
      return (
        <svg {...base(p)}>
          <path d="M3 8h18" />
          <path d="M3 16h18" />
          <circle cx="9" cy="12" r="2" />
          <circle cx="15.5" cy="12" r="1.5" />
        </svg>
      );
    case "insulin":
      return (
        <svg {...base(p)}>
          <circle cx="8" cy="12" r="4" />
          <path d="M12 12h9" />
          <path d="M18 12v3" />
          <path d="M15 12v2" />
        </svg>
      );
    case "cartilage":
      return (
        <svg {...base(p)}>
          <path d="M7 4c0 3 2 4 5 4s5-1 5-4" />
          <path d="M7 20c0-3 2-4 5-4s5 1 5 4" />
          <rect x="6" y="10" width="12" height="4" rx="2" />
        </svg>
      );
    case "muscle":
      return (
        <svg {...base(p)}>
          <path d="M6 15c1-4 4-6 8-6 2.5 0 4.5 1.5 4.5 4S16.5 17 13 17H7.5" />
          <path d="M9 12.5c1.5-1 3.5-1 5 0" />
        </svg>
      );
    case "melatonin":
      return (
        <svg {...base(p)}>
          <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" />
        </svg>
      );
    case "thyroid":
      return (
        <svg {...base(p)}>
          <path d="M12 10v6" />
          <path d="M12 12c-1.5-4-6-5-7-2s1 7 5 6c1-.2 1.7-1 2-2" />
          <path d="M12 12c1.5-4 6-5 7-2s-1 7-5 6c-1-.2-1.7-1-2-2" />
        </svg>
      );
    case "dopamine":
      return (
        <svg {...base(p)}>
          <path d="M13 3 5 14h6l-1 7 9-11h-6l0-7Z" />
        </svg>
      );
    case "uric-acid":
      return (
        <svg {...base(p)}>
          <path d="m12 3 6 9-6 9-6-9 6-9Z" />
          <path d="M12 8v8" />
        </svg>
      );
    case "gut-microbiome":
      return (
        <svg {...base(p)}>
          <path d="M6 6h9a3 3 0 0 1 0 6H9a3 3 0 0 0 0 6h9" />
          <circle cx="9" cy="9" r="0.8" fill="currentColor" />
          <circle cx="15" cy="15" r="0.8" fill="currentColor" />
        </svg>
      );
    case "blood-pressure":
      return (
        <svg {...base(p)}>
          <path d="M3 12h4l2.5-6 4 12 2.5-6H21" />
        </svg>
      );
    case "cortisol":
      return (
        <svg {...base(p)}>
          <circle cx="12" cy="12" r="8" />
          <path d="M12 8v4l3 2" />
        </svg>
      );
    default:
      return <IconBody {...p} />;
  }
}

export function CategoryIcon({ category, ...p }: P & { category: string }) {
  switch (category) {
    case "运动":
      return (
        <svg {...base(p)}>
          <path d="M4 16c4 0 6-6 9-6s4 4 7 4" />
          <circle cx="17" cy="6" r="2" />
        </svg>
      );
    case "饮食":
      return (
        <svg {...base(p)}>
          <path d="M4 13h16a7 7 0 0 1-16 0Z" />
          <path d="M8 9c0-2 1.5-3 4-3s4 1 4 3" />
        </svg>
      );
    case "睡眠":
      return (
        <svg {...base(p)}>
          <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" />
        </svg>
      );
    default:
      return <RoleIcon slug="muscle" {...p} />;
  }
}
