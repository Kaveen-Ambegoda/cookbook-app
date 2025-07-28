'use client';
import React, { useState, useEffect } from 'react';
import { HubConnectionBuilder, HubConnection } from '@microsoft/signalr';
import { useRouter } from 'next/navigation';
import { 
  Bell, 
  UserX, 
  Flag,
  ExternalLink,
  Eye,
  User,
  Clock,
  XCircle,
  CheckCircle
} from 'lucide-react';

export interface Notification {
  id: string;
  type: 'user_report' | 'recipe_report';
  title: string;
  description: string;
  timestamp: string;
  reporterId: string;
  reporterName: string;
  targetId: string;
  targetName: string;
  targetType: 'user' | 'recipe';
  isRead: boolean;
}

const AdminNotificationsPage: React.FC = () => {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load existing notifications
    const loadNotifications = async () => {
      try {
        const response = await fetch('/api/notifications');
        if (response.ok) {
          const data = await response.json();
          setNotifications(data);
        }
      } catch (error) {
        console.error('Failed to load notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    // Setup SignalR connection
    const setupSignalR = async () => {
      const newConnection = new HubConnectionBuilder()
        .withUrl('/notificationHub')
        .build();

      try {
        await newConnection.start();
        console.log('Connected to SignalR hub');

        // Listen for new notifications
        newConnection.on('ReceiveNotification', (notification: Notification) => {
          setNotifications(prev => [notification, ...prev]);
        });

        setConnection(newConnection);
      } catch (error) {
        console.error('Failed to connect to SignalR hub:', error);
      }
    };

    loadNotifications();
    setupSignalR();

    return () => {
      if (connection) {
        connection.stop();
      }
    };
  }, []);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await fetch(`/api/notifications/${notificationId}/read`, { method: 'PATCH' });
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
      );
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await fetch('/api/notifications/mark-all-read', { method: 'PATCH' });
      setNotifications(prev => 
        prev.map(n => ({ ...n, isRead: true }))
      );
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const handleNavigate = (notification: Notification) => {
    // Mark as read when navigating
    if (!notification.isRead) {
      handleMarkAsRead(notification.id);
    }

    // Navigate to appropriate management page
    if (notification.targetType === 'user') {
      router.push(`/admin/users?highlight=${notification.targetId}`);
    } else {
      router.push(`/admin/recipes?highlight=${notification.targetId}`);
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

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Bell className="w-8 h-8 text-blue-600" />
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Reports & Notifications</h1>
                <p className="text-gray-600">Manage user and recipe reports</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-500">
                {unreadCount} unread reports
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  <CheckCircle className="w-4 h-4" />
                  Mark All Read
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Filter Tabs (Optional) */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="flex border-b">
            <button className="px-6 py-3 text-sm font-medium text-blue-600 border-b-2 border-blue-600">
              All Reports ({notifications.length})
            </button>
            <button className="px-6 py-3 text-sm font-medium text-gray-500 hover:text-gray-700">
              Unread ({unreadCount})
            </button>
            <button className="px-6 py-3 text-sm font-medium text-gray-500 hover:text-gray-700">
              User Reports ({notifications.filter(n => n.type === 'user_report').length})
            </button>
            <button className="px-6 py-3 text-sm font-medium text-gray-500 hover:text-gray-700">
              Recipe Reports ({notifications.filter(n => n.type === 'recipe_report').length})
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white rounded-lg shadow-sm border p-6 transition-all hover:shadow-md ${
                !notification.isRead ? 'border-l-4 border-l-red-500 bg-red-50' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className={`p-2 rounded-lg ${!notification.isRead ? 'bg-red-100' : 'bg-gray-100'}`}>
                    {notification.type === 'user_report' ? (
                      <UserX className={`w-5 h-5 ${!notification.isRead ? 'text-red-600' : 'text-gray-600'}`} />
                    ) : (
                      <Flag className={`w-5 h-5 ${!notification.isRead ? 'text-red-600' : 'text-gray-600'}`} />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                      {!notification.isRead && (
                        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      )}
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        notification.type === 'user_report' 
                          ? 'bg-orange-100 text-orange-800' 
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {notification.type.replace('_', ' ')}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-3">{notification.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{formatTimeAgo(notification.timestamp)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>Reported by {notification.reporterName}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>Target: {notification.targetName}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setSelectedNotification(notification)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                      
                      <button
                        onClick={() => handleNavigate(notification)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-1 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Go to {notification.targetType === 'user' ? 'User' : 'Recipe'} Management
                      </button>

                      {!notification.isRead && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center gap-1 transition-colors"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Mark Read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {notifications.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No reports yet</h3>
              <p className="text-gray-600">New reports will appear here in real-time.</p>
            </div>
          )}
        </div>

        {/* Notification Detail Modal */}
        {selectedNotification && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Report Details</h2>
                  <button
                    onClick={() => setSelectedNotification(null)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
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
                      <span className="text-sm font-medium text-gray-500">Reported By</span>
                      <p>{selectedNotification.reporterName}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Target</span>
                      <p>{selectedNotification.targetName}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Timestamp</span>
                      <p>{new Date(selectedNotification.timestamp).toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Status</span>
                      <p className={selectedNotification.isRead ? 'text-green-600' : 'text-red-600'}>
                        {selectedNotification.isRead ? 'Read' : 'Unread'}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t">
                    {!selectedNotification.isRead && (
                      <button
                        onClick={() => {
                          handleMarkAsRead(selectedNotification.id);
                          setSelectedNotification({...selectedNotification, isRead: true});
                        }}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Mark as Read
                      </button>
                    )}
                    <button
                      onClick={() => {
                        handleNavigate(selectedNotification);
                        setSelectedNotification(null);
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Go to Management
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminNotificationsPage;