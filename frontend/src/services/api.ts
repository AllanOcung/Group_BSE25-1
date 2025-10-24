import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

export const BACKEND_URLS = {
  local8000: "http://127.0.0.1:8000/api",
  local8001: "http://127.0.0.1:8001/api",
  localhost8000: "http://localhost:8000/api",
  localhost8001: "http://localhost:8001/api",
  staging: "https://group-bse25-1.onrender.com/api",
  production: "https://group-bse25-1-1-prod.onrender.com/api",
};

let API_BASE_URL: string;

if (import.meta.env.VITE_API_URL) {
  API_BASE_URL = import.meta.env.VITE_API_URL;
}
else if (import.meta.env.PROD) {
  // Auto-detect staging vs production based on hostname
  const isStaging = window.location.hostname.includes('deploy-preview') ||
    window.location.hostname.includes('staging');

  API_BASE_URL = isStaging ? BACKEND_URLS.staging : BACKEND_URLS.production;
}
else {
  API_BASE_URL = BACKEND_URLS.local8001;
}

console.log('🔌 API Base URL:', API_BASE_URL);

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

// API Service Class with Axios
class ApiService {
  private api: AxiosInstance;

  constructor() {
    // Create axios instance with base configuration
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor - automatically add auth token
    this.api.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('access_token');
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - handle errors globally
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        // Handle 401 Unauthorized - token expired
        if (error.response?.status === 401) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          // Optionally redirect to login
          // window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Normalize URL fields to ensure they include a scheme
  private normalizeUrl(value: string): string | null {
    const v = String(value).trim();
    if (!v) return null;
    try {
      new URL(v);
      return v;
    } catch {
      try {
        const prefixed = `https://${v}`;
        new URL(prefixed);
        return prefixed;
      } catch {
        return null;
      }
    }
  }

  // Authentication
  async register(data: RegisterRequest): Promise<LoginResponse> {
    try {
      const response = await this.api.post('/auth/register/', data);
      const result = response.data;

      // Store tokens
      localStorage.setItem('access_token', result.tokens.access);
      localStorage.setItem('refresh_token', result.tokens.refresh);

      return {
        user: result.user,
        access: result.tokens.access,
        refresh: result.tokens.refresh,
        message: result.message,
      };
    } catch (error: any) {
      console.error('Registration error:', error.response?.data);
      throw error; // Axios already formats errors as { response: { data: ... } }
    }
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await this.api.post('/auth/login/', { email, password });
      const result = response.data;

      // Store tokens
      localStorage.setItem('access_token', result.tokens.access);
      localStorage.setItem('refresh_token', result.tokens.refresh);

      return {
        user: result.user,
        access: result.tokens.access,
        refresh: result.tokens.refresh,
        message: result.message,
      };
    } catch (error: any) {
      console.error('Login error:', error.response?.data);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await this.api.post('/auth/logout/');
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  }

  async requestPasswordReset(email: string): Promise<void> {
    await this.api.post('/auth/password-reset/', { email });
  }

  async confirmPasswordReset(
    uid: string,
    token: string,
    new_password: string
  ): Promise<void> {
    await this.api.post('/auth/password-reset-confirm/', {
      uid,
      token,
      new_password,
    });
  }

  // User/Profile
  async getProfile(): Promise<User> {
    const response = await this.api.get('/profile/');
    return response.data;
  }

  async updateProfile(data: Partial<User> & { profile_photo?: File }): Promise<User> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value as any);
      }
    });

    const response = await this.api.patch('/profile/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  }

  async getMembers(search?: string, skill?: string): Promise<User[]> {
    const response = await this.api.get('/users/members/', {
      params: { search, skill },
    });
    return response.data;
  }

  async getUser(id: number): Promise<User> {
    const response = await this.api.get(`/users/${id}/`);
    return response.data;
  }

  // Projects
  async getProjects(search?: string, tech?: string): Promise<Project[]> {
    const response = await this.api.get('/blog/projects/', {
      params: { search, tech },
    });
    return response.data;
  }

  async getProject(id: number): Promise<Project> {
    const response = await this.api.get(`/blog/projects/${id}/`);
    return response.data;
  }

  async getMyProjects(): Promise<Project[]> {
    const response = await this.api.get('/blog/projects/my_projects/');
    return response.data;
  }

  async createProject(data: CreateProjectRequest): Promise<Project> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') return;

      // Normalize URLs
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

    const response = await this.api.post('/blog/projects/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
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

    const response = await this.api.patch(`/blog/projects/${id}/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  }

  async deleteProject(id: number): Promise<void> {
    await this.api.delete(`/blog/projects/${id}/`);
  }

  // Posts
  async getPosts(search?: string, tag?: string): Promise<Post[]> {
    const response = await this.api.get('/blog/posts/', {
      params: { search, tag },
    });
    return response.data;
  }

  async getPost(id: number): Promise<Post> {
    const response = await this.api.get(`/blog/posts/${id}/`);
    return response.data;
  }

  async getMyPosts(): Promise<Post[]> {
    const response = await this.api.get('/blog/posts/my_posts/');
    return response.data;
  }

  async createPost(data: CreatePostRequest): Promise<Post> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        formData.append(key, value instanceof File ? value : String(value));
      }
    });

    const response = await this.api.post('/blog/posts/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  }

  async updatePost(id: number, data: Partial<CreatePostRequest>): Promise<Post> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        formData.append(key, value instanceof File ? value : String(value));
      }
    });

    const response = await this.api.patch(`/blog/posts/${id}/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  }

  async deletePost(id: number): Promise<void> {
    await this.api.delete(`/blog/posts/${id}/`);
  }

  // Admin
  async getAdminStats(): Promise<AdminStats> {
    const response = await this.api.get('/admin/statistics/');
    return response.data;
  }

  async getAllUsers(): Promise<User[]> {
    const response = await this.api.get('/users/');
    return response.data;
  }

  async toggleUserActive(userId: number): Promise<User> {
    const response = await this.api.post(`/users/${userId}/toggle_active/`);
    return response.data.user;
  }

  async changeUserRole(userId: number, role: string): Promise<User> {
    const response = await this.api.post(`/users/${userId}/change_role/`, { role });
    return response.data.user;
  }
}

export const apiService = new ApiService();