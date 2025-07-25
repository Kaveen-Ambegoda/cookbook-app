// src/data/userData.ts
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'User' | 'host' | 'admin';
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

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role?: 'User' | 'host' | 'admin';
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  role?: string;
  status?: string;
  avatar?: string;
  subscriptionType?: string;
  subscriptionEnd?: string;
  liveVideos?: number;
  posts?: number;
  events?: number;
  followers?: number;
  likes?: number;
  comments?: number;
  videosWatched?: number;
  engagementScore?: number;
}

// Enhanced interface for ban/unban operations
export interface BanUserRequest {
  status: 'banned' | 'active';
  autoRestrictFunctions?: boolean; // Whether to automatically restrict all functions
  reason?: string; // Optional reason for the ban
}

// Interface for batch restriction updates
export interface BulkRestrictionUpdate {
  userIds: number[];
  restrictions: Partial<User['restrictions']>;
}

const API_BASE = "https://localhost:7205/api/Users";

// Helper function to handle API responses
const handleApiResponse = async (response: Response): Promise<any> => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  
  // Handle 204 No Content responses
  if (response.status === 204) {
    return null;
  }
  
  return response.json();
};

// Helper function to create default restrictions
const createDefaultRestrictions = (): User['restrictions'] => ({
  commenting: false,
  liking: false,
  posting: false,
  messaging: false,
  liveStreaming: false,
});

// Helper function to create full restrictions (for banned users)
const createFullRestrictions = (): User['restrictions'] => ({
  commenting: true,
  liking: true,
  posting: true,
  messaging: true,
  liveStreaming: true,
});

// Get all users
export const fetchUsers = async (): Promise<User[]> => {
  try {
    const response = await fetch(API_BASE, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const users = await handleApiResponse(response);
    
    // Validate and transform the response data
    return users.map((user: any) => ({
      ...user,
      // Ensure restrictions object exists
      restrictions: user.restrictions || createDefaultRestrictions(),
      // Auto-apply restrictions for banned users if not already set
      ...(user.status === 'banned' && !hasAllRestrictions(user.restrictions) && {
        restrictions: createFullRestrictions()
      })
    }));
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// Helper function to check if user has all restrictions enabled
const hasAllRestrictions = (restrictions: User['restrictions'] | undefined): boolean => {
  if (!restrictions) return false;
  return Object.values(restrictions).every(restriction => restriction === true);
};

// Get single user
export const fetchUser = async (id: number): Promise<User> => {
  try {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const user = await handleApiResponse(response);
    
    // Ensure restrictions object exists
    const restrictions = user.restrictions || createDefaultRestrictions();
    
    return {
      ...user,
      restrictions: user.status === 'banned' ? createFullRestrictions() : restrictions
    };
  } catch (error) {
    console.error(`Error fetching user ${id}:`, error);
    throw error;
  }
};

// Create new user
export const createUser = async (user: CreateUserRequest): Promise<User> => {
  try {
    const response = await fetch(API_BASE, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({
        ...user,
        restrictions: createDefaultRestrictions() // Always start with no restrictions
      }),
    });
    
    return await handleApiResponse(response);
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

// Update full user object (used in editing forms)
export const updateUser = async (id: number, user: UpdateUserRequest): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify(user),
    });
    
    await handleApiResponse(response);
  } catch (error) {
    console.error(`Error updating user ${id}:`, error);
    throw error;
  }
};

// Delete user
export const deleteUser = async (id: number): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      }
    });
    
    await handleApiResponse(response);
  } catch (error) {
    console.error(`Error deleting user ${id}:`, error);
    throw error;
  }
};

// Enhanced update user status with auto-restriction support
export const updateUserStatus = async (
  id: number, 
  status: User["status"],
  options: { autoRestrictOnBan?: boolean; reason?: string } = {}
): Promise<void> => {
  try {
    const { autoRestrictOnBan = true, reason } = options;
    
    // If banning and auto-restrict is enabled, update restrictions first
    if (status === 'banned' && autoRestrictOnBan) {
      await updateUserRestrictions(id, createFullRestrictions());
    }
    
    // If unbanning, optionally remove all restrictions
    if (status === 'active') {
      await updateUserRestrictions(id, createDefaultRestrictions());
    }
    
    const response = await fetch(`${API_BASE}/${id}/status`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({ 
        status, 
        autoRestrictFunctions: autoRestrictOnBan,
        reason 
      }),
    });
    
    await handleApiResponse(response);
  } catch (error) {
    console.error(`Error updating user status for user ${id}:`, error);
    throw error;
  }
};

// Update user role
export const updateUserRole = async (id: number, role: User["role"]): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE}/${id}/role`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({ role }),
    });
    
    await handleApiResponse(response);
  } catch (error) {
    console.error(`Error updating user role for user ${id}:`, error);
    throw error;
  }
};

// Update user restrictions
export const updateUserRestrictions = async (
  id: number,
  restrictions: User["restrictions"]
): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE}/${id}/restrictions`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify(restrictions),
    });
    
    await handleApiResponse(response);
  } catch (error) {
    console.error(`Error updating user restrictions for user ${id}:`, error);
    throw error;
  }
};

