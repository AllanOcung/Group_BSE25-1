import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogCard from "@/components/BlogCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Calendar, User, Tag, Plus, Edit2, Trash2 } from "lucide-react";
import { useState } from "react";

type Post = {
  title: string;
  excerpt: string;
  coverImage: string;
  author: string;
  authorAvatar: string;
  publishedAt: string;
  readTime?: string;
  tags: string[];
  slug: string;
};

type Project = {
  id: string;
  title: string;
  description: string;
  repoUrl?: string;
  tags?: string[];
};

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // initial posts (kept from original file)
  const initialPosts: Post[] = [
    {
      title: "Building Scalable React Applications: Best Practices for 2024",
      excerpt:
        "Learn the latest patterns and practices for building maintainable React applications that can scale with your team and user base. We'll cover component architecture, state management, and performance optimization.",
      coverImage:
        "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop",
      author: "Emma Wilson",
      authorAvatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
      publishedAt: "Dec 15, 2024",
      readTime: "8 min read",
      tags: ["React", "JavaScript", "Best Practices"],
      slug: "scalable-react-applications",
    },
    {
      title: "The Future of Web Development: Trends to Watch",
      excerpt:
        "Explore the emerging trends in web development, from AI integration to new frameworks and tools that are shaping the industry. Discover what's coming next in the world of frontend development.",
      coverImage:
        "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=250&fit=crop",
      author: "David Kim",
      authorAvatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face",
      publishedAt: "Dec 12, 2024",
      readTime: "6 min read",
      tags: ["Web Development", "Trends", "AI"],
      slug: "future-web-development",
    },
    {
      title: "Machine Learning in Mobile Apps: A Practical Guide",
      excerpt:
        "Discover how to integrate machine learning capabilities into mobile applications. We'll cover TensorFlow Lite, Core ML, and practical implementation strategies for common ML use cases.",
      coverImage:
        "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=250&fit=crop",
      author: "Alex Rodriguez",
      authorAvatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
      publishedAt: "Dec 10, 2024",
      readTime: "12 min read",
      tags: ["Mobile", "Machine Learning", "AI"],
      slug: "ml-mobile-apps",
    },
    {
      title: "Design Systems: Building Consistent User Experiences",
      excerpt:
        "Learn how to create and maintain design systems that ensure consistency across your products. We'll explore tools, processes, and best practices for scalable design.",
      coverImage:
        "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop",
      author: "Emma Wilson",
      authorAvatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
      publishedAt: "Dec 8, 2024",
      readTime: "10 min read",
      tags: ["Design", "UI/UX", "Design Systems"],
      slug: "design-systems-guide",
    },
    {
      title: "DevOps Best Practices for Small Teams",
      excerpt:
        "Implement DevOps practices without enterprise complexity. Learn about CI/CD, infrastructure as code, and monitoring strategies that work for small development teams.",
      coverImage:
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=250&fit=crop",
      author: "David Kim",
      authorAvatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face",
      publishedAt: "Dec 5, 2024",
      readTime: "9 min read",
      tags: ["DevOps", "CI/CD", "Infrastructure"],
      slug: "devops-small-teams",
    },
    {
      title: "The Art of API Design: Creating Developer-Friendly Interfaces",
      excerpt:
        "Master the principles of good API design. From RESTful conventions to GraphQL schemas, learn how to create APIs that developers love to use.",
      coverImage:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop",
      author: "Jordan Martinez",
      authorAvatar:
        "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=40&h=40&fit=crop&crop=face",
      publishedAt: "Dec 3, 2024",
      readTime: "7 min read",
      tags: ["API", "Backend", "Development"],
      slug: "api-design-principles",
    },
  ];

  // --- POSTS state & CRUD UI state ---
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isEditPostOpen, setIsEditPostOpen] = useState(false);
  const [editingPostIndex, setEditingPostIndex] = useState<number | null>(null);
  const [postForm, setPostForm] = useState<Partial<Post>>({});

  // --- PROJECTS state & CRUD UI state ---
  const [projects, setProjects] = useState<Project[]>([
    { id: "p1", title: "Project Alpha", description: "An example project", repoUrl: "https://github.com/example/alpha", tags: ["example", "alpha"] },
  ]);
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [isEditProjectOpen, setIsEditProjectOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [projectForm, setProjectForm] = useState<Partial<Project>>({});

  // --- Mock API functions (UI-only) ---
  const mockCreatePost = (data: Post) =>
    new Promise<Post>((resolve) => {
      setTimeout(() => {
        resolve(data);
      }, 400);
    });

  const mockUpdatePost = (index: number, data: Post) =>
    new Promise<Post>((resolve) => {
      setTimeout(() => {
        resolve(data);
      }, 400);
    });

  const mockDeletePost = (index: number) =>
    new Promise<number>((resolve) => {
      setTimeout(() => {
        resolve(index);
      }, 300);
    });

  const mockCreateProject = (data: Project) =>
    new Promise<Project>((resolve) => {
      setTimeout(() => resolve(data), 400);
    });

  const mockUpdateProject = (id: string, data: Project) =>
    new Promise<Project>((resolve) => {
      setTimeout(() => resolve(data), 400);
    });

  const mockDeleteProject = (id: string) =>
    new Promise<string>((resolve) => {
      setTimeout(() => resolve(id), 300);
    });

  // --- Handlers for Posts ---
  const handleOpenCreatePost = () => {
    setPostForm({});
    setIsCreatePostOpen(true);
  };

  const handleCreatePost = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const newPost: Post = {
      title: postForm.title || "Untitled Post",
      excerpt: postForm.excerpt || "",
      coverImage: postForm.coverImage || "",
      author: postForm.author || "Unknown",
      authorAvatar: postForm.authorAvatar || "",
      publishedAt: postForm.publishedAt || new Date().toLocaleDateString(),
      readTime: postForm.readTime || "5 min read",
      tags: postForm.tags || [],
      slug: (postForm.title || "untitled").toLowerCase().replace(/\s+/g, "-"),
    };
    const saved = await mockCreatePost(newPost);
    setPosts((p) => [saved, ...p]);
    setIsCreatePostOpen(false);
  };

  const handleOpenEditPost = (index: number) => {
    setEditingPostIndex(index);
    setPostForm(posts[index]);
    setIsEditPostOpen(true);
  };

  const handleUpdatePost = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (editingPostIndex === null) return;
    const updated: Post = {
      title: postForm.title || posts[editingPostIndex].title,
      excerpt: postForm.excerpt || posts[editingPostIndex].excerpt,
      coverImage: postForm.coverImage || posts[editingPostIndex].coverImage,
      author: postForm.author || posts[editingPostIndex].author,
      authorAvatar: postForm.authorAvatar || posts[editingPostIndex].authorAvatar,
      publishedAt: postForm.publishedAt || posts[editingPostIndex].publishedAt,
      readTime: postForm.readTime || posts[editingPostIndex].readTime,
      tags: postForm.tags || posts[editingPostIndex].tags,
      slug: posts[editingPostIndex].slug,
    };
    await mockUpdatePost(editingPostIndex, updated);
    setPosts((p) => p.map((x, i) => (i === editingPostIndex ? updated : x)));
    setIsEditPostOpen(false);
    setEditingPostIndex(null);
  };

  const handleDeletePost = async (index: number) => {
    if (!confirm("Delete this post? This action is irreversible in this mock.")) return;
    await mockDeletePost(index);
    setPosts((p) => p.filter((_x, i) => i !== index));
  };

  // --- Handlers for Projects ---
  const handleOpenCreateProject = () => {
    setProjectForm({});
    setIsCreateProjectOpen(true);
  };

  const handleCreateProject = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const newProject: Project = {
      id: `p${Date.now()}`,
      title: projectForm.title || "Untitled Project",
      description: projectForm.description || "",
      repoUrl: projectForm.repoUrl,
      tags: projectForm.tags || [],
    };
    const saved = await mockCreateProject(newProject);
    setProjects((p) => [saved, ...p]);
    setIsCreateProjectOpen(false);
  };

  const handleOpenEditProject = (id: string) => {
    setEditingProjectId(id);
    setProjectForm(projects.find((p) => p.id === id) || {});
    setIsEditProjectOpen(true);
  };

  const handleUpdateProject = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!editingProjectId) return;
    const updatedProject: Project = {
      id: editingProjectId,
      title: projectForm.title || "Untitled",
      description: projectForm.description || "",
      repoUrl: projectForm.repoUrl,
      tags: projectForm.tags || [],
    };
    await mockUpdateProject(editingProjectId, updatedProject);
    setProjects((p) => p.map((pr) => (pr.id === editingProjectId ? updatedProject : pr)));
    setIsEditProjectOpen(false);
    setEditingProjectId(null);
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm("Delete this project? This action is irreversible in this mock.")) return;
    await mockDeleteProject(id);
    setProjects((p) => p.filter((pr) => pr.id !== id));
  };

  const categories = [
    { name: "All Posts", count: posts.length },
    { name: "Development", count: 4 },
    { name: "Design", count: 2 },
    { name: "DevOps", count: 1 },
    { name: "AI/ML", count: 2 },
  ];

  // --- small UI helpers ---
  const TagPill = ({ t }: { t: string }) => <span className="text-xs bg-muted/20 px-2 py-1 rounded mr-2">{t}</span>;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="py-20 bg-gradient-hero">
          <div className="container text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Our Blog</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
              Insights, tutorials, and thoughts from our team of developers, designers, and industry experts.
            </p>

            {/* Search */}
            <div className="max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-200 h-4 w-4" />
                <Input
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-blue-200"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Sidebar */}
              <aside className="lg:col-span-1 space-y-8">
                {/* Categories */}
                <div className="bg-muted/50 rounded-lg p-6">
                  <h3 className="font-semibold mb-4 flex items-center">
                    <Tag className="h-4 w-4 mr-2" />
                    Categories
                  </h3>
                  <ul className="space-y-2">
                    {categories.map((category, index) => (
                      <li key={index}>
                        <button className="flex items-center justify-between w-full text-left py-2 px-3 rounded-md hover:bg-muted transition-colors">
                          <span className="text-sm">{category.name}</span>
                          <span className="text-xs text-muted-foreground">{category.count}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recent Posts */}
                <div className="bg-muted/50 rounded-lg p-6">
                  <h3 className="font-semibold mb-4">Recent Posts</h3>
                  <ul className="space-y-3">
                    {posts.slice(0, 4).map((post, index) => (
                      <li key={index}>
                        <a href="#" className="block group">
                          <h4 className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">{post.title}</h4>
                          <p className="text-xs text-muted-foreground mt-1">{post.publishedAt}</p>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Projects (Manage UI) */}
                <div className="bg-muted/50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Projects</h3>
                    <Button size="sm" onClick={handleOpenCreateProject}><Plus className="h-4 w-4 mr-2" />New</Button>
                  </div>

                  <ul className="space-y-3">
                    {projects.map((p) => (
                      <li key={p.id} className="flex items-start justify-between">
                        <div>
                          <div className="text-sm font-medium">{p.title}</div>
                          <div className="text-xs text-muted-foreground line-clamp-2">{p.description}</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline" onClick={() => handleOpenEditProject(p.id)}>
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDeleteProject(p.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </aside>

              {/* Blog Posts + Admin */}
              <div className="lg:col-span-3">
                <div className="mb-8 flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Latest Articles</h2>
                    <p className="text-muted-foreground">Stay up to date with the latest trends and best practices in tech.</p>
                  </div>

                  {/* Admin Manage Buttons */}
                  <div className="flex items-center space-x-3">
                    <Button variant="outline" size="sm" onClick={() => setIsCreatePostOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" /> New Post
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => alert("This is a UI demo. Connect actions to your API as needed.")}>
                      Manage (demo)
                    </Button>
                  </div>
                </div>

                {/* Admin list (edit/delete) */}
                <div className="mb-6 bg-muted/40 rounded-lg p-4">
                  <h4 className="font-semibold mb-3">Manage Posts</h4>
                  <div className="space-y-3">
                    {posts.map((post, idx) => (
                      <div key={idx} className="flex items-start justify-between bg-muted/10 p-3 rounded">
                        <div>
                          <div className="font-medium">{post.title}</div>
                          <div className="text-xs text-muted-foreground">{post.publishedAt} • {post.readTime}</div>
                          <div className="mt-2 flex">{post.tags.slice(0, 4).map((t) => <TagPill key={t} t={t} />)}</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline" onClick={() => handleOpenEditPost(idx)}>
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDeletePost(idx)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Post grid (display cards) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {posts
                    .filter((p) => p.title.toLowerCase().includes(searchTerm.toLowerCase()) || p.excerpt.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((post, index) => (
                      <div key={index} className="relative">
                        <BlogCard {...post} />
                        {/* floating quick actions */}
                        <div className="absolute top-3 right-3 flex space-x-2">
                          <Button size="sm" variant="outline" onClick={() => handleOpenEditPost(index)}><Edit2 className="h-4 w-4" /></Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDeletePost(index)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </div>
                    ))}
                </div>

                {/* Pagination */}
                <div className="flex justify-center mt-12">
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" disabled>
                      Previous
                    </Button>
                    <Button variant="default" size="sm">
                      1
                    </Button>
                    <Button variant="outline" size="sm">
                      2
                    </Button>
                    <Button variant="outline" size="sm">
                      3
                    </Button>
                    <Button variant="outline" size="sm">
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="py-16 bg-gradient-secondary">
          <div className="container text-center">
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">Subscribe to our newsletter to get the latest articles and updates delivered to your inbox.</p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input placeholder="Enter your email" className="flex-1" />
              <Button variant="hero">Subscribe</Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* --- Modals: Create / Edit Post --- */}
      {(isCreatePostOpen || isEditPostOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-background rounded-lg w-full max-w-2xl p-6">
            <h3 className="text-xl font-semibold mb-4">{isCreatePostOpen ? "Create Post" : "Edit Post"}</h3>
            <form onSubmit={isCreatePostOpen ? handleCreatePost : handleUpdatePost} className="space-y-3">
              <Input placeholder="Title" value={postForm.title || ""} onChange={(e) => setPostForm((s) => ({ ...s, title: e.target.value }))} />
              <Input placeholder="Author" value={postForm.author || ""} onChange={(e) => setPostForm((s) => ({ ...s, author: e.target.value }))} />
              <Input placeholder="Cover Image URL" value={postForm.coverImage || ""} onChange={(e) => setPostForm((s) => ({ ...s, coverImage: e.target.value }))} />
              <Input placeholder="Published At (e.g. Dec 1, 2024)" value={postForm.publishedAt || ""} onChange={(e) => setPostForm((s) => ({ ...s, publishedAt: e.target.value }))} />
              <Input placeholder="Read time (e.g. 5 min read)" value={postForm.readTime || ""} onChange={(e) => setPostForm((s) => ({ ...s, readTime: e.target.value }))} />
              <textarea placeholder="Excerpt" value={postForm.excerpt || ""} onChange={(e) => setPostForm((s) => ({ ...s, excerpt: e.target.value }))} className="w-full p-3 rounded bg-muted/10" rows={4} />
              <Input placeholder="Tags (comma separated)" value={(postForm.tags || []).join(", ")} onChange={(e) => setPostForm((s) => ({ ...s, tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) }))} />
              <div className="flex items-center justify-end space-x-3">
                <Button variant="outline" onClick={() => { setIsCreatePostOpen(false); setIsEditPostOpen(false); setEditingPostIndex(null); }}>
                  Cancel
                </Button>
                <Button type="submit">{isCreatePostOpen ? "Create" : "Update"}</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- Modals: Create / Edit Project --- */}
      {(isCreateProjectOpen || isEditProjectOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-background rounded-lg w-full max-w-2xl p-6">
            <h3 className="text-xl font-semibold mb-4">{isCreateProjectOpen ? "Create Project" : "Edit Project"}</h3>
            <form onSubmit={isCreateProjectOpen ? handleCreateProject : handleUpdateProject} className="space-y-3">
              <Input placeholder="Title" value={projectForm.title || ""} onChange={(e) => setProjectForm((s) => ({ ...s, title: e.target.value }))} />
              <textarea placeholder="Description" value={projectForm.description || ""} onChange={(e) => setProjectForm((s) => ({ ...s, description: e.target.value }))} className="w-full p-3 rounded bg-muted/10" rows={4} />
              <Input placeholder="Repo URL" value={projectForm.repoUrl || ""} onChange={(e) => setProjectForm((s) => ({ ...s, repoUrl: e.target.value }))} />
              <Input placeholder="Tags (comma separated)" value={(projectForm.tags || []).join(", ")} onChange={(e) => setProjectForm((s) => ({ ...s, tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) }))} />
              <div className="flex items-center justify-end space-x-3">
                <Button variant="outline" onClick={() => { setIsCreateProjectOpen(false); setIsEditProjectOpen(false); setEditingProjectId(null); }}>
                  Cancel
                </Button>
                <Button type="submit">{isCreateProjectOpen ? "Create" : "Update"}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blog;
