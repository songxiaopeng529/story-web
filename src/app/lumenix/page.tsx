import type { Metadata } from "next";
import { Lumenix } from "./scene";

export const metadata: Metadata = {
  title: "Lumenix — Extraordinary by design",
  description: "A cinematic creative studio experience. Visual identity, digital design, and extraordinary experiences.",
};

export default function LumenixPage() {
  return <Lumenix />;
}
