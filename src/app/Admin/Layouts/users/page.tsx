// src/components/AdvancedUserManagement.tsx
'use client';

import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import {
  Users, Crown, CheckCircle, Ban, Lock, Flag, TrendingUp,
  Search, Plus, Shield, MessageSquare, Heart, Video, Loader2
} from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  fetchUsers,
  updateUserStatus,
  updateUserRole,
  updateUserRestrictions
} from '@/app/Admin/Layouts/Data/userData';
import { User } from '@/app/Admin/Layouts/Data/userData';
import { useSearchParams } from 'next/navigation';

// Type definitions
type UserStatus = 'active' | 'banned' | 'restricted';
type UserRole = 'normal' | 'host' | 'admin';
type StatusFilter = 'all' | UserStatus;
type SortField = keyof User;
type ActionType = 'ban' | 'unban' | 'upgrade' | 'downgrade';

interface Analytics {
  totalUsers: number;
  totalHosts: number;
  activeUsers: number;
  bannedUsers: number;
  restrictedUsers: number;
  reportedUsers: number;
  topUsers: User[];
  topHosts: User[];
}

interface ConfirmAction {
  user: User;
  action: ActionType;
}

interface LoadingStates {
  main: boolean;
  action: boolean;
  restriction: boolean;
}

// Custom hook for debounced search
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Error boundary component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('User Management Error:', error, errorInfo);
    toast.error('An unexpected error occurred. Please refresh the page.');
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 text-center">
          <div className="text-red-600 mb-4">
            <Ban className="mx-auto mb-2" size={48} />
            <h2 className="text-xl font-bold">Something went wrong</h2>
            <p className="text-sm mt-2">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function AdvancedUserManagement() {
  // State management
  const [users, setUsers] = useState<User[]>([]);
  const [analytics, setAnalytics] = useState<Analytics>({
    totalUsers: 0,
    totalHosts: 0,
    activeUsers: 0,
    bannedUsers: 0,
    restrictedUsers: 0,
    reportedUsers: 0,
    topUsers: [],
    topHosts: []
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortAsc, setSortAsc] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);
  const [loading, setLoading] = useState<LoadingStates>({
    main: false,
    action: false,
    restriction: false
  });
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Refs for cleanup
  const abortControllerRef = useRef<AbortController | null>(null);
  const isMountedRef = useRef(true);

  // Debounced search term
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Load users effect
  useEffect(() => {
    loadUsers();
  }, []);

  // Enhanced error handling
  const handleError = useCallback((err: unknown, context: string = 'operation') => {
    const errorMessage = err instanceof Error ? err.message : `Unknown error occurred during ${context}`;
    
    if (isMountedRef.current) {
      setError(errorMessage);
      toast.error(`${context.charAt(0).toUpperCase() + context.slice(1)} failed: ${errorMessage}`);
    }
    
    console.error(`${context} error:`, err);
  }, []);

  // Load users with retry logic
  const loadUsers = useCallback(async (attempt: number = 0) => {
    if (!isMountedRef.current) return;

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    setLoading(prev => ({ ...prev, main: true }));
    setError(null);

    try {
      const data = await fetchUsers();
      
      if (isMountedRef.current) {
        // Validate data structure
        if (!Array.isArray(data)) {
          throw new Error('Invalid data format received from server');
        }

        // Validate each user object
        const validatedUsers = data.filter(user => {
          return user && 
                 typeof user.id === 'number' && 
                 typeof user.name === 'string' && 
                 typeof user.email === 'string' &&
                 ['active', 'banned', 'restricted'].includes(user.status) &&
                 ['normal', 'host', 'admin'].includes(user.role);
        });

        if (validatedUsers.length !== data.length) {
          console.warn(`Filtered out ${data.length - validatedUsers.length} invalid user records`);
        }

        setUsers(validatedUsers);
        calculateAnalytics(validatedUsers);
        setRetryCount(0);
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return; // Request was cancelled
      }

      if (attempt < 3 && isMountedRef.current) {
        // Retry with exponential backoff
        setTimeout(() => {
          setRetryCount(attempt + 1);
          loadUsers(attempt + 1);
        }, Math.pow(2, attempt) * 1000);
        return;
      }

      handleError(err, 'loading users');
    } finally {
      if (isMountedRef.current) {
        setLoading(prev => ({ ...prev, main: false }));
      }
    }
  }, [handleError]);

  // Calculate analytics with validation
  const calculateAnalytics = useCallback((data: User[]) => {
    if (!Array.isArray(data) || !isMountedRef.current) return;

    try {
      const analytics: Analytics = {
        totalUsers: data.length,
        totalHosts: data.filter(u => u.role === 'host').length,
        activeUsers: data.filter(u => u.status === 'active').length,
        bannedUsers: data.filter(u => u.status === 'banned').length,
        restrictedUsers: data.filter(u => u.status === 'restricted').length,
        reportedUsers: data.filter(u => u.reported === true).length,
        topUsers: data
          .filter(u => u.role === 'normal' && typeof u.engagementScore === 'number')
          .sort((a, b) => (b.engagementScore || 0) - (a.engagementScore || 0))
          .slice(0, 5),
        topHosts: data
          .filter(u => u.role === 'host' && typeof u.followers === 'number')
          .sort((a, b) => (b.followers || 0) - (a.followers || 0))
          .slice(0, 5)
      };

      setAnalytics(analytics);
    } catch (err) {
      handleError(err, 'calculating analytics');
    }
  }, [handleError]);

  // Memoized filtered and sorted users
  const filteredUsers = useMemo(() => {
    if (!Array.isArray(users)) return [];

    try {
      return users
        .filter(user => {
          // Status filter
          const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
          
          // Search filter
          const searchLower = debouncedSearchTerm.toLowerCase();
          const matchesSearch = !searchLower || 
            (user.name?.toLowerCase().includes(searchLower) || 
             user.email?.toLowerCase().includes(searchLower));

          return matchesStatus && matchesSearch;
        })
        .sort((a, b) => {
          const aValue = a[sortField];
          const bValue = b[sortField];
          
          // Handle null/undefined values
          if (aValue == null && bValue == null) return 0;
          if (aValue == null) return 1;
          if (bValue == null) return -1;
          
          // Type-safe comparison
          let comparison = 0;
          if (typeof aValue === 'string' && typeof bValue === 'string') {
            comparison = aValue.localeCompare(bValue);
          } else if (typeof aValue === 'number' && typeof bValue === 'number') {
            comparison = aValue - bValue;
          } else {
            comparison = String(aValue).localeCompare(String(bValue));
          }
          
          return sortAsc ? comparison : -comparison;
        });
    } catch (err) {
      handleError(err, 'filtering users');
      return [];
    }
  }, [users, statusFilter, debouncedSearchTerm, sortField, sortAsc, handleError]);

  // Handle confirmation with loading state
  const handleConfirm = useCallback(async () => {
    if (!confirmAction || !isMountedRef.current) return;

    const { user, action } = confirmAction;
    setLoading(prev => ({ ...prev, action: true }));

    try {
      if (action === 'ban' || action === 'unban') {
        const newStatus: UserStatus = action === 'ban' ? 'banned' : 'active';
        await updateUserStatus(user.id, newStatus);
        toast.success(`${user.name} has been ${action === 'ban' ? 'banned' : 'unbanned'}`);
      } else if (action === 'upgrade' || action === 'downgrade') {
        const newRole: UserRole = action === 'upgrade' ? 'host' : 'normal';
        await updateUserRole(user.id, newRole);
        toast.success(`${user.name} has been ${action === 'upgrade' ? 'promoted to host' : 'demoted to normal user'}`);
      }
      
      await loadUsers();
    } catch (err) {
      handleError(err, 'user action');
    } finally {
      if (isMountedRef.current) {
        setLoading(prev => ({ ...prev, action: false }));
        setConfirmAction(null);
      }
    }
  }, [confirmAction, loadUsers, handleError]);

  // Handle restriction toggle with loading state
  const handleRestrictionToggle = useCallback(async (userId: number, key: keyof User['restrictions']) => {
    const user = users.find(u => u.id === userId);
    if (!user || !user.restrictions || !isMountedRef.current) return;

    setLoading(prev => ({ ...prev, restriction: true }));

    try {
      const updatedRestrictions = { 
        ...user.restrictions, 
        [key]: !user.restrictions[key] 
      };
      
      await updateUserRestrictions(userId, updatedRestrictions);
      toast.success(`${key} restriction ${updatedRestrictions[key] ? 'enabled' : 'disabled'} for ${user.name}`);
      await loadUsers();
    } catch (err) {
      handleError(err, 'updating restrictions');
    } finally {
      if (isMountedRef.current) {
        setLoading(prev => ({ ...prev, restriction: false }));
      }
    }
  }, [users, loadUsers, handleError]);

  // Event handlers
  const handleStatusFilterChange = useCallback((value: string) => {
    setStatusFilter(value as StatusFilter);
  }, []);

  const handleSortFieldChange = useCallback((value: string) => {
    setSortField(value as SortField);
  }, []);

  const handleSortToggle = useCallback(() => {
    setSortAsc(prev => !prev);
  }, []);

  const handleUserSelect = useCallback((user: User) => {
    setSelectedUser(user);
  }, []);

  const handleActionConfirm = useCallback((user: User, action: ActionType) => {
    setConfirmAction({ user, action });
  }, []);
  
  // Get highlight user from URL search params
  const searchParams = useSearchParams();
  const highlightUser = searchParams.get('highlight');
  const highlightUserId = highlightUser ? Number(highlightUser) : null;

  // Render loading state
  if (loading.main && users.length === 0) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-64">
        <Loader2 className="animate-spin text-blue-500 mb-4" size={48} />
        <p className="text-gray-600">Loading users...</p>
        {retryCount > 0 && (
          <p className="text-sm text-gray-500 mt-2">
            Retry attempt {retryCount}/3
          </p>
        )}
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="p-6 space-y-6">
        <ToastContainer 
          position="top-right" 
          autoClose={3000} 
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        
        {/* Header with search and filters */}
        <div className="flex flex-wrap gap-4 justify-between items-center">
          <div className="flex gap-2 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="Search users..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-300 pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                aria-label="Search users"
              />
            </div>
            
            <select 
              value={statusFilter} 
              onChange={(e) => handleStatusFilterChange(e.target.value)}
              className="border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Filter by status"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="restricted">Restricted</option>
              <option value="banned">Banned</option>
            </select>
          </div>

          <div className="flex gap-2 items-center">
            <label htmlFor="sort-select" className="text-sm font-medium">Sort by:</label>
            <select 
              id="sort-select"
              value={sortField} 
              onChange={(e) => handleSortFieldChange(e.target.value)}
              className="border border-gray-300 px-2 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="name">Name</option>
              <option value="email">Email</option>
              <option value="status">Status</option>
              <option value="role">Role</option>
              <option value="engagementScore">Engagement</option>
            </select>
            
            <button 
              onClick={handleSortToggle} 
              className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={`Sort ${sortAsc ? 'descending' : 'ascending'}`}
            >
              {sortAsc ? '↑' : '↓'}
            </button>

            <button
              onClick={() => loadUsers()}
              disabled={loading.main}
              className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Refresh users"
            >
              {loading.main ? <Loader2 className="animate-spin" size={16} /> : 'Refresh'}
            </button>
          </div>
        </div>

        {/* Error display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <Ban className="text-red-500 mr-2" size={20} />
              <p className="text-red-700">{error}</p>
              <button
                onClick={() => loadUsers()}
                className="ml-auto px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Analytics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatCard title="Total Users" value={analytics.totalUsers} icon={Users} />
          <StatCard title="Hosts" value={analytics.totalHosts} icon={Crown} />
          <StatCard title="Active" value={analytics.activeUsers} icon={CheckCircle} />
          <StatCard title="Restricted" value={analytics.restrictedUsers} icon={Lock} />
          <StatCard title="Banned" value={analytics.bannedUsers} icon={Ban} />
          <StatCard title="Reported" value={analytics.reportedUsers} icon={Flag} />
        </div>

        {/* Users Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {filteredUsers.length === 0 ? (
            <div className="p-8 text-center">
              <Users className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-500">
                {users.length === 0 ? 'No users found' : 'No users match your search criteria'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {[
                      { key: 'name', label: 'Name' },
                      { key: 'email', label: 'Email' },
                      { key: 'role', label: 'Role' },
                      { key: 'status', label: 'Status' },
                      { key: 'engagementScore', label: 'Engagement' },
                      { key: 'actions', label: 'Actions' }
                    ].map(header => (
                      <th 
                        key={header.key}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {header.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className={`hover:bg-gray-50 ${user.id === highlightUserId ? 'bg-yellow-100' : ''}`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name}
                          </div>
                          {user.reported && (
                            <Flag className="ml-2 text-red-500" size={16} />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.role === 'host' ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.status === 'active' ? 'bg-green-100 text-green-800' :
                          user.status === 'banned' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.engagementScore || 0}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                        <button
                          onClick={() => handleUserSelect(user)}
                          className="text-blue-600 hover:text-blue-800 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                          disabled={loading.action}
                        >
                          View
                        </button>
                        
                        <button
                          onClick={() => handleActionConfirm(user, user.status === 'active' ? 'ban' : 'unban')}
                          className={`hover:underline focus:outline-none focus:ring-2 focus:ring-red-500 rounded ${
                            user.status === 'active' ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'
                          }`}
                          disabled={loading.action || confirmAction !== null}
                        >
                          {user.status === 'active' ? 'Ban' : 'Unban'}
                        </button>
                        
                        <button
                          onClick={() => handleActionConfirm(user, user.role === 'host' ? 'downgrade' : 'upgrade')}
                          className="text-purple-600 hover:text-purple-800 hover:underline focus:outline-none focus:ring-2 focus:ring-purple-500 rounded"
                          disabled={loading.action || confirmAction !== null}
                        >
                          {user.role === 'host' ? 'Demote' : 'Promote'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* User Detail Modal */}
        {selectedUser && (
          <Modal 
            onClose={() => setSelectedUser(null)}
            title={`User Details - ${selectedUser.name}`}
            size="large"
          >
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedUser.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedUser.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Role</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedUser.role}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedUser.status}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Engagement Score</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedUser.engagementScore || 0}%</p>
                </div>
                {selectedUser.followers && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Followers</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedUser.followers}</p>
                  </div>
                )}
              </div>

              {selectedUser.restrictions && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Restrictions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.entries(selectedUser.restrictions).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-700 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <button
                          onClick={() => handleRestrictionToggle(selectedUser.id, key as keyof User['restrictions'])}
                          disabled={loading.restriction}
                          className={`px-3 py-1 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 ${
                            value 
                              ? 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500' 
                              : 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500'
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {loading.restriction ? (
                            <Loader2 className="animate-spin" size={14} />
                          ) : (
                            value ? 'Restricted' : 'Allowed'
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Modal>
        )}

        {/* Confirmation Modal */}
        {confirmAction && (
          <Modal 
            onClose={() => setConfirmAction(null)}
            title="Confirm Action"
            size="small"
          >
            <div className="space-y-4">
              <p className="text-gray-700">
                Are you sure you want to <strong>{confirmAction.action}</strong> user{' '}
                <strong>{confirmAction.user.name}</strong>?
              </p>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setConfirmAction(null)}
                  disabled={loading.action}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={loading.action}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {loading.action && <Loader2 className="animate-spin" size={16} />}
                  <span>Confirm</span>
                </button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </ErrorBoundary>
  );
}

// Enhanced StatCard component
const StatCard = ({ title, value, icon: Icon }: { title: string; value: number; icon: React.ElementType }) => (
  <div className="bg-white shadow-sm rounded-lg p-4 hover:shadow-md transition-shadow">
    <div className="flex items-center space-x-3">
      <div className="p-2 bg-blue-50 rounded-lg">
        <Icon className="text-blue-600" size={24} />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</p>
      </div>
    </div>
  </div>
);

// Enhanced Modal component with accessibility
const Modal: React.FC<{
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  size?: 'small' | 'medium' | 'large';
}> = ({ onClose, children, title, size = 'medium' }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Focus management
  useEffect(() => {
    const focusableElements = modalRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements && focusableElements.length > 0) {
      (focusableElements[0] as HTMLElement).focus();
    }
  }, []);

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const sizeClasses = {
    small: 'max-w-md',
    medium: 'max-w-lg',
    large: 'max-w-4xl'
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div 
        ref={modalRef}
        className={`bg-white rounded-lg shadow-xl p-6 w-full ${sizeClasses[size]} max-h-[90vh] overflow-y-auto relative`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 rounded-full p-1"
          aria-label="Close modal"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Title */}
        {title && (
          <h2 id="modal-title" className="text-xl font-semibold text-gray-900 mb-4 pr-8">
            {title}
          </h2>
        )}

        {/* Content */}
        <div className="mt-2">
          {children}
        </div>
      </div>
    </div>
  );
};