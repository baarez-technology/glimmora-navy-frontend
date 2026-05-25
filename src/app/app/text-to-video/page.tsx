"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Video,
  Send,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Play,
  Download,
  History,
  Zap,
  ChevronRight,
  Shield,
  Box,
  Anchor,
} from "lucide-react";
import { GlassPanel } from "@/components/ui/glass-panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { staggerContainer, fadeInUp } from "@/animations/variants";
import { t2v } from "@/lib/api/endpoints";
import { useApi, useMutation } from "@/lib/api/hooks";
import type { T2VJob as T2VJobBase } from "@/lib/api/types";

type Domain = "navy";

interface UIJob {
  job_id: string;
  question: string;
  domain: Domain;
  status: string;
  progress?: number;
  message?: string;
  video_url?: string;
  session_id?: string;
  error?: string;
  started_at: number;
}

function isTerminal(status: string): boolean {
  const s = (status || "").toLowerCase();
  return (
    s === "complete" ||
    s === "completed" ||
    s === "failed" ||
    s === "error" ||
    s === "cancelled"
  );
}

function isFailure(status: string): boolean {
  const s = (status || "").toLowerCase();
  return s === "failed" || s === "error" || s === "cancelled";
}

function isSuccess(status: string): boolean {
  const s = (status || "").toLowerCase();
  return s === "complete" || s === "completed";
}

function progressPct(job: UIJob): number {
  if (typeof job.progress === "number") {
    return Math.max(0, Math.min(100, job.progress));
  }
  const s = (job.status || "").toLowerCase();
  if (isSuccess(s)) return 100;
  if (s.includes("queued")) return 5;
  if (s.includes("phase2") || s.includes("retriev")) return 35;
  if (s.includes("phase3") || s.includes("render")) return 75;
  return 15;
}

