import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface ProjectFormData {
  id?: number;
  title: string;
  description: string;
  repoUrl?: string;
  tags?: string[];
}

interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProjectFormData) => Promise<void>;
  initialData?: Partial<ProjectFormData>;
  loading?: boolean;
}

export default function ProjectFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  loading,
}: ProjectFormModalProps) {
  const [form, setForm] = useState<Partial<ProjectFormData>>(initialData || {});
  const [error, setError] = useState("");

  useEffect(() => {
    setForm(initialData || {});
  }, [initialData]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.description) {
      setError("Title and Description are required.");
      return;
    }
    setError("");
    await onSubmit(form as ProjectFormData);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-background p-6 rounded-lg w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4">{form.id ? "Edit Project" : "New Project"}</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            placeholder="Title"
            value={form.title || ""}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <textarea
            placeholder="Description"
            className="w-full p-2 rounded bg-muted/10"
            rows={4}
            value={form.description || ""}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <Input
            placeholder="Repo URL"
            value={form.repoUrl || ""}
            onChange={(e) => setForm({ ...form, repoUrl: e.target.value })}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : form.id ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
