import { useState, useEffect } from "react";
import { apiService, User, AdminStats } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
     Users,
     FileText,
     FolderKanban,
     Loader2,
     Shield,
     ShieldAlert,
     Eye,
     Ban,
     CheckCircle,
     Search,
     RefreshCw,
} from "lucide-react";

const AdminPanel = () => {
     const [users, setUsers] = useState<User[]>([]);
     const [stats, setStats] = useState<AdminStats | null>(null);
     const [loading, setLoading] = useState(true);
     const [searchQuery, setSearchQuery] = useState("");
     const [actionLoading, setActionLoading] = useState<number | null>(null);

     useEffect(() => {
          loadData();
     }, []);

     const loadData = async () => {
          try {
               setLoading(true);
               const [usersData, statsData] = await Promise.all([
                    apiService.getAllUsers(),
                    apiService.getAdminStats(),
               ]);
               setUsers(usersData);
               setStats(statsData);
          } catch (error) {
               console.error("Failed to load admin data:", error);
          } finally {
               setLoading(false);
          }
     };

     const handleToggleActive = async (userId: number) => {
          try {
               setActionLoading(userId);
               const updatedUser = await apiService.toggleUserActive(userId);
               setUsers(users.map((u) => (u.id === userId ? updatedUser : u)));
               loadData(); // Reload stats
          } catch (error) {
               console.error("Failed to toggle user status:", error);
               alert("Failed to update user status");
          } finally {
               setActionLoading(null);
          }
     };

     const handleChangeRole = async (userId: number, currentRole: string) => {
          const roles = ["viewer", "member", "admin"];
          const currentIndex = roles.indexOf(currentRole);
          const newRole = roles[(currentIndex + 1) % roles.length];

          if (
               !confirm(
                    `Change user role from "${currentRole}" to "${newRole}"?`
               )
          )
               return;

          try {
               setActionLoading(userId);
               const updatedUser = await apiService.changeUserRole(userId, newRole);
               setUsers(users.map((u) => (u.id === userId ? updatedUser : u)));
               loadData(); // Reload stats
          } catch (error) {
               console.error("Failed to change role:", error);
               alert("Failed to change user role");
          } finally {
               setActionLoading(null);
          }
     };

     const filteredUsers = users.filter(
          (user) =>
               user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
               user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
               user.username?.toLowerCase().includes(searchQuery.toLowerCase())
     );

     const getRoleBadgeColor = (role: string) => {
          switch (role) {
               case "admin":
                    return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
               case "member":
                    return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
               default:
                    return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
          }
     };

     const getRoleIcon = (role: string) => {
          switch (role) {
               case "admin":
                    return <ShieldAlert className="h-3 w-3" />;
               case "member":
                    return <Shield className="h-3 w-3" />;
               default:
                    return <Eye className="h-3 w-3" />;
          }
     };

     return (
          <div className="p-6 max-w-7xl mx-auto">
               {/* Header */}
               <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                    <div>
                         <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
                         <p className="text-muted-foreground">
                              Manage users and monitor platform activity
                         </p>
                    </div>
                    <Button onClick={loadData} variant="outline" size="lg">
                         <RefreshCw className="mr-2 h-4 w-4" />
                         Refresh
                    </Button>
               </div>

               {/* Loading State */}
               {loading && (
                    <div className="flex justify-center items-center py-12">
                         <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
               )}

               {!loading && stats && (
                    <>
                         {/* Statistics Cards */}
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                              {/* Users Stats */}
                              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-6">
                                   <div className="flex items-center justify-between mb-4">
                                        <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                                             <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div className="text-right">
                                             <p className="text-3xl font-bold">{stats.users.total}</p>
                                             <p className="text-sm text-muted-foreground">Total Users</p>
                                        </div>
                                   </div>
                                   <div className="space-y-1 text-sm">
                                        <div className="flex justify-between">
                                             <span className="text-muted-foreground">Active:</span>
                                             <span className="font-medium">{stats.users.active}</span>
                                        </div>
                                        <div className="flex justify-between">
                                             <span className="text-muted-foreground">Admins:</span>
                                             <span className="font-medium">{stats.users.admins}</span>
                                        </div>
                                        <div className="flex justify-between">
                                             <span className="text-muted-foreground">Members:</span>
                                             <span className="font-medium">{stats.users.members}</span>
                                        </div>
                                   </div>
                              </div>

                              {/* Projects Stats */}
                              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-6">
                                   <div className="flex items-center justify-between mb-4">
                                        <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
                                             <FolderKanban className="h-6 w-6 text-green-600 dark:text-green-400" />
                                        </div>
                                        <div className="text-right">
                                             <p className="text-3xl font-bold">{stats.projects.total}</p>
                                             <p className="text-sm text-muted-foreground">Projects</p>
                                        </div>
                                   </div>
                                   <div className="space-y-1 text-sm">
                                        {stats.projects.by_owner.slice(0, 3).map((item, idx) => (
                                             <div key={idx} className="flex justify-between">
                                                  <span className="text-muted-foreground truncate">
                                                       {item.owner__username}:
                                                  </span>
                                                  <span className="font-medium">{item.count}</span>
                                             </div>
                                        ))}
                                   </div>
                              </div>

                              {/* Posts Stats */}
                              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-6">
                                   <div className="flex items-center justify-between mb-4">
                                        <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg">
                                             <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                        </div>
                                        <div className="text-right">
                                             <p className="text-3xl font-bold">{stats.posts.total}</p>
                                             <p className="text-sm text-muted-foreground">Blog Posts</p>
                                        </div>
                                   </div>
                                   <div className="space-y-1 text-sm">
                                        <div className="flex justify-between">
                                             <span className="text-muted-foreground">Published:</span>
                                             <span className="font-medium">{stats.posts.published}</span>
                                        </div>
                                        <div className="flex justify-between">
                                             <span className="text-muted-foreground">Drafts:</span>
                                             <span className="font-medium">{stats.posts.draft}</span>
                                        </div>
                                   </div>
                              </div>
                         </div>

                         {/* User Management */}
                         <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border">
                              <div className="p-6 border-b">
                                   <h2 className="text-xl font-bold mb-4">User Management</h2>
                                   <div className="relative max-w-md">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                        <Input
                                             type="text"
                                             placeholder="Search users..."
                                             value={searchQuery}
                                             onChange={(e) => setSearchQuery(e.target.value)}
                                             className="pl-10"
                                        />
                                   </div>
                              </div>

                              {/* Users Table */}
                              <div className="overflow-x-auto">
                                   <table className="w-full">
                                        <thead className="bg-gray-50 dark:bg-gray-900/50 border-b">
                                             <tr>
                                                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                       User
                                                  </th>
                                                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                       Role
                                                  </th>
                                                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                       Status
                                                  </th>
                                                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                       Joined
                                                  </th>
                                                  <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                       Actions
                                                  </th>
                                             </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                             {filteredUsers.map((user) => (
                                                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                                                       <td className="px-6 py-4 whitespace-nowrap">
                                                            <div>
                                                                 <div className="font-medium">{user.full_name}</div>
                                                                 <div className="text-sm text-muted-foreground">
                                                                      {user.email}
                                                                 </div>
                                                            </div>
                                                       </td>
                                                       <td className="px-6 py-4 whitespace-nowrap">
                                                            <button
                                                                 onClick={() => handleChangeRole(user.id, user.role)}
                                                                 disabled={actionLoading === user.id}
                                                                 className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(
                                                                      user.role
                                                                 )} hover:opacity-80 transition-opacity cursor-pointer disabled:opacity-50`}
                                                            >
                                                                 {getRoleIcon(user.role)}
                                                                 <span className="ml-1 capitalize">{user.role}</span>
                                                            </button>
                                                       </td>
                                                       <td className="px-6 py-4 whitespace-nowrap">
                                                            {user.is_active ? (
                                                                 <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                                                      <CheckCircle className="h-3 w-3 mr-1" />
                                                                      Active
                                                                 </span>
                                                            ) : (
                                                                 <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                                                                      <Ban className="h-3 w-3 mr-1" />
                                                                      Inactive
                                                                 </span>
                                                            )}
                                                       </td>
                                                       <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                                                            {new Date(user.date_joined).toLocaleDateString()}
                                                       </td>
                                                       <td className="px-6 py-4 whitespace-nowrap text-right">
                                                            <Button
                                                                 variant="outline"
                                                                 size="sm"
                                                                 onClick={() => handleToggleActive(user.id)}
                                                                 disabled={actionLoading === user.id}
                                                                 className={
                                                                      user.is_active
                                                                           ? "text-red-600 hover:text-red-700 hover:bg-red-50"
                                                                           : ""
                                                                 }
                                                            >
                                                                 {actionLoading === user.id ? (
                                                                      <Loader2 className="h-4 w-4 animate-spin" />
                                                                 ) : user.is_active ? (
                                                                      <>
                                                                           <Ban className="h-4 w-4 mr-1" />
                                                                           Deactivate
                                                                      </>
                                                                 ) : (
                                                                      <>
                                                                           <CheckCircle className="h-4 w-4 mr-1" />
                                                                           Activate
                                                                      </>
                                                                 )}
                                                            </Button>
                                                       </td>
                                                  </tr>
                                             ))}
                                        </tbody>
                                   </table>

                                   {filteredUsers.length === 0 && (
                                        <div className="p-12 text-center">
                                             <p className="text-muted-foreground">
                                                  {searchQuery
                                                       ? `No users found matching "${searchQuery}"`
                                                       : "No users found"}
                                             </p>
                                        </div>
                                   )}
                              </div>
                         </div>
                    </>
               )}
          </div>
     );
};

export default AdminPanel;
