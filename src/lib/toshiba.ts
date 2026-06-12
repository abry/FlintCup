// Produktkatalog hentet fra toshibavarmepumper.no (juni 2026).
// Priser er veiledende fra produsentens nettsider og kan avvike hos forhandler.

export type PlacementType = "vegg" | "gulv" | "multi";

export type Priority = "pris" | "stromsparing" | "design" | "stillegaende";

export type HeatPump = {
  id: string;
  name: string;
  tagline: string;
  placement: PlacementType;
  /** Veiledende pris i NOK, uten montering */
  price: number | null;
  energyClass: string;
  /** Årsvarmefaktor (SCOP) ved gjennomsnittsklima */
  scop: number | null;
  /** Laveste oppgitte driftstemperatur i °C */
  minTemp: number | null;
  /** Veiledende øvre boligareal i m² for én innedel */
  areaMax: number;
  wifi: boolean;
  highlights: string[];
  /** Hvor godt modellen treffer hver prioritet, 0–3 */
  priorityScore: Record<Priority, number>;
  url: string;
};

export const HEAT_PUMPS: HeatPump[] = [
  {
    id: "kontur-25",
    name: "Daiseikai 10 Kontur 25",
    tagline: "Toppmodellen med den nyeste teknologien",
    placement: "vegg",
    price: 29990,
    energyClass: "A+++",
    scop: 5.5,
    minTemp: -30,
    areaMax: 120,
    wifi: true,
    highlights: [
      "Best i klassen på strømsparing (SCOP 5,5)",
      "Integrert WiFi og smartsensor som justerer temperaturen",
      "Avansert filter for renere inneluft",
      "Tåler ned mot −30 °C",
    ],
    priorityScore: { pris: 0, stromsparing: 3, design: 2, stillegaende: 2 },
    url: "https://www.toshibavarmepumper.no/varmepumper-luft-luft/toshiba-kontur-25/",
  },
  {
    id: "ask-35",
    name: "Daiseikai 10 Ask",
    tagline: "Toppmodell med unikt design",
    placement: "vegg",
    price: 31490,
    energyClass: "A+++",
    scop: 5.4,
    minTemp: -30,
    areaMax: 150,
    wifi: true,
    highlights: [
      "Særegent design som gir eleganse til interiøret",
      "Fullt utstyrt med smartfunksjoner og integrert WiFi",
      "Samme Daiseikai 10-teknologi som Kontur",
    ],
    priorityScore: { pris: 0, stromsparing: 3, design: 3, stillegaende: 2 },
    url: "https://www.toshibavarmepumper.no/varmepumper-luft-luft/toshiba-ask-35/",
  },
  {
    id: "signatur-25",
    name: "Toshiba Signatur 25",
    tagline: "Særegent design og høy varmeeffekt",
    placement: "vegg",
    price: 25990,
    energyClass: "A+++",
    scop: 5.1,
    minTemp: -25,
    areaMax: 100,
    wifi: true,
    highlights: [
      "Svært stillegående med topp ytelse",
      "Høy varmeeffekt og nyttige funksjoner",
      "God mellomklasse mellom Seiya og Daiseikai",
    ],
    priorityScore: { pris: 1, stromsparing: 2, design: 2, stillegaende: 3 },
    url: "https://www.toshibavarmepumper.no/varmepumper-luft-luft/signatur-25/",
  },
  {
    id: "signatur-35",
    name: "Toshiba Signatur 35",
    tagline: "Signatur-design for større boliger",
    placement: "vegg",
    price: null,
    energyClass: "A++",
    scop: null,
    minTemp: -25,
    areaMax: 150,
    wifi: true,
    highlights: [
      "Samme design og funksjoner som Signatur 25",
      "Høyere varmeeffekt for større flater",
    ],
    priorityScore: { pris: 1, stromsparing: 2, design: 2, stillegaende: 3 },
    url: "https://www.toshibavarmepumper.no/varmepumper-luft-luft/signatur-35/",
  },
  {
    id: "seiya-nordic-25",
    name: "Toshiba Seiya Nordic 25",
    tagline: "Effektiv oppvarming til en fornuftig pris",
    placement: "vegg",
    price: 16490,
    energyClass: "A++",
    scop: 4.6,
    minTemp: -25,
    areaMax: 70,
    wifi: false,
    highlights: [
      "Prisgunstig modell tilpasset nordisk klima",
      "Energiklasse A++ og SCOP opptil 4,6",
      "Enkel og driftssikker",
    ],
    priorityScore: { pris: 3, stromsparing: 1, design: 1, stillegaende: 1 },
    url: "https://www.toshibavarmepumper.no/varmepumper-luft-luft/toshiba-seiya-nordic-25/",
  },
  {
    id: "gulvmodell-25",
    name: "Toshiba Gulvmodell 25",
    tagline: "Plasseres lavt — varmer langs gulvet",
    placement: "gulv",
    price: 27490,
    energyClass: "A+",
    scop: 4.3,
    minTemp: -25,
    areaMax: 100,
    wifi: true,
    highlights: [
      "Topp- og bunnspjeld fordeler varmen langs gulvet eller oppover",
      "Perfekt under vindu eller der veggplass er begrenset",
      "Stillegående med høy ytelse ved lave utetemperaturer",
    ],
    priorityScore: { pris: 1, stromsparing: 1, design: 2, stillegaende: 3 },
    url: "https://www.toshibavarmepumper.no/varmepumper-luft-luft/toshiba-gulvmodell-25/",
  },
  {
    id: "gulvmodell-35",
    name: "Toshiba Gulvmodell 35",
    tagline: "Gulvmodell for større varmebehov",
    placement: "gulv",
    price: null,
    energyClass: "A+",
    scop: null,
    minTemp: -25,
    areaMax: 130,
    wifi: true,
    highlights: [
      "Samme gulvmodell-fordeler med høyere varmeeffekt",
      "Blåser varm luft både opp og ned",
    ],
    priorityScore: { pris: 0, stromsparing: 1, design: 2, stillegaende: 3 },
    url: "https://www.toshibavarmepumper.no/varmepumper-luft-luft/toshiba-gulvmodell-35/",
  },
  {
    id: "multi-nordic",
    name: "Toshiba Multi Nordic",
    tagline: "Flere innedeler på én kraftig utedel",
    placement: "multi",
    price: 44490,
    energyClass: "A++",
    scop: null,
    minTemp: -25,
    areaMax: 250,
    wifi: true,
    highlights: [
      "Varm flere rom eller etasjer med separate innedeler",
      "Effektiv oppvarming ned mot −25 °C",
      "Velg innedeler i Kontur-, Ask- eller Signatur-design",
    ],
    priorityScore: { pris: 0, stromsparing: 2, design: 2, stillegaende: 2 },
    url: "https://www.toshibavarmepumper.no/varmepumper-luft-luft/multi-nordic-koontur/",
  },
];

