'use client';
import { Notification,fetchNotifications, updateNotificationStatus, markAllAsRead } from '@/app/Admin/Layouts/Data/notifiData';
import React, { useState } from 'react';
import { useEffect } from "react";
import { 
  Bell, 
  AlertTriangle, 
  UserX, 
  BookOpen, 
  Bug, 
  CheckCircle, 
  XCircle, 
  Eye, 
  User, 
  Clock, 
  Filter,
  Search,
  ChefHat,
  Flag,
  Settings,
  ExternalLink,
  MessageSquare,
  Star,
  Calendar
} from 'lucide-react';



const AdminNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  useEffect(() => {
  const loadNotifications = async () => {
    try {
      const data = await fetchNotifications();
      setNotifications(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  loadNotifications();
}, []);


  const notificationTypes = [
    { key: 'all', label: 'All Notifications', icon: Bell, count: notifications.length },
    { key: 'recipe_approval', label: 'Recipe Approvals', icon: ChefHat, count: notifications.filter(n => n.type === 'recipe_approval').length },
    { key: 'user_report', label: 'User Reports', icon: UserX, count: notifications.filter(n => n.type === 'user_report').length },
    { key: 'recipe_report', label: 'Recipe Reports', icon: Flag, count: notifications.filter(n => n.type === 'recipe_report').length },
    { key: 'malfunction', label: 'System Issues', icon: Bug, count: notifications.filter(n => n.type === 'malfunction').length }
  ];

  const filteredNotifications = notifications.filter(notification => {
    const matchesTab = activeTab === 'all' || notification.type === activeTab;
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (notification.reporterName && notification.reporterName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesPriority = !priorityFilter || notification.priority === priorityFilter;
    const matchesStatus = !statusFilter || notification.status === statusFilter;
    return matchesTab && matchesSearch && matchesPriority && matchesStatus;
  });

  const handleNotificationAction = async (id: string, action: 'approve' | 'reject' | 'resolve' | 'dismiss') => {
  try {
    await updateNotificationStatus(id, action);
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? {
              ...notification,
              status:
                action === 'approve'
                  ? 'approved'
                  : action === 'reject'
                  ? 'rejected'
                  : action === 'resolve'
                  ? 'resolved'
                  : 'dismissed',
              isRead: true,
            }
          : notification
      )
    );
    setSelectedNotification(null);
  } catch (err) {
    console.error('Failed to update notification:', err);
  }
};

  const handleMarkAllRead = async () => {
  try {
    await markAllAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  } catch (err) {
    console.error('Failed to mark all as read:', err);
  }
};


  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'resolved': return 'bg-purple-100 text-purple-800';
      case 'dismissed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'recipe_approval': return ChefHat;
      case 'user_report': return UserX;
      case 'recipe_report': return Flag;
      case 'malfunction': return Bug;
      default: return Bell;
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const handleNavigateToManagement = (notification: Notification) => {
  if (notification.targetUrl) {
    // Direct navigation if targetUrl is provided
    window.location.href = notification.targetUrl;
  } else {
    // Construct URL based on type and ID
    let url = '';
    if (notification.targetType === 'user' && notification.targetId) {
      url = `/Admin/users?highlight=${notification.targetId}`;
    } else if (notification.targetType === 'recipe' && notification.targetId) {
      url = `/Admin/recipes?highlight=${notification.targetId}`;
    }

    if (url) {
      window.location.href = url;
    } else {
      alert(`No specific page for ${notification.targetName}`);
    }
  }
};
  
  if (loading) return <div className="p-6 text-gray-600">Loading notifications...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;


  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Notification Center</h1>
                <p className="text-gray-600">Manage reports, approvals, and system alerts</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                {notifications.filter(n => !n.isRead).length} unread
              </span>
              {/*Mark all Read Button */}
              <button onClick={handleMarkAllRead} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                Mark All Read
              </button>

            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
              <div className="space-y-2">
                {notificationTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.key}
                      onClick={() => setActiveTab(type.key)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                        activeTab === type.key
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{type.label}</span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        activeTab === type.key ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {type.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Pending Actions</span>
                  <span className="font-semibold text-orange-600">
                    {notifications.filter(n => n.status === 'pending').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">High Priority</span>
                  <span className="font-semibold text-red-600">
                    {notifications.filter(n => n.priority === 'high' || n.priority === 'urgent').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Today's Reports</span>
                  <span className="font-semibold text-blue-600">
                    {notifications.filter(n => new Date(n.timestamp).toDateString() === new Date().toDateString()).length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search notifications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Priorities</option>
                  <option value="urgent">Urgent</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="resolved">Resolved</option>
                  <option value="dismissed">Dismissed</option>
                </select>
              </div>
            </div>

            {/* Notifications List */}
            <div className="space-y-4">
              {filteredNotifications.map((notification) => {
                const Icon = getTypeIcon(notification.type);
                return (
                  <div
                    key={notification.id}
                    className={`bg-white rounded-lg shadow-sm border p-6 transition-all hover:shadow-md ${
                      !notification.isRead ? 'border-l-4 border-l-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className={`p-2 rounded-lg ${
                          notification.priority === 'urgent' ? 'bg-red-100' :
                          notification.priority === 'high' ? 'bg-orange-100' :
                          notification.priority === 'medium' ? 'bg-yellow-100' :
                          'bg-blue-100'
                        }`}>
                          <Icon className={`w-5 h-5 ${
                            notification.priority === 'urgent' ? 'text-red-600' :
                            notification.priority === 'high' ? 'text-orange-600' :
                            notification.priority === 'medium' ? 'text-yellow-600' :
                            'text-blue-600'
                          }`} />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(notification.priority)}`}>
                              {notification.priority.toUpperCase()}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(notification.status)}`}>
                              {notification.status.toUpperCase()}
                            </span>
                          </div>
                          
                          <p className="text-gray-600 mb-3">{notification.description}</p>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{formatTimeAgo(notification.timestamp)}</span>
                            </div>
                            {notification.reporterName && (
                              <div className="flex items-center gap-1">
                                <User className="w-4 h-4" />
                                <span>By {notification.reporterName}</span>
                              </div>
                            )}
                            {notification.targetName && (
                              <div className="flex items-center gap-1">
                                <span>Target: {notification.targetName}</span>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setSelectedNotification(notification)}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                            >
                              <Eye className="w-4 h-4" />
                              View Details
                            </button>
                            
                            {notification.targetType && (
                              <button
                                onClick={() => handleNavigateToManagement(notification)}
                                className="text-purple-600 hover:text-purple-800 text-sm font-medium flex items-center gap-1"
                              >
                                <ExternalLink className="w-4 h-4" />
                                Go to {notification.targetType === 'user' ? 'User' : 'Recipe'} Management
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {notification.status === 'pending' && (
                        <div className="flex items-center gap-2 ml-4">
                          {notification.type === 'recipe_approval' && (
                            <>
                              <button
                                onClick={() => handleNotificationAction(notification.id, 'approve')}
                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm flex items-center gap-1 transition-colors"
                              >
                                <CheckCircle className="w-4 h-4" />
                                Approve
                              </button>
                              <button
                                onClick={() => handleNotificationAction(notification.id, 'reject')}
                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm flex items-center gap-1 transition-colors"
                              >
                                <XCircle className="w-4 h-4" />
                                Reject
                              </button>
                            </>
                          )}
                          {(notification.type === 'user_report' || notification.type === 'recipe_report') && (
                            <>
                              <button
                                onClick={() => handleNotificationAction(notification.id, 'resolve')}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm flex items-center gap-1 transition-colors"
                              >
                                <CheckCircle className="w-4 h-4" />
                                Resolve
                              </button>
                              <button
                                onClick={() => handleNotificationAction(notification.id, 'dismiss')}
                                className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-lg text-sm flex items-center gap-1 transition-colors"
                              >
                                <XCircle className="w-4 h-4" />
                                Dismiss
                              </button>
                            </>
                          )}
                          {notification.type === 'malfunction' && (
                            <button
                              onClick={() => handleNotificationAction(notification.id, 'resolve')}
                              className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg text-sm flex items-center gap-1 transition-colors"
                            >
                              <Settings className="w-4 h-4" />
                              Mark Fixed
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {filteredNotifications.length === 0 && (
                <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
                  <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
                  <p className="text-gray-600">Try adjusting your filters or check back later.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Notification Detail Modal */}
        {selectedNotification && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Notification Details</h2>
                  <button
                    onClick={() => setSelectedNotification(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">{selectedNotification.title}</h3>
                    <p className="text-gray-600">{selectedNotification.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Type</span>
                      <p className="capitalize">{selectedNotification.type.replace('_', ' ')}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Priority</span>
                      <p className="capitalize">{selectedNotification.priority}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Status</span>
                      <p className="capitalize">{selectedNotification.status}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Timestamp</span>
                      <p>{new Date(selectedNotification.timestamp).toLocaleString()}</p>
                    </div>
                  </div>

                  {selectedNotification.details && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Additional Details</h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        {Object.entries(selectedNotification.details).map(([key, value]) => (
                          <div key={key} className="flex justify-between py-1">
                            <span className="text-sm font-medium text-gray-600 capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}:
                            </span>
                            <span className="text-sm text-gray-900">{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedNotification.status === 'pending' && (
                    <div className="flex justify-end gap-3 pt-4 border-t">
                      {selectedNotification.type === 'recipe_approval' && (
                        <>
                          <button
                            onClick={() => handleNotificationAction(selectedNotification.id, 'approve')}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Approve Recipe
                          </button>
                          <button
                            onClick={() => handleNotificationAction(selectedNotification.id, 'reject')}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                          >
                            <XCircle className="w-4 h-4" />
                            Reject Recipe
                          </button>
                        </>
                      )}
                      {(selectedNotification.type === 'user_report' || selectedNotification.type === 'recipe_report') && (
                        <>
                          <button
                            onClick={() => handleNotificationAction(selectedNotification.id, 'resolve')}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Resolve Issue
                          </button>
                          <button
                            onClick={() => handleNotificationAction(selectedNotification.id, 'dismiss')}
                            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                          >
                            <XCircle className="w-4 h-4" />
                            Dismiss Report
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminNotifications;