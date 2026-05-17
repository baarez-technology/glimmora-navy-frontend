"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BrainCircuit,
  Eye,
  HelpCircle,
  AlertTriangle,
  Zap,
  MessageSquare,
  Activity,
  Users,
  Clock,
  ChevronRight,
  Settings,
  Send,
  Loader2,
  Sparkles,
} from "lucide-react";
import { GlassPanel } from "@/components/ui/glass-panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { MarkdownRenderer } from "@/components/ui/markdown-renderer";
import { staggerContainer, fadeInUp } from "@/animations/variants";
import { ai } from "@/lib/api/endpoints";
import { useApi, useMutation } from "@/lib/api/hooks";
import type { ChatMessage } from "@/lib/api/types";

const instructionModes = [
  { icon: Eye, label: "Silent Observe", active: false },
  { icon: HelpCircle, label: "Hinting", active: false },
  { icon: MessageSquare, label: "Guided Questioning", active: true },
  { icon: AlertTriangle, label: "Corrective", active: false },
  { icon: Zap, label: "Challenge Escalation", active: false },
];

const logTypeColors: Record<string, string> = {
  hint: "text-aegis-amber",
  challenge: "text-aegis-purple",
  observe: "text-aegis-cyan",
  system: "text-aegis-mist",
  corrective: "text-aegis-red",
  update: "text-aegis-green",
};

function classifyInteractionType(type: string): string {
  const t = type.toLowerCase();
  if (t.includes("hint")) return "hint";
  if (t.includes("assess")) return "challenge";
  if (t.includes("override") || t.includes("correct")) return "corrective";
  if (t.includes("remediate")) return "update";
  if (t.includes("chat")) return "observe";
  return "system";
}

function badgeVariantForStatus(status: string): "online" | "offline" | "warning" {
  const s = (status || "").toLowerCase();
  if (s.includes("ok") || s.includes("online") || s.includes("ready") || s.includes("healthy") || s.includes("loaded"))
    return "online";
  if (s.includes("degraded") || s.includes("warn")) return "warning";
  return "offline";
}

