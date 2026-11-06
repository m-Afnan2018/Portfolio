import type { Metadata } from "next";
import { LostScene } from "@/components/brand/LostScene";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

/** 404 — shared by every version: a torch-lit 404 and three doors back in. */
export default function NotFound() {
  return <LostScene />;
}