// Bulk update restrictions for multiple users
export const bulkUpdateRestrictions = async (
  updates: BulkRestrictionUpdate
): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE}/bulk/restrictions`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify(updates),
    });
    
    await handleApiResponse(response);
  } catch (error) {
    console.error('Error bulk updating user restrictions:', error);
    throw error;
  }
};

// Enhanced ban user function with automatic restriction
export const banUser = async (
  id: number, 
  reason?: string, 
  autoRestrict: boolean = true
): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE}/${id}/ban`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({ 
        reason, 
        autoRestrictFunctions: autoRestrict 
      }),
    });
    
    await handleApiResponse(response);
  } catch (error) {
    console.error(`Error banning user ${id}:`, error);
    throw error;
  }
};

// Enhanced unban user function with automatic restriction removal
export const unbanUser = async (
  id: number, 
  removeRestrictions: boolean = true
): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE}/${id}/unban`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({ 
        removeAllRestrictions: removeRestrictions 
      }),
    });
    
    await handleApiResponse(response);
  } catch (error) {
    console.error(`Error unbanning user ${id}:`, error);
    throw error;
  }
};

// Get user analytics with enhanced restricted count calculation
export const fetchUserAnalytics = async (): Promise<{
  totalUsers: number;
  totalHosts: number;
  activeUsers: number;
  bannedUsers: number;
  restrictedUsers: number; // Now includes banned users and users with any restrictions
  reportedUsers: number;
  fullyRestrictedUsers: number; // Users with all functions restricted
  partiallyRestrictedUsers: number; // Users with some functions restricted
  topUsers: User[];
  topHosts: User[];
}> => {
  try {
    const response = await fetch(`${API_BASE}/analytics`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const analytics = await handleApiResponse(response);
    
    // If the backend doesn't provide the enhanced analytics, calculate them
    if (!analytics.fullyRestrictedUsers && !analytics.partiallyRestrictedUsers) {
      const users = await fetchUsers();
      
      const fullyRestrictedUsers = users.filter(user => 
        user.status === 'banned' || hasAllRestrictions(user.restrictions)
      ).length;
      
      const partiallyRestrictedUsers = users.filter(user => 
        user.status !== 'banned' && 
        !hasAllRestrictions(user.restrictions) && 
        Object.values(user.restrictions || {}).some(restriction => restriction === true)
      ).length;
      
      return {
        ...analytics,
        fullyRestrictedUsers,
        partiallyRestrictedUsers,
        restrictedUsers: fullyRestrictedUsers + partiallyRestrictedUsers
      };
    }
    
    return analytics;
  } catch (error) {
    console.error('Error fetching user analytics:', error);
    throw error;
  }
};

// Get users by restriction status
export const fetchUsersByRestrictionStatus = async (
  restrictionType: keyof User['restrictions'] | 'any' | 'all' | 'none'
): Promise<User[]> => {
  try {
    const response = await fetch(`${API_BASE}/restrictions/${restrictionType}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    return await handleApiResponse(response);
  } catch (error) {
    console.error(`Error fetching users by restriction status ${restrictionType}:`, error);
    throw error;
  }
};

// Get restriction history for a user (if supported by backend)
export const fetchUserRestrictionHistory = async (id: number): Promise<{
  userId: number;
  history: Array<{
    timestamp: string;
    action: 'restricted' | 'unrestricted' | 'banned' | 'unbanned';
    restrictionType?: keyof User['restrictions'];
    reason?: string;
    performedBy?: string;
  }>;
}> => {
  try {
    const response = await fetch(`${API_BASE}/${id}/restriction-history`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    return await handleApiResponse(response);
  } catch (error) {
    console.error(`Error fetching restriction history for user ${id}:`, error);
    throw error;
  }
};

// Utility functions for restriction management
export const restrictionUtils = {
  // Check if user has any restrictions
  hasAnyRestrictions: (user: User): boolean => {
    return user.status === 'banned' || 
           Object.values(user.restrictions || {}).some(restriction => restriction === true);
  },

  // Check if user has all restrictions
  hasAllRestrictions: (user: User): boolean => {
    return user.status === 'banned' || hasAllRestrictions(user.restrictions);
  },

  // Get list of restricted functions
  getRestrictedFunctions: (user: User): string[] => {
    if (user.status === 'banned') {
      return Object.keys(createFullRestrictions());
    }
    
    return Object.entries(user.restrictions || {})
      .filter(([_, value]) => value === true)
      .map(([key, _]) => key);
  },

  // Get list of allowed functions
  getAllowedFunctions: (user: User): string[] => {
    if (user.status === 'banned') {
      return [];
    }
    
    return Object.entries(user.restrictions || {})
      .filter(([_, value]) => value === false)
      .map(([key, _]) => key);
  },

  // Create restriction summary
  getRestrictionSummary: (user: User): string => {
    if (user.status === 'banned') {
      return 'All functions restricted (Banned)';
    }
    
    const restrictedFunctions = restrictionUtils.getRestrictedFunctions(user);
    
    if (restrictedFunctions.length === 0) {
      return 'No restrictions';
    }
    
    if (restrictedFunctions.length === Object.keys(createDefaultRestrictions()).length) {
      return 'All functions restricted';
    }
    
    return `Partially restricted: ${restrictedFunctions.join(', ')}`;
  }
};