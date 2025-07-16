'use client';

import React, { useState, useEffect } from 'react';
import {
  Users, BookOpen, DollarSign, ChefHat, AlertTriangle, Crown,
  TrendingUp, TrendingDown, Activity, Calendar, Eye, MessageSquare,
  Heart, Video, Image, Flag, Ban, CheckCircle, Clock, Zap,
  Globe, UserCheck, UserX, Star, Award, Play, Pause,
  BarChart3, PieChart, LineChart, Settings, Bell, Search,
  Filter, Download, RefreshCw, Plus, ArrowUp, ArrowDown,
  Shield, Target, Layers, Database, Server, Wifi
} from 'lucide-react';
import * as dashboardData from '@/app/Admin/Layouts/Data/dashboardMockData';

interface Stat {
  id: string;
  label: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  icon: React.ComponentType<{ size?: number }>;
  colorClass: string;
  bgGradient: string;
}

interface ActivityItem {
  id: number;
  type: 'user' | 'recipe' | 'host' | 'report' | 'live' | 'subscription';
  action: string;
  user: string;
  target?: string;
  time: string;
  severity: 'low' | 'medium' | 'high';
}

interface PopularContent {
  id: number;
  title: string;
  creator: string;
  type: 'recipe' | 'video' | 'live';
  metrics: {
    views: number;
    likes: number;
    comments: number;
    rating?: number;
  };
  status: 'active' | 'flagged' | 'trending';
  thumbnail?: string;
}

interface SystemMetrics {
  serverLoad: number;
  memoryUsage: number;
  activeConnections: number;
  responseTime: number;
  uptime: string;
}

interface RealtimeData {
  activeUsers: number;
  liveStreams: number;
  newRegistrations: number;
  reportsToday: number;
}

export default function AdvancedAdminDashboard() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [popularContent, setPopularContent] = useState<PopularContent[]>([]);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    serverLoad: 0,
    memoryUsage: 0,
    activeConnections: 0,
    responseTime: 0,
    uptime: ''
  });
  const [realtimeData, setRealtimeData] = useState<RealtimeData>({
    activeUsers: 0,
    liveStreams: 0,
    newRegistrations: 0,
    reportsToday: 0
  });
  const [selectedTimeRange, setSelectedTimeRange] = useState<'24h' | '7d' | '30d' | '90d'>('24h');
  const [refreshing, setRefreshing] = useState(false);

