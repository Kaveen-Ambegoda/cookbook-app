// src/data/userData.ts

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'normal' | 'host';
  status: 'active' | 'banned' | 'restricted';
  registeredDate: string;
  lastActive: string;
  reportCount: number;
  reportReason?: string;
  reported: boolean;
  avatar?: string;
  subscriptionType?: 'monthly' | 'annual' | null;
  subscriptionEnd?: string;
  liveVideos?: number;
  posts?: number;
  events?: number;
  followers?: number;
  likes: number;
  comments: number;
  videosWatched: number;
  engagementScore: number;
  restrictions: {
    commenting: boolean;
    liking: boolean;
    posting: boolean;
    messaging: boolean;
    liveStreaming: boolean;
  };
}

const API_BASE = "https://localhost:7155/api/users";

// Get all users
export const fetchUsers = async (): Promise<User[]> => {
  const res = await fetch(API_BASE);
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
};

// Create new user
export const createUser = async (user: Partial<User>): Promise<User> => {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
  if (!res.ok) throw new Error("Failed to create user");
  return res.json();
};

// Update full user object (used in editing forms)
export const updateUser = async (id: number, user: Partial<User>): Promise<void> => {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
  if (!res.ok) throw new Error("Failed to update user");
};

// Delete user
export const deleteUser = async (id: number): Promise<void> => {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete user");
};

// 🔽 New specific update functions (for individual fields)

// Update user status
export const updateUserStatus = async (id: number, status: User["status"]): Promise<void> => {
  const res = await fetch(`${API_BASE}/${id}/status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Failed to update user status");
};

// Update user role
export const updateUserRole = async (id: number, role: User["role"]): Promise<void> => {
  const res = await fetch(`${API_BASE}/${id}/role`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role }),
  });
  if (!res.ok) throw new Error("Failed to update user role");
};

// Update user restrictions
export const updateUserRestrictions = async (
  id: number,
  restrictions: User["restrictions"]
): Promise<void> => {
  const res = await fetch(`${API_BASE}/${id}/restrictions`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(restrictions),
  });
  if (!res.ok) throw new Error("Failed to update user restrictions");
};
