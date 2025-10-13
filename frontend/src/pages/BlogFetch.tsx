import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogCard from "@/components/BlogCard";
import { Button } from "@/components/ui/button";
import { Plus, Edit2, Trash2 } from "lucide-react";
import PostFormModal, { PostFormData } from "@/components/PostFormModal";
import ProjectFormModal, { ProjectFormData } from "@/components/ProjectFormModal";

const API_BASE = "http://127.0.0.1:8000/api/blog";

export default function BlogFetch() {
  const [posts, setPosts] = useState<PostFormData[]>([]);
  const [projects, setProjects] = useState<ProjectFormData[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editPost, setEditPost] = useState<PostFormData | null>(null);
  const [editProject, setEditProject] = useState<ProjectFormData | null>(null);

  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    setLoading(true);
    try {
      const [postRes, projRes] = await Promise.all([
        fetch(`${API_BASE}/posts/`),
        fetch(`${API_BASE}/projects/`),
      ]);
      setPosts(await postRes.json());
      setProjects(await projRes.json());
    } finally {
      setLoading(false);
    }
  }

  async function savePost(data: PostFormData) {
    setLoading(true);
    try {
      const url = data.id ? `${API_BASE}/posts/${data.id}/` : `${API_BASE}/posts/`;
      const method = data.id ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (data.id) {
        setPosts(posts.map((p) => (p.id === data.id ? result : p)));
      } else {
        setPosts([result, ...posts]);
      }
    } finally {
      setLoading(false);
      setShowPostModal(false);
      setEditPost(null);
    }
  }

  async function deletePost(id: number) {
    if (!confirm("Delete this post?")) return;
    await fetch(`${API_BASE}/posts/${id}/`, { method: "DELETE" });
    setPosts(posts.filter((p) => p.id !== id));
  }

  async function saveProject(data: ProjectFormData) {
    setLoading(true);
    try {
      const url = data.id ? `${API_BASE}/projects/${data.id}/` : `${API_BASE}/projects/`;
      const method = data.id ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (data.id) {
        setProjects(projects.map((p) => (p.id === data.id ? result : p)));
      } else {
        setProjects([result, ...projects]);
      }
    } finally {
      setLoading(false);
      setShowProjectModal(false);
      setEditProject(null);
    }
  }

  async function deleteProject(id: number) {
    if (!confirm("Delete this project?")) return;
    await fetch(`${API_BASE}/projects/${id}/`, { method: "DELETE" });
    setProjects(projects.filter((p) => p.id !== id));
  }

  return (
    <div>
      <Header />
      <main className="container py-10">
        <div className="flex justify-between mb-6">
          <h1 className="text-3xl font-bold">Blog (Fetch CRUD)</h1>
          <div className="flex space-x-3">
            <Button onClick={() => setShowPostModal(true)}><Plus className="h-4 w-4 mr-2" /> New Post</Button>
            <Button onClick={() => setShowProjectModal(true)}><Plus className="h-4 w-4 mr-2" /> New Project</Button>
          </div>
        </div>

        {loading && <p>Loading...</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((p) => (
            <div key={p.id} className="relative">
              <BlogCard {...p} />
              <div className="absolute top-3 right-3 flex space-x-2">
                <Button size="sm" variant="outline" onClick={() => { setEditPost(p); setShowPostModal(true); }}>
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="destructive" onClick={() => deletePost(p.id!)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />

      <PostFormModal
        isOpen={showPostModal}
        onClose={() => { setShowPostModal(false); setEditPost(null); }}
        onSubmit={savePost}
        initialData={editPost || {}}
        loading={loading}
      />

      <ProjectFormModal
        isOpen={showProjectModal}
        onClose={() => { setShowProjectModal(false); setEditProject(null); }}
        onSubmit={saveProject}
        initialData={editProject || {}}
        loading={loading}
      />
    </div>
  );
}
