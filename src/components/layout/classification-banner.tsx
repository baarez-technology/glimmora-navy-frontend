"use client";

import { useAppStore } from "@/stores/app-store";

export function ClassificationBanner() {
  const { classificationLevel } = useAppStore();

  return (
    <div className="classification-banner">
      {classificationLevel} &nbsp;|&nbsp; GLIMMORA AEGIS NAVY &nbsp;|&nbsp; v1.0
    </div>
  );
}
