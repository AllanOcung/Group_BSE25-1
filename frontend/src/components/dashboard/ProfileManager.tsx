import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { apiService } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Camera, Save } from "lucide-react";

const ProfileManager = () => {
     const { user, updateUser } = useAuth();
     const [loading, setLoading] = useState(false);
     const [success, setSuccess] = useState("");
     const [error, setError] = useState("");

     const [formData, setFormData] = useState({
          first_name: user?.first_name || "",
          last_name: user?.last_name || "",
          bio: user?.bio || "",
          skills: user?.skills || "",
          linkedin_url: user?.linkedin_url || "",
          github_url: user?.github_url || "",
          personal_website: user?.personal_website || "",
     });

     const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
     const [photoPreview, setPhotoPreview] = useState<string | null>(null);

     useEffect(() => {
          if (user) {
               setFormData({
                    first_name: user.first_name || "",
                    last_name: user.last_name || "",
                    bio: user.bio || "",
                    skills: user.skills || "",
                    linkedin_url: user.linkedin_url || "",
                    github_url: user.github_url || "",
                    personal_website: user.personal_website || "",
               });
               if (user.profile_photo) {
                    setPhotoPreview(`https://localhost:8000${user.profile_photo}`);
               }
          }
     }, [user]);

     const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const file = e.target.files?.[0];
          if (file) {
               setProfilePhoto(file);
               const reader = new FileReader();
               reader.onloadend = () => {
                    setPhotoPreview(reader.result as string);
               };
               reader.readAsDataURL(file);
          }
     };

     const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault();
          setLoading(true);
          setError("");
          setSuccess("");

          try {
               const updateData: any = { ...formData };
               if (profilePhoto) {
                    updateData.profile_photo = profilePhoto;
               }

               const updatedUser = await apiService.updateProfile(updateData);
               updateUser(updatedUser);
               setSuccess("Profile updated successfully!");
               setTimeout(() => setSuccess(""), 3000);
          } catch (err: any) {
               setError(err.message || "Failed to update profile");
          } finally {
               setLoading(false);
          }
     };

     return (
          <div className="p-6 max-w-4xl mx-auto">
               <div className="mb-6">
                    <h1 className="text-3xl font-bold mb-2">My Profile</h1>
                    <p className="text-muted-foreground">
                         Manage your personal information and settings
                    </p>
               </div>

               {error && (
                    <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                         <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                    </div>
               )}

               {success && (
                    <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
                         <p className="text-sm text-green-600 dark:text-green-400">
                              {success}
                         </p>
                    </div>
               )}

               <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Profile Photo */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border">
                         <Label className="text-lg font-semibold mb-4 block">
                              Profile Photo
                         </Label>
                         <div className="flex items-center space-x-6">
                              <div className="relative">
                                   <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                                        {photoPreview ? (
                                             <img
                                                  src={photoPreview}
                                                  alt="Profile"
                                                  className="h-full w-full object-cover"
                                             />
                                        ) : (
                                             <div className="h-full w-full flex items-center justify-center text-3xl font-bold text-gray-400">
                                                  {user?.full_name?.charAt(0) || user?.email?.charAt(0) || "U"}
                                             </div>
                                        )}
                                   </div>
                                   <label
                                        htmlFor="photo-upload"
                                        className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-2 rounded-full cursor-pointer hover:bg-primary/90 transition-colors"
                                   >
                                        <Camera className="h-4 w-4" />
                                   </label>
                                   <input
                                        id="photo-upload"
                                        type="file"
                                        accept="image/*"
                                        onChange={handlePhotoChange}
                                        className="hidden"
                                   />
                              </div>
                              <div>
                                   <p className="font-medium mb-1">Upload new photo</p>
                                   <p className="text-sm text-muted-foreground">
                                        JPG, PNG or GIF. Max size 2MB.
                                   </p>
                              </div>
                         </div>
                    </div>

                    {/* Personal Information */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border space-y-4">
                         <Label className="text-lg font-semibold block">
                              Personal Information
                         </Label>

                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                   <Label htmlFor="first_name">First Name</Label>
                                   <Input
                                        id="first_name"
                                        value={formData.first_name}
                                        onChange={(e) =>
                                             setFormData({ ...formData, first_name: e.target.value })
                                        }
                                        disabled={loading}
                                   />
                              </div>
                              <div>
                                   <Label htmlFor="last_name">Last Name</Label>
                                   <Input
                                        id="last_name"
                                        value={formData.last_name}
                                        onChange={(e) =>
                                             setFormData({ ...formData, last_name: e.target.value })
                                        }
                                        disabled={loading}
                                   />
                              </div>
                         </div>

                         <div>
                              <Label htmlFor="bio">Bio</Label>
                              <textarea
                                   id="bio"
                                   className="w-full min-h-[100px] px-3 py-2 text-sm rounded-md border border-input bg-background"
                                   placeholder="Tell us about yourself..."
                                   value={formData.bio}
                                   onChange={(e) =>
                                        setFormData({ ...formData, bio: e.target.value })
                                   }
                                   disabled={loading}
                              />
                         </div>

                         <div>
                              <Label htmlFor="skills">Skills (comma-separated)</Label>
                              <Input
                                   id="skills"
                                   placeholder="e.g., React, Node.js, Python, Docker"
                                   value={formData.skills}
                                   onChange={(e) =>
                                        setFormData({ ...formData, skills: e.target.value })
                                   }
                                   disabled={loading}
                              />
                         </div>
                    </div>

                    {/* Social Links */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border space-y-4">
                         <Label className="text-lg font-semibold block">Social Links</Label>

                         <div>
                              <Label htmlFor="github_url">GitHub URL</Label>
                              <Input
                                   id="github_url"
                                   type="url"
                                   placeholder="https://github.com/username"
                                   value={formData.github_url}
                                   onChange={(e) =>
                                        setFormData({ ...formData, github_url: e.target.value })
                                   }
                                   disabled={loading}
                              />
                         </div>

                         <div>
                              <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                              <Input
                                   id="linkedin_url"
                                   type="url"
                                   placeholder="https://linkedin.com/in/username"
                                   value={formData.linkedin_url}
                                   onChange={(e) =>
                                        setFormData({ ...formData, linkedin_url: e.target.value })
                                   }
                                   disabled={loading}
                              />
                         </div>

                         <div>
                              <Label htmlFor="personal_website">Personal Website</Label>
                              <Input
                                   id="personal_website"
                                   type="url"
                                   placeholder="https://yourwebsite.com"
                                   value={formData.personal_website}
                                   onChange={(e) =>
                                        setFormData({ ...formData, personal_website: e.target.value })
                                   }
                                   disabled={loading}
                              />
                         </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                         <Button type="submit" disabled={loading} size="lg">
                              {loading ? (
                                   <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                   </>
                              ) : (
                                   <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Save Changes
                                   </>
                              )}
                         </Button>
                    </div>
               </form>
          </div>
     );
};

export default ProfileManager;
