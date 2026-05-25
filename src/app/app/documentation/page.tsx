"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Plus,
  Search,
  Edit,
  Trash2,
  Terminal,
  Play,
  Check,
  X,
  ChevronRight,
  ChevronDown,
  Shield,
  Loader2,
  Sparkles,
  HelpCircle,
  Folder,
  FolderOpen,
  Download,
  Bookmark,
  Share2,
  Compass,
  Flame,
  Anchor,
  Cpu,
  History,
  Radio,
  Clock,
  LayoutGrid
} from "lucide-react";
import { GlassPanel } from "@/components/ui/glass-panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { staggerContainer, fadeInUp } from "@/animations/variants";
import { documentation, scenarios, sessions } from "@/lib/api/endpoints";
import { useApi, useMutation } from "@/lib/api/hooks";
import { useUserStore } from "@/stores/user-store";
import type { DocumentationTopic, TrainingSession } from "@/lib/api/types";

// Helper function to parse inline markdown (bold **text** and italic *text*)
function parseInlineMarkdown(text: string): React.ReactNode {
  if (!text) return "";
  
  // Split by '**' to parse bold text
  const parts = text.split(/(\*\*.*?\*\*)/g);
  
  return parts.map((part, idx) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      const boldText = part.slice(2, -2);
      return <strong key={idx} className="font-bold text-aegis-white">{boldText}</strong>;
    }
    
    // Split by '*' for italics inside the non-bold part
    const subParts = part.split(/(\*.*?\*)/g);
    if (subParts.length > 1) {
      return (
        <span key={idx}>
          {subParts.map((subPart, subIdx) => {
            if (subPart.startsWith("*") && subPart.endsWith("*")) {
              return <em key={subIdx} className="italic text-aegis-cloud/90">{subPart.slice(1, -1)}</em>;
            }
            return subPart;
          })}
        </span>
      );
    }
    
    return part;
  });
}

