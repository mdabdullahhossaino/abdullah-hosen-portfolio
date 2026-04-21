// API-based service — replaces localStorage with calls to /api.php (PHP + MySQL)
// All function signatures are identical to the previous localStorage version.
// Only the admin session token is kept in localStorage (not actual data).

const API_BASE = "/api.php";

// ── Storage key for session token only ───────────────────────────────────────
const TOKEN_KEY = "admin_token";

// ── Exported types ────────────────────────────────────────────────────────────

export interface Project {
  id: number;
  title: string;
  description: string;
  category: string;
  imageUrls: string[];
  createdAt: number;
}

export interface ContactSubmission {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: number;
  service?: string;
}

export interface DashboardStats {
  totalContacts: number;
  totalProjects: number;
  contactsLast30Days: { date: string; count: number }[];
  projectsByCategory: { category: string; count: number }[];
}

export type LoginResult =
  | { __kind__: "ok"; ok: string }
  | { __kind__: "err"; err: string };

// ── Core fetch helper ─────────────────────────────────────────────────────────
async function api<T>(body: Record<string, unknown>): Promise<T> {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  const data = (await res.json()) as T;
  return data;
}

// ── Auth ──────────────────────────────────────────────────────────────────────
export async function adminLogin(
  username: string,
  password: string,
): Promise<LoginResult> {
  try {
    const data = await api<{
      success: boolean;
      token?: string;
      error?: string;
    }>({
      action: "login",
      username,
      password,
    });
    if (data.success && data.token) {
      localStorage.setItem(TOKEN_KEY, data.token);
      return { __kind__: "ok", ok: data.token };
    }
    return { __kind__: "err", err: data.error ?? "Invalid credentials" };
  } catch {
    return { __kind__: "err", err: "Network error — could not reach server" };
  }
}

export async function validateToken(token: string): Promise<boolean> {
  try {
    const data = await api<{ success: boolean; valid?: boolean }>({
      action: "validate_token",
      token,
    });
    return data.success && data.valid === true;
  } catch {
    return false;
  }
}

// ── Projects ──────────────────────────────────────────────────────────────────
export async function getProjects(): Promise<Project[]> {
  try {
    const data = await api<{ success: boolean; projects?: Project[] }>({
      action: "get_projects",
    });
    return data.success && data.projects ? data.projects : [];
  } catch {
    return [];
  }
}

export async function getProject(id: number): Promise<Project | null> {
  try {
    const projects = await getProjects();
    return projects.find((p) => p.id === id) ?? null;
  } catch {
    return null;
  }
}

export async function createProject(
  token: string,
  title: string,
  description: string,
  category: string,
  imageUrls: string[],
): Promise<Project | null> {
  try {
    const data = await api<{ success: boolean; project?: Project }>({
      action: "create_project",
      token,
      title,
      description,
      category,
      imageUrls,
    });
    return data.success && data.project ? data.project : null;
  } catch {
    return null;
  }
}

export async function updateProject(
  token: string,
  id: number,
  title: string,
  description: string,
  category: string,
  imageUrls: string[],
): Promise<boolean> {
  try {
    const data = await api<{ success: boolean }>({
      action: "update_project",
      token,
      id,
      title,
      description,
      category,
      imageUrls,
    });
    return data.success === true;
  } catch {
    return false;
  }
}

export async function deleteProject(
  token: string,
  id: number,
): Promise<boolean> {
  try {
    const data = await api<{ success: boolean }>({
      action: "delete_project",
      token,
      id,
    });
    return data.success === true;
  } catch {
    return false;
  }
}

// ── Contacts ──────────────────────────────────────────────────────────────────
export async function submitContact(
  name: string,
  email: string,
  subject: string,
  message: string,
  service?: string,
): Promise<ContactSubmission> {
  try {
    const data = await api<{ success: boolean; contact?: ContactSubmission }>({
      action: "submit_contact",
      name,
      email,
      subject,
      message,
      service: service ?? "",
    });
    if (data.success && data.contact) {
      return data.contact;
    }
    // API responded but no contact — still treat as success with a fallback shape
    return {
      id: Date.now(),
      name,
      email,
      subject,
      message,
      timestamp: Date.now(),
      service,
    };
  } catch {
    // Network or server error — throw so the caller can show an error state
    throw new Error("Failed to submit contact form");
  }
}

export async function getContacts(token: string): Promise<ContactSubmission[]> {
  try {
    const data = await api<{
      success: boolean;
      contacts?: ContactSubmission[];
    }>({
      action: "get_contacts",
      token,
    });
    return data.success && data.contacts ? data.contacts : [];
  } catch {
    return [];
  }
}

export async function deleteContact(
  token: string,
  id: number,
): Promise<boolean> {
  try {
    const data = await api<{ success: boolean }>({
      action: "delete_contact",
      token,
      id,
    });
    return data.success === true;
  } catch {
    return false;
  }
}

export async function getContactCount(): Promise<number> {
  try {
    const contacts = await getContacts(localStorage.getItem(TOKEN_KEY) ?? "");
    return contacts.length;
  } catch {
    return 0;
  }
}

// ── Dashboard stats ───────────────────────────────────────────────────────────
export async function getDashboardStats(
  token: string,
): Promise<DashboardStats> {
  const empty: DashboardStats = {
    totalContacts: 0,
    totalProjects: 0,
    contactsLast30Days: [],
    projectsByCategory: [],
  };
  try {
    const data = await api<{
      success: boolean;
      stats?: {
        totalProjects: number;
        totalContacts: number;
        contactsPerDay: { date: string; count: number }[];
        projectsByCategory: { category: string; count: number }[];
      };
    }>({
      action: "get_dashboard_stats",
      token,
    });
    if (!data.success || !data.stats) return empty;
    return {
      totalContacts: data.stats.totalContacts,
      totalProjects: data.stats.totalProjects,
      contactsLast30Days: data.stats.contactsPerDay,
      projectsByCategory: data.stats.projectsByCategory,
    };
  } catch {
    return empty;
  }
}