useEffect(() => {
  setStats(
    dashboardData.dashboardStats.map(stat => ({
      ...stat,
      trend: stat.trend as 'up' | 'down' | 'stable'
    }))
  );
  setRecentActivity(
    dashboardData.recentActivity.map(activity => ({
      ...activity,
      type: activity.type as ActivityItem['type'],
      severity: activity.severity as ActivityItem['severity'],
    }))
  );
  setPopularContent(
    dashboardData.popularContent.map(content => ({
      ...content,
      type: content.type as PopularContent['type'],
      status: content.status as PopularContent['status'],
    }))
  );
  setSystemMetrics(dashboardData.systemMetrics);
  setRealtimeData(dashboardData.realtimeData);

  const interval = setInterval(() => {
    setRealtimeData(prev => ({
      activeUsers: prev.activeUsers + Math.floor(Math.random() * 10 - 5),
      liveStreams: Math.max(0, prev.liveStreams + Math.floor(Math.random() * 3 - 1)),
      newRegistrations: prev.newRegistrations + Math.floor(Math.random() * 2),
      reportsToday: prev.reportsToday + Math.floor(Math.random() * 1),
    }));
  }, 5000);

  return () => clearInterval(interval);
}, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'user': return Users;
      case 'recipe': return BookOpen;
      case 'host': return Crown;
      case 'report': return Flag;
      case 'live': return Video;
      case 'subscription': return DollarSign;
      default: return Activity;
    }
  };

  const getActivityColor = (severity: ActivityItem['severity']) => {
    switch (severity) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-400';
    }
  };

  const getContentStatusColor = (status: PopularContent['status']) => {
    switch (status) {
      case 'trending': return 'text-green-600 bg-green-100';
      case 'flagged': return 'text-red-600 bg-red-100';
      case 'active': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const StatCard = ({ stat }: { stat: Stat }) => (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden group hover:shadow-xl transition-all duration-300">
      <div className={`bg-gradient-to-r ${stat.bgGradient} p-6 text-white`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-white bg-opacity-20 rounded-xl">
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium opacity-90">{stat.label}</p>
              <p className="text-3xl font-bold">
                {stat.id === 'totalRevenue' ? `$${(stat.value / 1000).toFixed(0)}K` : stat.value.toLocaleString()}
              </p>
            </div>
          </div>
          <div className={`flex items-center space-x-1 px-3 py-1 rounded-full bg-white bg-opacity-20`}>
            {stat.trend === 'up' ? <ArrowUp size={16} /> : stat.trend === 'down' ? <ArrowDown size={16} /> : <Activity size={16} />}
            <span className="text-sm font-medium">{Math.abs(stat.change)}%</span>
          </div>
        </div>
      </div>
    </div>
  );

  const RealtimeCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-600 font-medium">{title}</p>
          <p className="text-2xl font-bold text-slate-800">{value.toLocaleString()}</p>
        </div>
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon size={20} className="text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Admin Dashboard</h1>
          <p className="text-slate-600 mt-1">Comprehensive platform management and analytics</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-200">
            <Calendar size={16} className="text-slate-500" />
            <select 
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value as any)}
              className="text-sm font-medium text-slate-700 bg-transparent border-none outline-none"
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-lg"
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Real-time Metrics */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-slate-800 flex items-center">
            <Zap size={20} className="mr-2 text-yellow-500" />
            Real-time Metrics
          </h2>
          <div className="flex items-center space-x-2 text-sm text-slate-600">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Live Data</span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <RealtimeCard title="Active Users" value={realtimeData.activeUsers} icon={Users} color="bg-blue-500" />
          <RealtimeCard title="Live Streams" value={realtimeData.liveStreams} icon={Video} color="bg-red-500" />
          <RealtimeCard title="New Registrations" value={realtimeData.newRegistrations} icon={UserCheck} color="bg-green-500" />
          <RealtimeCard title="Reports Today" value={realtimeData.reportsToday} icon={Flag} color="bg-orange-500" />
        </div>
      </div>

      {/* Main Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <StatCard key={stat.id} stat={stat} />
        ))}
      </div>

      {/* System Health & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* System Health */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
            <Server size={20} className="mr-2 text-green-500" />
            System Health
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-slate-600">Server Load</span>
                <span className="text-sm font-bold text-slate-800">{systemMetrics.serverLoad}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    systemMetrics.serverLoad > 80 ? 'bg-red-500' : 
                    systemMetrics.serverLoad > 60 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${systemMetrics.serverLoad}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-slate-600">Memory Usage</span>
                <span className="text-sm font-bold text-slate-800">{systemMetrics.memoryUsage}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    systemMetrics.memoryUsage > 80 ? 'bg-red-500' : 
                    systemMetrics.memoryUsage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${systemMetrics.memoryUsage}%` }}
                ></div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
              <div>
                <p className="text-xs text-slate-500">Active Connections</p>
                <p className="text-lg font-bold text-slate-800">{systemMetrics.activeConnections.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Response Time</p>
                <p className="text-lg font-bold text-slate-800">{systemMetrics.responseTime}ms</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800 flex items-center">
                <Activity size={20} className="mr-2 text-blue-500" />
                Recent Activity ({recentActivity.length})
              </h3>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                View All
              </button>
            </div>
          </div>
          <div className="p-6 max-h-96 overflow-y-auto">
            <div className="space-y-4">
              {recentActivity.map((activity) => {
                const IconComponent = getActivityIcon(activity.type);
                return (
                  <div key={activity.id} className="flex items-start space-x-4 p-3 hover:bg-slate-50 rounded-lg transition-colors">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getActivityColor(activity.severity)}`}>
                      <IconComponent size={14} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800">
                        {activity.action}
                      </p>
                      <p className="text-sm text-slate-600">
                        by <span className="font-medium">{activity.user}</span>
                        {activity.target && (
                          <> on <span className="font-medium">{activity.target}</span></>
                        )}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      activity.severity === 'high' ? 'bg-red-100 text-red-600' :
                      activity.severity === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-green-100 text-green-600'
                    }`}>
                      {activity.severity}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Popular Content */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center">
              <TrendingUp size={20} className="mr-2 text-green-500" />
              Popular Content & Reports
            </h3>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors">
                Content
              </button>
              <button className="px-3 py-1 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                Reports
              </button>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {popularContent.map((content) => (
              <div key={content.id} className="flex items-center space-x-4 p-4 border border-slate-200 rounded-xl hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-br from-slate-200 to-slate-300 rounded-lg flex items-center justify-center">
                  {content.type === 'recipe' && <BookOpen size={20} className="text-slate-600" />}
                  {content.type === 'video' && <Video size={20} className="text-slate-600" />}
                  {content.type === 'live' && <Play size={20} className="text-red-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-medium text-slate-800 truncate">{content.title}</h4>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getContentStatusColor(content.status)}`}>
                      {content.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mb-2">by {content.creator}</p>
                  <div className="flex items-center space-x-4 text-xs text-slate-500">
                    <span className="flex items-center">
                      <Eye size={12} className="mr-1" />
                      {content.metrics.views.toLocaleString()}
                    </span>
                    <span className="flex items-center">
                      <Heart size={12} className="mr-1" />
                      {content.metrics.likes.toLocaleString()}
                    </span>
                    <span className="flex items-center">
                      <MessageSquare size={12} className="mr-1" />
                      {content.metrics.comments.toLocaleString()}
                    </span>
                    {content.metrics.rating && (
                      <span className="flex items-center">
                        <Star size={12} className="mr-1 text-yellow-500" />
                        {content.metrics.rating}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col space-y-1">
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Details">
                    <Eye size={16} />
                  </button>
                  {content.status === 'flagged' && (
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Take Action">
                      <Flag size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}