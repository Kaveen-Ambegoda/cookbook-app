// data/userData.ts

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

export const mockUsers: User[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "host",
    status: "active",
    registeredDate: "2024-01-15",
    lastActive: "2024-05-20",
    reportCount: 2,
    reported: true,
    subscriptionType: "monthly",
    subscriptionEnd: "2024-06-15",
    liveVideos: 25,
    posts: 150,
    events: 12,
    followers: 1250,
    likes: 5420,
    comments: 850,
    videosWatched: 320,
    engagementScore: 85,
    restrictions: {
      commenting: false,
      liking: false,
      posting: false,
      messaging: false,
      liveStreaming: false
    }
  },
  {
    id: 2,
    name: "Sarah Wilson",
    email: "sarah@example.com",
    role: "normal",
    status: "restricted",
    registeredDate: "2024-02-20",
    lastActive: "2024-05-25",
    reportCount: 0,
    reported: false,
    likes: 320,
    comments: 145,
    videosWatched: 890,
    engagementScore: 65,
    restrictions: {
      commenting: true,
      liking: false,
      posting: true,
      messaging: true,
      liveStreaming: false
    }
  }
];
