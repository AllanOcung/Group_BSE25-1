import { useState, useEffect } from "react";
import { apiService, Project } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
     Plus,
     Edit,
     Trash2,
     ExternalLink,
     Github,
     Loader2,
     X,
     Search,
} from "lucide-react";

const ProjectsManager = () => {
     const [projects, setProjects] = useState<Project[]>([]);
     const [loading, setLoading] = useState(true);
     const [isModalOpen, setIsModalOpen] = useState(false);
     const [editingProject, setEditingProject] = useState<Project | null>(null);
     const [searchQuery, setSearchQuery] = useState("");

     // Form state
     const [formData, setFormData] = useState({
          title: "",
          description: "",
          tech_stack: "",
          demo_link: "",
          source_code: "",
     });
     const [projectImage, setProjectImage] = useState<File | null>(null);
     const [imagePreview, setImagePreview] = useState<string | null>(null);
     const [formLoading, setFormLoading] = useState(false);
     const [formError, setFormError] = useState("");

     useEffect(() => {
          loadProjects();
     }, []);

     const loadProjects = async () => {
          try {
               setLoading(true);
               const data = await apiService.getMyProjects();
               setProjects(data);
          } catch (error) {
               console.error("Failed to load projects:", error);
          } finally {
               setLoading(false);
          }
     };

     const openCreateModal = () => {
          setEditingProject(null);
          setFormData({
               title: "",
               description: "",
               tech_stack: "",
               demo_link: "",
               source_code: "",
          });
          setProjectImage(null);
          setImagePreview(null);
          setFormError("");
          setIsModalOpen(true);
     };

     const openEditModal = (project: Project) => {
          setEditingProject(project);
          setFormData({
               title: project.title,
               description: project.description,
               tech_stack: project.tech_stack || "",
               demo_link: project.demo_link || "",
               source_code: project.source_code || "",
          });
          setProjectImage(null);
          setImagePreview(
               project.image ? `https://localhost:8000${project.image}` : null
          );
          setFormError("");
          setIsModalOpen(true);
     };

     const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const file = e.target.files?.[0];
          if (file) {
               setProjectImage(file);
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
               const projectData: any = {
                    title: formData.title,
                    description: formData.description,
               };

               // Only add optional fields if they have values
               if (formData.tech_stack?.trim()) {
                    projectData.tech_stack = formData.tech_stack.trim();
               }
               if (formData.demo_link?.trim()) {
                    // Normalize demo_link: if missing scheme, prefix https://
                    const raw = formData.demo_link.trim();
                    try {
                         new URL(raw);
                         projectData.demo_link = raw;
                    } catch (err) {
                         // try prefixing https://
                         try {
                              const prefixed = `https://${raw}`;
                              new URL(prefixed);
                              projectData.demo_link = prefixed;
                         } catch (err2) {
                              throw new Error("Please provide a valid Demo URL or leave it blank.");
                         }
                    }
               }
               if (formData.source_code?.trim()) {
                    const raw = formData.source_code.trim();
                    try {
                         new URL(raw);
                         projectData.source_code = raw;
                    } catch (err) {
                         try {
                              const prefixed = `https://${raw}`;
                              new URL(prefixed);
                              projectData.source_code = prefixed;
                         } catch (err2) {
                              throw new Error("Please provide a valid Source Code URL (e.g. https://github.com/...) or leave it blank.");
                         }
                    }
               }
               if (projectImage) {
                    projectData.image = projectImage;
               }

               if (editingProject) {
                    await apiService.updateProject(editingProject.id, projectData);
               } else {
                    await apiService.createProject(projectData);
               }

               setIsModalOpen(false);
               loadProjects();
          } catch (err: any) {
               setFormError(err.message || "Failed to save project");
          } finally {
               setFormLoading(false);
          }
     };

     const handleDelete = async (id: number) => {
          if (!confirm("Are you sure you want to delete this project?")) return;

          try {
               await apiService.deleteProject(id);
               loadProjects();
          } catch (error) {
               console.error("Failed to delete project:", error);
               alert("Failed to delete project");
          }
     };

     const filteredProjects = projects.filter(
          (project) =>
               project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
               project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
               project.tech_stack?.toLowerCase().includes(searchQuery.toLowerCase())
     );

     return (
          <div className="p-6 max-w-7xl mx-auto">
               {/* Header */}
               <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                    <div>
                         <h1 className="text-3xl font-bold mb-2">My Projects</h1>
                         <p className="text-muted-foreground">
                              Showcase your work and achievements
                         </p>
                    </div>
                    <Button onClick={openCreateModal} size="lg">
                         <Plus className="mr-2 h-4 w-4" />
                         New Project
                    </Button>
               </div>

               {/* Search */}
               <div className="mb-6">
                    <div className="relative max-w-md">
                         <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                         <Input
                              type="text"
                              placeholder="Search projects..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="pl-10"
                         />
                    </div>
               </div>

               {/* Loading State */}
               {loading && (
                    <div className="flex justify-center items-center py-12">
                         <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
               )}

               {/* Empty State */}
               {!loading && filteredProjects.length === 0 && !searchQuery && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-12 text-center">
                         <div className="max-w-md mx-auto">
                              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                   <Plus className="h-8 w-8 text-primary" />
                              </div>
                              <h3 className="text-xl font-semibold mb-2">No projects yet</h3>
                              <p className="text-muted-foreground mb-6">
                                   Start showcasing your work by creating your first project
                              </p>
                              <Button onClick={openCreateModal}>
                                   <Plus className="mr-2 h-4 w-4" />
                                   Create Your First Project
                              </Button>
                         </div>
                    </div>
               )}

               {/* No Search Results */}
               {!loading && filteredProjects.length === 0 && searchQuery && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-12 text-center">
                         <p className="text-muted-foreground">
                              No projects found matching "{searchQuery}"
                         </p>
                    </div>
               )}

               {/* Projects Grid */}
               {!loading && filteredProjects.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                         {filteredProjects.map((project) => (
                              <div
                                   key={project.id}
                                   className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow"
                              >
                                   {/* Project Image */}
                                   <div className="h-48 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                                        {project.image ? (
                                             <img
                                                  src={`https://localhost:8000${project.image}`}
                                                  alt={project.title}
                                                  className="w-full h-full object-cover"
                                             />
                                        ) : (
                                             <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                  <Plus className="h-12 w-12" />
                                             </div>
                                        )}
                                   </div>

                                   {/* Project Content */}
                                   <div className="p-4">
                                        <h3 className="text-lg font-semibold mb-2 line-clamp-1">
                                             {project.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                             {project.description}
                                        </p>

                                        {/* Tech Stack */}
                                        {project.tech_stack && (
                                             <div className="flex flex-wrap gap-2 mb-4">
                                                  {project.tech_stack.split(",").map((tech, idx) => (
                                                       <span
                                                            key={idx}
                                                            className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                                                       >
                                                            {tech.trim()}
                                                       </span>
                                                  ))}
                                             </div>
                                        )}

                                        {/* Links */}
                                        <div className="flex items-center gap-2 mb-4">
                                             {project.demo_link && (
                                                  <a
                                                       href={project.demo_link}
                                                       target="_blank"
                                                       rel="noopener noreferrer"
                                                       className="text-xs text-primary hover:underline flex items-center gap-1"
                                                  >
                                                       <ExternalLink className="h-3 w-3" />
                                                       Demo
                                                  </a>
                                             )}
                                             {project.source_code && (
                                                  <a
                                                       href={project.source_code}
                                                       target="_blank"
                                                       rel="noopener noreferrer"
                                                       className="text-xs text-primary hover:underline flex items-center gap-1"
                                                  >
                                                       <Github className="h-3 w-3" />
                                                       Code
                                                  </a>
                                             )}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-2">
                                             <Button
                                                  variant="outline"
                                                  size="sm"
                                                  className="flex-1"
                                                  onClick={() => openEditModal(project)}
                                             >
                                                  <Edit className="h-4 w-4 mr-1" />
                                                  Edit
                                             </Button>
                                             <Button
                                                  variant="outline"
                                                  size="sm"
                                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                  onClick={() => handleDelete(project.id)}
                                             >
                                                  <Trash2 className="h-4 w-4" />
                                             </Button>
                                        </div>
                                   </div>
                              </div>
                         ))}
                    </div>
               )}

               {/* Create/Edit Modal */}
               {isModalOpen && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                         <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                              <div className="sticky top-0 bg-white dark:bg-gray-800 border-b px-6 py-4 flex items-center justify-between">
                                   <h2 className="text-2xl font-bold">
                                        {editingProject ? "Edit Project" : "Create New Project"}
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

                                   {/* Project Image */}
                                   <div>
                                        <Label htmlFor="image">Project Image</Label>
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
                                                  id="image"
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
                                        <Label htmlFor="title">Project Title *</Label>
                                        <Input
                                             id="title"
                                             value={formData.title}
                                             onChange={(e) =>
                                                  setFormData({ ...formData, title: e.target.value })
                                             }
                                             placeholder="My Awesome Project"
                                             required
                                             disabled={formLoading}
                                        />
                                   </div>

                                   {/* Description */}
                                   <div>
                                        <Label htmlFor="description">Description *</Label>
                                        <textarea
                                             id="description"
                                             className="w-full min-h-[120px] px-3 py-2 text-sm rounded-md border border-input bg-background"
                                             placeholder="Describe your project..."
                                             value={formData.description}
                                             onChange={(e) =>
                                                  setFormData({ ...formData, description: e.target.value })
                                             }
                                             required
                                             disabled={formLoading}
                                        />
                                   </div>

                                   {/* Tech Stack */}
                                   <div>
                                        <Label htmlFor="tech_stack">
                                             Tech Stack (comma-separated)
                                        </Label>
                                        <Input
                                             id="tech_stack"
                                             value={formData.tech_stack}
                                             onChange={(e) =>
                                                  setFormData({ ...formData, tech_stack: e.target.value })
                                             }
                                             placeholder="React, Node.js, PostgreSQL"
                                             disabled={formLoading}
                                        />
                                   </div>

                                   {/* Demo Link */}
                                   <div>
                                        <Label htmlFor="demo_link">Demo Link</Label>
                                        <Input
                                             id="demo_link"
                                             type="url"
                                             value={formData.demo_link}
                                             onChange={(e) =>
                                                  setFormData({ ...formData, demo_link: e.target.value })
                                             }
                                             placeholder="https://demo.example.com"
                                             disabled={formLoading}
                                        />
                                   </div>

                                   {/* Source Code */}
                                   <div>
                                        <Label htmlFor="source_code">Source Code (GitHub URL)</Label>
                                        <Input
                                             id="source_code"
                                             type="url"
                                             value={formData.source_code}
                                             onChange={(e) =>
                                                  setFormData({ ...formData, source_code: e.target.value })
                                             }
                                             placeholder="https://github.com/username/repo"
                                             disabled={formLoading}
                                        />
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
                                                  <>{editingProject ? "Update" : "Create"} Project</>
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

export default ProjectsManager;
