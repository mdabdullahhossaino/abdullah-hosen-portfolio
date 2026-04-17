import { Skeleton } from "@/components/ui/skeleton";
import type { DashboardStats } from "@/services/staticService";
import { getDashboardStats } from "@/services/staticService";
import { useQuery } from "@tanstack/react-query";
import { BarChart2, FolderOpen, TrendingUp, Users } from "lucide-react";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// ── Recharts custom tooltip ────────────────────────────────────────────────
interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
    payload: Record<string, unknown>;
  }>;
  label?: string;
}

function BarTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="px-3 py-2 rounded-xl border text-xs font-mono"
      style={{
        background: "oklch(0.18 0.016 48)",
        borderColor: "oklch(0.72 0.18 50 / 0.3)",
        color: "oklch(0.93 0.008 60)",
      }}
    >
      <p style={{ color: "oklch(0.72 0.22 210)" }}>{label}</p>
      <p>
        <span style={{ color: "oklch(0.72 0.18 50)" }}>{payload[0].value}</span>{" "}
        contacts
      </p>
    </div>
  );
}

function PieTooltip({ active, payload }: TooltipProps) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div
      className="px-3 py-2 rounded-xl border text-xs font-mono"
      style={{
        background: "oklch(0.18 0.016 48)",
        borderColor: "oklch(0.72 0.22 210 / 0.3)",
        color: "oklch(0.93 0.008 60)",
      }}
    >
      <p style={{ color: "oklch(0.72 0.22 210)" }}>{item.name}</p>
      <p>
        <span style={{ color: "oklch(0.72 0.18 50)" }}>{item.value}</span>{" "}
        projects
      </p>
    </div>
  );
}

// ── Pie colors ──────────────────────────────────────────────────────────────
const PIE_COLORS = [
  "oklch(0.72 0.18 50)",
  "oklch(0.72 0.22 210)",
  "oklch(0.68 0.20 150)",
  "oklch(0.70 0.20 300)",
  "oklch(0.68 0.18 25)",
];

// ── Stat card ──────────────────────────────────────────────────────────────
interface StatCardProps {
  label: string;
  value: string | number;
  icon: typeof Users;
  accent: "gold" | "cyan" | "green";
}

const ACCENT_STYLES = {
  gold: {
    icon: "oklch(0.72 0.18 50)",
    bg: "oklch(0.72 0.18 50 / 0.10)",
    border: "oklch(0.72 0.18 50 / 0.25)",
    glow: "0 0 20px -5px oklch(0.72 0.18 50 / 0.35)",
  },
  cyan: {
    icon: "oklch(0.72 0.22 210)",
    bg: "oklch(0.72 0.22 210 / 0.10)",
    border: "oklch(0.72 0.22 210 / 0.25)",
    glow: "0 0 20px -5px oklch(0.72 0.22 210 / 0.35)",
  },
  green: {
    icon: "oklch(0.68 0.20 150)",
    bg: "oklch(0.68 0.20 150 / 0.10)",
    border: "oklch(0.68 0.20 150 / 0.25)",
    glow: "0 0 20px -5px oklch(0.68 0.20 150 / 0.35)",
  },
};

function StatCard({ label, value, icon: Icon, accent }: StatCardProps) {
  const s = ACCENT_STYLES[accent];
  return (
    <div
      className="rounded-2xl border p-5 flex items-center gap-4 transition-smooth hover:-translate-y-0.5"
      style={{
        background: "oklch(0.15 0.016 48)",
        borderColor: s.border,
        boxShadow: s.glow,
      }}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: s.bg, border: `1px solid ${s.border}` }}
      >
        <Icon size={22} style={{ color: s.icon }} />
      </div>
      <div>
        <p
          className="text-xs font-accent uppercase tracking-[0.15em] mb-0.5"
          style={{ color: "oklch(0.50 0.010 55)" }}
        >
          {label}
        </p>
        <p className="font-display font-bold text-2xl lg:text-3xl text-foreground leading-none tracking-tight">
          {value}
        </p>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────
