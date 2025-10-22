import { useState, useEffect } from "react";
import { apiService, Post } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
     Plus,
     Edit,
     Trash2,
     Loader2,
     X,
     Search,
     Eye,
     EyeOff,
     Calendar,
     Tag,
} from "lucide-react";

const BlogsManager = () => {
     const [posts, setPosts] = useState<Post[]>([]);
     const [loading, setLoading] = useState(true);
     const [isModalOpen, setIsModalOpen] = useState(false);
     const [editingPost, setEditingPost] = useState<Post | null>(null);
     const [searchQuery, setSearchQuery] = useState("");
     const [filterStatus, setFilterStatus] = useState<"all" | "published" | "draft">("all");

     // Form state
     const [formData, setFormData] = useState({
          title: "",
          content: "",
          tags: "",
          is_published: true,
     });
     const [coverImage, setCoverImage] = useState<File | null>(null);
     const [imagePreview, setImagePreview] = useState<string | null>(null);
     const [formLoading, setFormLoading] = useState(false);
     const [formError, setFormError] = useState("");

     useEffect(() => {
          loadPosts();
     }, []);

     const loadPosts = async () => {
          try {
               setLoading(true);
               const data = await apiService.getMyPosts();
               setPosts(data);
          } catch (error) {
               console.error("Failed to load posts:", error);
          } finally {
               setLoading(false);
          }
     };

     const openCreateModal = () => {
          setEditingPost(null);
          setFormData({
               title: "",
               content: "",
               tags: "",
               is_published: true,
          });
          setCoverImage(null);
          setImagePreview(null);
          setFormError("");
          setIsModalOpen(true);
     };

     const openEditModal = (post: Post) => {
          setEditingPost(post);
          setFormData({
               title: post.title,
               content: post.content,
               tags: post.tags || "",
               is_published: post.is_published,
          });
          setCoverImage(null);
          setImagePreview(
               post.cover_image ? `https://localhost:8000${post.cover_image}` : null
          );
          setFormError("");
          setIsModalOpen(true);
     };

     const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const file = e.target.files?.[0];
          if (file) {
               setCoverImage(file);
               const reader = new FileReader();
               reader.onloadend = () => {
                    setImagePreview(reader.result as string);
               };
               reader.readAsDataURL(file);
          }
     };

     const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault();
          setFormLoading(true);
          setFormError("");

          try {
               // Clean the data - only include non-empty values
               const postData: any = {
                    title: formData.title,
                    content: formData.content,
                    is_published: formData.is_published,
               };

               // Only add optional fields if they have values
               if (formData.tags?.trim()) {
                    postData.tags = formData.tags.trim();
               }
               if (coverImage) {
                    postData.cover_image = coverImage;
               }

               if (editingPost) {
                    await apiService.updatePost(editingPost.id, postData);
               } else {
                    await apiService.createPost(postData);
               }

               setIsModalOpen(false);
               loadPosts();
          } catch (err: any) {
               setFormError(err.message || "Failed to save post");
          } finally {
               setFormLoading(false);
          }
     };

     const handleDelete = async (id: number) => {
          if (!confirm("Are you sure you want to delete this blog post?")) return;

          try {
               await apiService.deletePost(id);
               loadPosts();
          } catch (error) {
               console.error("Failed to delete post:", error);
               alert("Failed to delete post");
          }
     };

     const filteredPosts = posts.filter((post) => {
          const matchesSearch =
               post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
               post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
               post.tags?.toLowerCase().includes(searchQuery.toLowerCase());

          const matchesStatus =
               filterStatus === "all" ||
               (filterStatus === "published" && post.is_published) ||
               (filterStatus === "draft" && !post.is_published);

          return matchesSearch && matchesStatus;
     });

     return (
          <div className="p-6 max-w-7xl mx-auto">
               {/* Header */}
               <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                    <div>
                         <h1 className="text-3xl font-bold mb-2">My Blog Posts</h1>
                         <p className="text-muted-foreground">
                              Write and share your thoughts with the community
                         </p>
                    </div>
                    <Button onClick={openCreateModal} size="lg">
                         <Plus className="mr-2 h-4 w-4" />
                         New Post
                    </Button>
               </div>

               {/* Filters */}
               <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative flex-1 max-w-md">
                         <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                         <Input
                              type="text"
                              placeholder="Search posts..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="pl-10"
                         />
                    </div>
                    <div className="flex gap-2">
                         <Button
                              variant={filterStatus === "all" ? "default" : "outline"}
                              onClick={() => setFilterStatus("all")}
                              size="sm"
                         >
                              All
                         </Button>
                         <Button
                              variant={filterStatus === "published" ? "default" : "outline"}
                              onClick={() => setFilterStatus("published")}
                              size="sm"
                         >
                              <Eye className="mr-1 h-4 w-4" />
                              Published
                         </Button>
                         <Button
                              variant={filterStatus === "draft" ? "default" : "outline"}
                              onClick={() => setFilterStatus("draft")}
                              size="sm"
                         >
                              <EyeOff className="mr-1 h-4 w-4" />
                              Drafts
                         </Button>
                    </div>
               </div>

               {/* Loading State */}
               {loading && (
                    <div className="flex justify-center items-center py-12">
                         <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
               )}

               {/* Empty State */}
               {!loading && filteredPosts.length === 0 && !searchQuery && filterStatus === "all" && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-12 text-center">
                         <div className="max-w-md mx-auto">
                              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                   <Plus className="h-8 w-8 text-primary" />
                              </div>
                              <h3 className="text-xl font-semibold mb-2">No blog posts yet</h3>
                              <p className="text-muted-foreground mb-6">
                                   Start writing and share your knowledge with the community
                              </p>
                              <Button onClick={openCreateModal}>
                                   <Plus className="mr-2 h-4 w-4" />
                                   Write Your First Post
                              </Button>
                         </div>
                    </div>
               )}

               {/* No Search/Filter Results */}
               {!loading && filteredPosts.length === 0 && (searchQuery || filterStatus !== "all") && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-12 text-center">
                         <p className="text-muted-foreground">
                              No posts found matching your criteria
                         </p>
                    </div>
               )}

               {/* Posts List */}
               {!loading && filteredPosts.length > 0 && (
                    <div className="space-y-4">
                         {filteredPosts.map((post) => (
                              <div
                                   key={post.id}
                                   className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow"
                              >
                                   <div className="flex flex-col sm:flex-row gap-4 p-4">
                                        {/* Cover Image */}
                                        <div className="sm:w-48 h-32 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden flex-shrink-0">
                                             {post.cover_image ? (
                                                  <img
                                                       src={`https://localhost:8000${post.cover_image}`}
                                                       alt={post.title}
                                                       className="w-full h-full object-cover"
                                                  />
                                             ) : (
                                                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                       <Plus className="h-8 w-8" />
                                                  </div>
                                             )}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                             <div className="flex items-start justify-between gap-2 mb-2">
                                                  <h3 className="text-lg font-semibold line-clamp-1">
                                                       {post.title}
                                                  </h3>
                                                  <div className="flex items-center gap-1 flex-shrink-0">
                                                       {post.is_published ? (
                                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                                                 <Eye className="h-3 w-3 mr-1" />
                                                                 Published
                                                            </span>
                                                       ) : (
                                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                                                                 <EyeOff className="h-3 w-3 mr-1" />
                                                                 Draft
                                                            </span>
                                                       )}
                                                  </div>
                                             </div>

                                             <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                                  {post.content}
                                             </p>

                                             {/* Tags */}
                                             {post.tags && (
                                                  <div className="flex flex-wrap gap-2 mb-3">
                                                       {post.tags.split(",").map((tag, idx) => (
                                                            <span
                                                                 key={idx}
                                                                 className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                                                            >
                                                                 <Tag className="h-3 w-3 mr-1" />
                                                                 {tag.trim()}
                                                            </span>
                                                       ))}
                                                  </div>
                                             )}

                                             {/* Meta & Actions */}
                                             <div className="flex items-center justify-between">
                                                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                       <Calendar className="h-3 w-3" />
                                                       {new Date(post.created_at).toLocaleDateString()}
                                                  </div>
                                                  <div className="flex gap-2">
                                                       <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => openEditModal(post)}
                                                       >
                                                            <Edit className="h-4 w-4 mr-1" />
                                                            Edit
                                                       </Button>
                                                       <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                            onClick={() => handleDelete(post.id)}
                                                       >
                                                            <Trash2 className="h-4 w-4" />
                                                       </Button>
                                                  </div>
                                             </div>
                                        </div>
                                   </div>
                              </div>
                         ))}
                    </div>
               )}

               {/* Create/Edit Modal */}
               {isModalOpen && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                         <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                              <div className="sticky top-0 bg-white dark:bg-gray-800 border-b px-6 py-4 flex items-center justify-between">
                                   <h2 className="text-2xl font-bold">
                                        {editingPost ? "Edit Post" : "Create New Post"}
                                   </h2>
                                   <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setIsModalOpen(false)}
                                   >
                                        <X className="h-4 w-4" />
                                   </Button>
                              </div>

                              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                   {formError && (
                                        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                                             <p className="text-sm text-red-600 dark:text-red-400">
                                                  {formError}
                                             </p>
                                        </div>
                                   )}

                                   {/* Cover Image */}
                                   <div>
                                        <Label htmlFor="cover_image">Cover Image</Label>
                                        <div className="mt-2">
                                             {imagePreview && (
                                                  <div className="mb-4 relative w-full h-48 rounded-lg overflow-hidden bg-gray-100">
                                                       <img
                                                            src={imagePreview}
                                                            alt="Preview"
                                                            className="w-full h-full object-cover"
                                                       />
                                                  </div>
                                             )}
                                             <Input
                                                  id="cover_image"
                                                  type="file"
                                                  accept="image/*"
                                                  onChange={handleImageChange}
                                                  disabled={formLoading}
                                             />
                                             <p className="text-xs text-muted-foreground mt-1">
                                                  PNG, JPG, or GIF. Max 5MB.
                                             </p>
                                        </div>
                                   </div>

                                   {/* Title */}
                                   <div>
                                        <Label htmlFor="title">Post Title *</Label>
                                        <Input
                                             id="title"
                                             value={formData.title}
                                             onChange={(e) =>
                                                  setFormData({ ...formData, title: e.target.value })
                                             }
                                             placeholder="Enter your post title"
                                             required
                                             disabled={formLoading}
                                        />
                                   </div>

                                   {/* Content */}
                                   <div>
                                        <Label htmlFor="content">Content *</Label>
                                        <textarea
                                             id="content"
                                             className="w-full min-h-[300px] px-3 py-2 text-sm rounded-md border border-input bg-background"
                                             placeholder="Write your blog post content..."
                                             value={formData.content}
                                             onChange={(e) =>
                                                  setFormData({ ...formData, content: e.target.value })
                                             }
                                             required
                                             disabled={formLoading}
                                        />
                                   </div>

                                   {/* Tags */}
                                   <div>
                                        <Label htmlFor="tags">Tags (comma-separated)</Label>
                                        <Input
                                             id="tags"
                                             value={formData.tags}
                                             onChange={(e) =>
                                                  setFormData({ ...formData, tags: e.target.value })
                                             }
                                             placeholder="React, TypeScript, Web Development"
                                             disabled={formLoading}
                                        />
                                   </div>

                                   {/* Publish Toggle */}
                                   <div className="flex items-center gap-2">
                                        <input
                                             type="checkbox"
                                             id="is_published"
                                             checked={formData.is_published}
                                             onChange={(e) =>
                                                  setFormData({ ...formData, is_published: e.target.checked })
                                             }
                                             disabled={formLoading}
                                             className="w-4 h-4 rounded border-gray-300"
                                        />
                                        <Label htmlFor="is_published" className="cursor-pointer">
                                             Publish immediately
                                        </Label>
                                   </div>

                                   {/* Submit Buttons */}
                                   <div className="flex gap-2 justify-end pt-4">
                                        <Button
                                             type="button"
                                             variant="outline"
                                             onClick={() => setIsModalOpen(false)}
                                             disabled={formLoading}
                                        >
                                             Cancel
                                        </Button>
                                        <Button type="submit" disabled={formLoading}>
                                             {formLoading ? (
                                                  <>
                                                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                       Saving...
                                                  </>
                                             ) : (
                                                  <>{editingPost ? "Update" : "Create"} Post</>
                                             )}
                                        </Button>
                                   </div>
                              </form>
                         </div>
                    </div>
               )}
          </div>
     );
};

export default BlogsManager;
