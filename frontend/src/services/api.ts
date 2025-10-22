const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

// Types
export interface User {
  id: number;
  username?: string;
  email: string;
  full_name: string;
  first_name?: string;
  last_name?: string;
  bio: string;
  role: "admin" | "member" | "viewer";
  skills: string;
  profile_photo: string | null;
  linkedin_url: string;
  github_url: string;
  personal_website: string;
  is_active: boolean;
  date_joined: string;
}

export interface Project {
  id: number;
  owner: number;
  owner_username: string;
  title: string;
  description: string;
  tech_stack: string;
  demo_link: string | null;
  source_code: string | null;
  image: string | null;
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: number;
  author: number;
  author_username: string;
  title: string;
  content: string;
  cover_image: string | null;
  tags: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface LoginResponse {
  user: User;
  access: string;
  refresh: string;
  message: string;
}

export interface RegisterRequest {
  email: string;
  username?: string;
  password: string;
  password_confirm: string;
  first_name: string;
  last_name: string;
  bio?: string;
  role?: string;
  skills?: string;
}

export interface CreateProjectRequest {
  title: string;
  description: string;
  tech_stack?: string;
  demo_link?: string;
  source_code?: string;
  image?: File;
}

export interface CreatePostRequest {
  title: string;
  content: string;
  cover_image?: File;
  tags?: string;
  is_published?: boolean;
}

export interface AdminStats {
  users: {
    total: number;
    active: number;
    admins: number;
    members: number;
  };
  projects: {
    total: number;
    by_owner: Array<{ owner__username: string; count: number }>;
  };
  posts: {
    total: number;
    published: number;
    draft: number;
    by_author: Array<{ author__username: string; count: number }>;
  };
}

// API Service Class
class ApiService {
  private baseUrl = API_BASE_URL;

  // Normalize URL fields to ensure they include a scheme. Returns normalized URL or null if invalid.
  private normalizeUrl(value: string): string | null {
    const v = String(value).trim();
    if (!v) return null;
    try {
      // If it already parses as a URL, return as-is
      // eslint-disable-next-line no-new
      new URL(v);
      return v;
    } catch (e) {
      // Try prefixing https:// and validate again
      try {
        const prefixed = `https://${v}`;
        // eslint-disable-next-line no-new
        new URL(prefixed);
        return prefixed;
      } catch (e2) {
        return null;
      }
    }
  }

  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem("access_token");
    if (token) {
      return {
        Authorization: `Bearer ${token}`,
      };
    }
    return {};
  }

