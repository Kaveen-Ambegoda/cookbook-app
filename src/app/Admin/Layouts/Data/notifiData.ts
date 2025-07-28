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
}

// Update the BASE_URL to point to the correct notifications endpoint
const BASE_URL = "https://localhost:7205/api/notifications"; // Changed from recipes to notifications

export const fetchNotifications = async (): Promise<Notification[]> => {
  try {
    const response = await fetch(BASE_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add authentication headers if needed
        // 'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch notifications: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

export const updateNotificationStatus = async (
  id: string,
  action: 'approve' | 'reject' | 'resolve' | 'dismiss'
): Promise<void> => {
  try {
    const response = await fetch(`${BASE_URL}/${id}/status`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        // Add authentication headers if needed
        // 'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ action }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update notification status: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error updating notification status:', error);
    throw error;
  }
};

export const markNotificationAsRead = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${BASE_URL}/${id}/read`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        // Add authentication headers if needed
        // 'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to mark notification as read: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

export const markAllAsRead = async (): Promise<void> => {
  try {
    const response = await fetch(`${BASE_URL}/mark-all-read`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        // Add authentication headers if needed
        // 'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to mark all as read: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
};

export const getUnreadCount = async (): Promise<number> => {
  try {
    const response = await fetch(`${BASE_URL}/unread-count`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add authentication headers if needed
        // 'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch unread count: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.count || 0;
  } catch (error) {
    console.error('Error fetching unread count:', error);
    throw error;
  }
};

// Optional: Function to delete/dismiss a notification
export const deleteNotification = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        // Add authentication headers if needed
        // 'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete notification: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw error;
  }
};