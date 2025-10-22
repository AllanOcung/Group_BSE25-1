import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { apiService, Project, Post } from "@/services/api";
import { FolderKanban, FileText, Eye, TrendingUp } from "lucide-react";

const DashboardOverview = () => {
     const { user } = useAuth();
     const [stats, setStats] = useState({
          projects: 0,
          blogs: 0,
          loading: true,
     });

     useEffect(() => {
          loadStats();
     }, []);

     const loadStats = async () => {
          try {
               const [projects, blogs] = await Promise.all([
                    apiService.getMyProjects(),
                    apiService.getMyPosts(),
               ]);
               setStats({
                    projects: projects.length,
                    blogs: blogs.length,
                    loading: false,
               });
          } catch (error) {
               console.error("Failed to load stats:", error);
               setStats({ projects: 0, blogs: 0, loading: false });
          }
     };

     const statCards = [
          {
               title: "My Projects",
               value: stats.projects,
               icon: FolderKanban,
               color: "bg-blue-500",
          },
          {
               title: "My Blogs",
               value: stats.blogs,
               icon: FileText,
               color: "bg-green-500",
          },
          {
               title: "Profile Views",
               value: "Coming Soon",
               icon: Eye,
               color: "bg-purple-500",
          },
          {
               title: "Total Reach",
               value: "Coming Soon",
               icon: TrendingUp,
               color: "bg-orange-500",
          },
     ];

     return (
          <div className="p-6 space-y-6">
               {/* Welcome Section */}
               <div>
                    <h1 className="text-3xl font-bold mb-2">
                         Welcome back, {user?.full_name?.split(" ")[0] || "there"}! 👋
                    </h1>
                    <p className="text-muted-foreground">
                         Here's what's happening with your portfolio today.
                    </p>
               </div>

               {/* Stats Grid */}
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((stat, index) => {
                         const Icon = stat.icon;
                         return (
                              <div
                                   key={index}
                                   className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border"
                              >
                                   <div className="flex items-center justify-between mb-4">
                                        <div className={`${stat.color} p-3 rounded-lg`}>
                                             <Icon className="h-6 w-6 text-white" />
                                        </div>
                                   </div>
                                   <h3 className="text-2xl font-bold mb-1">
                                        {stats.loading ? "..." : stat.value}
                                   </h3>
                                   <p className="text-sm text-muted-foreground">{stat.title}</p>
                              </div>
                         );
                    })}
               </div>

               {/* Quick Actions */}
               <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border">
                    <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                         <button className="p-4 border-2 border-dashed rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-left">
                              <FolderKanban className="h-8 w-8 text-primary mb-2" />
                              <h3 className="font-semibold mb-1">Create Project</h3>
                              <p className="text-sm text-muted-foreground">
                                   Showcase your latest work
                              </p>
                         </button>
                         <button className="p-4 border-2 border-dashed rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-left">
                              <FileText className="h-8 w-8 text-primary mb-2" />
                              <h3 className="font-semibold mb-1">Write Blog Post</h3>
                              <p className="text-sm text-muted-foreground">
                                   Share your knowledge
                              </p>
                         </button>
                         <button className="p-4 border-2 border-dashed rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-left">
                              <Eye className="h-8 w-8 text-primary mb-2" />
                              <h3 className="font-semibold mb-1">Update Profile</h3>
                              <p className="text-sm text-muted-foreground">
                                   Keep your info current
                              </p>
                         </button>
                    </div>
               </div>

               {/* Recent Activity */}
               <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border">
                    <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
                    <p className="text-muted-foreground">
                         Your recent projects and blog posts will appear here.
                    </p>
               </div>
          </div>
     );
};

export default DashboardOverview;
