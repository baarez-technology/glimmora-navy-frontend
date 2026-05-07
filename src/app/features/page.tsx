"use client";

import { Shield } from "lucide-react";
import Link from "next/link";
import { AegisButton } from "@/components/ui/aegis-button";

export default function FeaturesPage() {
  return (
    <div className="bg-aegis-void min-h-screen">
      <nav className="flex items-center justify-between px-8 py-4 border-b border-slate-200/60">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-aegis-cyan to-aegis-cyan-deep flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="font-display text-sm font-bold tracking-widest text-aegis-cyan">GLIMMORA AEGIS</span>
        </Link>
        <Link href="/login"><AegisButton size="sm">Login</AegisButton></Link>
      </nav>
      <div className="max-w-4xl mx-auto px-6 py-24 text-center">
        <span className="font-heading text-[11px] font-bold tracking-[0.1em] uppercase text-aegis-cyan">Features</span>
        <h1 className="font-display text-4xl font-bold text-aegis-white tracking-wide mt-3 mb-6">Deep Dive Into Capabilities</h1>
        <p className="text-aegis-mist max-w-2xl mx-auto mb-10">Explore every capability of the Glimmora Aegis platform in detail -- from AI instruction and digital twins to warfare simulation and sovereign deployment.</p>
        <Link href="/platform"><AegisButton>View Full Platform Overview</AegisButton></Link>
      </div>
    </div>
  );
}
