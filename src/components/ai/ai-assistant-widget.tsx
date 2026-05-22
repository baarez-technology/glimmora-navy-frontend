"use client";

import { useAppStore } from "@/stores/app-store";
import { motion, AnimatePresence } from "framer-motion";
import { BrainCircuit, X, Send, Sparkles, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ai } from "@/lib/api/endpoints";
import { useApi, useMutation } from "@/lib/api/hooks";
import type { ChatMessage } from "@/lib/api/types";

const SUGGESTIONS = [
  "Review today's sessions",
  "Trainee performance",
  "Scenario suggestions",
];

export function AIAssistantWidget() {
  const { aiWidgetOpen, toggleAIWidget } = useAppStore();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const modelInfo = useApi(() => ai.modelInfo(), [], { skip: !aiWidgetOpen });
  const { run: sendChat, loading: sending, error: chatError } = useMutation(
    ai.chat
  );

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, sending]);

  const handleSend = async (text?: string) => {
    const content = (text ?? message).trim();
    if (!content || sending) return;
    const userMsg: ChatMessage = { role: "user", content };
    const next: ChatMessage[] = [...messages, userMsg];
    setMessages(next);
    setMessage("");
    const res = await sendChat({ messages: next });
    if (res) {
      setMessages((m) => [...m, { role: "assistant", content: res.response }]);
    }
  };

  const modelOnline = !!modelInfo.data?.available;
  const modelLabel =
    modelInfo.data?.model_in_use || modelInfo.data?.model_name || "Navy Domain";

  return (
    <div className="fixed bottom-12 right-6 z-[800]">
      <AnimatePresence>
        {aiWidgetOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-16 right-0 w-[320px] h-[420px] glass-card rounded-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200/60">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-aegis-purple to-aegis-cyan flex items-center justify-center relative">
                  <BrainCircuit className="w-4 h-4 text-white" />
                  <span
                    className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${
                      modelOnline ? "bg-aegis-green" : "bg-aegis-slate"
                    }`}
                  />
                </div>
                <div>
                  <h3 className="text-sm font-heading font-bold text-aegis-white tracking-wide">
                    AEGIS AI
                  </h3>
                  <p
                    className={`text-[10px] font-mono ${
                      modelOnline ? "text-aegis-green" : "text-aegis-slate"
                    }`}
                  >
                    {modelInfo.loading
                      ? "CHECKING..."
                      : modelOnline
                      ? `ONLINE - ${modelLabel}`
                      : `OFFLINE - ${modelLabel}`}
                  </p>
                </div>
              </div>
              <button
                onClick={toggleAIWidget}
                className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4 text-aegis-mist" />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 p-5 overflow-y-auto space-y-4"
            >
              {messages.length === 0 && (
                <>
                  {/* AI Welcome */}
                  <div className="flex gap-3">
                    <div className="w-7 h-7 rounded-full bg-aegis-purple/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Sparkles className="w-3.5 h-3.5 text-aegis-purple" />
                    </div>
                    <div className="glass rounded-xl rounded-tl-sm p-3.5 text-sm text-aegis-cloud leading-relaxed">
                      Welcome, Commander. I am the AEGIS AI Instructor. I can
                      assist with doctrine queries, training analysis, scenario
                      recommendations, and competency assessments.

                      {/* Voice Waveform (Enhancement) */}
                      <div className="mt-4 flex items-center gap-1.5 h-8">
                        {[0.4, 0.7, 0.5, 0.9, 0.6, 0.8, 0.4, 0.5, 0.7].map((h, i) => (
                          <motion.div
                            key={i}
                            animate={{ height: [h * 10, h * 30, h * 10] }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              delay: i * 0.1,
                            }}
                            className="w-1 bg-aegis-purple/40 rounded-full"
                            style={{ height: h * 20 }}
                          />
                        ))}
                        <span className="text-[10px] font-mono text-aegis-purple ml-2 animate-pulse font-bold uppercase tracking-widest">
                          Listening...
                        </span>
                      </div>

                      <span className="text-aegis-mist text-xs mt-4 block">
                        All responses are grounded in approved naval doctrine.
                      </span>
                    </div>
                  </div>

                  {/* Suggestion chips */}
                  <div className="flex flex-wrap gap-2 pl-10">
                    {SUGGESTIONS.map((chip) => (
                      <button
                        key={chip}
                        onClick={() => handleSend(chip)}
                        className="px-3 py-1.5 rounded-full bg-aegis-cyan/10 border border-aegis-cyan/20 text-[11px] font-heading text-aegis-cyan hover:bg-aegis-cyan/20 transition-colors cursor-pointer"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-3 ${
                    msg.role === "user" ? "justify-end" : ""
                  }`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-7 h-7 rounded-full bg-aegis-purple/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Sparkles className="w-3.5 h-3.5 text-aegis-purple" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                      msg.role === "user"
                        ? "rounded-tr-sm bg-aegis-cyan/15 text-aegis-white border border-aegis-cyan/30"
                        : "rounded-tl-sm glass text-aegis-cloud"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {sending && (
                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-aegis-purple/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5 text-aegis-purple" />
                  </div>
                  <div className="glass rounded-xl rounded-tl-sm p-3 text-xs text-aegis-mist inline-flex items-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Thinking...
                  </div>
                </div>
              )}

              {chatError && (
                <div className="text-[11px] text-aegis-red pl-10">{chatError}</div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-slate-200/60">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Ask AEGIS AI..."
                  disabled={sending}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200/60 text-sm text-aegis-cloud placeholder:text-slate-400 focus:outline-none focus:border-aegis-cyan/30 transition-colors disabled:opacity-60"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={sending || !message.trim()}
                  className="p-2.5 rounded-xl bg-gradient-to-r from-aegis-cyan to-aegis-cyan-deep text-white hover:shadow-[0_4px_12px_rgba(14,165,233,0.3)] transition-shadow cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>
              <p className="mt-2 text-[9px] text-aegis-slate text-center font-mono tracking-wider uppercase">
                Offline Mode &bull; Doctrine-Grounded Responses
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Orb Button */}
      <motion.button
        onClick={toggleAIWidget}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 rounded-full bg-gradient-to-br from-aegis-purple to-aegis-cyan flex items-center justify-center cursor-pointer relative"
      >
        <motion.div
          animate={{
            boxShadow: [
              "0 0 8px rgba(124,77,255,0.3)",
              "0 0 24px rgba(0,229,255,0.4), 0 0 60px rgba(124,77,255,0.2)",
              "0 0 8px rgba(124,77,255,0.3)",
            ],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full"
        />
        <BrainCircuit className="w-6 h-6 text-white relative z-10" />
      </motion.button>
    </div>
  );
}
