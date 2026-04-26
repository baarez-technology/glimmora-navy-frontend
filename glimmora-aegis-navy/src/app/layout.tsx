import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GLIMMORA AEGIS -- NAVY | AGI-First Naval Training Platform",
  description:
    "AGI-First 3D Digital Twin, AR/VR-Enabled Naval Training Platform. Sovereign, Air-Gapped, Offline.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Orbitron:wght@400;500;600;700;800;900&family=Rajdhani:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-aegis-void text-aegis-cloud font-sans">
        {children}
      </body>
    </html>
  );
}
