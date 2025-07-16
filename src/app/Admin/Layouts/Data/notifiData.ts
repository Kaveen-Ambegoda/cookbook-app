// notifiData.ts
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
  details?: any;
  isRead: boolean;
}

export const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'recipe_approval',
    title: 'New Recipe Pending Approval',
    description: 'Spicy Thai Curry recipe submitted by Sarah Johnson needs review',
    timestamp: '2024-05-26T10:30:00Z',
    status: 'pending',
    priority: 'medium',
    reporterId: 'user_123',
    reporterName: 'Sarah Johnson',
    targetId: 'recipe_456',
    targetName: 'Spicy Thai Curry',
    targetType: 'recipe',
    category: 'Asian',
    details: {
      ingredients: 15,
      cookingTime: '45 minutes',
      difficulty: 'Intermediate',
      images: 3
    },
    isRead: false
  },
  {
    id: '2',
    type: 'user_report',
    title: 'User Reported for Inappropriate Content',
    description: 'Mike Chen reported for posting offensive comments on multiple recipes',
    timestamp: '2024-05-26T09:15:00Z',
    status: 'pending',
    priority: 'high',
    reporterId: 'user_789',
    reporterName: 'Lisa Wang',
    targetId: 'user_321',
    targetName: 'Mike Chen',
    targetType: 'user',
    details: {
      reportReason: 'Harassment and inappropriate language',
      reportedComments: 3,
      previousWarnings: 1
    },
    isRead: false
  },
  {
    id: '3',
    type: 'recipe_report',
    title: 'Recipe Reported for Copyright Issues',
    description: 'Italian Carbonara recipe reported for being copied from cookbook',
    timestamp: '2024-05-26T08:45:00Z',
    status: 'pending',
    priority: 'medium',
    reporterId: 'user_555',
    reporterName: 'Chef Marco',
    targetId: 'recipe_777',
    targetName: 'Authentic Italian Carbonara',
    targetType: 'recipe',
    category: 'Italian',
    details: {
      reportReason: 'Copyright infringement',
      source: 'Professional cookbook',
      evidence: 'Side-by-side comparison provided'
    },
    isRead: true
  },
  {
    id: '4',
    type: 'malfunction',
    title: 'Website Search Feature Error',
    description: 'Multiple users reporting search functionality not working properly',
    timestamp: '2024-05-26T07:20:00Z',
    status: 'pending',
    priority: 'urgent',
    reporterId: 'system',
    reporterName: 'System Alert',
    details: {
      affectedUsers: 25,
      errorType: 'Search API timeout',
      browserInfo: 'Multiple browsers affected'
    },
    isRead: false
  },
  {
    id: '5',
    type: 'recipe_approval',
    title: 'Premium Recipe Submission',
    description: 'Professional chef submitted advanced French dessert recipe',
    timestamp: '2024-05-25T16:30:00Z',
    status: 'approved',
    priority: 'low',
    reporterId: 'user_999',
    reporterName: 'Chef Antoine',
    targetId: 'recipe_888',
    targetName: 'Crème Brûlée Master Class',
    targetType: 'recipe',
    category: 'French',
    details: {
      ingredients: 8,
      cookingTime: '2 hours',
      difficulty: 'Advanced',
      isPremium: true
    },
    isRead: true
  }
];
