import type { Metadata } from "next";

import HeatPumpSelector from "@/components/HeatPumpSelector";

export const metadata: Metadata = {
  title: "Varmepumpevelger — Toshiba",
  description:
    "Svar på fire spørsmål og få anbefalt Toshiba-varmepumpen som passer boligen din.",
};

export default function HeatPumpSelectorPage() {
  return (
    <div className="space-y-3">
      <div className="card">
        <div
          className="text-sm font-bold mb-1"
          style={{ color: "var(--primary)" }}
        >
          🔥 Finn riktig Toshiba-varmepumpe
        </div>
        <p className="text-sm" style={{ color: "var(--ink-mute)" }}>
          Svar på fire korte spørsmål om boligen din, så foreslår vi modellene
          fra Toshiba som passer best.
        </p>
      </div>
      <HeatPumpSelector />
    </div>
  );
}
