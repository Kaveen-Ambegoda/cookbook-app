import { Users, Crown, BookOpen, Video, DollarSign, AlertTriangle } from 'lucide-react'; 
export const dashboardStats = [
  {
    id: 'totalUsers',
    label: 'Total Users',
    value: 15432,
    change: 12.5,
    trend: 'up',
    icon: Users,
    colorClass: 'text-blue-600',
    bgGradient: 'from-blue-500 to-blue-600'
  },
  {
    id: 'hostUsers',
    label: 'Host Users',
    value: 2847,
    change: 8.3,
    trend: 'up',
    icon: Crown,
    colorClass: 'text-yellow-600',
    bgGradient: 'from-yellow-500 to-orange-500'
  },
  {
    id: 'totalContent',
    label: 'Total Content',
    value: 48392,
    change: 15.7,
    trend: 'up',
    icon: BookOpen,
    colorClass: 'text-green-600',
    bgGradient: 'from-green-500 to-emerald-600'
  },
  {
    id: 'liveStreams',
    label: 'Live Streams',
    value: 127,
    change: -3.2,
    trend: 'down',
    icon: Video,
    colorClass: 'text-red-600',
    bgGradient: 'from-red-500 to-pink-600'
  },
  {
    id: 'totalRevenue',
    label: 'Monthly Revenue',
    value: 284750,
    change: 22.1,
    trend: 'up',
    icon: DollarSign,
    colorClass: 'text-purple-600',
    bgGradient: 'from-purple-500 to-indigo-600'
  },
  {
    id: 'pendingReports',
    label: 'Pending Reports',
    value: 34,
    change: -18.5,
    trend: 'down',
    icon: AlertTriangle,
    colorClass: 'text-orange-600',
    bgGradient: 'from-orange-500 to-red-500'
  }
];

export const recentActivity = [
  {
    id: 1,
    type: 'user',
    action: 'New user registered',
    user: 'Emma Thompson',
    time: '2 minutes ago',
    severity: 'low'
  },
  {
    id: 2,
    type: 'host',
    action: 'Started live cooking session',
    user: 'Chef Marco',
    target: 'Italian Pasta Masterclass',
    time: '5 minutes ago',
    severity: 'medium'
  },
  {
    id: 3,
    type: 'report',
    action: 'Content reported for spam',
    user: 'System',
    target: 'Recipe: Quick Breakfast Ideas',
    time: '8 minutes ago',
    severity: 'high'
  },
  {
    id: 4,
    type: 'subscription',
    action: 'Upgraded to annual plan',
    user: 'Sarah Johnson',
    time: '12 minutes ago',
    severity: 'low'
  },
  {
    id: 5,
    type: 'recipe',
    action: 'Recipe trending globally',
    user: 'Chef Rodriguez',
    target: 'Authentic Tacos Recipe',
    time: '15 minutes ago',
    severity: 'medium'
  }
];

export const popularContent = [
  {
    id: 1,
    title: 'Ultimate Chocolate Cake',
    creator: 'Baker Sarah',
    type: 'recipe',
    metrics: { views: 25600, likes: 3420, comments: 567, rating: 4.9 },
    status: 'trending'
  },
  {
    id: 2,
    title: 'Live: Italian Cooking Masterclass',
    creator: 'Chef Marco',
    type: 'live',
    metrics: { views: 1250, likes: 890, comments: 234 },
    status: 'active'
  },
  {
    id: 3,
    title: 'Healthy Meal Prep Guide',
    creator: 'NutritionPro',
    type: 'video',
    metrics: { views: 18400, likes: 2100, comments: 445, rating: 4.7 },
    status: 'active'
  },
  {
    id: 4,
    title: 'Suspicious Recipe Content',
    creator: 'Anonymous User',
    type: 'recipe',
    metrics: { views: 340, likes: 12, comments: 8 },
    status: 'flagged'
  }
];

export const systemMetrics = {
  serverLoad: 68,
  memoryUsage: 72,
  activeConnections: 1247,
  responseTime: 245,
  uptime: '99.9%'
};

export const realtimeData = {
  activeUsers: 3847,
  liveStreams: 23,
  newRegistrations: 47,
  reportsToday: 12
};
