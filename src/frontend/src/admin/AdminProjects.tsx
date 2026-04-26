import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import type { Project } from "@/services/staticService";
import {
  createProject,
  deleteProject,
  getProjects,
  updateProject,
  uploadProjectImage,
} from "@/services/staticService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  AlertTriangle,
  Download,
  Edit2,
  FolderOpen,
  ImageIcon,
  Loader2,
  Plus,
  RefreshCw,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import * as XLSX from "xlsx";

const CATEGORIES = [
  "WordPress",
  "Frontend",
  "Performance",
  "Security",
  "AI",
] as const;

type Category = (typeof CATEGORIES)[number];

interface ProjectFormState {
  title: string;
  description: string;
  category: Category;
  imageUrls: string[];
}

const EMPTY_FORM: ProjectFormState = {
  title: "",
  description: "",
  category: "WordPress",
  imageUrls: [],
};

const CATEGORY_COLORS: Record<string, string> = {
  WordPress: "oklch(0.72 0.18 50)",
  Frontend: "oklch(0.72 0.22 210)",
  Performance: "oklch(0.68 0.20 150)",
  Security: "oklch(0.65 0.22 25)",
  AI: "oklch(0.70 0.20 300)",
};

// Represents a slot in the image list — either uploading, failed, or done
type ImageSlot =
  | { status: "uploading"; file: File; localUrl: string }
  | { status: "error"; file: File; localUrl: string; message: string }
  | { status: "done"; url: string };

