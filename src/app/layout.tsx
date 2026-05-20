import { Newsreader, Schibsted_Grotesk } from "next/font/google";

import "./globals.css";

const newsreader = Newsreader({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-newsreader",
});

const schibsted = Schibsted_Grotesk({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-schibsted",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="nb"
      className={`${newsreader.variable} ${schibsted.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
