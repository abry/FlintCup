import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="nb" suppressHydrationWarning>
      <body className="min-h-full font-sans antialiased">{children}</body>
    </html>
  );
}
