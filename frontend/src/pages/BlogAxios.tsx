import axios from "axios";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogCard from "@/components/BlogCard";
import { Button } from "@/components/ui/button";
import { Plus, Edit2, Trash2 } from "lucide-react";
import PostFormModal, { PostFormData } from "@/components/PostFormModal";
import ProjectFormModal, { ProjectFormData } from "@/components/ProjectFormModal";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api/blog/",
  headers: { "Content-Type": "application/json" },
});

export default function BlogAxios() {
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
        API.get("posts/"),
        API.get("projects/"),
      ]);
      setPosts(postRes.data);
      setProjects(projRes.data);
    } finally {
      setLoading(false);
    }
  }

  async function savePost(data: PostFormData) {
    setLoading(true);
    try {
      const res = data.id
        ? await API.put(`posts/${data.id}/`, data)
        : await API.post("posts/", data);
      const newPost = res.data;
      setPosts((prev) =>
        data.id ? prev.map((p) => (p.id === data.id ? newPost : p)) : [newPost, ...prev]
      );
    } finally {
      setLoading(false);
      setShowPostModal(false);
      setEditPost(null);
    }
  }

  async function deletePost(id: number) {
    if (!confirm("Delete this post?")) return;
    await API.delete(`posts/${id}/`);
    setPosts(posts.filter((p) => p.id !== id));
  }

  async function saveProject(data: ProjectFormData) {
    setLoading(true);
    try {
      const res = data.id
        ? await API.put(`projects/${data.id}/`, data)
        : await API.post("projects/", data);
      const newProj = res.data;
      setProjects((prev) =>
        data.id ? prev.map((p) => (p.id === data.id ? newProj : p)) : [newProj, ...prev]
      );
    } finally {
      setLoading(false);
      setShowProjectModal(false);
      setEditProject(null);
    }
  }

  async function deleteProject(id: number) {
    if (!confirm("Delete this project?")) return;
    await API.delete(`projects/${id}/`);
    setProjects(projects.filter((p) => p.id !== id));
  }

  return (
    <div>
      <Header />
      <main className="container py-10">
        <div className="flex justify-between mb-6">
          <h1 className="text-3xl font-bold">Blog (Axios CRUD)</h1>
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
