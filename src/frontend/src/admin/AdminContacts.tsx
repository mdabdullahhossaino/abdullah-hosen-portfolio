import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ContactSubmission } from "@/services/staticService";
import { deleteContact, getContacts } from "@/services/staticService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Download,
  Mail,
  MailOpen,
  RefreshCw,
  Reply,
  Search,
  Trash2,
  Users,
} from "lucide-react";
import { useState } from "react";

function formatDate(ts: number) {
  const d = new Date(ts);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function exportCSV(contacts: ContactSubmission[]) {
  const headers = ["ID", "Name", "Email", "Subject", "Message", "Date"];
  const rows = contacts.map((c) => [
    String(c.id),
    c.name,
    c.email,
    c.subject,
    `"${c.message.replace(/"/g, '""')}"`,
    formatDate(c.timestamp),
  ]);
  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `contacts-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function replyViaEmail(contact: ContactSubmission) {
  const subject = encodeURIComponent(`Re: ${contact.subject}`);
  const body = encodeURIComponent(
    `Hi ${contact.name},\n\nThank you for reaching out.\n\n---\nOriginal message:\n${contact.message}\n`,
  );
  window.open(
    `mailto:${contact.email}?subject=${subject}&body=${body}`,
    "_self",
  );
}

// ── Read tracking (localStorage) ──────────────────────────────────────────
const READ_KEY = "admin_read_contacts";
function getReadIds(): Set<string> {
  try {
    const raw = localStorage.getItem(READ_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}
function markRead(id: string) {
  const ids = getReadIds();
  ids.add(id);
  localStorage.setItem(READ_KEY, JSON.stringify([...ids]));
}

// ── Row expand ─────────────────────────────────────────────────────────────
function ContactRow({
  contact,
  isRead,
  onMarkRead,
  onDelete,
  isDeleting,
}: {
  contact: ContactSubmission;
  isRead: boolean;
  onMarkRead: (id: string) => void;
  onDelete: (id: number) => void;
  isDeleting: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);
  const idStr = String(contact.id);

  function toggle() {
    if (!isRead) onMarkRead(idStr);
    setExpanded((p) => !p);
  }

  function handleDeleteClick(e: React.MouseEvent) {
    e.stopPropagation();
    setConfirmDel(true);
  }

  function handleConfirmDelete(e: React.MouseEvent) {
    e.stopPropagation();
    onDelete(contact.id);
    setConfirmDel(false);
  }

  function handleCancelDelete(e: React.MouseEvent) {
    e.stopPropagation();
    setConfirmDel(false);
  }

  return (
    <>
      <TableRow
        className="cursor-pointer transition-smooth hover:bg-muted/30"
        onClick={toggle}
        data-ocid={`contact-row-${idStr}`}
        style={{
          borderBottom: expanded ? "none" : undefined,
          opacity: isDeleting ? 0.5 : 1,
          transition: "opacity 0.2s ease",
        }}
      >
        <TableCell className="py-3">
          <div className="flex items-center gap-2">
            {isRead ? (
              <MailOpen size={14} style={{ color: "oklch(0.50 0.010 55)" }} />
            ) : (
              <Mail size={14} style={{ color: "oklch(0.72 0.22 210)" }} />
            )}
            <span
              className="text-sm font-medium"
              style={{
                color: isRead ? "oklch(0.70 0.010 60)" : "oklch(0.93 0.008 60)",
              }}
            >
              {contact.name}
            </span>
          </div>
        </TableCell>
        <TableCell className="py-3">
          <span className="text-sm text-muted-foreground font-mono">
            {contact.email}
          </span>
        </TableCell>
        <TableCell className="py-3">
          <span className="text-sm text-foreground line-clamp-1 max-w-[200px] block">
            {contact.subject}
          </span>
        </TableCell>
        <TableCell className="py-3 hidden md:table-cell">
          <span
            className="text-xs font-mono"
            style={{ color: "oklch(0.50 0.010 55)" }}
          >
            {formatDate(contact.timestamp)}
          </span>
        </TableCell>
        <TableCell className="py-3" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-2 flex-wrap">
            {!isRead && (
              <Badge
                className="text-[10px] font-mono px-2 py-0"
                style={{
                  background: "oklch(0.72 0.22 210 / 0.15)",
                  color: "oklch(0.72 0.22 210)",
                  border: "1px solid oklch(0.72 0.22 210 / 0.3)",
                }}
              >
                New
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 rounded-lg hover:bg-primary/10 hover:text-primary"
              onClick={() => replyViaEmail(contact)}
              aria-label="Reply via email"
              data-ocid={`btn-reply-${idStr}`}
            >
              <Reply size={14} />
            </Button>

            {confirmDel ? (
              <div
                className="flex items-center gap-1.5 rounded-lg px-2 py-1 border"
                style={{
                  background: "oklch(0.18 0.045 15 / 0.9)",
                  borderColor: "oklch(0.55 0.22 15 / 0.5)",
                }}
              >
                <span
                  className="text-[11px] font-mono whitespace-nowrap"
                  style={{ color: "oklch(0.80 0.12 20)" }}
                >
                  Delete?
                </span>
                <button
                  type="button"
                  className="text-[11px] font-bold px-1.5 py-0.5 rounded transition-colors"
                  style={{
                    background: "oklch(0.55 0.22 15)",
                    color: "oklch(0.98 0.005 60)",
                  }}
                  onClick={handleConfirmDelete}
                  aria-label="Confirm delete"
                  data-ocid={`btn-confirm-delete-${idStr}`}
                  disabled={isDeleting}
                >
                  Yes
                </button>
                <button
                  type="button"
                  className="text-[11px] px-1.5 py-0.5 rounded transition-colors"
                  style={{
                    background: "oklch(0.22 0.012 48)",
                    color: "oklch(0.65 0.010 55)",
                  }}
                  onClick={handleCancelDelete}
                  aria-label="Cancel delete"
                  data-ocid={`btn-cancel-delete-${idStr}`}
                >
                  No
                </button>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 rounded-lg transition-colors hover:bg-rose-500/15"
                onClick={handleDeleteClick}
                aria-label={`Delete message from ${contact.name}`}
                data-ocid={`btn-delete-${idStr}`}
                disabled={isDeleting}
              >
                <Trash2 size={14} style={{ color: "oklch(0.62 0.18 15)" }} />
              </Button>
            )}
          </div>
        </TableCell>
      </TableRow>
      {expanded && (
        <TableRow style={{ borderTop: "none" }}>
          <TableCell colSpan={5} className="pb-4 pt-0">
            <div
              className="rounded-xl p-4 text-sm text-foreground leading-relaxed border-l-2"
              style={{
                background: "oklch(0.12 0.014 48)",
                borderLeftColor: "oklch(0.72 0.18 50 / 0.5)",
              }}
            >
              {contact.message}
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

// ── Main component ─────────────────────────────────────────────────────────
export function AdminContacts() {
  const token = localStorage.getItem("admin_token") ?? "";
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [readIds, setReadIds] = useState<Set<string>>(getReadIds);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

  const {
    data: contacts = [],
    isLoading,
    refetch,
  } = useQuery<ContactSubmission[]>({
    queryKey: ["contacts", token],
    queryFn: () => getContacts(token),
    enabled: !!token,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => deleteContact(token, id),
    onMutate: (id: number) => {
      const idStr = String(id);
      setDeletingIds((prev) => new Set([...prev, idStr]));
      // Optimistic update — remove row immediately
      queryClient.setQueryData<ContactSubmission[]>(
        ["contacts", token],
        (old) => (old ?? []).filter((c) => String(c.id) !== idStr),
      );
    },
    onSettled: (_data, _error, id: number) => {
      const idStr = String(id);
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(idStr);
        return next;
      });
      refetch();
    },
  });

  function handleMarkRead(id: string) {
    markRead(id);
    setReadIds(getReadIds());
  }

  const filtered = contacts.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.subject.toLowerCase().includes(q)
    );
  });

  const unreadCount = contacts.filter((c) => !readIds.has(String(c.id))).length;

  return (
    <div className="space-y-6" data-ocid="admin-contacts">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-foreground mb-1 flex items-center gap-2">
            Contact Submissions
            {unreadCount > 0 && (
              <span
                className="inline-flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-mono font-bold"
                style={{
                  background: "oklch(0.72 0.22 210 / 0.15)",
                  color: "oklch(0.72 0.22 210)",
                  border: "1px solid oklch(0.72 0.22 210 / 0.3)",
                }}
              >
                {unreadCount}
              </span>
            )}
          </h1>
          <p className="text-muted-foreground text-sm">
            {contacts.length} total · click a row to read message
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="gap-1.5 border-border/40 hover:border-accent/50 text-muted-foreground hover:text-foreground"
            data-ocid="btn-refresh-contacts"
          >
            <RefreshCw size={13} />
            Refresh
          </Button>
          <Button
            size="sm"
            onClick={() => exportCSV(contacts)}
            disabled={contacts.length === 0}
            className="gap-1.5 font-display"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.72 0.18 50), oklch(0.68 0.16 38))",
              color: "oklch(0.08 0.012 50)",
            }}
            data-ocid="btn-export-csv"
          >
            <Download size={13} />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          placeholder="Search by name, email or subject…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-8 text-sm border-border/40 focus:border-accent/50"
          style={{ background: "oklch(0.12 0.014 48)" }}
          data-ocid="input-contact-search"
        />
      </div>

      {/* Table */}
      <div
        className="rounded-2xl border overflow-hidden"
        style={{
          background: "oklch(0.14 0.015 48)",
          borderColor: "oklch(0.28 0.018 48 / 0.6)",
        }}
      >
        {isLoading ? (
          <div className="p-6 space-y-3">
            {(["a", "b", "c", "d", "e"] as const).map((k) => (
              <Skeleton key={k} className="h-12 rounded-xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-16 text-center"
            data-ocid="contacts-empty"
          >
            <Users size={40} className="mb-3 text-muted-foreground/30" />
            <p className="font-display font-semibold text-foreground mb-1">
              {search ? "No matches found" : "No contacts yet"}
            </p>
            <p className="text-muted-foreground text-sm">
              {search
                ? "Try a different search term"
                : "Contact form submissions will appear here"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto scrollbar-thin">
            <Table>
              <TableHeader>
                <TableRow
                  style={{
                    borderColor: "oklch(0.28 0.018 48 / 0.5)",
                    background: "oklch(0.12 0.014 48)",
                  }}
                >
                  <TableHead
                    className="text-[10px] font-mono uppercase tracking-[0.15em]"
                    style={{ color: "oklch(0.50 0.010 55)" }}
                  >
                    Name
                  </TableHead>
                  <TableHead
                    className="text-[10px] font-mono uppercase tracking-[0.15em]"
                    style={{ color: "oklch(0.50 0.010 55)" }}
                  >
                    Email
                  </TableHead>
                  <TableHead
                    className="text-[10px] font-mono uppercase tracking-[0.15em]"
                    style={{ color: "oklch(0.50 0.010 55)" }}
                  >
                    Subject
                  </TableHead>
                  <TableHead
                    className="text-[10px] font-mono uppercase tracking-[0.15em] hidden md:table-cell"
                    style={{ color: "oklch(0.50 0.010 55)" }}
                  >
                    Date
                  </TableHead>
                  <TableHead
                    className="text-[10px] font-mono uppercase tracking-[0.15em]"
                    style={{ color: "oklch(0.50 0.010 55)" }}
                  >
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((c) => (
                  <ContactRow
                    key={String(c.id)}
                    contact={c}
                    isRead={readIds.has(String(c.id))}
                    onMarkRead={handleMarkRead}
                    onDelete={(id) => deleteMutation.mutate(id)}
                    isDeleting={deletingIds.has(String(c.id))}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
