import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, Link } from "react-router-dom";
import {
     LayoutDashboard,
     User,
     FolderKanban,
     FileText,
     Settings,
     LogOut,
     Shield,
     Menu,
     X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardOverview from "@/components/dashboard/DashboardOverview";
import ProfileManager from "@/components/dashboard/ProfileManager";
import ProjectsManager from "@/components/dashboard/ProjectsManager";
import BlogsManager from "@/components/dashboard/BlogsManager";
import AdminPanel from "@/components/dashboard/AdminPanel";

type DashboardView =
     | "overview"
     | "profile"
     | "projects"
     | "blogs"
     | "admin"
     | "settings";

const Dashboard = () => {
     const { isLoggedIn, user, isAdmin, logout } = useAuth();
     const [currentView, setCurrentView] = useState<DashboardView>("overview");
     const [sidebarOpen, setSidebarOpen] = useState(false);

     if (!isLoggedIn) {
          return <Navigate to="/" replace />;
     }

     const menuItems = [
          { id: "overview", label: "Overview", icon: LayoutDashboard },
          { id: "profile", label: "My Profile", icon: User },
          { id: "projects", label: "My Projects", icon: FolderKanban },
          { id: "blogs", label: "My Blogs", icon: FileText },
          ...(isAdmin
               ? [{ id: "admin", label: "Admin Panel", icon: Shield }]
               : []),
          { id: "settings", label: "Settings", icon: Settings },
     ];

     const renderView = () => {
          switch (currentView) {
               case "overview":
                    return <DashboardOverview />;
               case "profile":
                    return <ProfileManager />;
               case "projects":
                    return <ProjectsManager />;
               case "blogs":
                    return <BlogsManager />;
               case "admin":
                    return isAdmin ? <AdminPanel /> : <DashboardOverview />;
               case "settings":
                    return <div className="p-6">Settings coming soon...</div>;
               default:
                    return <DashboardOverview />;
          }
     };

     return (
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
               {/* Mobile Header */}
               <div className="lg:hidden bg-white dark:bg-gray-800 border-b px-4 py-3 flex items-center justify-between sticky top-0 z-20">
                    <h1 className="text-xl font-bold">Dashboard</h1>
                    <Button
                         variant="ghost"
                         size="icon"
                         onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                         {sidebarOpen ? <X /> : <Menu />}
                    </Button>
               </div>

               <div className="flex h-screen">
                    {/* Sidebar */}
                    <aside
                         className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-800 border-r transform transition-transform duration-200 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                              }`}
                    >
                         <div className="flex flex-col h-full">
                              {/* Logo/Brand */}
                              <div className="p-6 border-b">
                                   <Link to="/" className="flex items-center space-x-2">
                                        <div className="h-8 w-8 rounded-lg bg-gradient-primary"></div>
                                        <span className="font-bold text-lg">Portfolio Hub</span>
                                   </Link>
                              </div>

                              {/* User Info */}
                              <div className="p-6 border-b">
                                   <div className="flex items-center space-x-3">
                                        <div className="h-10 w-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-semibold">
                                             {user?.full_name?.charAt(0) || user?.email?.charAt(0) || "U"}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                             <p className="text-sm font-medium truncate">
                                                  {user?.full_name || user?.email}
                                             </p>
                                             <p className="text-xs text-muted-foreground capitalize">
                                                  {user?.role || "member"}
                                             </p>
                                        </div>
                                   </div>
                              </div>

                              {/* Navigation */}
                              <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                                   {menuItems.map((item) => {
                                        const Icon = item.icon;
                                        const isActive = currentView === item.id;
                                        return (
                                             <button
                                                  key={item.id}
                                                  onClick={() => {
                                                       setCurrentView(item.id as DashboardView);
                                                       setSidebarOpen(false);
                                                  }}
                                                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                                            ? "bg-primary text-primary-foreground"
                                                            : "text-muted-foreground hover:bg-gray-100 dark:hover:bg-gray-700"
                                                       }`}
                                             >
                                                  <Icon className="h-5 w-5" />
                                                  <span className="font-medium">{item.label}</span>
                                             </button>
                                        );
                                   })}
                              </nav>

                              {/* Logout */}
                              <div className="p-4 border-t">
                                   <button
                                        onClick={logout}
                                        className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                   >
                                        <LogOut className="h-5 w-5" />
                                        <span className="font-medium">Logout</span>
                                   </button>
                              </div>
                         </div>
                    </aside>

                    {/* Overlay for mobile */}
                    {sidebarOpen && (
                         <div
                              className="fixed inset-0 bg-black/50 z-20 lg:hidden"
                              onClick={() => setSidebarOpen(false)}
                         />
                    )}

                    {/* Main Content */}
                    <main className="flex-1 overflow-y-auto">
                         <div className="max-w-7xl mx-auto">{renderView()}</div>
                    </main>
               </div>
          </div>
     );
};

export default Dashboard;