// ── Excel export helper ────────────────────────────────────────────────────
function exportProjectsToExcel(projects: Project[]) {
  const rows = projects.map((p) => ({
    ID: String(p.id),
    Title: p.title,
    Category: p.category,
    Description: p.description,
    "Image URLs": p.imageUrls.join(";"),
    "Created Date": new Date(p.createdAt).toISOString().split("T")[0],
  }));

  const ws = XLSX.utils.json_to_sheet(rows);
  ws["!cols"] = [
    { wch: 20 },
    { wch: 40 },
    { wch: 14 },
    { wch: 60 },
    { wch: 80 },
    { wch: 14 },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Projects");

  const today = new Date().toISOString().split("T")[0];
  XLSX.writeFile(wb, `projects-export-${today}.xlsx`);
}

// ── Image upload area (with per-image server upload + loading states) ──────
function ImageUploadArea({
  slots,
  onSlotsChange,
}: {
  slots: ImageSlot[];
  onSlotsChange: (
    next: ImageSlot[] | ((prev: ImageSlot[]) => ImageSlot[]),
  ) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);

    // Build uploading slots immediately — user sees local previews right away
    const newSlots: ImageSlot[] = fileArray.map((f) => ({
      status: "uploading",
      file: f,
      localUrl: URL.createObjectURL(f),
    }));

    // Capture start index before state update
    let startIndex = 0;
    onSlotsChange((prev) => {
      startIndex = prev.length;
      return [...prev, ...newSlots];
    });

    // Upload each file and update its slot when done
    for (let i = 0; i < fileArray.length; i++) {
      const slotIndex = startIndex + i;
      try {
        const url = await uploadProjectImage(fileArray[i]);
        onSlotsChange((prev) => {
          const next = [...prev];
          const old = next[slotIndex];
          if (old && (old.status === "uploading" || old.status === "error")) {
            URL.revokeObjectURL(old.localUrl);
          }
          next[slotIndex] = { status: "done", url };
          return next;
        });
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Upload failed";
        onSlotsChange((prev) => {
          const next = [...prev];
          const old = next[slotIndex];
          if (old && old.status === "uploading") {
            next[slotIndex] = {
              status: "error",
              file: old.file,
              localUrl: old.localUrl,
              message: msg,
            };
          }
          return next;
        });
      }
    }
  }

  async function retrySlot(
    idx: number,
    slot: Extract<ImageSlot, { status: "error" }>,
  ) {
    const file = slot.file;
    onSlotsChange((prev) => {
      const next = [...prev];
      next[idx] = { status: "uploading", file, localUrl: slot.localUrl };
      return next;
    });

    try {
      const url = await uploadProjectImage(file);
      onSlotsChange((prev) => {
        const next = [...prev];
        const old = next[idx];
        if (old && (old.status === "uploading" || old.status === "error")) {
          URL.revokeObjectURL(old.localUrl);
        }
        next[idx] = { status: "done", url };
        return next;
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Upload failed";
      onSlotsChange((prev) => {
        const next = [...prev];
        next[idx] = {
          status: "error",
          file,
          localUrl: slot.localUrl,
          message: msg,
        };
        return next;
      });
    }
  }

  function removeSlot(idx: number) {
    onSlotsChange((prev) => {
      const slot = prev[idx];
      if (slot && (slot.status === "uploading" || slot.status === "error")) {
        URL.revokeObjectURL(slot.localUrl);
      }
      return prev.filter((_, i) => i !== idx);
    });
  }

  const hasUploading = slots.some((s) => s.status === "uploading");

  return (
    <div className="space-y-3">
      <button
        type="button"
        className="w-full rounded-xl border-2 border-dashed p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-smooth hover:border-primary/50 hover:bg-primary/5"
        style={{ borderColor: "oklch(0.28 0.018 48)" }}
        onClick={() => fileRef.current?.click()}
        aria-label="Upload project visuals"
        data-ocid="image-upload-area"
      >
        {hasUploading ? (
          <Loader2
            size={28}
            className="animate-spin"
            style={{ color: "oklch(0.72 0.18 50)" }}
          />
        ) : (
          <ImageIcon size={28} style={{ color: "oklch(0.50 0.010 55)" }} />
        )}
        <p className="text-sm text-muted-foreground">
          {hasUploading ? "Uploading to server…" : "Click to upload images"}
        </p>
        <p
          className="text-[10px] font-mono"
          style={{ color: "oklch(0.40 0.008 55)" }}
        >
          PNG, JPG, WEBP · max 5 MB · saved permanently to server
        </p>
      </button>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = "";
        }}
        data-ocid="input-image-files"
      />

      {slots.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {slots.map((slot, idx) => {
            const previewSrc =
              slot.status === "done" ? slot.url : slot.localUrl;
            const stableKey =
              slot.status === "done"
                ? `done-${slot.url}`
                : `${slot.status}-${slot.localUrl}`;

            return (
              <div
                key={stableKey}
                className="relative group w-20 h-20 rounded-xl overflow-hidden border"
                style={{ borderColor: "oklch(0.28 0.018 48)" }}
              >
                <img
                  src={previewSrc}
                  alt={`Project preview ${idx + 1}`}
                  className="w-full h-full object-cover"
                />

                {/* Uploading overlay */}
                {slot.status === "uploading" && (
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ background: "oklch(0.05 0.010 48 / 0.72)" }}
                  >
                    <Loader2
                      size={20}
                      className="animate-spin"
                      style={{ color: "oklch(0.72 0.18 50)" }}
                    />
                  </div>
                )}

                {/* Error overlay */}
                {slot.status === "error" && (
                  <div
                    className="absolute inset-0 flex flex-col items-center justify-center gap-1 p-1"
                    style={{ background: "oklch(0.05 0.010 48 / 0.85)" }}
                    title={slot.message}
                  >
                    <AlertCircle
                      size={14}
                      style={{ color: "oklch(0.65 0.22 25)" }}
                    />
                    <button
                      type="button"
                      onClick={() => retrySlot(idx, slot)}
                      className="rounded text-[9px] px-1.5 py-0.5 font-mono flex items-center gap-1"
                      style={{
                        background: "oklch(0.72 0.18 50 / 0.25)",
                        color: "oklch(0.72 0.18 50)",
                      }}
                      aria-label="Retry upload"
                    >
                      <RefreshCw size={8} />
                      Retry
                    </button>
                  </div>
                )}

                {/* Remove button — shown on hover when not uploading */}
                {slot.status !== "uploading" && (
                  <button
                    type="button"
                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-smooth rounded-full p-0.5"
                    style={{ background: "oklch(0.05 0.010 48 / 0.8)" }}
                    onClick={() => removeSlot(idx)}
                    aria-label="Remove image"
                  >
                    <X size={12} style={{ color: "oklch(0.65 0.22 25)" }} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Delete confirm dialog ──────────────────────────────────────────────────
function DeleteConfirmDialog({
  open,
  projectTitle,
  onConfirm,
  onCancel,
  deleting,
}: {
  open: boolean;
  projectTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
  deleting: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onCancel()}>
      <DialogContent
        className="max-w-sm border"
        style={{
          background: "oklch(0.14 0.015 48)",
          borderColor: "oklch(0.28 0.018 48 / 0.6)",
        }}
        data-ocid="delete-confirm-dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-foreground flex items-center gap-2">
            <AlertTriangle size={18} style={{ color: "oklch(0.65 0.22 25)" }} />
            Delete Project
          </DialogTitle>
        </DialogHeader>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Are you sure you want to delete{" "}
          <span className="text-foreground font-semibold">
            "{projectTitle}"
          </span>
          ? This cannot be undone.
        </p>
        <DialogFooter className="gap-2 sm:gap-2 pt-2">
          <Button
            variant="outline"
            className="flex-1 border-border/40"
            onClick={onCancel}
            disabled={deleting}
            data-ocid="delete-cancel-button"
          >
            Cancel
          </Button>
          <Button
            className="flex-1 gap-2"
            onClick={onConfirm}
            disabled={deleting}
            style={{
              background: "oklch(0.50 0.22 25)",
              color: "oklch(0.93 0.008 25)",
            }}
            data-ocid="delete-confirm-button"
          >
            {deleting ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <Trash2 size={13} />
            )}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Project card ───────────────────────────────────────────────────────────
function ProjectCard({
  project,
  onEdit,
  onDeleteRequest,
}: {
  project: Project;
  onEdit: () => void;
  onDeleteRequest: () => void;
}) {
  const color = CATEGORY_COLORS[project.category] ?? "oklch(0.72 0.18 50)";
  const thumb = project.imageUrls[0];

  return (
    <div
      className="rounded-2xl border overflow-hidden transition-smooth hover:-translate-y-0.5 card-lift group"
      style={{
        background: "oklch(0.15 0.016 48)",
        borderColor: "oklch(0.28 0.018 48 / 0.5)",
      }}
      data-ocid={`project-card-${String(project.id)}`}
    >
      {/* Thumbnail */}
      <div
        className="w-full h-40 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${color}22, oklch(0.12 0.014 48))`,
        }}
      >
        {thumb ? (
          <img
            src={thumb}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FolderOpen size={36} style={{ color: `${color}88` }} />
          </div>
        )}
        {project.imageUrls.length > 1 && (
          <span
            className="absolute bottom-2 right-2 text-[10px] font-mono px-2 py-0.5 rounded-full"
            style={{
              background: "oklch(0.05 0.010 48 / 0.7)",
              color: "oklch(0.93 0.008 60)",
            }}
          >
            +{project.imageUrls.length - 1} more
          </span>
        )}
      </div>

      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display font-semibold text-foreground text-sm leading-snug line-clamp-2 flex-1">
            {project.title}
          </h3>
          <Badge
            className="shrink-0 text-[10px] font-mono px-2 py-0"
            style={{
              background: `${color}18`,
              color: color,
              border: `1px solid ${color}40`,
            }}
          >
            {project.category}
          </Badge>
        </div>
        <p className="text-muted-foreground text-xs line-clamp-2 leading-relaxed">
          {project.description}
        </p>
        <div className="flex items-center gap-2 pt-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 flex-1 gap-1.5 text-xs rounded-lg hover:bg-accent/10 hover:text-accent"
            onClick={onEdit}
            data-ocid={`btn-edit-project-${String(project.id)}`}
          >
            <Edit2 size={12} />
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5 px-3 text-xs rounded-lg hover:bg-destructive/10 hover:text-destructive"
            onClick={onDeleteRequest}
            aria-label="Delete project"
            data-ocid={`btn-delete-project-${String(project.id)}`}
          >
            <Trash2 size={12} />
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Helpers: convert between string[] and ImageSlot[] ─────────────────────
function slotsToUrls(slots: ImageSlot[]): string[] {
  return slots
    .filter(
      (s): s is Extract<ImageSlot, { status: "done" }> => s.status === "done",
    )
    .map((s) => s.url);
}

function urlsToSlots(urls: string[]): ImageSlot[] {
  return urls.map((url) => ({ status: "done" as const, url }));
}

// ── Project form modal ─────────────────────────────────────────────────────
function ProjectModal({
  open,
  onClose,
  initial,
  onSave,
  saving,
}: {
  open: boolean;
  onClose: () => void;
  initial: ProjectFormState & { id?: number };
  onSave: (data: ProjectFormState & { id?: number }) => void;
  saving: boolean;
}) {
  const [form, setForm] = useState<{
    id?: number;
    title: string;
    description: string;
    category: Category;
    slots: ImageSlot[];
  }>(() => ({
    id: initial.id,
    title: initial.title,
    description: initial.description,
    category: initial.category,
    slots: urlsToSlots(initial.imageUrls),
  }));

  function set<K extends "title" | "description" | "category">(
    key: K,
    val: ProjectFormState[K],
  ) {
    setForm((p) => ({ ...p, [key]: val }));
  }

  const isEdit = !!initial.id;
  const hasUploading = form.slots.some((s) => s.status === "uploading");
  const valid =
    form.title.trim() &&
    form.description.trim() &&
    form.category &&
    !hasUploading;

  function handleSave() {
    onSave({
      id: form.id,
      title: form.title,
      description: form.description,
      category: form.category,
      imageUrls: slotsToUrls(form.slots),
    });
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="max-w-lg border max-h-[90vh] overflow-y-auto scrollbar-thin"
        style={{
          background: "oklch(0.14 0.015 48)",
          borderColor: "oklch(0.28 0.018 48 / 0.6)",
        }}
        data-ocid="project-modal"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-foreground">
            {isEdit ? "Edit Project" : "Add New Project"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Title */}
          <div className="space-y-1.5">
            <Label
              htmlFor="proj-title"
              className="text-[10px] font-mono uppercase tracking-[0.15em] text-muted-foreground"
            >
              Title <span style={{ color: "oklch(0.65 0.22 25)" }}>*</span>
            </Label>
            <Input
              id="proj-title"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="Portfolio Website Redesign"
              className="border-border/40 focus:border-primary/60 text-foreground"
              style={{ background: "oklch(0.10 0.012 48)" }}
              data-ocid="input-proj-title"
            />
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <Label className="text-[10px] font-mono uppercase tracking-[0.15em] text-muted-foreground">
              Category <span style={{ color: "oklch(0.65 0.22 25)" }}>*</span>
            </Label>
            <Select
              value={form.category}
              onValueChange={(v) => set("category", v as Category)}
            >
              <SelectTrigger
                className="border-border/40 text-foreground"
                style={{ background: "oklch(0.10 0.012 48)" }}
                data-ocid="select-proj-category"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent style={{ background: "oklch(0.14 0.015 48)" }}>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label
              htmlFor="proj-desc"
              className="text-[10px] font-mono uppercase tracking-[0.15em] text-muted-foreground"
            >
              Description{" "}
              <span style={{ color: "oklch(0.65 0.22 25)" }}>*</span>
            </Label>
            <Textarea
              id="proj-desc"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Brief description of what was built and technologies used…"
              rows={3}
              className="border-border/40 focus:border-primary/60 text-foreground resize-none"
              style={{ background: "oklch(0.10 0.012 48)" }}
              data-ocid="input-proj-desc"
            />
          </div>

          {/* Images */}
          <div className="space-y-1.5">
            <Label className="text-[10px] font-mono uppercase tracking-[0.15em] text-muted-foreground">
              Images
              {hasUploading && (
                <span
                  className="ml-2 normal-case tracking-normal font-normal"
                  style={{ color: "oklch(0.72 0.18 50)" }}
                >
                  — uploading, please wait…
                </span>
              )}
            </Label>
            <ImageUploadArea
              slots={form.slots}
              onSlotsChange={(next) =>
                setForm((p) => ({
                  ...p,
                  slots: typeof next === "function" ? next(p.slots) : next,
                }))
              }
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1 border-border/40"
              onClick={onClose}
              disabled={saving}
              data-ocid="btn-cancel-project"
            >
              Cancel
            </Button>
            <Button
              className="flex-1 font-display gap-2"
              onClick={handleSave}
              disabled={!valid || saving}
              title={
                hasUploading ? "Wait for images to finish uploading" : undefined
              }
              style={
                valid && !saving
                  ? {
                      background:
                        "linear-gradient(135deg, oklch(0.72 0.18 50), oklch(0.68 0.16 38))",
                      color: "oklch(0.08 0.012 50)",
                    }
                  : undefined
              }
              data-ocid="btn-save-project"
            >
              {saving || hasUploading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : null}
              {isEdit ? "Save Changes" : "Add Project"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Import progress banner ────────────────────────────────────────────────
function ImportProgress({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;
  return (
    <div
      className="rounded-xl border px-4 py-3 flex items-center gap-4"
      style={{
        background: "oklch(0.14 0.018 210 / 0.5)",
        borderColor: "oklch(0.72 0.22 210 / 0.4)",
      }}
      data-ocid="import-progress"
    >
      <Loader2
        size={16}
        className="animate-spin shrink-0"
        style={{ color: "oklch(0.72 0.22 210)" }}
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-display text-foreground">
          Importing {current} of {total} projects…
        </p>
        <div
          className="mt-1.5 h-1.5 rounded-full overflow-hidden"
          style={{ background: "oklch(0.22 0.016 48)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${pct}%`,
              background:
                "linear-gradient(90deg, oklch(0.72 0.22 210), oklch(0.72 0.18 50))",
            }}
          />
        </div>
      </div>
      <span
        className="font-mono text-xs shrink-0"
        style={{ color: "oklch(0.72 0.22 210)" }}
      >
        {pct}%
      </span>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────
export function AdminProjects() {
  const token = localStorage.getItem("admin_token") ?? "";
  const qc = useQueryClient();

  const importFileRef = useRef<HTMLInputElement>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<
    (ProjectFormState & { id?: number }) | null
  >(null);

  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const [importProgress, setImportProgress] = useState<{
    current: number;
    total: number;
  } | null>(null);

  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: () => getProjects(),
  });

  const createMutation = useMutation({
    mutationFn: async (data: ProjectFormState) =>
      createProject(
        token,
        data.title,
        data.description,
        data.category,
        data.imageUrls,
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project created successfully");
      setModalOpen(false);
    },
    onError: () => toast.error("Failed to create project"),
  });

  const updateMutation = useMutation({
    mutationFn: async (data: ProjectFormState & { id: number }) =>
      updateProject(
        token,
        data.id,
        data.title,
        data.description,
        data.category,
        data.imageUrls,
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project updated successfully");
      setEditing(null);
    },
    onError: () => toast.error("Failed to update project"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => deleteProject(token, id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project deleted");
      setConfirmDeleteOpen(false);
      setDeleteTarget(null);
    },
    onError: () => toast.error("Failed to delete project"),
  });

  function openCreate() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(project: Project) {
    setEditing({
      id: project.id,
      title: project.title,
      description: project.description,
      category: project.category as Category,
      imageUrls: project.imageUrls,
    });
  }

  async function handleSave(data: ProjectFormState & { id?: number }) {
    if (data.id !== undefined) {
      await updateMutation.mutateAsync({ ...data, id: data.id });
    } else {
      await createMutation.mutateAsync(data);
    }
  }

  function requestDelete(project: Project) {
    setDeleteTarget(project);
    setConfirmDeleteOpen(true);
  }

  function confirmDelete() {
    if (deleteTarget) {
      deleteMutation.mutate(deleteTarget.id);
    }
  }

  function handleExport() {
    if (projects.length === 0) {
      toast.info("No projects to export");
      return;
    }
    exportProjectsToExcel(projects);
    toast.success(`Exported ${projects.length} projects to Excel`);
  }

  async function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    let rows: Record<string, string>[] = [];

    try {
      const arrayBuffer = await file.arrayBuffer();
      const wb = XLSX.read(arrayBuffer, { type: "array" });
      const wsName = wb.SheetNames[0];
      const ws = wb.Sheets[wsName];
      rows = XLSX.utils.sheet_to_json<Record<string, string>>(ws, {
        defval: "",
      });
    } catch {
      toast.error(
        "Failed to parse file. Please use the exported Excel format.",
      );
      return;
    }

    const valid = rows.filter(
      (r) => (r.Title ?? "").trim() && (r.Category ?? "").trim(),
    );

    if (valid.length === 0) {
      toast.warning(
        "No valid rows found. Make sure columns match: Title, Category, Description, Image URLs",
      );
      return;
    }

    setImportProgress({ current: 0, total: valid.length });
    let imported = 0;

    for (let i = 0; i < valid.length; i++) {
      const r = valid[i];
      const title = (r.Title ?? "").trim();
      const category = (r.Category ?? "WordPress").trim();
      const description = (r.Description ?? "").trim();
      const rawUrls = (r["Image URLs"] ?? "").trim();
      // Only import server-side paths — skip any leftover blob: URLs
      const imageUrls = rawUrls
        ? rawUrls
            .split(";")
            .map((u) => u.trim())
            .filter((u) => u && !u.startsWith("blob:"))
        : [];

      try {
        await createProject(token, title, description, category, imageUrls);
        imported++;
      } catch {
        // skip failed rows
      }

      setImportProgress({ current: i + 1, total: valid.length });
    }

    await qc.invalidateQueries({ queryKey: ["projects"] });
    setImportProgress(null);

    if (imported > 0) {
      toast.success(
        `${imported} project${imported !== 1 ? "s" : ""} imported successfully!`,
      );
    } else {
      toast.error("Import failed — no projects were created.");
    }
  }

  const isSaving = createMutation.isPending || updateMutation.isPending;
  const activeModal = editing ?? { ...EMPTY_FORM };

  return (
    <div className="space-y-6" data-ocid="admin-projects">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-foreground mb-1">
            Projects
          </h1>
          <p className="text-muted-foreground text-sm">
            {projects.length} project{projects.length !== 1 ? "s" : ""} · all
            shown on public portfolio
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            className="gap-2 text-xs font-display border"
            style={{
              borderColor: "oklch(0.72 0.18 50 / 0.5)",
              color: "oklch(0.72 0.18 50)",
              background: "oklch(0.72 0.18 50 / 0.07)",
            }}
            onClick={handleExport}
            disabled={projects.length === 0 || !!importProgress}
            data-ocid="btn-export-excel"
          >
            <Download size={13} />
            Export Excel
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="gap-2 text-xs font-display border"
            style={{
              borderColor: "oklch(0.72 0.22 210 / 0.5)",
              color: "oklch(0.72 0.22 210)",
              background: "oklch(0.72 0.22 210 / 0.07)",
            }}
            onClick={() => importFileRef.current?.click()}
            disabled={!!importProgress}
            data-ocid="btn-import-excel"
          >
            {importProgress ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <Upload size={13} />
            )}
            Import Excel
          </Button>
          <input
            ref={importFileRef}
            type="file"
            accept=".xlsx,.csv"
            className="hidden"
            onChange={handleImportFile}
            data-ocid="input-import-file"
          />

          <Button
            onClick={openCreate}
            size="sm"
            className="gap-2 font-display"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.72 0.18 50), oklch(0.68 0.16 38))",
              color: "oklch(0.08 0.012 50)",
              boxShadow: "0 4px 20px -4px oklch(0.72 0.18 50 / 0.5)",
            }}
            data-ocid="btn-add-project"
          >
            <Plus size={14} />
            Add Project
          </Button>
        </div>
      </div>

      {importProgress && (
        <ImportProgress
          current={importProgress.current}
          total={importProgress.total}
        />
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {(["a", "b", "c", "d", "e", "f"] as const).map((k) => (
            <Skeleton key={k} className="h-64 rounded-2xl" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div
          className="rounded-2xl border flex flex-col items-center justify-center py-20 text-center"
          style={{
            background: "oklch(0.14 0.015 48)",
            borderColor: "oklch(0.28 0.018 48 / 0.6)",
          }}
          data-ocid="projects-empty"
        >
          <FolderOpen size={48} className="mb-4 text-muted-foreground/30" />
          <p className="font-display font-semibold text-foreground mb-2">
            No projects yet
          </p>
          <p className="text-muted-foreground text-sm mb-6">
            Add your first project or import from Excel
          </p>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 font-display border"
              style={{
                borderColor: "oklch(0.72 0.22 210 / 0.5)",
                color: "oklch(0.72 0.22 210)",
              }}
              onClick={() => importFileRef.current?.click()}
              data-ocid="btn-import-excel-empty"
            >
              <Upload size={13} />
              Import Excel
            </Button>
            <Button
              onClick={openCreate}
              className="gap-2 font-display"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.72 0.18 50), oklch(0.68 0.16 38))",
                color: "oklch(0.08 0.012 50)",
              }}
              data-ocid="btn-add-project-empty"
            >
              <Plus size={14} />
              Add First Project
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {projects.map((p) => (
            <ProjectCard
              key={String(p.id)}
              project={p}
              onEdit={() => openEdit(p)}
              onDeleteRequest={() => requestDelete(p)}
            />
          ))}
        </div>
      )}

      {(modalOpen || editing !== null) && (
        <ProjectModal
          open={modalOpen || editing !== null}
          onClose={() => {
            setModalOpen(false);
            setEditing(null);
          }}
          initial={activeModal}
          onSave={handleSave}
          saving={isSaving}
        />
      )}

      <DeleteConfirmDialog
        open={confirmDeleteOpen}
        projectTitle={deleteTarget?.title ?? ""}
        onConfirm={confirmDelete}
        onCancel={() => {
          setConfirmDeleteOpen(false);
          setDeleteTarget(null);
        }}
        deleting={deleteMutation.isPending}
      />
    </div>
  );
}
