"use client";

import { useState } from "react";

import {
  formatPrice,
  recommendHeatPumps,
  type Recommendation,
  type SelectorAnswers,
} from "@/lib/toshiba";

type Step = {
  key: keyof SelectorAnswers;
  question: string;
  options: { value: string; label: string; hint?: string }[];
};

const STEPS: Step[] = [
  {
    key: "area",
    question: "Hvor stort areal skal varmes opp?",
    options: [
      { value: "under60", label: "Under 60 m²", hint: "Leilighet eller hytte" },
      { value: "60to100", label: "60–100 m²", hint: "Mindre enebolig / rekkehus" },
      { value: "100to150", label: "100–150 m²", hint: "Vanlig enebolig" },
      { value: "over150", label: "Over 150 m²", hint: "Stor bolig, gjerne flere etasjer" },
    ],
  },
  {
    key: "placement",
    question: "Hvor skal innedelen plasseres?",
    options: [
      { value: "vegg", label: "Høyt på vegg", hint: "Vanligst og mest effektivt" },
      { value: "gulv", label: "Lavt / ved gulvet", hint: "F.eks. under et vindu" },
      { value: "flereRom", label: "Flere rom", hint: "Innedeler i flere rom/etasjer" },
      { value: "vetIkke", label: "Vet ikke", hint: "Vis meg det som passer best" },
    ],
  },
  {
    key: "priority",
    question: "Hva er viktigst for deg?",
    options: [
      { value: "pris", label: "Lav pris" },
      { value: "stromsparing", label: "Lavest strømforbruk" },
      { value: "design", label: "Design" },
      { value: "stillegaende", label: "Stillegående" },
    ],
  },
  {
    key: "climate",
    question: "Hvor kaldt blir det om vinteren der du bor?",
    options: [
      { value: "mild", label: "Mildt kystklima", hint: "Sjelden under −10 °C" },
      { value: "kald", label: "Kald vinter", hint: "Ned mot −20 °C" },
      { value: "ekstrem", label: "Svært kald vinter", hint: "−25 °C eller kaldere" },
    ],
  },
];

export default function HeatPumpSelector() {
  const [answers, setAnswers] = useState<Partial<SelectorAnswers>>({});
  const [stepIndex, setStepIndex] = useState(0);

  const done = stepIndex >= STEPS.length;
  const results = done
    ? recommendHeatPumps(answers as SelectorAnswers)
    : null;

  function answer(key: keyof SelectorAnswers, value: string) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    setStepIndex((i) => i + 1);
  }

  function restart() {
    setAnswers({});
    setStepIndex(0);
  }

  if (done && results) {
    return <Results results={results} onRestart={restart} />;
  }

  const step = STEPS[stepIndex];

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-bold" style={{ color: "var(--primary)" }}>
          {step.question}
        </div>
        <span
          className="text-xs font-semibold whitespace-nowrap"
          style={{ color: "var(--ink-muter)" }}
        >
          {stepIndex + 1} / {STEPS.length}
        </span>
      </div>
      <div className="space-y-2">
        {step.options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => answer(step.key, opt.value)}
            className="w-full text-left rounded-xl border px-4 py-3 transition-colors hover:border-[color:var(--primary)]"
            style={{ background: "var(--bg)", borderColor: "var(--border)" }}
          >
            <span className="text-sm font-semibold block">{opt.label}</span>
            {opt.hint ? (
              <span className="text-xs" style={{ color: "var(--ink-mute)" }}>
                {opt.hint}
              </span>
            ) : null}
          </button>
        ))}
      </div>
      {stepIndex > 0 ? (
        <button
          type="button"
          onClick={() => setStepIndex((i) => i - 1)}
          className="mt-3 text-xs font-semibold underline underline-offset-2"
          style={{ color: "var(--ink-mute)" }}
        >
          ← Tilbake
        </button>
      ) : null}
    </div>
  );
}

function Results({
  results,
  onRestart,
}: {
  results: Recommendation[];
  onRestart: () => void;
}) {
  return (
    <div className="space-y-3">
      {results.length === 0 ? (
        <div className="card-info">
          <p className="text-sm" style={{ color: "var(--ink-mute)" }}>
            Fant ingen modell som passer svarene dine. Prøv igjen, eller ta
            kontakt med en Toshiba-forhandler for en befaring.
          </p>
        </div>
      ) : (
        results.map((r, index) => (
          <div
            key={r.pump.id}
            className="card"
            style={
              index === 0
                ? { borderColor: "var(--primary)", borderWidth: 2 }
                : undefined
            }
          >
            {index === 0 ? (
              <div
                className="text-xs font-bold uppercase tracking-wide mb-1"
                style={{ color: "var(--green)" }}
              >
                ✓ Vår anbefaling
              </div>
            ) : null}
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-bold">{r.pump.name}</div>
                <p className="text-xs" style={{ color: "var(--ink-mute)" }}>
                  {r.pump.tagline}
                </p>
              </div>
              <div
                className="text-sm font-bold whitespace-nowrap"
                style={{ color: "var(--primary)" }}
              >
                {formatPrice(r.pump.price)}
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              <Badge>{r.pump.energyClass}</Badge>
              {r.pump.scop !== null ? (
                <Badge>SCOP {r.pump.scop.toLocaleString("nb-NO")}</Badge>
              ) : null}
              {r.pump.minTemp !== null ? (
                <Badge>Ned til {r.pump.minTemp} °C</Badge>
              ) : null}
              {r.pump.wifi ? <Badge>WiFi</Badge> : null}
            </div>
            {r.reasons.length > 0 ? (
              <ul
                className="text-xs mt-2 space-y-0.5 list-disc pl-4"
                style={{ color: "var(--ink-mute)" }}
              >
                {r.reasons.map((reason) => (
                  <li key={reason}>{reason}</li>
                ))}
              </ul>
            ) : null}
            <a
              href={r.pump.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3 text-xs font-bold underline underline-offset-2"
              style={{ color: "var(--primary)" }}
            >
              Se modellen hos Toshiba →
            </a>
          </div>
        ))
      )}
      <div className="text-center">
        <button
          type="button"
          onClick={onRestart}
          className="text-xs font-semibold underline underline-offset-2"
          style={{ color: "var(--ink-mute)" }}
        >
          Start på nytt
        </button>
      </div>
      <p className="text-xs text-center" style={{ color: "var(--ink-muter)" }}>
        Veiledende priser fra toshibavarmepumper.no, uten montering. Riktig
        dimensjonering bør alltid bekreftes av forhandler med befaring.
      </p>
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="text-xs font-semibold px-2 py-0.5 rounded-full border"
      style={{
        background: "var(--primary-bg)",
        borderColor: "var(--primary-soft)",
        color: "var(--primary)",
      }}
    >
      {children}
    </span>
  );
}
