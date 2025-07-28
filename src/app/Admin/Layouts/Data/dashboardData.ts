// services/dashboardApi.ts
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

// Types for dashboard data
export interface DashboardStats {
  totalUsers: number;
  totalRecipes: number;
  newUsersToday: number;
  newRecipesToday: number;
}

export interface NewUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture?: string;
  createdAt: string;
  status: string;
}

export interface NewRecipe {
  id: number;
  title: string;
  category: string;
  cookingTime: number;
  portion: number;
  image?: string;
  userName: string;
  createdAt: string;
  likesCount: number;
}

export interface TopUser {
  id: number;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  totalLikes: number;
  totalRecipes: number;
  engagementScore: number;
  rank: number;
}

export interface TopRecipe {
  id: number;
  title: string;
  category: string;
  image?: string;
  userName: string;
  likesCount: number;
  cookingTime: number;
  rank: number;
}

export interface RealtimeData {
  activeUsers: number;
  newUsersToday: number;
  newRecipesToday: number;
  totalLikes: number;
}

export interface DashboardData {
  stats: DashboardStats;
  newUsers: NewUser[];
  newRecipes: NewRecipe[];
  topUsers: TopUser[];
  topRecipes: TopRecipe[];
  realtimeData: RealtimeData;
}

class DashboardApiService {
  private baseUrl: string;
  private hubConnection: HubConnection | null = null;
  private token: string | null = null;

  constructor(baseUrl: string = 'https://localhost:7205') {
    this.baseUrl = baseUrl;
  }

  // Set authentication token
  setAuthToken(token: string) {
    this.token = token;
  }

  // Get request headers with authentication
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  // Initialize SignalR connection for real-time updates
  async initializeSignalR(callbacks: {
    onRealtimeUpdate: (data: RealtimeData) => void;
    onNewUserRegistered?: (user: NewUser) => void;
    onNewRecipeAdded?: (recipe: NewRecipe) => void;
    onTopUsersUpdated?: (users: TopUser[]) => void;
    onTopRecipesUpdated?: (recipes: TopRecipe[]) => void;
  }): Promise<void> {
    try {
      this.hubConnection = new HubConnectionBuilder()
        .withUrl(`${this.baseUrl}/dashboardHub`, {
          accessTokenFactory: () => this.token || ''
        })
        .withAutomaticReconnect()
        .configureLogging(LogLevel.Information)
        .build();

      // Listen for real-time updates
      this.hubConnection.on('RealtimeUpdate', callbacks.onRealtimeUpdate);
      
      if (callbacks.onNewUserRegistered) {
        this.hubConnection.on('NewUserRegistered', callbacks.onNewUserRegistered);
      }

      if (callbacks.onNewRecipeAdded) {
        this.hubConnection.on('NewRecipeAdded', callbacks.onNewRecipeAdded);
      }

      if (callbacks.onTopUsersUpdated) {
        this.hubConnection.on('TopUsersUpdated', callbacks.onTopUsersUpdated);
      }

      if (callbacks.onTopRecipesUpdated) {
        this.hubConnection.on('TopRecipesUpdated', callbacks.onTopRecipesUpdated);
      }

      await this.hubConnection.start();
      await this.hubConnection.invoke('JoinAdminGroup');
      console.log('SignalR Connected');
    } catch (error) {
      console.error('SignalR Connection Error:', error);
      throw error;
    }
  }

  // Disconnect SignalR
  async disconnectSignalR(): Promise<void> {
    if (this.hubConnection) {
      try {
        await this.hubConnection.invoke('LeaveAdminGroup');
        await this.hubConnection.stop();
      } catch (error) {
        console.error('Error disconnecting SignalR:', error);
      } finally {
        this.hubConnection = null;
      }
    }
  }

  // Check SignalR connection status
  getConnectionState(): string {
    return this.hubConnection?.state || 'Disconnected';
  }

  // Fetch dashboard statistics
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const response = await fetch(`${this.baseUrl}/api/admin/dashboard/stats`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }

  // Fetch new users with pagination
  async getNewUsers(page: number = 1, limit: number = 10): Promise<NewUser[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/admin/dashboard/new-users?page=${page}&limit=${limit}`,
        {
          method: 'GET',
          headers: this.getHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching new users:', error);
      throw error;
    }
  }

  // Fetch new recipes with pagination
  async getNewRecipes(page: number = 1, limit: number = 10): Promise<NewRecipe[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/admin/dashboard/new-recipes?page=${page}&limit=${limit}`,
        {
          method: 'GET',
          headers: this.getHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching new recipes:', error);
      throw error;
    }
  }

  // Fetch top users
  async getTopUsers(limit: number = 3): Promise<TopUser[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/admin/dashboard/top-users?limit=${limit}`,
        {
          method: 'GET',
          headers: this.getHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching top users:', error);
      throw error;
    }
  }

  // Fetch top recipes
  async getTopRecipes(limit: number = 3): Promise<TopRecipe[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/admin/dashboard/top-recipes?limit=${limit}`,
        {
          method: 'GET',
          headers: this.getHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching top recipes:', error);
      throw error;
    }
  }

  // Fetch real-time metrics
  async getRealtimeMetrics(): Promise<RealtimeData> {
    try {
      const response = await fetch(`${this.baseUrl}/api/admin/dashboard/realtime-metrics`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching realtime metrics:', error);
      throw error;
    }
  }

  // Fetch all dashboard data at once
  async getDashboardData(): Promise<DashboardData> {
    try {
      const [stats, newUsers, newRecipes, topUsers, topRecipes, realtimeData] = await Promise.all([
        this.getDashboardStats(),
        this.getNewUsers(1, 10),
        this.getNewRecipes(1, 10),
        this.getTopUsers(3),
        this.getTopRecipes(3),
        this.getRealtimeMetrics()
      ]);

      return {
        stats,
        newUsers,
        newRecipes,
        topUsers,
        topRecipes,
        realtimeData
      };
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  }

  // Utility method to format dates
  static formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Utility method to format numbers
  static formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }

  // Utility method to get initials from name
  static getInitials(firstName: string, lastName: string): string {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }

  // Utility method to get status color
  static getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-600';
      case 'restricted':
        return 'bg-yellow-100 text-yellow-600';
      case 'banned':
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  }
}

// Export singleton instance
export const dashboardApi = new DashboardApiService();
export default dashboardApi;

// React Hook for using the dashboard API
export const useDashboardApi = () => {
  return {
    api: dashboardApi,
    formatDate: DashboardApiService.formatDate,
    formatNumber: DashboardApiService.formatNumber,
    getInitials: DashboardApiService.getInitials,
    getStatusColor: DashboardApiService.getStatusColor
  };
};