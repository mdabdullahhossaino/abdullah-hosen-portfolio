import { createActor } from "@/backend";
import type { Project } from "@/backend.d";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Edit2,
  FolderOpen,
  ImageIcon,
  Loader2,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

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

// ── Image upload input ─────────────────────────────────────────────────────
function ImageUploadArea({
  images,
  onAdd,
  onRemove,
  uploading,
}: {
  images: string[];
  onAdd: (url: string) => void;
  onRemove: (idx: number) => void;
  uploading: boolean;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [localUploading, setLocalUploading] = useState(false);

  async function handleFiles(files: FileList | null) {
    if (!files) return;
    setLocalUploading(true);
    for (const file of Array.from(files)) {
      // Use object URL for preview; in production this would use object-storage extension
      const url = URL.createObjectURL(file);
      onAdd(url);
    }
    setLocalUploading(false);
  }

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
        <ImageIcon size={28} style={{ color: "oklch(0.50 0.010 55)" }} />
        <p className="text-sm text-muted-foreground">
          {localUploading || uploading
            ? "Uploading…"
            : "Click to upload images"}
        </p>
        <p
          className="text-[10px] font-mono"
          style={{ color: "oklch(0.40 0.008 55)" }}
        >
          PNG, JPG, WEBP supported
        </p>
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
        data-ocid="input-image-files"
      />
      {images.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {images.map((url, idx) => (
            <div
              key={`img-${idx}-${url.slice(-8)}`}
              className="relative group w-20 h-20 rounded-xl overflow-hidden border"
              style={{ borderColor: "oklch(0.28 0.018 48)" }}
            >
              <img
                src={url}
                alt={`Project preview ${idx + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-smooth"
                style={{ background: "oklch(0.05 0.010 48 / 0.7)" }}
                onClick={() => onRemove(idx)}
                aria-label="Remove image"
              >
                <X size={18} style={{ color: "oklch(0.65 0.22 25)" }} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Project card ───────────────────────────────────────────────────────────
function ProjectCard({
  project,
  onEdit,
  onDelete,
  deleting,
}: {
  project: Project;
  onEdit: () => void;
  onDelete: () => void;
  deleting: boolean;
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
            className="h-8 w-8 p-0 rounded-lg hover:bg-destructive/10 hover:text-destructive"
            onClick={onDelete}
            disabled={deleting}
            aria-label="Delete project"
            data-ocid={`btn-delete-project-${String(project.id)}`}
          >
            {deleting ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <Trash2 size={12} />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
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
  initial: ProjectFormState & { id?: bigint };
  onSave: (data: ProjectFormState & { id?: bigint }) => void;
  saving: boolean;
}) {
  const [form, setForm] = useState<ProjectFormState & { id?: bigint }>(initial);

  function set<K extends keyof ProjectFormState>(
    key: K,
    val: ProjectFormState[K],
  ) {
    setForm((p) => ({ ...p, [key]: val }));
  }

  const isEdit = !!initial.id;
  const valid = form.title.trim() && form.description.trim() && form.category;

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
            </Label>
            <ImageUploadArea
              images={form.imageUrls}
              onAdd={(url) => set("imageUrls", [...form.imageUrls, url])}
              onRemove={(idx) =>
                set(
                  "imageUrls",
                  form.imageUrls.filter((_, i) => i !== idx),
                )
              }
              uploading={false}
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
              onClick={() => onSave(form)}
              disabled={!valid || saving}
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
              {saving ? <Loader2 size={14} className="animate-spin" /> : null}
              {isEdit ? "Save Changes" : "Add Project"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Main component ─────────────────────────────────────────────────────────
export function AdminProjects() {
  const token = localStorage.getItem("admin_token") ?? "";
  const { actor, isFetching: actorLoading } = useActor(createActor);
  const qc = useQueryClient();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<
    (ProjectFormState & { id?: bigint }) | null
  >(null);
  const [deletingId, setDeletingId] = useState<bigint | null>(null);

  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      return actor.getProjects();
    },
    enabled: !!actor && !actorLoading,
  });

  const createMutation = useMutation({
    mutationFn: async (data: ProjectFormState) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.createProject(
        token,
        data.title,
        data.description,
        data.category,
        data.imageUrls,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project created successfully");
      setModalOpen(false);
    },
    onError: () => toast.error("Failed to create project"),
  });

  const updateMutation = useMutation({
    mutationFn: async (data: ProjectFormState & { id: bigint }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updateProject(
        token,
        data.id,
        data.title,
        data.description,
        data.category,
        data.imageUrls,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project updated successfully");
      setEditing(null);
    },
    onError: () => toast.error("Failed to update project"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteProject(token, id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project deleted");
      setDeletingId(null);
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

  async function handleSave(data: ProjectFormState & { id?: bigint }) {
    if (data.id !== undefined) {
      await updateMutation.mutateAsync({ ...data, id: data.id });
    } else {
      await createMutation.mutateAsync(data);
    }
  }

  function handleDelete(id: bigint) {
    setDeletingId(id);
    deleteMutation.mutate(id);
  }

  const isSaving = createMutation.isPending || updateMutation.isPending;
  const activeModal = editing ?? { ...EMPTY_FORM };

  return (
    <div className="space-y-6" data-ocid="admin-projects">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-foreground mb-1">
            Projects
          </h1>
          <p className="text-muted-foreground text-sm">
            {projects.length} project{projects.length !== 1 ? "s" : ""} · all
            shown on public portfolio
          </p>
        </div>
        <Button
          onClick={openCreate}
          className="gap-2 font-display shrink-0"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.72 0.18 50), oklch(0.68 0.16 38))",
            color: "oklch(0.08 0.012 50)",
            boxShadow: "0 4px 20px -4px oklch(0.72 0.18 50 / 0.5)",
          }}
          data-ocid="btn-add-project"
        >
          <Plus size={15} />
          Add Project
        </Button>
      </div>

      {/* Grid */}
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
            Add your first project to showcase your work
          </p>
          <Button
            onClick={openCreate}
            className="gap-2 font-display"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.72 0.18 50), oklch(0.68 0.16 38))",
              color: "oklch(0.08 0.012 50)",
            }}
          >
            <Plus size={14} />
            Add First Project
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {projects.map((p) => (
            <ProjectCard
              key={String(p.id)}
              project={p}
              onEdit={() => openEdit(p)}
              onDelete={() => handleDelete(p.id)}
              deleting={deletingId === p.id && deleteMutation.isPending}
            />
          ))}
        </div>
      )}

      {/* Modal */}
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
    </div>
  );
}
