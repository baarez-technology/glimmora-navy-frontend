"use client";

import { motion } from "framer-motion";
import { Brain, Zap, AlertCircle } from "lucide-react";
import { GlassPanel } from "./glass-panel";

interface TraineeLoad {
  name: string;
  load: number; // 0-100
  status: "optimal" | "stressed" | "critical";
}

const trainees: TraineeLoad[] = [
  { name: "LT J. Kumar", load: 45, status: "optimal" },
  { name: "SLT R. Patel", load: 82, status: "stressed" },
  { name: "CPO M. Singh", load: 32, status: "optimal" },
  { name: "LT A. Desai", load: 94, status: "critical" },
];

export function CognitiveLoadMonitor() {
  return (
    <GlassPanel className="h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-aegis-purple" />
          <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist">
            Cognitive Load Monitor
          </h3>
        </div>
        <Zap className="w-4 h-4 text-aegis-gold animate-pulse" />
      </div>

      <div className="space-y-5">
        {trainees.map((trainee) => (
          <div key={trainee.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-heading font-bold text-aegis-cloud">
                {trainee.name}
              </span>
              <div className="flex items-center gap-2">
                {trainee.status === "critical" && (
                  <AlertCircle className="w-3.5 h-3.5 text-aegis-red animate-bounce" />
                )}
                <span className={`text-[10px] font-mono font-bold uppercase ${
                  trainee.status === "critical" ? "text-aegis-red" : 
                  trainee.status === "stressed" ? "text-aegis-amber" : 
                  "text-aegis-green"
                }`}>
                  {trainee.status}
                </span>
              </div>
            </div>
            
            <div className="relative h-2 w-full rounded-full bg-slate-100 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${trainee.load}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`h-full rounded-full ${
                  trainee.load > 90 ? "bg-aegis-red" : 
                  trainee.load > 70 ? "bg-aegis-amber" : 
                  "bg-aegis-purple"
                }`}
              />
            </div>
            
            <div className="flex justify-between text-[9px] font-mono text-aegis-slate">
              <span>0% LOAD</span>
              <span>{trainee.load}% CAPACITY</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-3 rounded-lg bg-aegis-purple/5 border border-aegis-purple/10">
        <p className="text-[10px] text-aegis-purple leading-relaxed">
          <span className="font-bold">AI Insight:</span> High cognitive load detected in Damage Control (LT A. Desai). Suggesting immediate interval training or instructor intervention.
        </p>
      </div>
    </GlassPanel>
  );
}