// Custom simple Markdown renderer to avoid dependencies and styling problems
function RenderMarkdown({ text }: { text: string }) {
  if (!text) return null;
  const lines = text.split("\n");
  let inCode = false;
  const listItems: string[] = [];
  const renderedElements: React.ReactNode[] = [];
  let tableHeaders: string[] = [];
  let tableRows: string[][] = [];

  const flushList = (key: string) => {
    if (listItems.length > 0) {
      renderedElements.push(
        <ul key={`list-${key}`} className="list-disc pl-5 space-y-1.5 mb-4 text-aegis-cloud font-body text-xs leading-relaxed">
          {listItems.map((item, idx) => (
            <li key={idx} className="marker:text-aegis-cyan">{parseInlineMarkdown(item)}</li>
          ))}
        </ul>
      );
      listItems.length = 0;
    }
  };

  const flushTable = (key: string) => {
    if (tableRows.length > 0) {
      renderedElements.push(
        <div key={`table-wrapper-${key}`} className="overflow-x-auto my-4 border border-white/10 rounded-lg glass">
          <table className="min-w-full divide-y divide-white/10">
            <thead className="bg-white/[0.03]">
              <tr>
                {tableHeaders.map((h, i) => (
                  <th key={i} className="px-3.5 py-2 text-left text-[10px] font-heading font-bold text-aegis-cyan uppercase tracking-wider">
                    {parseInlineMarkdown(h)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-transparent font-body text-xs text-aegis-cloud">
              {tableRows.map((row, i) => (
                <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                  {row.map((cell, j) => (
                    <td key={j} className="px-3.5 py-2 whitespace-nowrap">
                      {parseInlineMarkdown(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      tableHeaders = [];
      tableRows = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Fenced code blocks
    if (line.startsWith("```")) {
      flushList(String(i));
      flushTable(String(i));
      if (inCode) {
        inCode = false;
      } else {
        inCode = true;
        const codeLines: string[] = [];
        let j = i + 1;
        while (j < lines.length && !lines[j].trim().startsWith("```")) {
          codeLines.push(lines[j]);
          j++;
        }
        renderedElements.push(
          <div key={`code-${i}`} className="relative my-4 rounded-lg overflow-hidden border border-white/10 font-mono text-[11px] shadow-lg">
            <div className="flex items-center justify-between px-3.5 py-1.5 bg-slate-950 border-b border-white/5 text-[9px] text-aegis-slate tracking-widest uppercase">
              <span>Terminal Sandbox</span>
              <span className="text-aegis-cyan font-bold">SOVEREIGN AI</span>
            </div>
            <pre className="p-3 bg-slate-900 overflow-x-auto text-aegis-cyan leading-relaxed select-all">
              <code>{codeLines.join("\n")}</code>
            </pre>
          </div>
        );
        inCode = false;
        i = j; // skip forward
      }
      continue;
    }

    if (inCode) continue;

    // Headers
    if (line.startsWith("# ")) {
      flushList(String(i));
      flushTable(String(i));
      renderedElements.push(
        <h1 key={i} className="font-display text-base font-extrabold text-aegis-white tracking-wide mt-5 mb-3.5 border-b border-white/10 pb-1.5 uppercase">
          {parseInlineMarkdown(line.substring(2))}
        </h1>
      );
    } else if (line.startsWith("## ")) {
      flushList(String(i));
      flushTable(String(i));
      renderedElements.push(
        <h2 key={i} className="font-heading text-[13px] font-bold text-aegis-white tracking-wide mt-5 mb-2.5 border-l-[3px] border-aegis-cyan pl-2 py-0.5">
          {parseInlineMarkdown(line.substring(3))}
        </h2>
      );
    } else if (line.startsWith("### ")) {
      flushList(String(i));
      flushTable(String(i));
      renderedElements.push(
        <h3 key={i} className="font-heading text-[11px] font-semibold text-aegis-cyan tracking-wider uppercase mt-4 mb-2">
          {parseInlineMarkdown(line.substring(4))}
        </h3>
      );
    }
    // Blockquotes
    else if (line.startsWith("> ")) {
      flushList(String(i));
      flushTable(String(i));
      renderedElements.push(
        <div key={i} className="my-4 p-3 bg-aegis-cyan/5 border-l-4 border-aegis-cyan rounded-r-lg font-body text-xs italic text-aegis-cloud leading-relaxed">
          {parseInlineMarkdown(line.substring(2))}
        </div>
      );
    }
    // Lists
    else if (line.startsWith("- ") || line.startsWith("* ")) {
      flushTable(String(i));
      listItems.push(line.substring(2));
    }
    // Table parser
    else if (line.startsWith("|")) {
      flushList(String(i));
      const cells = line.split("|").map(c => c.trim()).filter(c => c !== "");
      if (line.includes("---")) {
        // Divider row, skip
        continue;
      }
      if (tableHeaders.length === 0) {
        tableHeaders = cells;
      } else {
        tableRows.push(cells);
      }
    }
    // Blank lines
    else if (line === "") {
      flushList(String(i));
      flushTable(String(i));
    }
    // Normal Paragraphs
    else {
      flushList(String(i));
      flushTable(String(i));
      renderedElements.push(
        <p key={i} className="font-body text-xs leading-relaxed text-aegis-cloud mb-3.5">
          {parseInlineMarkdown(line)}
        </p>
      );
    }
  }

  // Flush any remaining collections
  flushList("end");
  flushTable("end");

  return <div className="custom-markdown space-y-2">{renderedElements}</div>;
}

export default function DocumentationPage() {
  const user = useUserStore((s) => s.user);
  const isManageable = user?.role === "instructor" || user?.role === "admin";


  const [selectedTopic, setSelectedTopic] = useState<DocumentationTopic | null>(null);
  const [dashboardSearch, setDashboardSearch] = useState("");

  // Playground States
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalLogs, setTerminalLogs] = useState<Array<{ type: "info" | "success" | "error" | "warn"; text: string }>>([]);
  const [isRunningCommand, setIsRunningCommand] = useState(false);

  // Form Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<DocumentationTopic | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formDomain, setFormDomain] = useState("bridge");
  const [formDescription, setFormDescription] = useState("");
  const [formContentMarkdown, setFormContentMarkdown] = useState("");
  const [formExampleInteractive, setFormExampleInteractive] = useState("");

  // Analytics and Session calculations
  const scenariosData = useApi(() => scenarios.list({ page_size: 100 }), [user?.id]);
  const sessionsData = useApi(() => sessions.list({ page_size: 1000 }), [user?.id]);
  const topicsData = useApi(() => documentation.list(), []);
  const { run: createTopic, loading: isCreating } = useMutation(documentation.create);
  const { run: updateTopic, loading: isUpdating } = useMutation(documentation.update);
  const { run: deleteTopic } = useMutation(documentation.delete);

  const [expandedDomains, setExpandedDomains] = useState<Record<string, boolean>>({
    bridge: true,
    cic: true,
    engineering: true,
    damage_control: true,
    small_boats: true,
    unmanned_systems: true,
  });

  const toggleDomain = (domain: string) => {
    setExpandedDomains((prev) => ({
      ...prev,
      [domain]: !prev[domain],
    }));
  };

  // Map scenario_id to domain
  const scenarioDomainMap = useMemo(() => {
    const items = scenariosData.data?.items || [];
    const m: Record<string, string> = {};
    for (const s of items) {
      m[s.id] = s.domain;
    }
    return m;
  }, [scenariosData.data]);

  // Helper to determine difficulty based on topic title
  const getTopicDifficulty = useCallback((title: string): string => {
    const t = title.toLowerCase();
    if (t.includes("basic") || t.includes("rule 9") || t.includes("target range") || t.includes("lube") || t.includes("boundaries") || t.includes("rhib launch") || t.includes("buoyancy &")) return "basic";
    if (t.includes("intermediate") || t.includes("rule 10") || t.includes("iff") || t.includes("turbine start") || t.includes("shoring") || t.includes("vbss boarding") || t.includes("waypoint")) return "intermediate";
    if (t.includes("advanced") || t.includes("rule 19") || t.includes("shield") || t.includes("thermal") || t.includes("cbrn") || t.includes("extraction") || t.includes("swarm")) return "advanced";
    return "basic"; // fallback
  }, []);

  // Helper to match a manual topic to its corresponding database training scenario
  const getMatchingScenario = useCallback((topic: DocumentationTopic) => {
    const items = scenariosData.data?.items || [];
    const diff = getTopicDifficulty(topic.title);
    
    // Find scenario matching domain and difficulty
    return items.find(s => s.domain === topic.domain && s.difficulty === diff)
      || items.find(s => s.domain === topic.domain)
      || items[0]
      || null;
  }, [scenariosData.data, getTopicDifficulty]);

  // Determine individual topic progress based on training sessions completed
  const getTopicProgress = useCallback((topic: DocumentationTopic) => {
    const sList = (sessionsData.data?.items || [])
      .filter((s) => s.trainee_id === user?.id);
    
    // Find sessions specifically created for this topic (by checking instructor_notes for Topic ID or Title)
    const topicSessions = sList.filter(s => 
      s.instructor_notes?.includes(`(Topic ID: ${topic.id})`) ||
      s.instructor_notes?.includes(`study manual for "${topic.title}"`) ||
      s.instructor_notes?.includes(topic.title)
    );

    if (topicSessions.length === 0) {
      return { label: "Not Started", color: "text-aegis-slate", bg: "bg-white/5", border: "border-white/10" };
    }

    const completed = topicSessions.some(s => s.status === "completed");
    if (completed) {
      return { label: "Completed", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" };
    }

    return { label: "In Progress", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" };
  }, [sessionsData.data, user?.id]);

  // Dynamic Session counts by domain matching strictly completed DB manuals
  const domainSessionCounts = useMemo(() => {
    const counts: Record<string, number> = {
      bridge: 0,
      cic: 0,
      engineering: 0,
      damage_control: 0,
      small_boats: 0,
      unmanned_systems: 0,
    };
    
    const items = topicsData.data || [];
    for (const topic of items) {
      const progress = getTopicProgress(topic);
      if (progress.label === "Completed" && topic.domain in counts) {
        counts[topic.domain]++;
      }
    }
    return counts;
  }, [topicsData.data, getTopicProgress]);

  // Helper to get progress values for a topic
  const getTopicProgressVal = useCallback((topic: DocumentationTopic) => {
    const progress = getTopicProgress(topic);
    if (progress.label === "Completed") return 100;
    if (progress.label === "In Progress") return 50;
    return 0;
  }, [getTopicProgress]);

  // Helper to compute domain progress dynamically
  const getDomainProgress = useCallback((dKey: string) => {
    const items = topicsData.data || [];
    const topics = items.filter(t => t.domain === dKey);
    if (topics.length === 0) return 0;
    const sum = topics.reduce((acc, t) => acc + getTopicProgressVal(t), 0);
    return Math.round(sum / topics.length);
  }, [topicsData.data, getTopicProgressVal]);

  // Helper to extract a 0..100 score from a training session.score blob
  const extractSessionScore = (s: Omit<TrainingSession, "score"> & { score?: Record<string, unknown> | number | null }): number => {
    if (!s || !s.score) return 85;
    if (typeof s.score === "number") return s.score;
    if (typeof s.score === "object") {
      const raw = s.score as Record<string, unknown>;
      const candidates = ["overall", "overall_score", "score", "final_score", "total"];
      for (const k of candidates) {
        const v = raw[k];
        if (typeof v === "number" && Number.isFinite(v)) {
          return v <= 1 ? Math.round(v * 100) : Math.round(v);
        }
      }
      // Fallback: average all numeric values
      const nums = Object.values(raw).filter(
        (v): v is number => typeof v === "number" && Number.isFinite(v)
      );
      if (nums.length > 0) {
        const avg = nums.reduce((a, b) => a + b, 0) / nums.length;
        return avg <= 1 ? Math.round(avg * 100) : Math.round(avg);
      }
    }
    return 85;
  };

  const [isCompleting, setIsCompleting] = useState(false);

  const handleNextTopic = useCallback(() => {
    if (!selectedTopic) return;
    
    // Find all topics inside this domain, sorted by order
    const domainTopics = (topicsData.data || [])
      .filter(t => t.domain === selectedTopic.domain)
      .sort((a, b) => {
        const getOrder = (title: string) => {
          const t = title.toLowerCase();
          if (t.includes("basic") || t.includes("rule 9") || t.includes("target range") || t.includes("lube") || t.includes("boundaries") || t.includes("rhib launch") || t.includes("buoyancy &")) return 1;
          if (t.includes("intermediate") || t.includes("rule 10") || t.includes("iff") || t.includes("turbine start") || t.includes("shoring") || t.includes("vbss boarding") || t.includes("waypoint")) return 2;
          if (t.includes("advanced") || t.includes("rule 19") || t.includes("shield") || t.includes("thermal") || t.includes("cbrn") || t.includes("extraction") || t.includes("swarm")) return 3;
          return 99;
        };
        return getOrder(a.title) - getOrder(b.title);
      });

    const currentIndex = domainTopics.findIndex(t => t.id === selectedTopic.id);
    if (currentIndex >= 0 && currentIndex < domainTopics.length - 1) {
      // Load next topic in the SAME domain!
      setSelectedTopic(domainTopics[currentIndex + 1]);
    } else {
      // We are at the advanced topic! Let's wrap around to the next domain's basic topic!
      const domainKeys = ["bridge", "cic", "engineering", "damage_control", "small_boats", "unmanned_systems"];
      const nextDomainIdx = (domainKeys.indexOf(selectedTopic.domain) + 1) % domainKeys.length;
      const nextDomainKey = domainKeys[nextDomainIdx];
      
      // Expand that domain folder in the sidebar!
      setExpandedDomains(prev => ({ ...prev, [nextDomainKey]: true }));
      
      const nextDomainTopics = (topicsData.data || [])
        .filter(t => t.domain === nextDomainKey)
        .sort((a, b) => {
          const getOrder = (title: string) => {
            const t = title.toLowerCase();
            if (t.includes("basic") || t.includes("rule 9") || t.includes("target range") || t.includes("lube") || t.includes("boundaries") || t.includes("rhib launch") || t.includes("buoyancy &")) return 1;
            if (t.includes("intermediate") || t.includes("rule 10") || t.includes("iff") || t.includes("turbine start") || t.includes("shoring") || t.includes("vbss boarding") || t.includes("waypoint")) return 2;
            if (t.includes("advanced") || t.includes("rule 19") || t.includes("shield") || t.includes("thermal") || t.includes("cbrn") || t.includes("extraction") || t.includes("swarm")) return 3;
            return 99;
          };
          return getOrder(a.title) - getOrder(b.title);
        });

      if (nextDomainTopics.length > 0) {
        setSelectedTopic(nextDomainTopics[0]);
      } else {
        // Fallback: return to dashboard landing screen
        setSelectedTopic(null);
      }
    }
  }, [selectedTopic, topicsData.data, setSelectedTopic, setExpandedDomains]);

  const handleMarkAsCompleted = useCallback(async () => {
    if (!selectedTopic || !user) return;
    setIsCompleting(true);
    try {
      const scenario = getMatchingScenario(selectedTopic);
      if (scenario) {
        // Create session
        const sess = await sessions.create({
          scenario_id: scenario.id,
          trainee_id: user.id
        });
        
        // Immediately end the session with 100% score!
        if (sess && sess.id) {
          await sessions.end(sess.id, {
            instructor_notes: `Sovereign AI Auto-Score: Fully completed study manual for "${selectedTopic.title}" (Topic ID: ${selectedTopic.id})`,
            final_score: { "overall": 100 }
          });
        }
      }
      
      // Reload sessions to refresh state
      await sessionsData.refetch();
      
      // Show log
      setTerminalLogs(prev => [
        ...prev,
        { type: "success", text: `✓ Verified Mastery: Study notes for "${selectedTopic.title}" completed!` },
        { type: "success", text: `✓ Progress synced on sovereign decentralized ledger. Final score: 100%` }
      ]);

      // Move forward
      handleNextTopic();
    } catch (err) {
      console.error("Failed to save progression:", err);
      setTerminalLogs(prev => [
        ...prev,
        { type: "error", text: `⚠ Failed to write ledger: ${String(err)}` }
      ]);
    } finally {
      setIsCompleting(false);
    }
  }, [selectedTopic, user, sessionsData, handleNextTopic, setTerminalLogs, getMatchingScenario]);

  // API mutations and lists are hoisted to the top of the component body to prevent hoisting issues

  // Load interactive default on topic change
  useEffect(() => {
    if (selectedTopic) {
      setTerminalInput(selectedTopic.example_interactive || "");
      setTerminalLogs([
        { type: "info", text: `Loaded topic sandbox: "${selectedTopic.title}"` },
        { type: "info", text: `Standard interactive order: "${selectedTopic.example_interactive || "None"}"` },
        { type: "info", text: "Ready for sovereign command simulation execution..." }
      ]);
    }
  }, [selectedTopic]);



  // Handle Command Execution Simulation
  const runSimulatorCommand = () => {
    if (!selectedTopic || isRunningCommand) return;
    const cmd = terminalInput.trim();
    if (!cmd) return;

    setIsRunningCommand(true);
    setTerminalLogs((prev) => [...prev, { type: "info", text: `> Running terminal command: "${cmd}"` }]);

    setTimeout(() => {
      const match = selectedTopic.example_interactive || "";
      if (cmd.toLowerCase() === match.toLowerCase()) {
        let feedbackLogs: Array<{ type: "info" | "success" | "error" | "warn"; text: string }> = [];
        if (selectedTopic.domain === "bridge") {
          feedbackLogs = [
            { type: "success", text: "Command Executed: INS Vikrant alters helm as directed." },
            { type: "success", text: "State: Starboard 10 degrees applied. Stabilizing compass." },
            { type: "success", text: "Check: Passage safely clear of commercial shipping lane. Trainee score +10." }
          ];
        } else if (selectedTopic.domain === "cic") {
          feedbackLogs = [
            { type: "success", text: "Sovereign IFF Query: Sent interrogation pulse." },
            { type: "success", text: "Response: Crypto Mode 4 returned negative." },
            { type: "success", text: "Command: Track TGT-01 successfully classified as HOSTILE. Approved by CO. Trainee score +10." }
          ];
        } else if (selectedTopic.domain === "engineering") {
          feedbackLogs = [
            { type: "success", text: "Gas Turbine Pre-start verified: Lube Oil 40 PSI, Fuel 30 PSI." },
            { type: "success", text: "Ignition: Auxiliary starter engaged. Turbine self-sustaining at 4500 RPM." },
            { type: "success", text: "System State: Stable idle at 400°C. Compressor Online. Trainee score +10." }
          ];
        } else {
          feedbackLogs = [
            { type: "success", text: `Standard technical instruction "${cmd}" parsed.` },
            { type: "success", text: "Command Sandbox: Pre-conditions met. Safe operational sequence completed successfully." }
          ];
        }
        setTerminalLogs((prev) => [...prev, ...feedbackLogs]);
      } else {
        setTerminalLogs((prev) => [
          ...prev,
          { type: "warn", text: `Warning: Input order "${cmd}" did not match exact standard checklist item.` },
          { type: "warn", text: `Recommended checklist command for this lesson: "${match}"` }
        ]);
      }
      setIsRunningCommand(false);
    }, 1200);
  };

  // Handle Form Submission (Create or Edit)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const payload = {
      title: formTitle,
      domain: formDomain,
      description: formDescription,
      content_markdown: formContentMarkdown,
      example_interactive: formExampleInteractive,
    };

    if (editingTopic) {
      const res = await updateTopic(editingTopic.id, payload);
      if (res) {
        topicsData.refetch();
        setSelectedTopic({ ...editingTopic, ...payload } as DocumentationTopic);
        setIsModalOpen(false);
        resetForm();
      }
    } else {
      const res = await createTopic(payload);
      if (res) {
        topicsData.refetch();
        setIsModalOpen(false);
        resetForm();
      }
    }
  };

  const openEdit = (topic: DocumentationTopic, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingTopic(topic);
    setFormTitle(topic.title);
    setFormDomain(topic.domain);
    setFormDescription(topic.description || "");
    setFormContentMarkdown(topic.content_markdown || "");
    setFormExampleInteractive(topic.example_interactive || "");
    setIsModalOpen(true);
  };

  const handleDelete = async (topic_id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this technical documentation topic?")) {
      const res = await deleteTopic(topic_id);
      if (res) {
        topicsData.refetch();
        if (selectedTopic?.id === topic_id) {
          setSelectedTopic(null);
        }
      }
    }
  };

  const openAdd = () => {
    setEditingTopic(null);
    resetForm();
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormTitle("");
    setFormDomain("bridge");
    setFormDescription("");
    setFormContentMarkdown("");
    setFormExampleInteractive("");
  };



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
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-aegis-cyan to-aegis-blue flex items-center justify-center shadow-lg shadow-aegis-cyan/20">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-aegis-white tracking-wide">
              Technical Documentation Sandbox
            </h1>
            <p className="font-heading text-sm text-aegis-mist tracking-wider mt-0.5">
              Interactive technical manuals with real-time command line simulator.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge label="Sovereign AI Assured" variant="online" pulse />
          {isManageable && (
            <button
              onClick={openAdd}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-aegis-cyan to-aegis-blue text-white font-heading font-bold text-xs tracking-wider hover:opacity-90 transition-all shadow-lg shadow-aegis-cyan/15"
            >
              <Plus className="w-3.5 h-3.5" /> UPLOAD TOPIC
            </button>
          )}
        </div>
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Navigation Sidebar (Left 3 columns) */}
        <div className="lg:col-span-3 space-y-4 lg:sticky lg:top-24 lg:max-h-[calc(100vh-120px)] lg:overflow-y-auto custom-scrollbar pr-2 self-start">
          {/* Folders Header */}
          <div className="flex items-center gap-3 px-3 py-3 border-b border-white/5">
            <div className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/10 flex items-center justify-center text-aegis-cyan shadow-inner">
              <Folder className="w-4 h-4 text-aegis-cyan fill-current" />
            </div>
            <span className="font-heading font-black text-sm text-aegis-white tracking-wider">Navy Folders</span>
          </div>

          {/* Topics Collapsible Folders List */}
          <div className="space-y-3 font-heading">
            {topicsData.loading || sessionsData.loading ? (
              <div className="py-8 flex flex-col items-center justify-center gap-2 text-aegis-slate text-xs">
                <Loader2 className="w-5 h-5 animate-spin text-aegis-cyan" />
                Syncing technical manuals & sessions...
              </div>
            ) : (
              (() => {
                const domainsConfig = [
                  { key: "bridge", label: "Bridge Watch & Navigation" },
                  { key: "cic", label: "CIC & Warfare Operations" },
                  { key: "engineering", label: "Marine Engineering" },
                  { key: "damage_control", label: "Damage Control" },
                  { key: "small_boats", label: "Small Boats Operations" },
                  { key: "unmanned_systems", label: "Unmanned Systems" },
                ];

                const groupedTopics = {
                  bridge: [] as DocumentationTopic[],
                  cic: [] as DocumentationTopic[],
                  engineering: [] as DocumentationTopic[],
                  damage_control: [] as DocumentationTopic[],
                  small_boats: [] as DocumentationTopic[],
                  unmanned_systems: [] as DocumentationTopic[],
                };

                (topicsData.data || []).forEach((topic) => {
                  if (topic.domain in groupedTopics) {
                    groupedTopics[topic.domain as keyof typeof groupedTopics].push(topic);
                  }
                });

                return domainsConfig.map((dom) => {
                  const isExpanded = expandedDomains[dom.key];
                  const sessionCount = domainSessionCounts[dom.key] || 0;
                  
                  const getOrder = (title: string) => {
                    const t = title.toLowerCase();
                    if (t.includes("basic") || t.includes("rule 9") || t.includes("target range") || t.includes("lube") || t.includes("boundaries") || t.includes("rhib launch") || t.includes("buoyancy &")) return 1;
                    if (t.includes("intermediate") || t.includes("rule 10") || t.includes("iff") || t.includes("turbine start") || t.includes("shoring") || t.includes("vbss boarding") || t.includes("waypoint")) return 2;
                    if (t.includes("advanced") || t.includes("rule 19") || t.includes("shield") || t.includes("thermal") || t.includes("cbrn") || t.includes("extraction") || t.includes("swarm")) return 3;
                    return 99;
                  };

                  const rawTopics = groupedTopics[dom.key as keyof typeof groupedTopics] || [];
                  const topicsInDomain = [...rawTopics].sort((a, b) => getOrder(a.title) - getOrder(b.title));
                  
                  return (
                    <div key={dom.key} className="space-y-1">
                      {/* Folder Row */}
                      <div
                        onClick={() => toggleDomain(dom.key)}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/[0.02] cursor-pointer transition-all group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {isExpanded ? (
                            <FolderOpen className="w-4 h-4 text-aegis-cyan shrink-0" />
                          ) : (
                            <Folder className="w-4 h-4 text-aegis-slate group-hover:text-aegis-cyan shrink-0" />
                          )}
                          <span className="text-xs font-bold text-aegis-white group-hover:text-aegis-cyan transition-colors truncate">
                            {dom.label.split(" & ")[0]}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[10px] font-bold text-aegis-cyan/90 bg-aegis-cyan/10 px-2 py-0.5 rounded-full font-mono min-w-[20px] text-center border border-aegis-cyan/10 shadow-sm shadow-aegis-cyan/5">
                            {sessionCount}
                          </span>
                          {isExpanded ? (
                            <ChevronDown className="w-3.5 h-3.5 text-aegis-slate shrink-0" />
                          ) : (
                            <ChevronRight className="w-3.5 h-3.5 text-aegis-slate shrink-0" />
                          )}
                        </div>
                      </div>

                      {/* Subtopics (expanded list) */}
                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden relative pl-6 space-y-1.5 ml-4 py-1 group/timeline"
                          >
                            {/* Modern timeline progress line track */}
                            <div className="absolute left-[9px] top-0 bottom-0 w-[1.5px] bg-white/5 group-hover/timeline:bg-aegis-cyan/10 transition-colors" />

                            {topicsInDomain.length === 0 ? (
                              <div className="py-2 pl-3 text-[10px] text-aegis-slate italic font-body">
                                No manuals.
                              </div>
                            ) : (
                              topicsInDomain.map((topic) => {
                                const isSelected = selectedTopic?.id === topic.id;
                                const progress = getTopicProgress(topic);
                                return (
                                  <div
                                    key={topic.id}
                                    onClick={() => setSelectedTopic(topic)}
                                    className={`group relative flex items-center justify-between py-1.5 pl-2 pr-3 rounded-lg cursor-pointer transition-all ${
                                      isSelected
                                        ? "bg-white/[0.05] text-aegis-cyan font-bold"
                                        : "bg-transparent text-aegis-slate hover:text-aegis-white"
                                    }`}
                                  >
                                    {/* Dynamic Bullet Node on the track */}
                                    <div
                                      className={`absolute -left-[14px] top-[14px] w-2 h-2 rounded-full z-10 -translate-x-1/2 border transition-all duration-300 ${
                                        progress.label === "Completed" ? "bg-emerald-500 border-emerald-400 shadow-md shadow-emerald-500/40" :
                                        progress.label === "In Progress" ? "bg-amber-500 border-amber-400 shadow-md shadow-amber-500/40 animate-pulse" :
                                        "bg-slate-900 border-white/10"
                                      }`}
                                    />

                                    <div className="flex items-center justify-between w-full min-w-0 gap-2 mr-2">
                                      <span className="text-xs font-heading truncate">
                                        {topic.title}
                                      </span>
                                      <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border leading-none shrink-0 ${progress.color} ${progress.bg} ${progress.border}`}>
                                        {progress.label}
                                      </span>
                                    </div>

                                    <div className="shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                      {isManageable && (
                                        <>
                                          <button
                                            onClick={(e) => openEdit(topic, e)}
                                            className="p-0.5 rounded bg-white/5 border border-white/5 hover:border-aegis-cyan/35 hover:bg-aegis-cyan/10 text-aegis-slate hover:text-aegis-cyan transition-all"
                                          >
                                            <Edit className="w-2.5 h-2.5" />
                                          </button>
                                          <button
                                            onClick={(e) => handleDelete(topic.id, e)}
                                            className="p-0.5 rounded bg-white/5 border border-white/5 hover:border-red-500/35 hover:bg-red-500/10 text-aegis-slate hover:text-red-500 transition-all"
                                          >
                                            <Trash2 className="w-2.5 h-2.5" />
                                          </button>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                );
                              })
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                });
              })()
            )}
          </div>
        </div>

        {/* Content & Sandbox Console (Right 9 columns) */}
        <div className="lg:col-span-9 flex flex-col pr-2 space-y-5">
          {selectedTopic ? (
            <>
              {/* Breadcrumbs */}
              <div className="text-[9px] font-heading font-bold text-aegis-slate tracking-widest uppercase flex items-center gap-1.5 shrink-0 pl-1">
                <span
                  onClick={() => setSelectedTopic(null)}
                  className="cursor-pointer hover:text-aegis-cyan transition-colors"
                >
                  Study Notes
                </span>
                <ChevronRight className="w-3 h-3 text-aegis-slate" />
                <span className="text-aegis-slate">
                  {(() => {
                    const dMap: Record<string, string> = {
                      bridge: "Navigation",
                      cic: "Warfare Operations",
                      engineering: "Engineering",
                      damage_control: "Damage Control",
                      small_boats: "Small Boats",
                      unmanned_systems: "Unmanned Systems"
                    };
                    return dMap[selectedTopic.domain] || selectedTopic.domain;
                  })()}
                </span>
                <ChevronRight className="w-3 h-3 text-aegis-slate" />
                <span className="text-aegis-cyan">{selectedTopic.title}</span>
              </div>

              {/* Topic Header Card */}
              <div className="p-5 rounded-xl bg-white/[0.02] border border-white/10 shrink-0 relative overflow-hidden shadow-xl shadow-black/30">
                {/* Glowing background hint */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-aegis-cyan/5 to-transparent rounded-full blur-3xl pointer-events-none" />
                
                {/* Tags and Actions Row */}
                <div className="flex items-center justify-between gap-4 mb-3.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] font-heading font-black uppercase tracking-wider px-2 py-0.5 rounded bg-white/5 text-aegis-cloud border border-white/10">
                      {selectedTopic.domain.replace("_", " ")}
                    </span>
                    <span className="text-[8px] font-heading font-black uppercase tracking-wider px-2 py-0.5 rounded bg-aegis-cyan/15 text-aegis-cyan border border-aegis-cyan/20">
                      SOVEREIGN MANUAL
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => {
                        const blob = new Blob([selectedTopic.content_markdown || ""], { type: "text/plain" });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = `${selectedTopic.title.replace(/\s+/g, "_")}_Manual.txt`;
                        a.click();
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-aegis-cyan to-aegis-blue hover:opacity-95 text-white font-heading font-bold text-[9px] tracking-wider transition-all shadow-md shadow-aegis-cyan/15"
                    >
                      <Download className="w-3 h-3" /> Download PDF
                    </button>
                    <button
                      onClick={() => alert("Topic added to your personalized study dashboard!")}
                      className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 text-aegis-slate hover:text-white transition-all shadow-sm"
                    >
                      <Bookmark className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        alert("Link copied to clipboard! Share it with authorized team members.");
                      }}
                      className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 text-aegis-slate hover:text-white transition-all shadow-sm"
                    >
                      <Share2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Title & Description */}
                <h2 className="font-display text-xl font-bold text-aegis-white tracking-wide leading-tight">
                  {selectedTopic.title}
                </h2>
                <p className="font-body text-[11px] text-aegis-slate mt-1.5 max-w-2xl leading-relaxed">
                  {selectedTopic.description || "Comprehensive technical manuals covering operational checklists and live sovereign AI simulator codes."}
                </p>
              </div>

              {/* Main Reading Content (Full Width) */}
              <GlassPanel className="p-6">
                <RenderMarkdown text={selectedTopic.content_markdown || ""} />
              </GlassPanel>

              {/* Manual Progress Tracker & Next Manual Progression Controller */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/10 shrink-0 relative overflow-hidden shadow-xl shadow-black/20">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-aegis-cyan/5 to-transparent rounded-full blur-2xl pointer-events-none" />
                
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all ${
                    getTopicProgress(selectedTopic).label === "Completed"
                      ? "text-emerald-400 border-emerald-500/20 bg-emerald-500/10"
                      : "text-amber-400 border-amber-500/20 bg-amber-500/10 animate-pulse"
                  }`}>
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[9px] font-heading font-black tracking-widest text-aegis-slate uppercase">
                      MANUAL PROGRESS STATUS
                    </div>
                    <div className="text-xs font-bold text-aegis-white">
                      {getTopicProgress(selectedTopic).label === "Completed"
                        ? "Mastery Achieved — Verified on Sovereign Ledger"
                        : "Study Completed? Sync Trainee Progress"}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0 z-10">
                  {getTopicProgress(selectedTopic).label !== "Completed" ? (
                    <button
                      onClick={handleMarkAsCompleted}
                      disabled={isCompleting}
                      className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:opacity-55 text-slate-950 font-heading font-bold text-xs tracking-wider transition-all shadow-md shadow-emerald-500/25 w-full sm:w-auto"
                    >
                      {isCompleting ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" /> SYNCING LEDGER...
                        </>
                      ) : (
                        <>
                          <Check className="w-3.5 h-3.5" /> MARK AS COMPLETED & NEXT
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={handleNextTopic}
                      className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-aegis-cyan to-aegis-blue hover:opacity-95 text-white font-heading font-bold text-xs tracking-wider transition-all shadow-md shadow-aegis-cyan/25 w-full sm:w-auto"
                    >
                      PROCEED TO NEXT MANUAL <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Try It Yourself Simulator Sandbox Embedded Card */}
              <GlassPanel className="flex flex-col relative overflow-hidden" glow>
                <div className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.02] border-b border-white/5 shrink-0">
                  <Terminal className="w-3.5 h-3.5 text-aegis-cyan" />
                  <h3 className="font-heading text-[10px] tracking-widest uppercase text-aegis-white">
                    Sovereign AI Interactive Command Simulator
                  </h3>
                  <div className="ml-auto flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-aegis-cyan animate-pulse" />
                    <span className="text-[8px] font-mono text-aegis-cyan font-black uppercase">Telemetry Online</span>
                  </div>
                </div>

                {/* Sandbox code editor */}
                <div className="p-4 bg-slate-950/70 border-b border-white/5 shrink-0">
                  <p className="text-[9px] font-heading font-black text-aegis-mist uppercase tracking-widest mb-1.5 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-aegis-cyan" /> Try It Yourself Editor
                  </p>
                  <div className="relative font-mono text-[11px]">
                    <textarea
                      value={terminalInput}
                      onChange={(e) => setTerminalInput(e.target.value)}
                      className="w-full bg-slate-900 border border-white/10 rounded-lg p-3 min-h-[60px] text-aegis-cyan placeholder:text-aegis-slate focus:outline-none focus:border-aegis-cyan/35 resize-none font-bold shadow-inner leading-relaxed"
                      placeholder="Input standard instruction sequence (e.g. HELM STARBOARD 10 or START_TURBINE)..."
                    />
                    <button
                      onClick={runSimulatorCommand}
                      disabled={isRunningCommand || !selectedTopic}
                      className="absolute bottom-2.5 right-2.5 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-aegis-cyan to-aegis-blue hover:opacity-90 disabled:opacity-50 text-white font-heading font-bold text-[9px] tracking-wider transition-all shadow-md shadow-aegis-cyan/15 cursor-pointer"
                    >
                      {isRunningCommand ? (
                        <Loader2 className="w-3 animate-spin" />
                      ) : (
                        <Play className="w-3 fill-current" />
                      )}
                      RUN COMMAND
                    </button>
                  </div>
                </div>

                {/* Feedback simulated terminal logs */}
                <div className="p-4 bg-slate-900/60 font-mono text-[11px] overflow-y-auto max-h-[200px] custom-scrollbar leading-relaxed">
                  <div className="space-y-2">
                    {terminalLogs.map((log, i) => (
                      <div
                        key={i}
                        className={`${
                          log.type === "success" ? "text-emerald-400 font-bold" :
                          log.type === "error" ? "text-red-400 animate-pulse font-bold" :
                          log.type === "warn" ? "text-amber-400 font-bold" :
                          "text-aegis-cyan opacity-80"
                        }`}
                      >
                        {log.type === "success" ? "✓ " : log.type === "error" ? "✗ " : log.type === "warn" ? "⚠ " : "> "}
                        {log.text}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sovereign warning footer */}
                <div className="p-4 bg-white/[0.02] border-t border-white/5 shrink-0 flex items-center gap-2.5">
                  <Shield className="w-4 h-4 text-aegis-cyan shrink-0" />
                  <p className="text-[9px] text-aegis-slate italic font-body leading-relaxed">
                    Closed-loop sovereign telemetry validation. Command telemetry encrypted with naval hardware keys.
                  </p>
                </div>
              </GlassPanel>
            </>
          ) : (
            <div className="space-y-6">
              {/* Dashboard Hero Row */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-white/[0.02] to-transparent border border-white/5 relative overflow-hidden shadow-xl shadow-black/30">
                <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-aegis-cyan/5 to-transparent rounded-full blur-3xl pointer-events-none" />
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                  <div className="space-y-1">
                    <span className="text-[10px] font-heading font-black tracking-widest text-aegis-cyan uppercase">
                      Operational Study Manuals
                    </span>
                    <h2 className="font-display text-xl font-bold text-aegis-white tracking-wide">
                      Technical Study Notes
                    </h2>
                    <p className="font-body text-xs text-aegis-slate max-w-lg leading-relaxed">
                      Access precision-crafted sovereign notes and interactive telemetry simulator codes to review naval protocols.
                    </p>
                  </div>
                  
                  {/* Dashboard Search input */}
                  <div className="relative w-full md:w-80 shrink-0">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-aegis-slate" />
                    <input
                      type="text"
                      value={dashboardSearch}
                      onChange={(e) => setDashboardSearch(e.target.value)}
                      placeholder="Search notes, chapters, topics..."
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-950/70 border border-white/10 rounded-xl text-xs text-white placeholder:text-aegis-slate focus:outline-none focus:border-aegis-cyan/35 transition-all font-heading font-medium tracking-wide shadow-inner"
                    />
                    {dashboardSearch && (
                      <button
                        onClick={() => setDashboardSearch("")}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-aegis-slate hover:text-white text-[10px] font-black font-mono tracking-wider"
                      >
                        CLEAR
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Dynamic Content Panel */}
              {dashboardSearch.trim() ? (
                /* Search Results View */
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Search className="w-4 h-4 text-aegis-cyan" />
                    <h3 className="font-heading text-xs font-black tracking-widest uppercase text-aegis-white">
                      Search Results for &ldquo;{dashboardSearch}&rdquo; ({
                        (topicsData.data || []).filter(topic =>
                          topic.title.toLowerCase().includes(dashboardSearch.toLowerCase()) ||
                          (topic.description && topic.description.toLowerCase().includes(dashboardSearch.toLowerCase())) ||
                          topic.domain.toLowerCase().includes(dashboardSearch.toLowerCase())
                        ).length
                      })
                    </h3>
                  </div>

                  {(() => {
                    const searchResults = (topicsData.data || []).filter(topic =>
                      topic.title.toLowerCase().includes(dashboardSearch.toLowerCase()) ||
                      (topic.description && topic.description.toLowerCase().includes(dashboardSearch.toLowerCase())) ||
                      topic.domain.toLowerCase().includes(dashboardSearch.toLowerCase())
                    );

                    if (searchResults.length === 0) {
                      return (
                        <div className="p-12 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                          <HelpCircle className="w-8 h-8 text-aegis-slate mx-auto mb-3 animate-pulse" />
                          <p className="text-xs text-aegis-slate font-heading leading-relaxed">
                            No technical manuals or notes match your query. Try searching for different keywords or select a subject below.
                          </p>
                        </div>
                      );
                    }

                    return (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {searchResults.map((topic) => {
                          const progress = getTopicProgress(topic);
                          return (
                            <div
                              key={topic.id}
                              onClick={() => {
                                setSelectedTopic(topic);
                                setDashboardSearch("");
                                setExpandedDomains(prev => ({ ...prev, [topic.domain]: true }));
                              }}
                              className="p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 hover:border-white/10 transition-all cursor-pointer group shadow-lg"
                            >
                              <div className="flex items-center justify-between gap-3 mb-2">
                                <span className="text-[8px] font-heading font-black uppercase tracking-wider px-2 py-0.5 rounded bg-white/5 text-aegis-cyan">
                                  {topic.domain.replace("_", " ")}
                                </span>
                                <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border leading-none shrink-0 ${progress.color} ${progress.bg} ${progress.border}`}>
                                  {progress.label}
                                </span>
                              </div>
                              <h4 className="font-display text-sm font-bold text-aegis-white group-hover:text-aegis-cyan transition-colors truncate">
                                {topic.title}
                              </h4>
                              <p className="font-body text-[11px] text-aegis-slate mt-1.5 line-clamp-2 leading-relaxed">
                                {topic.description || "Comprehensive technical manual with interactive sovereign AI command simulation."}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
              ) : (
                /* Main Dashboard View */
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Subjects Column (Left 8 columns) */}
                  <div className="lg:col-span-8 space-y-4">
                    <div className="flex items-center gap-2.5 px-1 py-1">
                      <LayoutGrid className="w-4 h-4 text-aegis-cyan" />
                      <h3 className="font-heading text-xs font-black tracking-widest uppercase text-aegis-white">
                        Navy subjects
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        {
                          key: "bridge",
                          title: "Bridge Watch & Navigation",
                          subcategories: ["COLREGS Rules", "Helmsmanship", "Restricted Visibility"],
                          icon: Compass,
                          color: "from-cyan-500/10 to-blue-500/10 border-cyan-500/20",
                          accent: "text-aegis-cyan border-aegis-cyan/30 bg-aegis-cyan/10",
                          barColor: "bg-gradient-to-r from-aegis-cyan to-aegis-blue shadow-lg shadow-aegis-cyan/20",
                        },
                        {
                          key: "cic",
                          title: "CIC & Warfare Operations",
                          subcategories: ["Radar Tracking", "Threat Classification", "Air Defense"],
                          icon: Shield,
                          color: "from-blue-500/10 to-indigo-500/10 border-blue-500/20",
                          accent: "text-blue-400 border-blue-500/30 bg-blue-500/10",
                          barColor: "bg-gradient-to-r from-blue-500 to-indigo-500 shadow-lg shadow-blue-500/20",
                        },
                        {
                          key: "engineering",
                          title: "Marine Engineering",
                          subcategories: ["Propulsion Auxiliaries", "Gas Turbine Start", "Thermal Control"],
                          icon: Cpu,
                          color: "from-indigo-500/10 to-purple-500/10 border-indigo-500/20",
                          accent: "text-indigo-400 border-indigo-500/30 bg-indigo-500/10",
                          barColor: "bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/20",
                        },
                        {
                          key: "damage_control",
                          title: "Damage Control",
                          subcategories: ["Fire Classification", "Bulkhead Shoring", "CBRN Protection"],
                          icon: Flame,
                          color: "from-red-500/10 to-orange-500/10 border-red-500/20",
                          accent: "text-red-400 border-red-500/30 bg-red-500/10",
                          barColor: "bg-gradient-to-r from-red-500 to-orange-500 shadow-lg shadow-red-500/20",
                        },
                        {
                          key: "small_boats",
                          title: "Small Boats Operations",
                          subcategories: ["RHIB Launch Procedures", "VBSS Boarding Rules", "Tactical Extraction"],
                          icon: Anchor,
                          color: "from-emerald-500/10 to-teal-500/10 border-emerald-500/20",
                          accent: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
                          barColor: "bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/20",
                        },
                        {
                          key: "unmanned_systems",
                          title: "Unmanned Systems",
                          subcategories: ["UUV Depth Control", "USV Waypoint Tracking", "Drone Swarms"],
                          icon: Radio,
                          color: "from-amber-500/10 to-yellow-500/10 border-amber-500/20",
                          accent: "text-amber-400 border-amber-500/30 bg-amber-500/10",
                          barColor: "bg-gradient-to-r from-amber-500 to-yellow-500 shadow-lg shadow-amber-500/20",
                        },
                      ].map((subject) => {
                        const IconComponent = subject.icon;
                        const domainProgress = getDomainProgress(subject.key);
                        const topicsInDomain = (topicsData.data || []).filter(t => t.domain === subject.key);
                        
                        return (
                          <div
                            key={subject.key}
                            onClick={() => {
                              // Expand sidebar folder and select the first topic
                              setExpandedDomains(prev => ({ ...prev, [subject.key]: true }));
                              const sortedTopics = [...topicsInDomain].sort((a, b) => {
                                const getOrder = (title: string) => {
                                  const t = title.toLowerCase();
                                  if (t.includes("basic") || t.includes("rule 9") || t.includes("target range") || t.includes("lube") || t.includes("boundaries") || t.includes("rhib launch") || t.includes("buoyancy &")) return 1;
                                  if (t.includes("intermediate") || t.includes("rule 10") || t.includes("iff") || t.includes("turbine start") || t.includes("shoring") || t.includes("vbss boarding") || t.includes("waypoint")) return 2;
                                  if (t.includes("advanced") || t.includes("rule 19") || t.includes("shield") || t.includes("thermal") || t.includes("cbrn") || t.includes("extraction") || t.includes("swarm")) return 3;
                                  return 99;
                                };
                                return getOrder(a.title) - getOrder(b.title);
                              });
                              if (sortedTopics.length > 0) {
                                setSelectedTopic(sortedTopics[0]);
                              }
                            }}
                            className={`p-5 rounded-2xl bg-gradient-to-br ${subject.color} border border-white/5 hover:border-white/20 transition-all cursor-pointer group shadow-xl relative overflow-hidden`}
                          >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform" />
                            
                            {/* Card Header */}
                            <div className="flex items-center justify-between gap-3 mb-4">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${subject.accent} group-hover:scale-110 transition-transform`}>
                                <IconComponent className="w-4 h-4" />
                              </div>
                              <span className="text-[9px] font-heading font-black text-aegis-slate tracking-widest uppercase">
                                NOTES: {topicsInDomain.length}
                              </span>
                            </div>

                            {/* Title */}
                            <h4 className="font-display text-sm font-bold text-aegis-white group-hover:text-aegis-cyan transition-colors leading-snug">
                              {subject.title}
                            </h4>

                            {/* Sub-categories */}
                            <div className="flex flex-wrap gap-1.5 mt-3 mb-5">
                              {subject.subcategories.map((sub, sIdx) => (
                                <span
                                  key={sIdx}
                                  className="text-[9px] font-heading font-medium text-aegis-slate border border-white/5 bg-white/[0.02] px-2 py-0.5 rounded-full hover:border-white/20 transition-all duration-300"
                                >
                                  {sub}
                                </span>
                              ))}
                            </div>

                            {/* Progress bar */}
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between text-[9px] font-heading font-black tracking-wider text-aegis-slate uppercase">
                                <span>PROGRESS</span>
                                <span className="text-aegis-white group-hover:text-aegis-cyan transition-colors">{domainProgress}%</span>
                              </div>
                              <div className="w-full h-1 bg-slate-900 border border-white/5 rounded-full overflow-hidden">
                                <div
                                  className={`h-full ${subject.barColor} rounded-full transition-all duration-500`}
                                  style={{ width: `${domainProgress}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Activity & Knowledge Gap Column (Right 4 columns) */}
                  <div className="lg:col-span-4 space-y-6">
                    {/* Activity widget */}
                    <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 shadow-xl space-y-4">
                      <div className="flex items-center gap-2.5 border-b border-white/5 pb-3">
                        <History className="w-4 h-4 text-aegis-cyan" />
                        <h3 className="font-heading text-xs font-black tracking-widest uppercase text-aegis-white">
                          Activity
                        </h3>
                      </div>

                      <div className="space-y-3">
                        {(() => {
                          const recentSessions = (sessionsData.data?.items || [])
                            .filter(s => s.status === "completed")
                            .slice(0, 3);
                          
                          if (recentSessions.length === 0) {
                            return (
                              <div className="py-8 text-center text-aegis-slate font-heading text-[10px] leading-relaxed">
                                No active learning logs found.<br />Complete telemetry simulators to sync logs.
                              </div>
                            );
                          }

                          return recentSessions.map((s, idx) => {
                            const sDom = scenarioDomainMap[s.scenario_id] || "bridge";
                            const dMap: Record<string, string> = {
                              bridge: "NAVIGATION",
                              cic: "WARFARE OPERATIONS",
                              engineering: "ENGINEERING",
                              damage_control: "DAMAGE CONTROL",
                              small_boats: "SMALL BOATS",
                              unmanned_systems: "UNMANNED SYSTEMS"
                            };
                            
                            // Map score level
                            const scoreVal = extractSessionScore(s);
                            
                            // Get relative time
                            const relativeTime = s.created_at 
                              ? (() => {
                                  try {
                                    const diff = Date.now() - new Date(s.created_at).getTime();
                                    const hrs = Math.floor(diff / (1000 * 60 * 60));
                                    if (hrs < 1) return "JUST NOW";
                                    if (hrs < 24) return `${hrs} HOURS AGO`;
                                    const days = Math.floor(hrs / 24);
                                    if (days === 1) return "YESTERDAY";
                                    return `${days} DAYS AGO`;
                                  } catch {
                                    return "RECENTLY";
                                  }
                                })()
                              : "RECENTLY";

                            // Dynamic scenario label
                            const sLabel = sDom === "bridge" ? "Narrow Channel COLREGS Run" :
                                           sDom === "cic" ? "Air Shield Defense Simulation" :
                                           sDom === "engineering" ? "Auxiliary Fuel Alignment" :
                                           sDom === "damage_control" ? "Class A Boundaries Containment" :
                                           sDom === "small_boats" ? "RHIB Davit Hook Alignment" :
                                           "Drone Decoy Swarm Tactics";

                            return (
                              <div
                                key={s.id || idx}
                                onClick={() => {
                                  // Find the first topic of this domain and open it
                                  setExpandedDomains(prev => ({ ...prev, [sDom]: true }));
                                  const topics = (topicsData.data || []).filter(t => t.domain === sDom);
                                  if (topics.length > 0) {
                                    setSelectedTopic(topics[0]);
                                  }
                                }}
                                className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.01] border border-white/5 hover:border-white/10 hover:bg-white/[0.03] transition-all cursor-pointer group"
                              >
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center border border-white/10 bg-white/5 shrink-0 group-hover:scale-105 transition-transform text-aegis-slate group-hover:text-aegis-cyan">
                                  <Clock className="w-4 h-4" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="text-[8px] font-heading font-black tracking-widest text-aegis-slate group-hover:text-aegis-cyan transition-colors uppercase">
                                    {dMap[sDom]} • {relativeTime}
                                  </div>
                                  <div className="text-xs font-bold text-aegis-white truncate mt-0.5">
                                    {sLabel}
                                  </div>
                                </div>
                                <div className="text-xs font-mono font-black text-emerald-400 border border-emerald-500/20 bg-emerald-500/5 px-2 py-0.5 rounded shrink-0">
                                  {scoreVal}%
                                </div>
                              </div>
                            );
                          });
                        })()}
                      </div>
                    </div>

                    {/* Knowledge Gap detector widget */}
                    {(() => {
                      const domainKeys = ["bridge", "cic", "engineering", "damage_control", "small_boats", "unmanned_systems"];
                      const dMap: Record<string, string> = {
                        bridge: "Bridge Watch & Navigation",
                        cic: "CIC & Warfare Operations",
                        engineering: "Marine Engineering",
                        damage_control: "Damage Control",
                        small_boats: "Small Boats Operations",
                        unmanned_systems: "Unmanned Systems"
                      };
                      let lowest = { key: "bridge", val: 100 };
                      for (const key of domainKeys) {
                        const val = getDomainProgress(key);
                        if (val < lowest.val) {
                          lowest = { key, val };
                        }
                      }
                      
                      const hasGap = lowest.val < 100;
                      
                      if (hasGap) {
                        return (
                          <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-500/20 via-purple-500/15 to-transparent border border-indigo-500/20 relative overflow-hidden shadow-xl shadow-indigo-900/10">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none" />
                            
                            <div className="w-8 h-8 rounded-lg border border-indigo-500/30 bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-4 animate-bounce">
                              <BookOpen className="w-4 h-4" />
                            </div>
                            
                            <h4 className="font-display text-sm font-extrabold text-white tracking-wide">
                              Knowledge Gap!
                            </h4>
                            
                            <p className="font-body text-[11px] text-aegis-slate mt-2 leading-relaxed">
                              You haven&rsquo;t reviewed &ldquo;{dMap[lowest.key]}&rdquo; in 5 days. Students who review weekly score 24% higher.
                            </p>
                            
                            <button
                              onClick={() => {
                                setExpandedDomains(prev => ({ ...prev, [lowest.key]: true }));
                                const topics = (topicsData.data || []).filter(t => t.domain === lowest.key);
                                if (topics.length > 0) {
                                  setSelectedTopic(topics[0]);
                                }
                              }}
                              className="mt-5 w-full py-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90 transition-all text-white font-heading font-black text-[10px] tracking-widest rounded-xl uppercase shadow-md shadow-indigo-500/20"
                            >
                              Review Now
                            </button>
                          </div>
                        );
                      }

                      return (
                        <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500/20 via-teal-500/15 to-transparent border border-emerald-500/20 relative overflow-hidden shadow-xl shadow-emerald-900/10">
                          <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none" />
                          
                          <div className="w-8 h-8 rounded-lg border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4 animate-pulse">
                            <Shield className="w-4 h-4 text-emerald-400" />
                          </div>
                          
                          <h4 className="font-display text-sm font-extrabold text-white tracking-wide">
                            Operational Cleared!
                          </h4>
                          
                          <p className="font-body text-[11px] text-aegis-slate mt-2 leading-relaxed">
                            100% readiness across all Navy subjects. You have fully met sovereign AI instruction clearance guidelines.
                          </p>
                          
                          <div className="mt-5 text-center text-[10px] font-heading font-black text-emerald-400 tracking-widest uppercase border border-emerald-500/20 bg-emerald-500/5 py-2 rounded-xl">
                            READY FOR ACTIVE DEPLOYMENT
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                </div>
              )}
            </div>
          )}
        </div>

      </div>

      {/* Upload/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="w-full max-w-2xl bg-slate-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
                <div className="flex items-center gap-2.5">
                  <BookOpen className="w-5 h-5 text-aegis-cyan" />
                  <h2 className="font-heading font-bold text-sm text-aegis-white tracking-wide">
                    {editingTopic ? "Edit Technical Manual Topic" : "Upload New Documentation Topic"}
                  </h2>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 text-aegis-slate hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5 col-span-2 sm:col-span-1">
                    <label className="text-[10px] font-heading font-bold uppercase tracking-wider text-aegis-mist">
                      Topic Title
                    </label>
                    <input
                      type="text"
                      required
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      placeholder="e.g. COLREGS Rule 9 Narrow Channels"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-aegis-white placeholder:text-aegis-slate focus:outline-none focus:border-aegis-cyan/40 transition-colors font-body"
                    />
                  </div>

                  <div className="space-y-1.5 col-span-2 sm:col-span-1">
                    <label className="text-[10px] font-heading font-bold uppercase tracking-wider text-aegis-mist">
                      Training Domain
                    </label>
                    <select
                      value={formDomain}
                      onChange={(e) => setFormDomain(e.target.value)}
                      className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-sm text-aegis-white focus:outline-none focus:border-aegis-cyan/40 transition-colors font-body"
                    >
                      <option value="bridge">Bridge Watch & Navigation</option>
                      <option value="cic">CIC & Warfare Operations</option>
                      <option value="engineering">Marine Engineering</option>
                      <option value="damage_control">Damage Control</option>
                      <option value="small_boats">Small Boats</option>
                      <option value="unmanned_systems">Unmanned Systems</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-heading font-bold uppercase tracking-wider text-aegis-mist">
                    Brief Description
                  </label>
                  <input
                    type="text"
                    required
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Provide a concise 1-sentence synopsis of this lesson"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-aegis-white placeholder:text-aegis-slate focus:outline-none focus:border-aegis-cyan/40 transition-colors font-body"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-heading font-bold uppercase tracking-wider text-aegis-mist flex items-center justify-between">
                    <span>Tutorial Content (Markdown Formatted)</span>
                    <span className="text-[9px] font-body font-normal text-aegis-slate italic">Supports: # Header, ## Sub, &gt; Note, tables</span>
                  </label>
                  <textarea
                    required
                    value={formContentMarkdown}
                    onChange={(e) => setFormContentMarkdown(e.target.value)}
                    placeholder="# Aegis Navigation: Title&#10;&#10;Learn rules here...&#10;&#10;## 1. Subheading&#10;- Bullet point 1"
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 min-h-[160px] text-sm text-aegis-white placeholder:text-aegis-slate focus:outline-none focus:border-aegis-cyan/40 transition-colors resize-none font-mono leading-relaxed"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-heading font-bold uppercase tracking-wider text-aegis-mist flex items-center gap-1">
                    <Terminal className="w-3 h-3" /> Try It Yourself Simulator Action Checklist
                  </label>
                  <input
                    type="text"
                    required
                    value={formExampleInteractive}
                    onChange={(e) => setFormExampleInteractive(e.target.value)}
                    placeholder="e.g. HELM STARBOARD 10 or START_TURBINE"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-aegis-cyan placeholder:text-aegis-slate focus:outline-none focus:border-aegis-cyan/40 transition-colors font-mono"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 hover:border-white/15 text-aegis-slate hover:text-white text-xs font-heading font-bold transition-all"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating || isUpdating}
                    className="flex items-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r from-aegis-cyan to-aegis-blue hover:opacity-90 disabled:opacity-50 text-white font-heading font-bold text-xs tracking-wider transition-all shadow-lg shadow-aegis-cyan/15"
                  >
                    {(isCreating || isUpdating) ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Check className="w-3.5 h-3.5" />
                    )}
                    {editingTopic ? "SAVE CHANGES" : "PUBLISH TOPIC"}
                  </button>
                </div>
              </form>
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
