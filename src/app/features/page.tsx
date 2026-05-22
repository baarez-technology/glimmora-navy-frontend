"use client";

import { Shield } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import logoImg from "@/assets/logo.png";
import { AegisButton } from "@/components/ui/aegis-button";

export default function FeaturesPage() {
  return (
    <div className="bg-aegis-void min-h-screen">
      <nav className="flex items-center justify-between px-8 py-4 border-b border-slate-200/60">
        <Link href="/" className="flex items-center select-none">
          <div className="relative h-8 w-14">
            <Image
              src={logoImg}
              alt="Glimmora Aegis Navy"
              fill
              className="object-contain object-left"
              priority
            />
          </div>
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
