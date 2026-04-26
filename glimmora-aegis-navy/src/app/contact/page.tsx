"use client";

import { motion } from "framer-motion";
import { Shield, Send } from "lucide-react";
import { staggerContainer, fadeInUp } from "@/animations/variants";
import { AegisButton } from "@/components/ui/aegis-button";
import Link from "next/link";

export default function ContactPage() {
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

      <motion.section variants={staggerContainer} initial="initial" animate="animate" className="max-w-xl mx-auto px-6 py-24">
        <motion.div variants={fadeInUp} className="text-center mb-12">
          <span className="font-heading text-[11px] font-bold tracking-[0.1em] uppercase text-aegis-cyan">Contact</span>
          <h1 className="font-display text-3xl font-bold text-aegis-white tracking-wide mt-3">Get In Touch</h1>
          <p className="text-aegis-mist mt-3">For defense inquiries, demonstrations, and partnership opportunities.</p>
        </motion.div>

        <motion.div variants={fadeInUp} className="glass-card rounded-2xl p-8 space-y-5">
          {[
            { label: "Name", type: "text", placeholder: "Your full name" },
            { label: "Organization", type: "text", placeholder: "Navy / Coast Guard / OEM / Shipyard" },
            { label: "Role", type: "text", placeholder: "Your designation" },
            { label: "Email", type: "email", placeholder: "official@domain.mil" },
          ].map((field) => (
            <div key={field.label}>
              <label className="text-[10px] font-heading font-bold text-aegis-slate tracking-[0.1em] uppercase block mb-1.5">{field.label}</label>
              <input type={field.type} placeholder={field.placeholder} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200/60 text-sm text-aegis-cloud placeholder:text-slate-400 focus:outline-none focus:border-aegis-cyan/30 transition-colors" />
            </div>
          ))}
          <div>
            <label className="text-[10px] font-heading font-bold text-aegis-slate tracking-[0.1em] uppercase block mb-1.5">Message</label>
            <textarea rows={4} placeholder="Describe your requirements..." className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200/60 text-sm text-aegis-cloud placeholder:text-slate-400 focus:outline-none focus:border-aegis-cyan/30 transition-colors resize-none" />
          </div>
          <AegisButton className="w-full" icon={<Send className="w-4 h-4" />}>Submit Inquiry</AegisButton>
        </motion.div>
      </motion.section>
    </div>
  );
}