  // Authentication
  async register(data: RegisterRequest): Promise<LoginResponse> {
    const response = await fetch(`${this.baseUrl}/auth/register/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      console.error("Registration error response:", error);
      throw { response: { data: error } }; // Throw in format expected by LoginModal
    }
    const result = await response.json();
    console.log("Registration success:", result);
    // Store tokens
    localStorage.setItem("access_token", result.tokens.access);
    localStorage.setItem("refresh_token", result.tokens.refresh);
    // Return in expected format
    return {
      user: result.user,
      access: result.tokens.access,
      refresh: result.tokens.refresh,
      message: result.message
    };
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${this.baseUrl}/auth/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw { response: { data: error } }; // Throw in format expected by LoginModal
    }
    const result = await response.json();
    // Store tokens
    localStorage.setItem("access_token", result.tokens.access);
    localStorage.setItem("refresh_token", result.tokens.refresh);
    // Return in expected format
    return {
      user: result.user,
      access: result.tokens.access,
      refresh: result.tokens.refresh,
      message: result.message
    };
  }

  async logout(): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/auth/logout/`, {
        method: "POST",
        headers: this.getAuthHeaders(),
      });
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    }
  }

  async requestPasswordReset(email: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/auth/password-reset/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (!response.ok) throw new Error("Password reset request failed");
  }

  async confirmPasswordReset(
    uid: string,
    token: string,
    new_password: string
  ): Promise<void> {
    const response = await fetch(`${this.baseUrl}/auth/password-reset-confirm/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uid, token, new_password }),
    });
    if (!response.ok) throw new Error("Password reset failed");
  }

  // User/Profile
  async getProfile(): Promise<User> {
    const response = await fetch(`${this.baseUrl}/profile/`, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch profile");
    return response.json();
  }

  async updateProfile(data: Partial<User> & { profile_photo?: File }): Promise<User> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      formData.append(key, value as any);
    });

    const response = await fetch(`${this.baseUrl}/profile/`, {
      method: "PATCH",
      headers: this.getAuthHeaders(),
      body: formData,
    });
    if (!response.ok) throw new Error("Failed to update profile");
    return response.json();
  }

  async getMembers(search?: string, skill?: string): Promise<User[]> {
    let url = `${this.baseUrl}/users/members/`;
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (skill) params.append("skill", skill);
    if (params.toString()) url += `?${params.toString()}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch members");
    return response.json();
  }

  async getUser(id: number): Promise<User> {
    const response = await fetch(`${this.baseUrl}/users/${id}/`);
    if (!response.ok) throw new Error("Failed to fetch user");
    return response.json();
  }

  // Projects
  async getProjects(search?: string, tech?: string): Promise<Project[]> {
    let url = `${this.baseUrl}/blog/projects/`;
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (tech) params.append("tech", tech);
    if (params.toString()) url += `?${params.toString()}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch projects");
    return response.json();
  }

  async getProject(id: number): Promise<Project> {
    const response = await fetch(`${this.baseUrl}/blog/projects/${id}/`);
    if (!response.ok) throw new Error("Failed to fetch project");
    return response.json();
  }

  async getMyProjects(): Promise<Project[]> {
    const response = await fetch(`${this.baseUrl}/blog/projects/my_projects/`, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch my projects");
    return response.json();
  }

  async createProject(data: CreateProjectRequest): Promise<Project> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') return;

      // Normalize URL-like fields so Django URLField accepts them
      if ((key === 'demo_link' || key === 'source_code') && typeof value === 'string') {
        const normalized = this.normalizeUrl(value);
        if (normalized) {
          formData.append(key, normalized);
        } else {
          // Invalid URL provided — throw with a helpful message so caller can display it
          throw new Error(`Invalid URL provided for ${key}`);
        }
        return;
      }

      formData.append(key, value instanceof File ? value : String(value));
    });

    const response = await fetch(`${this.baseUrl}/blog/projects/`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: formData,
    });
    if (!response.ok) {
      const error = await response.json();
      console.error("Failed to create project:", error);
      throw new Error(error.detail || JSON.stringify(error) || "Failed to create project");
    }
    return response.json();
  }

  async updateProject(
    id: number,
    data: Partial<CreateProjectRequest>
  ): Promise<Project> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') return;

      if ((key === 'demo_link' || key === 'source_code') && typeof value === 'string') {
        const normalized = this.normalizeUrl(value);
        if (normalized) {
          formData.append(key, normalized);
        } else {
          throw new Error(`Invalid URL provided for ${key}`);
        }
        return;
      }

      formData.append(key, value instanceof File ? value : String(value));
    });

    const response = await fetch(`${this.baseUrl}/blog/projects/${id}/`, {
      method: "PATCH",
      headers: this.getAuthHeaders(),
      body: formData,
    });
    if (!response.ok) {
      const error = await response.json();
      console.error("Failed to update project:", error);
      throw new Error(error.detail || JSON.stringify(error) || "Failed to update project");
    }
    return response.json();
  }

  async deleteProject(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/blog/projects/${id}/`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to delete project");
  }

  // Posts
  async getPosts(search?: string, tag?: string): Promise<Post[]> {
    let url = `${this.baseUrl}/blog/posts/`;
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (tag) params.append("tag", tag);
    if (params.toString()) url += `?${params.toString()}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch posts");
    return response.json();
  }

  async getPost(id: number): Promise<Post> {
    const response = await fetch(`${this.baseUrl}/blog/posts/${id}/`);
    if (!response.ok) throw new Error("Failed to fetch post");
    return response.json();
  }

  async getMyPosts(): Promise<Post[]> {
    const response = await fetch(`${this.baseUrl}/blog/posts/my_posts/`, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch my posts");
    return response.json();
  }

  async createPost(data: CreatePostRequest): Promise<Post> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        formData.append(key, value instanceof File ? value : String(value));
      }
    });

    const response = await fetch(`${this.baseUrl}/blog/posts/`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: formData,
    });
    if (!response.ok) {
      const error = await response.json();
      console.error("Failed to create post:", error);
      throw new Error(error.detail || JSON.stringify(error) || "Failed to create post");
    }
    return response.json();
  }

  async updatePost(id: number, data: Partial<CreatePostRequest>): Promise<Post> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        formData.append(key, value instanceof File ? value : String(value));
      }
    });

    const response = await fetch(`${this.baseUrl}/blog/posts/${id}/`, {
      method: "PATCH",
      headers: this.getAuthHeaders(),
      body: formData,
    });
    if (!response.ok) {
      const error = await response.json();
      console.error("Failed to update post:", error);
      throw new Error(error.detail || JSON.stringify(error) || "Failed to update post");
    }
    return response.json();
  }

  async deletePost(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/blog/posts/${id}/`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to delete post");
  }

  // Admin
  async getAdminStats(): Promise<AdminStats> {
    const response = await fetch(`${this.baseUrl}/admin/statistics/`, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch statistics");
    return response.json();
  }

  async getAllUsers(): Promise<User[]> {
    const response = await fetch(`${this.baseUrl}/users/`, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch users");
    return response.json();
  }

  async toggleUserActive(userId: number): Promise<User> {
    const response = await fetch(`${this.baseUrl}/users/${userId}/toggle_active/`, {
      method: "POST",
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to toggle user status");
    const data = await response.json();
    return data.user;
  }

  async changeUserRole(userId: number, role: string): Promise<User> {
    const response = await fetch(`${this.baseUrl}/users/${userId}/change_role/`, {
      method: "POST",
      headers: {
        ...this.getAuthHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role }),
    });
    if (!response.ok) throw new Error("Failed to change user role");
    const data = await response.json();
    return data.user;
  }
}

export const apiService = new ApiService();