export function AdminDashboard() {
  const token = localStorage.getItem("admin_token") ?? "";

  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["dashboard-stats", token],
    queryFn: () => getDashboardStats(token),
    enabled: !!token,
    refetchInterval: 30_000,
  });

  const barData = (stats?.contactsLast30Days ?? []).map((d) => ({
    date: d.date.slice(5),
    count: Number(d.count),
  }));

  const pieData = (stats?.projectsByCategory ?? []).map((c) => ({
    name: c.category,
    value: Number(c.count),
  }));

  const totalContacts = stats ? Number(stats.totalContacts) : 0;
  const totalProjects = stats ? Number(stats.totalProjects) : 0;
  const latestCount =
    barData.length > 0 ? barData[barData.length - 1].count : 0;

  return (
    <div className="space-y-8" data-ocid="admin-dashboard">
      {/* Header */}
      <div>
        <h1 className="font-display font-bold text-2xl lg:text-3xl text-foreground mb-1 tracking-tight">
          Dashboard
        </h1>
        <p className="text-muted-foreground text-sm lg:text-base font-body">
          Overview of your portfolio activity
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {isLoading ? (
          (["contacts", "projects", "latest"] as const).map((k) => (
            <Skeleton key={k} className="h-24 rounded-2xl" />
          ))
        ) : (
          <>
            <StatCard
              label="Total Contacts"
              value={totalContacts}
              icon={Users}
              accent="cyan"
            />
            <StatCard
              label="Total Projects"
              value={totalProjects}
              icon={FolderOpen}
              accent="gold"
            />
            <StatCard
              label="Latest (Today)"
              value={latestCount}
              icon={TrendingUp}
              accent="green"
            />
          </>
        )}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Bar chart — contacts per day */}
        <div
          className="xl:col-span-2 rounded-2xl border p-6"
          style={{
            background: "oklch(0.14 0.015 48)",
            borderColor: "oklch(0.28 0.018 48 / 0.6)",
          }}
          data-ocid="chart-contacts-bar"
        >
          <div className="flex items-center gap-2 mb-5">
            <BarChart2 size={16} style={{ color: "oklch(0.72 0.22 210)" }} />
            <p className="font-display font-semibold text-sm text-foreground">
              Contacts — Last 30 Days
            </p>
          </div>
          {isLoading ? (
            <Skeleton className="h-52 rounded-xl" />
          ) : barData.length === 0 ? (
            <div className="h-52 flex items-center justify-center text-muted-foreground text-sm">
              No contact data yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={210}>
              <BarChart data={barData} barSize={14}>
                <XAxis
                  dataKey="date"
                  tick={{ fill: "oklch(0.50 0.010 55)", fontSize: 10 }}
                  axisLine={{ stroke: "oklch(0.28 0.018 48)" }}
                  tickLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{ fill: "oklch(0.50 0.010 55)", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip content={<BarTooltip />} />
                <Bar
                  dataKey="count"
                  radius={[4, 4, 0, 0]}
                  isAnimationActive
                  animationDuration={1200}
                  animationEasing="ease-out"
                  fill="url(#barGradient)"
                />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor="oklch(0.72 0.22 210)"
                      stopOpacity={0.9}
                    />
                    <stop
                      offset="100%"
                      stopColor="oklch(0.72 0.18 50)"
                      stopOpacity={0.7}
                    />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Donut chart — projects by category */}
        <div
          className="rounded-2xl border p-6"
          style={{
            background: "oklch(0.14 0.015 48)",
            borderColor: "oklch(0.28 0.018 48 / 0.6)",
          }}
          data-ocid="chart-projects-donut"
        >
          <div className="flex items-center gap-2 mb-5">
            <FolderOpen size={16} style={{ color: "oklch(0.72 0.18 50)" }} />
            <p className="font-display font-semibold text-sm text-foreground">
              Projects by Category
            </p>
          </div>
          {isLoading ? (
            <Skeleton className="h-52 rounded-xl" />
          ) : pieData.length === 0 ? (
            <div className="h-52 flex items-center justify-center text-muted-foreground text-sm">
              No projects yet
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <ResponsiveContainer width="100%" height={170}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={78}
                    paddingAngle={3}
                    dataKey="value"
                    isAnimationActive
                    animationBegin={200}
                    animationDuration={1400}
                    animationEasing="ease-out"
                  >
                    {pieData.map((entry, idx) => (
                      <Cell
                        key={`cell-${entry.name}`}
                        fill={PIE_COLORS[idx % PIE_COLORS.length]}
                        stroke="transparent"
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              {/* Legend */}
              <ul className="space-y-1.5 w-full mt-1">
                {pieData.map((item, idx) => (
                  <li
                    key={item.name}
                    className="flex items-center justify-between text-xs"
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{
                          background: PIE_COLORS[idx % PIE_COLORS.length],
                        }}
                      />
                      <span className="text-muted-foreground">{item.name}</span>
                    </span>
                    <span
                      className="font-mono font-semibold"
                      style={{ color: PIE_COLORS[idx % PIE_COLORS.length] }}
                    >
                      {item.value}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
