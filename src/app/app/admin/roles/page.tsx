"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Lock,
  Plus,
  Edit,
  Users,
  CheckCircle,
  Loader2,
  AlertTriangle,
  UserX,
  ChevronLeft,
  ChevronRight,
  Save,
  X,
} from "lucide-react";
import { GlassPanel } from "@/components/ui/glass-panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { AegisButton } from "@/components/ui/aegis-button";
import { staggerContainer, fadeInUp } from "@/animations/variants";
import { users } from "@/lib/api/endpoints";
import { useApi, useMutation } from "@/lib/api/hooks";
import { useUserStore } from "@/stores/user-store";
import type { BackendUser } from "@/lib/api/types";

const ROLES: Array<{
  key: string;
  label: string;
  desc: string;
  permissions: string[];
  clearance: "RESTRICTED" | "CONFIDENTIAL" | "SECRET";
}> = [
  {
    key: "trainee",
    label: "Trainee",
    desc: "View training modules, execute sessions",
    permissions: ["View training modules", "Execute sessions", "View own scores"],
    clearance: "RESTRICTED",
  },
  {
    key: "instructor",
    label: "Instructor",
    desc: "Author scenarios, manage sessions, govern AI",
    permissions: [
      "All trainee + author scenarios",
      "Manage sessions",
      "AI governance",
      "Debrief generation",
    ],
    clearance: "CONFIDENTIAL",
  },
  {
    key: "evaluator",
    label: "Evaluator",
    desc: "Certification authority and pass/fail decisions",
    permissions: [
      "All instructor + certification authority",
      "Assessment grading",
      "Pass/fail decisions",
    ],
    clearance: "CONFIDENTIAL",
  },
  {
    key: "doctrine",
    label: "Doctrine Manager",
    desc: "Content ingestion and doctrine approval",
    permissions: ["Content ingestion", "Doctrine approval", "Source management"],
    clearance: "SECRET",
  },
  {
    key: "fleet",
    label: "Fleet Training Command",
    desc: "Enterprise dashboards and reporting",
    permissions: [
      "Enterprise dashboards",
      "Cross-base reporting",
      "Strategic planning",
    ],
    clearance: "SECRET",
  },
  {
    key: "admin",
    label: "Admin",
    desc: "Full system access",
    permissions: ["Full system access", "RBAC config", "Audit logs", "Security controls"],
    clearance: "SECRET",
  },
  {
    key: "maintainer",
    label: "System Maintainer",
    desc: "Deployment, patching, model versioning",
    permissions: [
      "Deployment management",
      "Patching",
      "Model versioning",
      "Infrastructure",
    ],
    clearance: "SECRET",
  },
];

const CLEARANCES = ["RESTRICTED", "CONFIDENTIAL", "SECRET", "TOP_SECRET"] as const;
const PAGE_SIZE = 15;

