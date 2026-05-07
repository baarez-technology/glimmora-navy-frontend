"use client";

import { cn } from "@/lib/utils";

interface RadarDisplayProps {
  size?: number;
  className?: string;
}

export function RadarDisplay({ size = 200, className }: RadarDisplayProps) {
  const rings = [0.25, 0.5, 0.75, 1];
  const contacts = [
    { x: 30, y: -40, type: "friendly" as const },
    { x: -50, y: 20, type: "hostile" as const },
    { x: 60, y: 55, type: "neutral" as const },
    { x: -20, y: -60, type: "unknown" as const },
    { x: 45, y: -15, type: "friendly" as const },
  ];

  const contactColors = {
    friendly: "#2979ff",
    hostile: "#ff1744",
    neutral: "#00e676",
    unknown: "#ffd740",
  };

  return (
    <div
      className={cn("radar-container relative", className)}
      style={{ width: size, height: size }}
    >
      {/* Rings */}
      {rings.map((r) => (
        <div
          key={r}
          className="radar-ring"
          style={{
            width: `${r * 100}%`,
            height: `${r * 100}%`,
          }}
        />
      ))}

      {/* Cross lines */}
      <div className="absolute top-0 left-1/2 w-px h-full bg-aegis-cyan/20" />
      <div className="absolute top-1/2 left-0 w-full h-px bg-aegis-cyan/20" />

      {/* Sweep line */}
      <div className="radar-sweep-line" />

      {/* Center dot */}
      <div className="absolute top-1/2 left-1/2 w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-aegis-cyan shadow-[0_0_8px_rgba(14,165,233,0.4)]" />

      {/* Contacts */}
      {contacts.map((contact, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            top: `calc(50% + ${contact.y}px)`,
            left: `calc(50% + ${contact.x}px)`,
            backgroundColor: contactColors[contact.type],
            boxShadow: `0 0 6px ${contactColors[contact.type]}`,
          }}
        />
      ))}
    </div>
  );
}
