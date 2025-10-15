import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface PostFormData {
  id?: number;
  title: string;
  excerpt: string;
  author: string;
  coverImage: string;
  publishedAt?: string;
  tags?: string[];
}

interface PostFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PostFormData) => Promise<void>;
  initialData?: Partial<PostFormData>;
  loading?: boolean;
}

export default function PostFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  loading,
}: PostFormModalProps) {
  const [form, setForm] = useState<Partial<PostFormData>>(initialData || {});
  const [error, setError] = useState("");

  useEffect(() => {
    setForm(initialData || {});
  }, [initialData]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.author) {
      setError("Title and Author are required.");
      return;
    }
    setError("");
    await onSubmit(form as PostFormData);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-background p-6 rounded-lg w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4">{form.id ? "Edit Post" : "New Post"}</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            placeholder="Title"
            value={form.title || ""}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <Input
            placeholder="Author"
            value={form.author || ""}
            onChange={(e) => setForm({ ...form, author: e.target.value })}
          />
          <Input
            placeholder="Excerpt"
            value={form.excerpt || ""}
            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
          />
          <Input
            placeholder="Cover Image URL"
            value={form.coverImage || ""}
            onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
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