export default function RolesPage() {
  const currentUser = useUserStore((s) => s.user);
  const isAdmin = currentUser?.role === "admin";

  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRole, setEditRole] = useState<string>("trainee");
  const [page, setPage] = useState(1);
  const [filterRole, setFilterRole] = useState<string>("");

  const summary = useApi(() => users.rolesSummary(), []);
  const userList = useApi(
    () =>
      users.list({
        page,
        page_size: PAGE_SIZE,
        role: filterRole || undefined,
      }),
    [page, filterRole]
  );

  const updateMut = useMutation(users.update);
  const deactivateMut = useMutation(users.deactivate);
  const createMut = useMutation(users.create);

  const roleCounts = useMemo(() => summary.data ?? {}, [summary.data]);

  const totalPages = Math.max(
    1,
    Math.ceil((userList.data?.total ?? 0) / PAGE_SIZE)
  );

  const handleSaveRole = async (id: string) => {
    const res = await updateMut.run(id, { role: editRole as BackendUser["role"] });
    if (res) {
      setEditingId(null);
      userList.refetch();
      summary.refetch();
    }
  };

  const handleDeactivate = async (id: string) => {
    const res = await deactivateMut.run(id);
    if (res) {
      userList.refetch();
      summary.refetch();
    }
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="space-y-6"
    >
      <motion.div variants={fadeInUp} className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-aegis-gold to-aegis-amber flex items-center justify-center">
            <Lock className="w-6 h-6 text-aegis-void" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-aegis-white tracking-wide">
              Role-Based Access Control
            </h1>
            <p className="font-heading text-sm text-aegis-mist tracking-wider mt-0.5">
              Configure Roles, Permissions & Clearance Levels
            </p>
          </div>
        </div>
        {isAdmin && (
          <AegisButton
            size="sm"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setShowCreate((v) => !v)}
          >
            {showCreate ? "Close" : "Create User"}
          </AegisButton>
        )}
      </motion.div>

      {/* Roles Grid (counts populated from rolesSummary) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ROLES.map((role) => (
          <motion.div key={role.key} variants={fadeInUp}>
            <GlassPanel
              className="hover:border-aegis-cyan/15 transition-all"
              animated={false}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-heading text-base font-bold text-aegis-white tracking-wide">
                  {role.label}
                </h3>
                <button className="p-1.5 rounded-lg hover:bg-white/[0.04] text-aegis-mist cursor-pointer">
                  <Edit className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1.5">
                  <Users className="w-3 h-3 text-aegis-slate" />
                  <span className="text-xs font-mono text-aegis-mist">
                    {summary.loading ? "..." : roleCounts[role.key] ?? 0} users
                  </span>
                </div>
                <StatusBadge label={role.clearance} variant="warning" />
              </div>
              <div className="space-y-1.5">
                {role.permissions.map((p) => (
                  <div key={p} className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-aegis-green shrink-0" />
                    <span className="text-[11px] text-aegis-mist">{p}</span>
                  </div>
                ))}
              </div>
            </GlassPanel>
          </motion.div>
        ))}
      </div>

      {/* Create user form (admin only) */}
      {isAdmin && showCreate && (
        <motion.div variants={fadeInUp}>
          <CreateUserForm
            onClose={() => setShowCreate(false)}
            onCreated={() => {
              setShowCreate(false);
              userList.refetch();
              summary.refetch();
            }}
            mutation={createMut}
          />
        </motion.div>
      )}

      {/* User list (admin only) */}
      {isAdmin && (
        <motion.div variants={fadeInUp}>
          <GlassPanel animated={false}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist">
                User Directory
              </h3>
              <div className="flex items-center gap-2">
                <label className="text-[10px] font-heading text-aegis-slate uppercase">
                  Filter
                </label>
                <select
                  value={filterRole}
                  onChange={(e) => {
                    setFilterRole(e.target.value);
                    setPage(1);
                  }}
                  className="bg-white/[0.03] border border-white/10 rounded-lg px-2 py-1 text-xs text-aegis-cloud focus:outline-none focus:border-aegis-cyan/50"
                >
                  <option value="">All Roles</option>
                  {ROLES.map((r) => (
                    <option key={r.key} value={r.key}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {(updateMut.error || deactivateMut.error) && (
              <div className="mb-4 flex items-center gap-2 text-xs text-aegis-red">
                <AlertTriangle className="w-3.5 h-3.5" />
                {updateMut.error || deactivateMut.error}
              </div>
            )}

            {userList.loading ? (
              <div className="flex items-center gap-2 text-xs text-aegis-mist">
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Loading users...
              </div>
            ) : userList.error ? (
              <p className="text-xs text-aegis-red">{userList.error}</p>
            ) : !userList.data || userList.data.items.length === 0 ? (
              <p className="text-xs text-aegis-slate">No users found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/[0.06]">
                      {[
                        "Service No.",
                        "Name",
                        "Rank",
                        "Unit",
                        "Role",
                        "Clearance",
                        "Status",
                        "Actions",
                      ].map((h) => (
                        <th
                          key={h}
                          className="text-left py-3 px-4 text-[10px] font-heading font-bold tracking-[0.1em] uppercase text-aegis-slate"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {userList.data.items.map((u) => {
                      const editing = editingId === u.id;
                      return (
                        <tr
                          key={u.id}
                          className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                        >
                          <td className="py-3 px-4 text-xs font-mono text-aegis-cloud">
                            {u.service_number}
                          </td>
                          <td className="py-3 px-4 text-sm text-aegis-cloud">{u.name}</td>
                          <td className="py-3 px-4 text-xs text-aegis-mist">{u.rank}</td>
                          <td className="py-3 px-4 text-xs text-aegis-mist">{u.unit}</td>
                          <td className="py-3 px-4">
                            {editing ? (
                              <select
                                value={editRole}
                                onChange={(e) => setEditRole(e.target.value)}
                                className="bg-white/[0.03] border border-white/10 rounded-lg px-2 py-1 text-xs text-aegis-cloud focus:outline-none focus:border-aegis-cyan/50"
                              >
                                {ROLES.map((r) => (
                                  <option key={r.key} value={r.key}>
                                    {r.label}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <span className="text-xs font-mono text-aegis-cyan uppercase">
                                {u.role}
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-[10px] font-mono text-aegis-slate uppercase">
                            {u.classification_clearance}
                          </td>
                          <td className="py-3 px-4">
                            <StatusBadge
                              label={u.is_active ? "ACTIVE" : "INACTIVE"}
                              variant={u.is_active ? "online" : "offline"}
                            />
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              {editing ? (
                                <>
                                  <button
                                    onClick={() => handleSaveRole(u.id)}
                                    disabled={updateMut.loading}
                                    className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-heading font-bold text-aegis-green border border-aegis-green/30 hover:bg-aegis-green/10 disabled:opacity-50"
                                  >
                                    {updateMut.loading ? (
                                      <Loader2 className="w-3 h-3 animate-spin" />
                                    ) : (
                                      <Save className="w-3 h-3" />
                                    )}
                                    Save
                                  </button>
                                  <button
                                    onClick={() => setEditingId(null)}
                                    className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-heading text-aegis-mist border border-white/[0.06] hover:bg-white/[0.04]"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={() => {
                                      setEditingId(u.id);
                                      setEditRole(u.role);
                                    }}
                                    className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-heading text-aegis-cyan border border-aegis-cyan/30 hover:bg-aegis-cyan/10"
                                  >
                                    <Edit className="w-3 h-3" /> Edit
                                  </button>
                                  {u.is_active && (
                                    <button
                                      onClick={() => handleDeactivate(u.id)}
                                      disabled={deactivateMut.loading}
                                      className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-heading text-aegis-red border border-aegis-red/30 hover:bg-aegis-red/10 disabled:opacity-50"
                                    >
                                      <UserX className="w-3 h-3" /> Deactivate
                                    </button>
                                  )}
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/[0.06]">
              <span className="text-[10px] font-mono text-aegis-slate uppercase">
                Page {page} of {totalPages} &bull; {userList.data?.total ?? 0} total
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page <= 1 || userList.loading}
                  className="p-1.5 rounded-lg glass border border-white/[0.06] text-aegis-mist hover:text-aegis-cyan transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page >= totalPages || userList.loading}
                  className="p-1.5 rounded-lg glass border border-white/[0.06] text-aegis-mist hover:text-aegis-cyan transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </GlassPanel>
        </motion.div>
      )}
    </motion.div>
  );
}

function CreateUserForm({
  onClose,
  onCreated,
  mutation,
}: {
  onClose: () => void;
  onCreated: () => void;
  mutation: ReturnType<typeof useMutation<Parameters<typeof users.create>, BackendUser>>;
}) {
  const [form, setForm] = useState({
    service_number: "",
    name: "",
    rank: "",
    unit: "",
    role: "trainee",
    password: "",
    classification_clearance: "RESTRICTED",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await mutation.run(form);
    if (res) onCreated();
  };

  const setField = (k: keyof typeof form, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  return (
    <GlassPanel animated={false}>
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist">
          Create User
        </h3>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-white/[0.04] text-aegis-mist"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-3"
      >
        <Field
          label="Service Number"
          value={form.service_number}
          onChange={(v) => setField("service_number", v)}
          required
        />
        <Field
          label="Full Name"
          value={form.name}
          onChange={(v) => setField("name", v)}
          required
        />
        <Field
          label="Rank"
          value={form.rank}
          onChange={(v) => setField("rank", v)}
          required
        />
        <Field
          label="Unit"
          value={form.unit}
          onChange={(v) => setField("unit", v)}
          required
        />
        <div>
          <label className="block text-[10px] font-heading text-aegis-slate uppercase tracking-wider mb-2">
            Role
          </label>
          <select
            value={form.role}
            onChange={(e) => setField("role", e.target.value)}
            className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-aegis-white focus:outline-none focus:border-aegis-cyan/50"
          >
            {ROLES.map((r) => (
              <option key={r.key} value={r.key}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-heading text-aegis-slate uppercase tracking-wider mb-2">
            Classification Clearance
          </label>
          <select
            value={form.classification_clearance}
            onChange={(e) => setField("classification_clearance", e.target.value)}
            className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-aegis-white focus:outline-none focus:border-aegis-cyan/50"
          >
            {CLEARANCES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <Field
          label="Initial Password"
          value={form.password}
          onChange={(v) => setField("password", v)}
          type="password"
          required
        />
        <div className="flex items-end gap-3">
          <AegisButton
            type="submit"
            loading={mutation.loading}
            disabled={mutation.loading}
            icon={<Plus className="w-4 h-4" />}
          >
            Create
          </AegisButton>
        </div>
        {mutation.error && (
          <div className="md:col-span-2 flex items-center gap-2 text-xs text-aegis-red">
            <AlertTriangle className="w-3.5 h-3.5" /> {mutation.error}
          </div>
        )}
      </form>
    </GlassPanel>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-[10px] font-heading text-aegis-slate uppercase tracking-wider mb-2">
        {label}
      </label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-aegis-white placeholder:text-aegis-slate focus:outline-none focus:border-aegis-cyan/50"
      />
    </div>
  );
}
