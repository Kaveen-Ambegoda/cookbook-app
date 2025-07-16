'use client';
import { mockUsers, User as UserType } from '@/app/Admin/Layouts/Data/userData';
import { useEffect, useState } from 'react';
import {
  Search, Filter, MoreVertical, ChevronDown, Plus,
  CheckCircle, XCircle, Flag, AlertTriangle, Clock,
  User, Users, Crown, Calendar, Ban, Trash2, Eye, Edit,
  Shield, MessageSquare, Heart, Video, Image, Zap,
  TrendingUp, Award, Star,
  DollarSign, Activity, UserCheck, UserX, Lock
} from 'lucide-react';

interface Analytics {
  totalUsers: number;
  totalHosts: number;
  activeUsers: number;
  bannedUsers: number;
  restrictedUsers: number;
  reportedUsers: number;
  topUsers: UserType[];
  topHosts: UserType[];
  recentActivity: any[];
}

export default function AdvancedUserManagement() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [analytics, setAnalytics] = useState<Analytics>({
    totalUsers: 0,
    totalHosts: 0,
    activeUsers: 0,
    bannedUsers: 0,
    restrictedUsers: 0,
    reportedUsers: 0,
    topUsers: [],
    topHosts: [],
    recentActivity: []
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [showRestrictionModal, setShowRestrictionModal] = useState(false);
  const [currentTab, setCurrentTab] = useState<'users' | 'analytics' | 'reports'>('users');

  useEffect(() => {
  setUsers(mockUsers);

  const mockAnalytics: Analytics = {
    totalUsers: mockUsers.length,
    totalHosts: mockUsers.filter(u => u.role === 'host').length,
    activeUsers: mockUsers.filter(u => u.status === 'active').length,
    bannedUsers: mockUsers.filter(u => u.status === 'banned').length,
    restrictedUsers: mockUsers.filter(u => u.status === 'restricted').length,
    reportedUsers: mockUsers.filter(u => u.reported).length,
    topUsers: mockUsers.filter(u => u.role === 'normal').sort((a, b) => b.engagementScore - a.engagementScore).slice(0, 5),
    topHosts: mockUsers.filter(u => u.role === 'host').sort((a, b) => (b.followers || 0) - (a.followers || 0)).slice(0, 5),
    recentActivity: []
  };

  setAnalytics(mockAnalytics);
}, []);
  // Filter users based on view type and search
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    switch (viewType) {
      case 'normal': return user.role === 'normal' && matchesSearch;
      case 'host': return user.role === 'host' && matchesSearch;
      case 'reported': return user.reported && matchesSearch;
      case 'restricted': return user.status === 'restricted' && matchesSearch;
      case 'banned': return user.status === 'banned' && matchesSearch;
      default: return matchesSearch;
    }
  });

  const handleUserAction = (action: string, userId: number) => {
    setUsers(prev => prev.map(user => {
      if (user.id === userId) {
        switch (action) {
          case 'ban':
            return { ...user, status: 'banned' as const };
          case 'unban':
            return { ...user, status: 'active' as const };
          case 'restrict':
            return { ...user, status: 'restricted' as const };
          case 'unrestrict':
            return { ...user, status: 'active' as const };
          case 'downgrade':
            return { ...user, role: 'normal' as const, subscriptionType: null };
          case 'upgrade':
            return { ...user, role: 'host' as const, subscriptionType: 'monthly' as const };
          default:
            return user;
        }
      }
      return user;
    }));
  };

  const handleRestrictionChange = (userId: number, restrictions: any) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, restrictions } : user
    ));
  };

  const StatCard = ({ title, value, icon: Icon, color, subtitle }: any) => (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600">{title}</p>
          <p className={`text-3xl font-bold ${color}`}>{value}</p>
          {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-full ${color.replace('text-', 'bg-').replace('-600', '-100')}`}>
          <Icon size={24} className={color} />
        </div>
      </div>
    </div>
  );

  const UserDetailsModal = ({ user, onClose }: { user: UserType; onClose: () => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                {user.role === 'host' ? <Crown size={24} /> : <User size={24} />}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{user.name}</h2>
                <p className="text-blue-100">{user.email}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    user.role === 'host' ? 'bg-yellow-400 text-yellow-900' : 'bg-blue-400 text-blue-900'
                  }`}>
                    {user.role.toUpperCase()}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    user.status === 'active' ? 'bg-green-400 text-green-900' :
                    user.status === 'restricted' ? 'bg-orange-400 text-orange-900' :
                    'bg-red-400 text-red-900'
                  }`}>
                    {user.status.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors">
              <XCircle size={24} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* User Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl">
              <div className="flex items-center space-x-2">
                <Heart size={20} className="text-blue-600" />
                <div>
                  <p className="text-sm text-blue-600 font-medium">Likes</p>
                  <p className="text-xl font-bold text-blue-700">{user.likes.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl">
              <div className="flex items-center space-x-2">
                <MessageSquare size={20} className="text-green-600" />
                <div>
                  <p className="text-sm text-green-600 font-medium">Comments</p>
                  <p className="text-xl font-bold text-green-700">{user.comments.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl">
              <div className="flex items-center space-x-2">
                <Video size={20} className="text-purple-600" />
                <div>
                  <p className="text-sm text-purple-600 font-medium">Videos Watched</p>
                  <p className="text-xl font-bold text-purple-700">{user.videosWatched.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl">
              <div className="flex items-center space-x-2">
                <TrendingUp size={20} className="text-orange-600" />
                <div>
                  <p className="text-sm text-orange-600 font-medium">Engagement Score</p>
                  <p className="text-xl font-bold text-orange-700">{user.engagementScore}%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Host Specific Info */}
          {user.role === 'host' && (
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl border border-yellow-200">
              <h3 className="text-lg font-semibold text-yellow-800 mb-4 flex items-center">
                <Crown size={20} className="mr-2" />
                Host Information
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-yellow-600">Subscription</p>
                  <p className="font-semibold text-yellow-800">{user.subscriptionType?.toUpperCase() || 'None'}</p>
                </div>
                <div>
                  <p className="text-sm text-yellow-600">Live Videos</p>
                  <p className="font-semibold text-yellow-800">{user.liveVideos || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-yellow-600">Posts</p>
                  <p className="font-semibold text-yellow-800">{user.posts || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-yellow-600">Followers</p>
                  <p className="font-semibold text-yellow-800">{user.followers?.toLocaleString() || 0}</p>
                </div>
              </div>
            </div>
          )}

          {/* User Restrictions */}
          <div className="bg-slate-50 p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
              <Shield size={20} className="mr-2" />
              User Restrictions
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(user.restrictions).map(([key, restricted]) => (
                <div key={key} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                  <span className="text-sm font-medium text-slate-700 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <div className={`w-4 h-4 rounded-full ${restricted ? 'bg-red-500' : 'bg-green-500'}`} />
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-200">
            {user.status === 'active' ? (
              <>
                <button
                  onClick={() => handleUserAction('ban', user.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                >
                  <Ban size={16} />
                  <span>Ban User</span>
                </button>
                <button
                  onClick={() => handleUserAction('restrict', user.id)}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2"
                >
                  <Lock size={16} />
                  <span>Restrict User</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => handleUserAction(user.status === 'banned' ? 'unban' : 'unrestrict', user.id)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <CheckCircle size={16} />
                <span>{user.status === 'banned' ? 'Unban' : 'Remove Restrictions'}</span>
              </button>
            )}
            
            {user.role === 'host' && (
              <button
                onClick={() => handleUserAction('downgrade', user.id)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
              >
                <User size={16} />
                <span>Downgrade to Normal</span>
              </button>
            )}
            
            {user.role === 'normal' && (
              <button
                onClick={() => handleUserAction('upgrade', user.id)}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors flex items-center space-x-2"
              >
                <Crown size={16} />
                <span>Upgrade to Host</span>
              </button>
            )}
            
            <button
              onClick={() => setShowRestrictionModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Shield size={16} />
              <span>Manage Restrictions</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">User Management Dashboard</h1>
          <p className="text-slate-600 mt-1">Comprehensive user and host management system</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-lg flex items-center space-x-2">
            <Plus size={16} />
            <span>Add User</span>
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-lg">
            Export Data
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 mb-6 bg-white p-1 rounded-xl shadow-sm border border-slate-200">
        {[
          { id: 'users', label: 'Users', icon: Users },
          { id: 'analytics', label: 'Analytics', icon: TrendingUp },
          { id: 'reports', label: 'Reports', icon: Flag }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setCurrentTab(tab.id as any)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-200 ${
              currentTab === tab.id 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <tab.icon size={18} />
            <span className="font-medium">{tab.label}</span>
          </button>
        ))}
      </div>

      {currentTab === 'analytics' ? (
        /* Analytics Dashboard */
        <div className="space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            <StatCard title="Total Users" value={analytics.totalUsers} icon={Users} color="text-blue-600" />
            <StatCard title="Host Users" value={analytics.totalHosts} icon={Crown} color="text-yellow-600" />
            <StatCard title="Active Users" value={analytics.activeUsers} icon={CheckCircle} color="text-green-600" />
            <StatCard title="Restricted" value={analytics.restrictedUsers} icon={Lock} color="text-orange-600" />
            <StatCard title="Banned Users" value={analytics.bannedUsers} icon={Ban} color="text-red-600" />
            <StatCard title="Reported" value={analytics.reportedUsers} icon={Flag} color="text-purple-600" />
          </div>

          {/* Top Users */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                <Star size={20} className="mr-2 text-yellow-500" />
                Top Normal Users
              </h3>
              <div className="space-y-3">
                {analytics.topUsers.map((user, index) => (
                  <div key={user.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{user.name}</p>
                        <p className="text-sm text-slate-600">{user.likes.toLocaleString()} likes</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-slate-800">{user.engagementScore}%</p>
                      <p className="text-xs text-slate-600">engagement</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                <Crown size={20} className="mr-2 text-yellow-500" />
                Top Host Users
              </h3>
              <div className="space-y-3">
                {analytics.topHosts.map((user, index) => (
                  <div key={user.id} className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{user.name}</p>
                        <p className="text-sm text-slate-600">{user.followers?.toLocaleString()} followers</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-slate-800">{user.liveVideos}</p>
                      <p className="text-xs text-slate-600">live videos</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Users Table */
        <div className="space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-200">
            <div className="relative flex-1 max-w-md">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              {['all', 'normal', 'host', 'reported', 'restricted', 'banned'].map(type => (
                <button
                  key={type}
                  onClick={() => setViewType(type as any)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    viewType === type
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <h2 className="text-lg font-semibold flex items-center">
                <Users size={20} className="mr-2" />
                Users ({filteredUsers.length})
              </h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Activity</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Last Active</th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredUsers.map(user => (
                    <tr
                      key={user.id}
                      className="hover:bg-slate-50 cursor-pointer transition-colors duration-200"
                      onClick={() => setSelectedUser(user)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{user.name}</p>
                            <p className="text-sm text-slate-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          user.role === 'host' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {user.role === 'host' && <Crown size={12} className="mr-1" />}
                          {user.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          user.status === 'active' ? 'bg-green-100 text-green-800' :
                          user.status === 'restricted' ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {user.status === 'active' && <CheckCircle size={12} className="mr-1" />}
                          {user.status === 'restricted' && <Lock size={12} className="mr-1" />}
                          {user.status === 'banned' && <Ban size={12} className="mr-1" />}
                          {user.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-4 text-sm text-slate-600">
                          <span className="flex items-center">
                            <Heart size={14} className="mr-1 text-red-500" />
                            {user.likes.toLocaleString()}
                          </span>
                          <span className="flex items-center">
                            <MessageSquare size={14} className="mr-1 text-blue-500" />
                            {user.comments.toLocaleString()}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {user.lastActive}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (user.status === 'active') {
                              handleUserAction('ban', user.id);
                            } else {
                              handleUserAction(user.status === 'banned' ? 'unban' : 'unrestrict', user.id);
                            }
                          }}
                          className={`p-2 rounded-lg transition-colors ${
                            user.status === 'active' 
                              ? 'text-red-600 hover:bg-red-50' 
                              : 'text-green-600 hover:bg-green-50'
                          }`}
                          title={user.status === 'active' ? 'Ban User' : 'Restore User'}
                        >
                          {user.status === 'active' ? <Ban size={16} /> : <CheckCircle size={16} />}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {selectedUser && (
        <UserDetailsModal 
          user={selectedUser} 
          onClose={() => setSelectedUser(null)} 
        />
      )}

      {/* Restriction Management Modal */}
      {showRestrictionModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800 flex items-center">
                <Shield size={20} className="mr-2" />
                Manage User Restrictions - {selectedUser.name}
              </h3>
            </div>
            <div className="p-6 space-y-4">
              {Object.entries(selectedUser.restrictions).map(([key, restricted]) => (
                <div key={key} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-800 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                    <p className="text-sm text-slate-600">
                      {restricted ? 'User is restricted from this action' : 'User can perform this action'}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const newRestrictions = {
                        ...selectedUser.restrictions,
                        [key]: !restricted
                      };
                      handleRestrictionChange(selectedUser.id, newRestrictions);
                      setSelectedUser({ ...selectedUser, restrictions: newRestrictions });
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      restricted 
                        ? 'bg-red-600 text-white hover:bg-red-700' 
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {restricted ? 'Remove Restriction' : 'Add Restriction'}
                  </button>
                </div>
              ))}
            </div>
            <div className="p-6 border-t border-slate-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowRestrictionModal(false)}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowRestrictionModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}