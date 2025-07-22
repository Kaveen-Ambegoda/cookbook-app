// src/app/Layouts/Data/notifiData.ts
export interface Notification {
  id: string;
  type: 'user_report' | 'recipe_approval' | 'malfunction' | 'recipe_report';
  title: string;
  description: string;
  timestamp: string;
  status: 'pending' | 'approved' | 'rejected' | 'resolved' | 'dismissed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  reporterId?: string;
  reporterName?: string;
  targetId?: string;
  targetName?: string;
  targetType?: 'user' | 'recipe';
  category?: string;
  details?: Record<string, any>;
  isRead: boolean;
  targetUrl?: string;
}

const BASE_URL = "https://localhost:7155/api/recipes"; 

export const fetchNotifications = async (): Promise<Notification[]> => {
  const response = await fetch(BASE_URL);
  if (!response.ok) {
    throw new Error('Failed to fetch notifications');
  }
  return response.json();
};

export const updateNotificationStatus = async (
  id: string,
  action: 'approve' | 'reject' | 'resolve' | 'dismiss'
): Promise<void> => {
  const response = await fetch(`${BASE_URL}/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action }),
  });
  if (!response.ok) {
    throw new Error('Failed to update notification status');
  }
};

export const markAllAsRead = async (): Promise<void> => {
  const response = await fetch(`${BASE_URL}/markAllRead`, { method: 'PATCH' });
  if (!response.ok) {
    throw new Error('Failed to mark all as read');
  }
};
