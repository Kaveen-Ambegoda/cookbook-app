'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Users, BookOpen, UserPlus, TrendingUp, Crown, Heart,
  RefreshCw, Calendar, ArrowRight, Star, Eye, ChevronRight,
  Activity, Zap, Award
} from 'lucide-react';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

// Interfaces
interface DashboardStats {
  totalUsers: number;
  totalRecipes: number;
  newUsersToday: number;
  newRecipesToday: number;
}

interface NewUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture?: string;
  createdAt: string;
  status: string;
}

interface NewRecipe {
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

interface TopUser {
  id: number;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  totalLikes: number;
  totalRecipes: number;
  engagementScore: number;
  rank: number;
}

interface TopRecipe {
  id: number;
  title: string;
  category: string;
  image?: string;
  userName: string;
  likesCount: number;
  cookingTime: number;
  rank: number;
}

interface RealtimeData {
  activeUsers: number;
  newUsersToday: number;
  newRecipesToday: number;
  totalLikes: number;
}

export default function SimplifiedAdminDashboard() {
  // State
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalRecipes: 0,
    newUsersToday: 0,
    newRecipesToday: 0
  });
  
  const [newUsers, setNewUsers] = useState<NewUser[]>([]);
  const [newRecipes, setNewRecipes] = useState<NewRecipe[]>([]);
  const [topUsers, setTopUsers] = useState<TopUser[]>([]);
  const [topRecipes, setTopRecipes] = useState<TopRecipe[]>([]);
  const [realtimeData, setRealtimeData] = useState<RealtimeData>({
    activeUsers: 0,
    newUsersToday: 0,
    newRecipesToday: 0,
    totalLikes: 0
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [hubConnection, setHubConnection] = useState<HubConnection | null>(null);
  const [userPage, setUserPage] = useState(1);
  const [recipePage, setRecipePage] = useState(1);

  // API Configuration
  const API_BASE_URL = 'https://localhost:7205/api';
  const HUB_URL = 'https://localhost:7205/dashboardHub';

  const getAuthToken = () => localStorage.getItem('authToken') || '';
  const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getAuthToken()}`
  });

  // SignalR Connection
  const initializeSignalR = useCallback(async () => {
    try {
      const connection = new HubConnectionBuilder()
        .withUrl(HUB_URL, {
          accessTokenFactory: () => getAuthToken()
        })
        .withAutomaticReconnect()
        .configureLogging(LogLevel.Information)
        .build();

      connection.on('RealtimeUpdate', (data: RealtimeData) => {
        setRealtimeData(data);
        // Update stats with realtime data
        setStats(prev => ({
          ...prev,
          newUsersToday: data.newUsersToday,
          newRecipesToday: data.newRecipesToday
        }));
      });

      connection.on('NewUserRegistered', (user: NewUser) => {
        setNewUsers(prev => [user, ...prev.slice(0, 9)]);
        setStats(prev => ({ ...prev, totalUsers: prev.totalUsers + 1 }));
      });

      connection.on('NewRecipeAdded', (recipe: NewRecipe) => {
        setNewRecipes(prev => [recipe, ...prev.slice(0, 9)]);
        setStats(prev => ({ ...prev, totalRecipes: prev.totalRecipes + 1 }));
      });

      connection.on('TopUsersUpdated', (users: TopUser[]) => {
        setTopUsers(users);
      });

      connection.on('TopRecipesUpdated', (recipes: TopRecipe[]) => {
        setTopRecipes(recipes);
      });

      await connection.start();
      await connection.invoke('JoinAdminGroup');
      setHubConnection(connection);
      console.log('SignalR Connected');
    } catch (error) {
      console.error('SignalR Connection Error:', error);
    }
  }, []);

  // API Calls
  const fetchDashboardStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/dashboard/stats`, {
        headers: getHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchNewUsers = async (page: number = 1) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/dashboard/new-users?page=${page}&limit=10`, {
        headers: getHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        if (page === 1) {
          setNewUsers(data);
        } else {
          setNewUsers(prev => [...prev, ...data]);
        }
      }
    } catch (error) {
      console.error('Error fetching new users:', error);
    }
  };

  const fetchNewRecipes = async (page: number = 1) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/dashboard/new-recipes?page=${page}&limit=10`, {
        headers: getHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        if (page === 1) {
          setNewRecipes(data);
        } else {
          setNewRecipes(prev => [...prev, ...data]);
        }
      }
    } catch (error) {
      console.error('Error fetching new recipes:', error);
    }
  };

  const fetchTopUsers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/dashboard/top-users?limit=3`, {
        headers: getHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        setTopUsers(data);
      }
    } catch (error) {
      console.error('Error fetching top users:', error);
    }
  };

  const fetchTopRecipes = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/dashboard/top-recipes?limit=3`, {
        headers: getHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        setTopRecipes(data);
      }
    } catch (error) {
      console.error('Error fetching top recipes:', error);
    }
  };

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchDashboardStats(),
        fetchNewUsers(1),
        fetchNewRecipes(1),
        fetchTopUsers(),
        fetchTopRecipes()
      ]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const loadMoreUsers = () => {
    const nextPage = userPage + 1;
    setUserPage(nextPage);
    fetchNewUsers(nextPage);
  };

  const loadMoreRecipes = () => {
    const nextPage = recipePage + 1;
    setRecipePage(nextPage);
    fetchNewRecipes(nextPage);
  };

  useEffect(() => {
    initializeSignalR();
    loadDashboardData();

    return () => {
      if (hubConnection) {
        hubConnection.invoke('LeaveAdminGroup');
        hubConnection.stop();
      }
    };
  }, [initializeSignalR]);

  // Components
  const StatCard = ({ title, value, icon: Icon, color, bgColor }: any) => (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className={`${bgColor} p-6 text-white`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-white bg-opacity-20 rounded-xl">
              <Icon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium opacity-90">{title}</p>
              <p className="text-3xl font-bold">{value.toLocaleString()}</p>
            </div>
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

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="text-yellow-500" size={20} />;
      case 2: return <Award className="text-gray-400" size={20} />;
      case 3: return <Award className="text-amber-600" size={20} />;
      default: return <Star className="text-blue-500" size={16} />;
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw size={48} className="animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-lg text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Admin Dashboard</h1>
          <p className="text-slate-600 mt-1">Platform overview and analytics</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
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
            Live Metrics
          </h2>
          <div className="flex items-center space-x-2 text-sm text-slate-600">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Live Data {hubConnection?.state === 'Connected' ? '(Connected)' : '(Disconnected)'}</span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <RealtimeCard title="Active Users" value={realtimeData.activeUsers} icon={Users} color="bg-blue-500" />
          <RealtimeCard title="New Users Today" value={realtimeData.newUsersToday} icon={UserPlus} color="bg-green-500" />
          <RealtimeCard title="New Recipes Today" value={realtimeData.newRecipesToday} icon={BookOpen} color="bg-purple-500" />
          <RealtimeCard title="Total Likes" value={realtimeData.totalLikes} icon={Heart} color="bg-red-500" />
        </div>
      </div>

      {/* Main Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          color="text-blue-600"
          bgColor="bg-gradient-to-r from-blue-500 to-blue-600"
        />
        <StatCard
          title="Total Recipes"
          value={stats.totalRecipes}
          icon={BookOpen}
          color="text-green-600"
          bgColor="bg-gradient-to-r from-green-500 to-emerald-600"
        />
        <StatCard
          title="New Users Today"
          value={stats.newUsersToday}
          icon={UserPlus}
          color="text-purple-600"
          bgColor="bg-gradient-to-r from-purple-500 to-indigo-600"
        />
        <StatCard
          title="New Recipes Today"
          value={stats.newRecipesToday}
          icon={TrendingUp}
          color="text-orange-600"
          bgColor="bg-gradient-to-r from-orange-500 to-red-500"
        />
      </div>

      {/* Top Users and Top Recipes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Top Users */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center">
              <Crown size={20} className="mr-2 text-yellow-500" />
              Top Users
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {topUsers.map((user) => (
                <div key={user.id} className="flex items-center space-x-4 p-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    {getRankIcon(user.rank)}
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                      {user.firstName[0]}{user.lastName[0]}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-800">{user.firstName} {user.lastName}</h4>
                    <div className="flex items-center space-x-4 text-sm text-slate-600">
                      <span className="flex items-center">
                        <Heart size={12} className="mr-1 text-red-500" />
                        {user.totalLikes} likes
                      </span>
                      <span className="flex items-center">
                        <BookOpen size={12} className="mr-1 text-green-500" />
                        {user.totalRecipes} recipes
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-600">Score</p>
                    <p className="text-lg font-bold text-blue-600">{user.engagementScore.toFixed(1)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Recipes */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center">
              <Star size={20} className="mr-2 text-yellow-500" />
              Most Liked Recipes
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {topRecipes.map((recipe) => (
                <div key={recipe.id} className="flex items-center space-x-4 p-4 bg-gradient-to-r from-slate-50 to-green-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    {getRankIcon(recipe.rank)}
                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                      <BookOpen size={16} className="text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-800 truncate">{recipe.title}</h4>
                    <p className="text-sm text-slate-600">by {recipe.userName}</p>
                    <div className="flex items-center space-x-3 text-sm text-slate-500">
                      <span className="flex items-center">
                        <Heart size={12} className="mr-1 text-red-500" />
                        {recipe.likesCount} likes
                      </span>
                      <span>{recipe.cookingTime} min</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* New Users and New Recipes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* New Users */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center">
              <UserPlus size={20} className="mr-2 text-green-500" />
              New Users ({newUsers.length})
            </h3>
          </div>
          <div className="p-6 max-h-96 overflow-y-auto">
            <div className="space-y-3">
              {newUsers.map((user) => (
                <div key={user.id} className="flex items-center space-x-4 p-3 hover:bg-slate-50 rounded-lg transition-colors">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                    {user.firstName[0]}{user.lastName[0]}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-slate-800">{user.firstName} {user.lastName}</h4>
                    <p className="text-sm text-slate-600">{user.email}</p>
                    <p className="text-xs text-slate-500">{new Date(user.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {user.status}
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={loadMoreUsers}
              className="w-full mt-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <span>Load More</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* New Recipes */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center">
              <BookOpen size={20} className="mr-2 text-purple-500" />
              New Recipes ({newRecipes.length})
            </h3>
          </div>
          <div className="p-6 max-h-96 overflow-y-auto">
            <div className="space-y-3">
              {newRecipes.map((recipe) => (
                <div key={recipe.id} className="flex items-center space-x-4 p-3 hover:bg-slate-50 rounded-lg transition-colors">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                    <BookOpen size={16} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-slate-800 truncate">{recipe.title}</h4>
                    <p className="text-sm text-slate-600">by {recipe.userName}</p>
                    <div className="flex items-center space-x-3 text-xs text-slate-500">
                      <span>{recipe.category}</span>
                      <span>{recipe.cookingTime} min</span>
                      <span className="flex items-center">
                        <Heart size={10} className="mr-1 text-red-500" />
                        {recipe.likesCount}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">{new Date(recipe.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={loadMoreRecipes}
              className="w-full mt-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <span>Load More</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}