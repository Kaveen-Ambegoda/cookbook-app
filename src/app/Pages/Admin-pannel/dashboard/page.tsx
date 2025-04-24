// src/app/dashboard/page.tsx
'use client';

import { Card } from '../../../Components/Card';
import { Users, BookOpen, DollarSign, ChefHat, AlertTriangle } from 'lucide-react';
import React, { useState } from 'react';

// Define interfaces for better type safety
interface Stat {
  id: string;
  label: string;
  value: number;
  icon: React.ComponentType<{ size?: number }>;
  colorClass: string;
}

interface ActivityItem {
  id: number;
  type: string;
  name: string;
  time: string;
}

interface PopularRecipe {
  id: number;
  title: string;
  rating: number;
  views: number;
  imageUrl?: string;
}

export default function DashboardPage() {
  // Stats data array
  const [stats, setStats] = useState<Stat[]>([
    {
      id: 'users',
      label: 'Total Users',
      value: 1245,
      icon: Users,
      colorClass: 'bg-blue-100 text-blue-600'
    },
    {
      id: 'recipes',
      label: 'Total Recipes',
      value: 3782,
      icon: BookOpen,
      colorClass: 'bg-green-100 text-green-600'
    },
    {
      id: 'hosts',
      label: 'Pending Host Requests',
      value: 8,
      icon: ChefHat,
      colorClass: 'bg-yellow-100 text-yellow-600'
    },
    {
      id: 'cookies',
      label: 'Total Cookies',
      value: 28450,
      icon: DollarSign,
      colorClass: 'bg-purple-100 text-purple-600'
    },
    {
      id: 'flagged',
      label: 'Flagged Content',
      value: 17,
      icon: AlertTriangle,
      colorClass: 'bg-red-100 text-red-600'
    }
  ]);

  // Recent activity data
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([
    { id: 1, type: 'New User Registered', name: 'John Smith', time: '2 hours ago' },
    { id: 2, type: 'New recipe published', name: 'Chocolate Cake', time: '3 hours ago' },
    { id: 3, type: 'Host request', name: 'Anna Johnson', time: '5 hours ago' }
  ]);

  // Popular recipes data
  const [popularRecipes, setPopularRecipes] = useState<PopularRecipe[]>([
    {
      id: 1,
      title: 'Italian Pasta Carbonara',
      rating: 4.8,
      views: 1245,
      imageUrl: ''
    },
    {
      id: 2,
      title: 'Beef Wellington',
      rating: 4.7,
      views: 980,
      imageUrl: ''
    },
    {
      id: 3,
      title: 'French Macarons',
      rating: 4.6,
      views: 850,
      imageUrl: ''
    }
  ]);

  const addNewActivity = () => {
    const newActivity: ActivityItem = {
      id: Date.now(),
      type: 'New Comment',
      name: 'Pasindu Induwara',
      time: 'Just now'
    };
    setRecentActivity(prev => [newActivity, ...prev]);
  };

  // Function to get activity color based on type
  const getActivityColor = (type: string): string => {
    if (type.toLowerCase().includes('user')) return 'bg-blue-500';
    if (type.toLowerCase().includes('recipe')) return 'bg-green-500';
    if (type.toLowerCase().includes('host')) return 'bg-yellow-500';
    return 'bg-gray-400';
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button 
          onClick={addNewActivity}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Refresh
        </button>
      </div>

      <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.id} className="p-6 shadow-sm">
            <div className="flex items-center">
              <div className={`p-3 rounded-full ${stat.colorClass}`}>
                <stat.icon size={24} />
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                <p className="text-2xl font-semibold">{stat.value.toLocaleString()}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 mb-8 md:grid-cols-2">
        <Card className="p-6 shadow-sm h-96 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4">Recent Activity ({recentActivity.length})</h2>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start">
                <div className={`w-2 h-2 mt-2 rounded-full mr-3 ${getActivityColor(activity.type)}`}></div>
                <div>
                  <p className="text-sm">
                    {activity.type}: <span className="font-medium">{activity.name}</span>
                  </p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 shadow-sm h-96">
          <h2 className="text-lg font-semibold mb-4">Popular Recipes</h2>
          <div className="space-y-4">
            {popularRecipes.map((recipe) => (
              <div key={recipe.id} className="flex items-center">
                <div className="w-12 h-12 bg-gray-200 rounded mr-3">
                  {recipe.imageUrl && (
                    <img 
                      src={recipe.imageUrl} 
                      alt={recipe.title} 
                      className="w-full h-full object-cover rounded"
                    />
                  )}
                </div>
                <div>
                  <p className="font-medium">{recipe.title}</p>
                  <p className="text-xs text-gray-500">
                    {recipe.rating} ★ | {recipe.views.toLocaleString()} views
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}