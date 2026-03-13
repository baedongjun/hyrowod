import axios from "axios";
import { ApiResponse, AuthResponse } from "@/types";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: JWT 토큰 자동 첨부
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor: 에러 처리
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth API
export const authApi = {
  signup: (data: { email: string; password: string; name: string; phone?: string }) =>
    api.post<ApiResponse<AuthResponse>>("/api/v1/auth/signup", data),

  login: (data: { email: string; password: string }) =>
    api.post<ApiResponse<AuthResponse>>("/api/v1/auth/login", data),
};

// Box API
export const boxApi = {
  search: (params: { city?: string; district?: string; keyword?: string; page?: number; size?: number; verified?: boolean; premium?: boolean; maxFee?: number; minRating?: number }) =>
    api.get("/api/v1/boxes", { params }),

  getOne: (id: number) =>
    api.get(`/api/v1/boxes/${id}`),

  getPremium: () =>
    api.get("/api/v1/boxes/premium"),

  getMy: (page = 0) =>
    api.get("/api/v1/boxes/my", { params: { page } }),

  create: (data: object) =>
    api.post("/api/v1/boxes", data),

  update: (id: number, data: object) =>
    api.put(`/api/v1/boxes/${id}`, data),

  delete: (id: number) =>
    api.delete(`/api/v1/boxes/${id}`),

  getCoaches: (boxId: number) =>
    api.get(`/api/v1/boxes/${boxId}/coaches`),

  getSchedules: (boxId: number) =>
    api.get(`/api/v1/boxes/${boxId}/schedules`),

  getReviews: (boxId: number, page = 0) =>
    api.get(`/api/v1/boxes/${boxId}/reviews`, { params: { page } }),

  createReview: (boxId: number, data: { rating: number; content: string }) =>
    api.post(`/api/v1/boxes/${boxId}/reviews`, data),

  addCoach: (boxId: number, data: { name: string; bio?: string; experienceYears?: number; certifications?: string[] }) =>
    api.post(`/api/v1/boxes/${boxId}/coaches`, data),

  deleteCoach: (coachId: number) =>
    api.delete(`/api/v1/coaches/${coachId}`),

  addSchedule: (boxId: number, data: { dayOfWeek: string; startTime: string; endTime: string; className: string; maxCapacity?: number }) =>
    api.post(`/api/v1/boxes/${boxId}/schedules`, data),

  deleteSchedule: (scheduleId: number) =>
    api.delete(`/api/v1/schedules/${scheduleId}`),
};

// WOD API
export const wodApi = {
  getToday: (boxId?: number) =>
    api.get("/api/v1/wod/today", { params: boxId ? { boxId } : {} }),

  getHistory: (page = 0, size = 20) =>
    api.get("/api/v1/wod/history", { params: { page, size } }),

  createBoxWod: (boxId: number, data: object) =>
    api.post(`/api/v1/wod`, data, { params: { boxId } }),
};

// Competition API
export const competitionApi = {
  getAll: (params?: { status?: string; city?: string; page?: number }) =>
    api.get("/api/v1/competitions", { params }),

  getOne: (id: number) =>
    api.get(`/api/v1/competitions/${id}`),
};

// Community API
export const communityApi = {
  getPosts: (params?: { category?: string; keyword?: string; page?: number }) =>
    api.get("/api/v1/community/posts", { params }),

  getMyPosts: (page = 0) =>
    api.get("/api/v1/community/posts/mine", { params: { page } }),

  getPost: (id: number) =>
    api.get(`/api/v1/community/posts/${id}`),

  createPost: (data: { title: string; content: string; category: string; imageUrls?: string[] }) =>
    api.post("/api/v1/community/posts", data),

  updatePost: (id: number, data: object) =>
    api.put(`/api/v1/community/posts/${id}`, data),

  deletePost: (id: number) =>
    api.delete(`/api/v1/community/posts/${id}`),

  likePost: (id: number) =>
    api.post(`/api/v1/community/posts/${id}/like`),

  getComments: (postId: number) =>
    api.get(`/api/v1/community/posts/${postId}/comments`),

  createComment: (postId: number, content: string, parentId?: number) =>
    api.post(`/api/v1/community/posts/${postId}/comments`, { content, parentId }),

  deleteComment: (commentId: number) =>
    api.delete(`/api/v1/community/comments/${commentId}`),
};

// User API
export const userApi = {
  getMe: () =>
    api.get("/api/v1/users/me"),

  updateMe: (data: { name: string; phone?: string; profileImageUrl?: string }) =>
    api.put("/api/v1/users/me", data),

  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.put("/api/v1/users/me/password", data),

  getMyReviews: (page = 0) =>
    api.get("/api/v1/users/me/reviews", { params: { page } }),
};

// Admin API
export const adminApi = {
  getDashboard: () =>
    api.get("/api/v1/admin/dashboard"),

  getBoxes: (page = 0) =>
    api.get("/api/v1/admin/boxes", { params: { page } }),

  verifyBox: (id: number, verified: boolean) =>
    api.patch(`/api/v1/admin/boxes/${id}/verify`, null, { params: { verified } }),

  setPremium: (id: number, premium: boolean) =>
    api.patch(`/api/v1/admin/boxes/${id}/premium`, null, { params: { premium } }),

  createCompetition: (data: object) =>
    api.post("/api/v1/admin/competitions", data),

  updateCompetitionStatus: (id: number, status: string) =>
    api.patch(`/api/v1/admin/competitions/${id}/status`, null, { params: { status } }),

  createCommonWod: (data: object) =>
    api.post("/api/v1/admin/wod", data),

  getUsers: (page = 0) =>
    api.get("/api/v1/admin/users", { params: { page } }),

  toggleUserActive: (id: number, active: boolean) =>
    api.patch(`/api/v1/admin/users/${id}/active`, null, { params: { active } }),

  updateUserRole: (id: number, role: string) =>
    api.patch(`/api/v1/admin/users/${id}/role`, null, { params: { role } }),

  getPosts: (page = 0) =>
    api.get("/api/v1/admin/posts", { params: { page } }),

  deletePost: (id: number) =>
    api.delete(`/api/v1/admin/posts/${id}`),

  deleteComment: (id: number) =>
    api.delete(`/api/v1/admin/comments/${id}`),

  deleteWod: (id: number) =>
    api.delete(`/api/v1/admin/wod/${id}`),

  deleteCompetition: (id: number) =>
    api.delete(`/api/v1/admin/competitions/${id}`),
};