export type SelectorAnswers = {
  /** Areal som skal varmes opp, i m² */
  area: "under60" | "60to100" | "100to150" | "over150";
  placement: "vegg" | "gulv" | "flereRom" | "vetIkke";
  priority: Priority;
  /** Kaldeste vinternetter der du bor */
  climate: "mild" | "kald" | "ekstrem";
};

const AREA_M2: Record<SelectorAnswers["area"], number> = {
  under60: 60,
  "60to100": 100,
  "100to150": 150,
  over150: 200,
};

export type Recommendation = {
  pump: HeatPump;
  score: number;
  reasons: string[];
};

export function recommendHeatPumps(answers: SelectorAnswers): Recommendation[] {
  const area = AREA_M2[answers.area];

  const scored = HEAT_PUMPS.map((pump) => {
    let score = 0;
    const reasons: string[] = [];

    // Plassering
    if (answers.placement === "flereRom") {
      if (pump.placement === "multi") {
        score += 5;
        reasons.push("Multisplitt-system som varmer flere rom samtidig");
      } else {
        score -= 4;
      }
    } else if (answers.placement === "gulv") {
      if (pump.placement === "gulv") {
        score += 5;
        reasons.push("Gulvmodell laget for lav plassering");
      } else {
        score -= 3;
      }
    } else if (pump.placement === "vegg") {
      score += 2;
    } else if (pump.placement === "multi" && answers.area !== "over150") {
      score -= 2;
    }

    // Areal
    if (pump.areaMax >= area) {
      score += 2;
      if (pump.areaMax - area <= 30) {
        score += 1;
        reasons.push(`Riktig dimensjonert for ca. ${area} m²`);
      }
    } else {
      score -= 3;
    }
    if (answers.area === "over150" && pump.placement === "multi") {
      score += 2;
      reasons.push("Stort areal dekkes best med flere innedeler");
    }

    // Prioritet
    const p = pump.priorityScore[answers.priority];
    score += p * 2;
    if (p === 3) {
      reasons.push(
        {
          pris: "Lavest pris i Toshiba-sortimentet",
          stromsparing: "Blant de aller beste på strømsparing",
          design: "Modellen med mest gjennomført design",
          stillegaende: "En av de mest stillegående modellene",
        }[answers.priority],
      );
    }

    // Klima
    if (answers.climate === "ekstrem") {
      if (pump.minTemp !== null && pump.minTemp <= -30) {
        score += 3;
        reasons.push(`Dokumentert drift ned mot ${pump.minTemp} °C`);
      } else {
        score -= 2;
      }
    } else if (answers.climate === "kald" && pump.minTemp !== null && pump.minTemp <= -25) {
      score += 1;
    }

    return { pump, score, reasons };
  });

  return scored
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

export function formatPrice(price: number | null): string {
  if (price === null) return "Pris hos forhandler";
  return `${price.toLocaleString("nb-NO")} kr`;
}