export default function TextToVideoPage() {
  const [question, setQuestion] = useState("");
  const domain: Domain = "navy";
  const [activeJobs, setActiveJobs] = useState<UIJob[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<UIJob | null>(null);
  const [trackedJobId, setTrackedJobId] = useState<string | null>(null);

  const { run: submitJob, loading: isSubmitting } = useMutation(t2v.generate);
  const jobsHistory = useApi(() => t2v.jobs(), []);
  const modules = useApi(() => t2v.modules(domain), [domain]);

  // Automatically track any running jobs in history on load
  useEffect(() => {
    if (!jobsHistory.data) return;
    const entries = Object.entries(jobsHistory.data) as Array<[string, T2VJobBase]>;
    const runningJobs = entries
      .filter(([_, job]) => !isTerminal(job.status || ""))
      .map(([job_id, job]) => ({
        job_id,
        question: job.question || "",
        domain: (job.domain as Domain) || "navy",
        status: job.status || "queued",
        message: job.message || job.status,
        started_at: (job.started_at as number) || Date.now(),
        progress: typeof job.progress === "number" ? job.progress : undefined,
      }));
    if (runningJobs.length > 0) {
      Promise.resolve().then(() => {
        setActiveJobs((prev) => {
          const merged = [...prev];
          runningJobs.forEach((rj) => {
            if (!merged.some((mj) => mj.job_id === rj.job_id)) {
              merged.push(rj);
            }
          });
          return merged;
        });
        setTrackedJobId((curr) => curr || runningJobs[0].job_id);
      });
    }
  }, [jobsHistory.data]);

  // Poll the most recently submitted job for status updates every 3 seconds.
  useEffect(() => {
    if (!trackedJobId) return;
    let cancelled = false;

    const tick = async () => {
      try {
        const s = await t2v.status(trackedJobId);
        if (cancelled) return;
        setActiveJobs((jobs) =>
          jobs.map((j) =>
            j.job_id === trackedJobId
              ? {
                  ...j,
                  status: s.status || j.status,
                  progress:
                    typeof s.progress === "number" ? s.progress : j.progress,
                  message: typeof s.message === "string" ? s.message : j.message,
                  video_url:
                    typeof s.video_url === "string" ? s.video_url : j.video_url,
                  session_id:
                    typeof s.session_id === "string"
                      ? s.session_id
                      : j.session_id,
                  domain:
                    (s.domain as Domain) ||
                    j.domain,
                  error: isFailure(s.status || "")
                    ? s.error || (s.message as string) || s.status
                    : undefined,
                }
              : j
          )
        );
        if (isTerminal(s.status || "")) {
          jobsHistory.refetch();
          return;
        }
      } catch {
        // swallow errors; will retry on next tick
      }
      if (!cancelled) setTimeout(tick, 3000);
    };
    tick();
    return () => {
      cancelled = true;
    };
  }, [trackedJobId, jobsHistory]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const q = question.trim();
    if (!q || isSubmitting) return;
    const res = await submitJob({ question: q, domain });
    if (!res || !res.job_id) return;
    const newJob: UIJob = {
      job_id: res.job_id,
      question: q,
      domain,
      status: "queued",
      message: res.message,
      started_at: Date.now(),
    };
    setActiveJobs((prev) => [newJob, ...prev]);
    setQuestion("");
    setTrackedJobId(res.job_id);
  };

  const presetModules = useMemo(() => {
    const items = (modules.data?.modules ?? []) as Array<Record<string, unknown>>;
    return items.slice(0, 6).map((m, i) => {
      const id = (m.id as string) || (m.module_id as string) || `${domain}-${i}`;
      const label =
        (m.title as string) ||
        (m.label as string) ||
        (m.name as string) ||
        (m.question as string) ||
        `Module ${i + 1}`;
      const question =
        (m.question as string) ||
        (m.prompt as string) ||
        (m.title as string) ||
        label;
      return { id, label, question };
    });
  }, [modules.data, domain]);

  const historyItems = useMemo(() => {
    if (!jobsHistory.data) return [];
    const entries = Object.entries(jobsHistory.data) as Array<[string, T2VJobBase]>;
    return entries
      .map(([job_id, job]) => ({ job_id, ...job }))
      .sort((a, b) => {
        const aStarted = (a as Record<string, unknown>).started_at;
        const bStarted = (b as Record<string, unknown>).started_at;
        const ta = typeof aStarted === "number" ? aStarted : 0;
        const tb = typeof bStarted === "number" ? bStarted : 0;
        return tb - ta;
      })
      .slice(0, 8);
  }, [jobsHistory.data]);

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="space-y-6 max-w-7xl mx-auto"
    >
      {/* Header */}
      <motion.div
        variants={fadeInUp}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-aegis-cyan to-aegis-blue flex items-center justify-center shadow-lg shadow-aegis-cyan/20">
            <Video className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-aegis-white tracking-wide">
              Aegis Text-to-Video
            </h1>
            <p className="font-heading text-sm text-aegis-mist tracking-wider mt-0.5">
              Generative Multi-Agent Video Pipeline for Technical Training
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge label="Pipeline Online" variant="online" pulse />
          <div className="h-4 w-px bg-white/10 mx-2" />
          <button className="p-2 rounded-lg glass border border-white/5 hover:text-aegis-cyan transition-colors">
            <History className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-lg glass border border-white/5 hover:text-aegis-cyan transition-colors">
            <Zap className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Console (Left 8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Question Input */}
          <motion.div variants={fadeInUp}>
            <GlassPanel glow className="relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Sparkles className="w-24 h-24 text-aegis-cyan" />
              </div>

              <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist mb-4 flex items-center gap-2">
                <Send className="w-3 h-3" /> Start Generation
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Ask a technical question (e.g., 'How does the LM2500 compressor section work?')"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-4 min-h-[120px] text-aegis-white placeholder:text-aegis-slate focus:outline-none focus:border-aegis-cyan/50 transition-colors resize-none font-body text-sm leading-relaxed"
                  />
                  <div className="absolute bottom-3 right-3 flex items-center gap-2">
                    <span className="text-[10px] text-aegis-slate font-mono uppercase tracking-widest">
                      Multi-Agent Pipeline
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-aegis-cyan/10 border border-aegis-cyan/30 rounded-lg w-full sm:w-auto">
                    <Anchor className="w-3.5 h-3.5 text-aegis-cyan" />
                    <span className="text-xs font-heading font-semibold text-aegis-cyan tracking-wider">
                      NAVY DOMAIN
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !question.trim()}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-2.5 rounded-xl bg-gradient-to-r from-aegis-cyan to-aegis-blue text-white font-heading font-bold tracking-wider hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-aegis-cyan/10"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Zap className="w-4 h-4" />
                    )}
                    GENERATE TRAINING VIDEO
                  </button>
                </div>
              </form>
            </GlassPanel>
          </motion.div>

          {/* Active / Recent Jobs */}
          <motion.div variants={fadeInUp} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist">
                Active & Recent Pipelines
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-aegis-slate font-mono">
                  {activeJobs.length} JOBS
                </span>
              </div>
            </div>

            <AnimatePresence mode="popLayout">
              {activeJobs.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-12 flex flex-col items-center justify-center text-center space-y-3 glass rounded-2xl border border-white/5"
                >
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                    <Video className="w-6 h-6 text-aegis-slate" />
                  </div>
                  <p className="text-sm text-aegis-slate font-heading">
                    No active video generation jobs.
                    <br />
                    Submit a question to start the multi-agent pipeline.
                  </p>
                </motion.div>
              ) : (
                <div className="space-y-3">
                  {activeJobs.map((job) => {
                    const pct = progressPct(job);
                    const done = isSuccess(job.status);
                    const failed = isFailure(job.status);
                    return (
                      <motion.div
                        key={job.job_id}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="group"
                      >
                        <GlassPanel
                          className="p-4 hover:border-aegis-cyan/30 transition-colors cursor-pointer"
                          animated={false}
                        >
                          <div
                            onClick={() => done && setSelectedVideo(job)}
                            className="flex items-start justify-between gap-4"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] font-heading font-bold px-1.5 py-0.5 rounded bg-aegis-cyan/10 text-aegis-cyan">
                                  NAVY
                                </span>
                                <span className="text-[10px] font-mono text-aegis-slate uppercase">
                                  {job.job_id}
                                </span>
                              </div>
                              <h4 className="text-sm font-heading font-bold text-aegis-white truncate">
                                {job.question}
                              </h4>

                              {/* Progress bar for running jobs */}
                              {!done && !failed && (
                                <div className="mt-3 space-y-1.5">
                                  <div className="flex items-center justify-between text-[10px]">
                                    <span className="text-aegis-cyan font-semibold flex items-center gap-1.5">
                                      <Loader2 className="w-3 h-3 animate-spin" />{" "}
                                      {job.message || job.status}
                                    </span>
                                    <span className="text-aegis-slate font-mono italic uppercase">
                                      {pct}%
                                    </span>
                                  </div>
                                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                      initial={{ width: 0 }}
                                      animate={{ width: `${pct}%` }}
                                      className="h-full bg-gradient-to-r from-aegis-cyan to-aegis-blue"
                                    />
                                  </div>
                                </div>
                              )}

                              {done && (
                                <div className="mt-2 flex items-center gap-4 text-[10px] text-aegis-green font-heading font-bold uppercase tracking-wider">
                                  <span className="flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3" /> Generation Succeeded
                                  </span>
                                  <span className="text-aegis-slate font-normal flex items-center gap-1">
                                    <Clock className="w-3 h-3" />{" "}
                                    {Math.max(
                                      1,
                                      // eslint-disable-next-line react-hooks/purity
                                      Math.round((Date.now() - job.started_at) / 1000)
                                    )}
                                    s
                                  </span>
                                </div>
                              )}

                              {failed && (
                                <div className="mt-2 text-[11px] text-aegis-red font-heading">
                                  {job.error || job.message || "Job failed"}
                                </div>
                              )}
                            </div>

                            <div className="shrink-0 flex flex-col items-end gap-2">
                              {done ? (
                                <button className="w-10 h-10 rounded-full bg-aegis-cyan/10 text-aegis-cyan flex items-center justify-center hover:bg-aegis-cyan hover:text-white transition-all group-hover:scale-110">
                                  <Play className="w-5 h-5 fill-current" />
                                </button>
                              ) : failed ? (
                                <div className="w-10 h-10 rounded-full bg-aegis-red/10 text-aegis-red flex items-center justify-center">
                                  <AlertCircle className="w-5 h-5" />
                                </div>
                              ) : (
                                <div className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center">
                                  <Loader2 className="w-5 h-5 text-aegis-slate animate-spin" />
                                </div>
                              )}
                            </div>
                          </div>
                        </GlassPanel>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Sidebar (Right 4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Modules */}
          <motion.div variants={fadeInUp}>
            <GlassPanel>
              <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist mb-4 flex items-center gap-2">
                <Box className="w-3 h-3" /> Quick Modules
              </h3>
              {modules.loading && !modules.data ? (
                <div className="flex items-center gap-2 text-xs text-aegis-mist">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Loading modules...
                </div>
              ) : modules.error ? (
                <p className="text-xs text-aegis-red">{modules.error}</p>
              ) : presetModules.length === 0 ? (
                <p className="text-xs text-aegis-slate">
                  No pre-validated modules available.
                </p>
              ) : (
                <div className="space-y-2">
                  {presetModules.map((module) => (
                    <button
                      key={module.id}
                      onClick={() => {
                        setQuestion(module.question);
                      }}
                      className="w-full text-left p-3 rounded-lg bg-white/5 border border-white/5 hover:border-aegis-cyan/30 hover:bg-white/[0.08] transition-all group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-heading font-semibold text-aegis-cloud group-hover:text-aegis-cyan transition-colors">
                          {module.label}
                        </span>
                        <ChevronRight className="w-3 h-3 text-aegis-slate group-hover:text-aegis-cyan group-hover:translate-x-1 transition-all" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </GlassPanel>
          </motion.div>

          {/* Pipeline / Job History */}
          <motion.div variants={fadeInUp}>
            <GlassPanel variant="subtle">
              <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist mb-5">
                Recent Jobs
              </h3>
              {jobsHistory.loading && !jobsHistory.data ? (
                <div className="flex items-center gap-2 text-xs text-aegis-mist">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Loading history...
                </div>
              ) : jobsHistory.error ? (
                <p className="text-xs text-aegis-red">{jobsHistory.error}</p>
              ) : historyItems.length === 0 ? (
                <p className="text-xs text-aegis-slate">No prior jobs.</p>
              ) : (
                <div className="space-y-3">
                  {historyItems.map((job) => {
                    const done = isSuccess(job.status);
                    const failed = isFailure(job.status);
                    return (
                      <div
                        key={job.job_id}
                        onClick={() => {
                          if (done) {
                            setSelectedVideo(job as unknown as UIJob);
                          } else if (!failed) {
                            // Track active running job
                            setTrackedJobId(job.job_id);
                            setActiveJobs((prev) => {
                              if (prev.some((j) => j.job_id === job.job_id)) return prev;
                              return [job as unknown as UIJob, ...prev];
                            });
                          }
                        }}
                        className={`flex items-center justify-between gap-3 p-2 rounded-lg hover:bg-white/5 transition-all cursor-pointer ${
                          done ? "hover:border-aegis-cyan/30" : ""
                        }`}
                      >
                        <div className="min-w-0">
                          <p className="text-xs text-aegis-cloud font-medium truncate">
                            {(job.question as string) || job.job_id}
                          </p>
                          <p className="text-[10px] text-aegis-slate font-mono uppercase">
                            {(job.domain as string) || "--"} &bull; {job.job_id}
                          </p>
                        </div>
                        <StatusBadge
                          label={job.status}
                          variant={
                            done
                              ? "online"
                              : failed
                              ? "offline"
                              : "active"
                          }
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </GlassPanel>
          </motion.div>

          {/* Governance Info */}
          <motion.div variants={fadeInUp}>
            <GlassPanel className="bg-gradient-to-br from-aegis-blue/10 to-transparent">
              <div className="flex items-center gap-3 mb-3">
                <Shield className="w-5 h-5 text-aegis-cyan" />
                <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-white">
                  Sovereign AI
                </h3>
              </div>
              <p className="text-[11px] leading-relaxed text-aegis-mist italic">
                Video generation is performed using air-gapped sovereign LLM logic and local technical manuals. No proprietary doctrine data is sent to external public models.
              </p>
            </GlassPanel>
          </motion.div>
        </div>
      </div>

      {/* Video Modal / Player overlay */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[500] flex items-center justify-center p-4 md:p-12 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-5xl glass rounded-2xl border border-white/10 overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-aegis-cyan/20 text-aegis-cyan">
                    <Video className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-heading font-bold text-aegis-white truncate max-w-md">
                      {selectedVideo.question}
                    </h2>
                    <p className="text-[10px] text-aegis-mist uppercase font-mono">
                      Generated training module &bull; {selectedVideo.domain}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedVideo(null)}
                  className="p-2 text-aegis-slate hover:text-white transition-colors"
                >
                  <ChevronRight className="w-6 h-6 rotate-90" />
                </button>
              </div>

              {/* Video Player */}
              <div className="aspect-video bg-black flex items-center justify-center relative group">
                {selectedVideo.session_id ? (
                  <video
                    key={selectedVideo.job_id}
                    src={t2v.videoUrl(selectedVideo.domain, selectedVideo.session_id)}
                    controls
                    className="w-full h-full object-contain bg-black"
                  />
                ) : selectedVideo.video_url ? (
                  <video
                    key={selectedVideo.job_id}
                    src={selectedVideo.video_url}
                    controls
                    className="w-full h-full object-contain bg-black"
                  />
                ) : (
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 rounded-full bg-aegis-cyan/20 border border-aegis-cyan/40 flex items-center justify-center animate-pulse">
                      <Play className="w-8 h-8 text-aegis-cyan fill-current" />
                    </div>
                    <p className="text-aegis-cyan font-heading text-xs tracking-widest uppercase">
                      Waiting for video session...
                    </p>
                  </div>
                )}
              </div>

              {/* Metadata */}
              <div className="p-6 grid grid-cols-3 gap-8">
                <div className="col-span-2 space-y-4">
                  <h3 className="text-xs font-heading font-bold text-aegis-mist uppercase tracking-widest">
                    Job Details
                  </h3>
                  <div className="space-y-2 text-sm leading-relaxed text-aegis-cloud font-body">
                    <p>
                      <span className="text-aegis-cyan font-mono text-xs mr-2">
                        QUESTION
                      </span>
                      {selectedVideo.question}
                    </p>
                    {selectedVideo.message && (
                      <p>
                        <span className="text-aegis-cyan font-mono text-xs mr-2">
                          STATUS
                        </span>
                        {selectedVideo.message}
                      </p>
                    )}
                    {selectedVideo.session_id && (
                      <p>
                        <span className="text-aegis-cyan font-mono text-xs mr-2">
                          SESSION
                        </span>
                        {selectedVideo.session_id}
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xs font-heading font-bold text-aegis-mist uppercase tracking-widest">
                    Pipeline Audit
                  </h3>
                  <div className="space-y-2">
                    {[
                      { label: "Job ID", value: selectedVideo.job_id },
                      { label: "Domain", value: selectedVideo.domain },
                      { label: "Status", value: selectedVideo.status },
                      {
                        label: "Progress",
                        value: `${progressPct(selectedVideo)}%`,
                      },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between py-1 border-b border-white/5"
                      >
                        <span className="text-[10px] text-aegis-slate font-heading">
                          {item.label}
                        </span>
                        <span className="text-[10px] text-aegis-white font-mono truncate max-w-[120px]">
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                  {selectedVideo.session_id && (
                    <a
                      href={t2v.videoUrl(selectedVideo.domain, selectedVideo.session_id)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[10px] font-heading font-bold text-white transition-all"
                    >
                      <Download className="w-3.5 h-3.5" /> DOWNLOAD MP4
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 243, 255, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 243, 255, 0.4);
        }
      `}</style>
    </motion.div>
  );
}