export default function AIInstructorPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [context, setContext] = useState("");
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const modelState = useApi(() => ai.modelInfo(), []);
  const auditState = useApi(
    () => ai.auditLog({ page: 1, page_size: 8 }),
    []
  );
  const { run: sendChat, loading: chatLoading, error: chatError } = useMutation(
    ai.chat
  );

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, chatLoading]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || chatLoading) return;
    const userMsg: ChatMessage = { role: "user", content: text };
    const nextHistory: ChatMessage[] = [...messages, userMsg];
    setMessages(nextHistory);
    setInput("");
    const res = await sendChat({
      messages: nextHistory,
      context: context.trim() || undefined,
    });
    if (res) {
      setMessages((m) => [...m, { role: "assistant", content: res.response }]);
    }
  };

  const modelLabel = modelState.data?.model_in_use || modelState.data?.model_name;
  const modelStatus = modelState.data?.status || "unknown";
  const modelOnline = !!modelState.data?.available;

  const auditEntries = auditState.data?.items ?? [];

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={fadeInUp} className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-aegis-purple to-aegis-cyan flex items-center justify-center">
            <BrainCircuit className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-aegis-white tracking-wide">
              Adaptive AI Instructor
            </h1>
            <p className="font-heading text-sm text-aegis-mist tracking-wider mt-0.5">
              Active Teaching & Assessment under Human Governance
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {modelState.loading ? (
            <StatusBadge label="Loading..." variant="neutral" />
          ) : modelState.error ? (
            <StatusBadge label="Model Offline" variant="offline" />
          ) : (
            <StatusBadge
              label={`${modelLabel || "Model"} ${modelStatus}`}
              variant={badgeVariantForStatus(modelStatus)}
              pulse={modelOnline}
            />
          )}
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg glass border border-white/[0.06] text-xs font-heading text-aegis-mist hover:text-aegis-cyan transition-colors cursor-pointer">
            <Settings className="w-4 h-4" />
            Configure
          </button>
        </div>
      </motion.div>

      {/* Instruction Mode Selector */}
      <motion.div variants={fadeInUp}>
        <GlassPanel className="flex items-center gap-2 p-3" animated={false}>
          <span className="text-[10px] font-heading font-bold text-aegis-slate tracking-[0.1em] uppercase mr-3">
            Mode:
          </span>
          {instructionModes.map((mode) => (
            <button
              key={mode.label}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-heading font-semibold tracking-wider transition-all duration-200 cursor-pointer ${
                mode.active
                  ? "bg-aegis-cyan/15 text-aegis-cyan border border-aegis-cyan/30"
                  : "text-aegis-mist hover:text-aegis-cloud hover:bg-white/[0.04]"
              }`}
            >
              <mode.icon className="w-3.5 h-3.5" />
              {mode.label}
            </button>
          ))}
        </GlassPanel>
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Chat Console (Left 60%) */}
        <div className="lg:col-span-3 space-y-4">
          <motion.div variants={fadeInUp}>
            <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist mb-4">
              Live Instructor Console
            </h3>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <GlassPanel className="flex flex-col" animated={false}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-aegis-cyan/20 to-aegis-blue/10 flex items-center justify-center">
                    <Activity className="w-5 h-5 text-aegis-cyan" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-heading text-sm font-bold text-aegis-white tracking-wide">
                        AEGIS AI CHAT
                      </span>
                      <StatusBadge
                        label={modelOnline ? "ACTIVE" : "WAITING"}
                        variant={modelOnline ? "active" : "neutral"}
                        pulse={modelOnline}
                      />
                    </div>
                    <p className="text-xs text-aegis-mist mt-0.5">
                      Doctrine-grounded reasoning &bull; {modelLabel || "loading model"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-aegis-slate">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="text-xs font-mono">
                    {messages.length} turns
                  </span>
                </div>
              </div>

              <div
                ref={scrollRef}
                className="space-y-3 min-h-[260px] max-h-[420px] overflow-y-auto p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]"
              >
                {messages.length === 0 && !chatLoading && (
                  <div className="flex flex-col items-center justify-center py-8 text-center gap-2">
                    <Sparkles className="w-6 h-6 text-aegis-purple/60" />
                    <p className="text-xs text-aegis-slate">
                      Ask AEGIS AI a doctrine, scenario, or coaching question to start the session.
                    </p>
                  </div>
                )}
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-xs leading-relaxed ${
                        msg.role === "user"
                          ? "bg-aegis-cyan/15 text-aegis-white border border-aegis-cyan/30"
                          : "bg-white/[0.04] text-aegis-cloud border border-white/[0.05]"
                      }`}
                    >
                      <div className="text-[10px] font-heading text-aegis-slate tracking-wider uppercase mb-1">
                        {msg.role === "user" ? "Instructor" : "AEGIS AI"}
                      </div>
                      <MarkdownRenderer content={msg.content} />
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="rounded-xl px-3.5 py-2.5 text-xs bg-white/[0.04] border border-white/[0.05] text-aegis-mist flex items-center gap-2">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      AEGIS AI is reasoning...
                    </div>
                  </div>
                )}
                {chatError && (
                  <div className="text-[11px] text-aegis-red px-2">{chatError}</div>
                )}
              </div>

              <div className="mt-4 space-y-2">
                <input
                  type="text"
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="Optional context (scenario id, doctrine version, etc.)"
                  className="w-full bg-white/[0.02] border border-white/[0.05] rounded-lg px-3 py-2 text-xs text-aegis-cloud placeholder:text-aegis-slate focus:outline-none focus:border-aegis-cyan/40"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder="Ask the AI Instructor..."
                    className="flex-1 bg-white/[0.03] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-aegis-white placeholder:text-aegis-slate focus:outline-none focus:border-aegis-cyan/50"
                  />
                  <button
                    onClick={handleSend}
                    disabled={chatLoading || !input.trim()}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-aegis-cyan to-aegis-blue text-white text-xs font-heading font-bold tracking-wider disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity cursor-pointer"
                  >
                    {chatLoading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Send className="w-3.5 h-3.5" />
                    )}
                    Send
                  </button>
                </div>
              </div>
            </GlassPanel>
          </motion.div>
        </div>

        {/* Right Column (40%) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Intervention Log (live AI audit) */}
          <motion.div variants={fadeInUp}>
            <GlassPanel>
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist">
                  Intervention Log
                </h3>
                <button className="text-[10px] font-heading text-aegis-cyan hover:text-aegis-white transition-colors flex items-center gap-1 cursor-pointer">
                  Full Log <ChevronRight className="w-3 h-3" />
                </button>
              </div>
              {auditState.loading ? (
                <div className="flex items-center gap-2 text-xs text-aegis-mist">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Loading recent AI activity...
                </div>
              ) : auditState.error ? (
                <p className="text-xs text-aegis-red">{auditState.error}</p>
              ) : auditEntries.length === 0 ? (
                <p className="text-xs text-aegis-slate">No AI interactions recorded yet.</p>
              ) : (
                <div className="space-y-3">
                  {auditEntries.map((entry) => {
                    const kind = classifyInteractionType(entry.interaction_type);
                    const time = new Date(entry.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    });
                    const detail = entry.override_reason
                      ? `Override: ${entry.override_reason}`
                      : `${entry.interaction_type}${
                          entry.doctrine_version_used
                            ? ` -- doctrine ${entry.doctrine_version_used}`
                            : ""
                        }`;
                    return (
                      <div key={entry.id} className="flex items-start gap-3">
                        <span className="text-[10px] font-mono text-aegis-slate shrink-0 mt-0.5 w-10">
                          {time}
                        </span>
                        <div className="w-1.5 h-1.5 rounded-full bg-aegis-gunmetal shrink-0 mt-1.5" />
                        <p className={`text-xs leading-relaxed ${logTypeColors[kind]}`}>
                          {detail}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </GlassPanel>
          </motion.div>

          {/* Model Status / Policy */}
          <motion.div variants={fadeInUp}>
            <GlassPanel>
              <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist mb-5">
                Model & Policy
              </h3>
              {modelState.loading ? (
                <div className="text-xs text-aegis-mist flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Loading model info...
                </div>
              ) : modelState.error ? (
                <p className="text-xs text-aegis-red">{modelState.error}</p>
              ) : modelState.data ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-aegis-cloud">Provider</span>
                    <span className="text-xs font-mono text-aegis-cyan">
                      {modelState.data.provider}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-aegis-cloud">Active Model</span>
                    <span className="text-xs font-mono text-aegis-cyan">
                      {modelState.data.model_in_use || modelState.data.model_name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-aegis-cloud">Status</span>
                    <StatusBadge
                      label={modelState.data.status}
                      variant={badgeVariantForStatus(modelState.data.status)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-aegis-cloud">Available</span>
                    <span className="text-xs font-mono text-aegis-cyan">
                      {modelState.data.available ? "yes" : "no"}
                    </span>
                  </div>
                  {modelState.data.available_models?.length > 0 && (
                    <div>
                      <span className="text-[10px] font-heading text-aegis-slate tracking-wider uppercase">
                        Available Models
                      </span>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {modelState.data.available_models.map((m) => (
                          <span
                            key={m}
                            className="px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.06] text-[10px] font-mono text-aegis-mist"
                          >
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : null}
            </GlassPanel>
          </motion.div>

          {/* Active Trainees */}
          <motion.div variants={fadeInUp}>
            <GlassPanel>
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-4 h-4 text-aegis-cyan" />
                <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist">
                  Conversation Turns
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-3xl font-bold text-aegis-cyan">
                  {messages.length}
                </span>
                <span className="text-xs text-aegis-mist">
                  messages in current session
                </span>
              </div>
            </GlassPanel>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
