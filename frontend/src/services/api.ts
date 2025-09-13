const API_BASE_URL = "http://localhost:8000/api";

// Types
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

// API Service Class
class ApiService {
  private baseUrl = API_BASE_URL;

  // Projects
  async getProjects(): Promise<Project[]> {
    const response = await fetch(`${this.baseUrl}/projects/`);
    if (!response.ok) throw new Error("Failed to fetch projects");
    return response.json();
  }

  async getProject(id: number): Promise<Project> {
    const response = await fetch(`${this.baseUrl}/projects/${id}/`);
    if (!response.ok) throw new Error("Failed to fetch project");
    return response.json();
  }

  async createProject(data: CreateProjectRequest): Promise<Project> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value);
      }
    });

    const response = await fetch(`${this.baseUrl}/projects/`, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) throw new Error("Failed to create project");
    return response.json();
  }

  async updateProject(
    id: number,
    data: Partial<CreateProjectRequest>,
  ): Promise<Project> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value);
      }
    });

    const response = await fetch(`${this.baseUrl}/projects/${id}/`, {
      method: "PUT",
      body: formData,
    });
    if (!response.ok) throw new Error("Failed to update project");
    return response.json();
  }

  async deleteProject(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/projects/${id}/`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete project");
  }

  // Posts
  async getPosts(): Promise<Post[]> {
    const response = await fetch(`${this.baseUrl}/posts/`);
    if (!response.ok) throw new Error("Failed to fetch posts");
    return response.json();
  }

  async getPost(id: number): Promise<Post> {
    const response = await fetch(`${this.baseUrl}/posts/${id}/`);
    if (!response.ok) throw new Error("Failed to fetch post");
    return response.json();
  }

  async createPost(data: CreatePostRequest): Promise<Post> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, String(value));
      }
    });

    const response = await fetch(`${this.baseUrl}/posts/`, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) throw new Error("Failed to create post");
    return response.json();
  }

  async updatePost(
    id: number,
    data: Partial<CreatePostRequest>,
  ): Promise<Post> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, String(value));
      }
    });

    const response = await fetch(`${this.baseUrl}/posts/${id}/`, {
      method: "PUT",
      body: formData,
    });
    if (!response.ok) throw new Error("Failed to update post");
    return response.json();
  }

  async deletePost(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/posts/${id}/`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete post");
  }
}

export const apiService = new ApiService();
