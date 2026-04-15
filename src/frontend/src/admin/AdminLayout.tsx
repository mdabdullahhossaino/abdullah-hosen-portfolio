import { Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  BarChart2,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Mail,
} from "lucide-react";
import { useAdmin } from "./AdminContext";
import { AdminLogin } from "./AdminLogin";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    href: "/ridoy/dashboard",
    icon: LayoutDashboard,
    ocid: "admin-nav-dashboard",
  },
  {
    label: "Projects",
    href: "/ridoy/projects",
    icon: FolderKanban,
    ocid: "admin-nav-projects",
  },
  {
    label: "Contacts",
    href: "/ridoy/contacts",
    icon: Mail,
    ocid: "admin-nav-contacts",
  },
];

export function AdminLayout() {
  const { adminToken, logout } = useAdmin();
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  if (!adminToken) {
    return <AdminLogin />;
  }

  function handleLogout() {
    logout();
    navigate({ to: "/ridoy" });
  }

  return (
    <div
      className="min-h-screen flex"
      style={{ background: "oklch(0.09 0.010 48)" }}
      data-ocid="admin-layout"
    >
      {/* Sidebar */}
      <aside
        className="w-60 shrink-0 flex flex-col border-r border-border/40 min-h-screen sticky top-0 h-screen"
        style={{ background: "oklch(0.11 0.014 48)" }}
      >
        {/* Logo */}
        <div className="px-5 py-6 border-b border-border/30">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-sm shrink-0"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.72 0.18 50 / 0.2), oklch(0.72 0.22 210 / 0.2))",
                border: "1px solid oklch(0.72 0.18 50 / 0.25)",
              }}
            >
              <BarChart2 size={16} style={{ color: "oklch(0.72 0.18 50)" }} />
            </div>
            <div>
              <p
                className="font-display font-bold text-sm lg:text-base leading-none mb-0.5 tracking-tight"
                style={{ color: "oklch(0.72 0.18 50)" }}
              >
                Admin Panel
              </p>
              <p className="text-xs font-accent text-muted-foreground">
                Abdullah Hosen
              </p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav
          className="flex-1 px-3 py-4 flex flex-col gap-1"
          aria-label="Admin navigation"
        >
          {NAV_ITEMS.map(({ label, href, icon: Icon, ocid }) => {
            const active =
              currentPath === href || currentPath.startsWith(`${href}/`);
            return (
              <button
                key={href}
                type="button"
                onClick={() => navigate({ to: href })}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm lg:text-base font-accent transition-all duration-200 w-full text-left"
                style={{
                  background: active
                    ? "oklch(0.72 0.18 50 / 0.15)"
                    : "transparent",
                  color: active
                    ? "oklch(0.72 0.18 50)"
                    : "oklch(0.60 0.010 55)",
                  border: active
                    ? "1px solid oklch(0.72 0.18 50 / 0.2)"
                    : "1px solid transparent",
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLButtonElement).style.color =
                      "oklch(0.80 0.010 60)";
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "oklch(0.72 0.18 50 / 0.06)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLButtonElement).style.color =
                      "oklch(0.60 0.010 55)";
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "transparent";
                  }
                }}
                data-ocid={ocid}
              >
                <Icon size={16} />
                {label}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-border/30">
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm lg:text-base font-accent w-full transition-all duration-200"
            style={{ color: "oklch(0.55 0.22 25)" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "oklch(0.55 0.22 25 / 0.1)";
              (e.currentTarget as HTMLButtonElement).style.color =
                "oklch(0.70 0.22 25)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "transparent";
              (e.currentTarget as HTMLButtonElement).style.color =
                "oklch(0.55 0.22 25)";
            }}
            data-ocid="admin-logout"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 overflow-auto" data-ocid="admin-content">
        <Outlet />
      </main>
    </div>
  );
}
