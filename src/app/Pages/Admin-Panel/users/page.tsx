'use client';
import { useState } from 'react';
import { Card } from '@/components/Card';
import {
  Search, Filter, MoreVertical,
  CheckCircle, XCircle, Flag, AlertTriangle,
  User, Calendar, Ban, Trash2, Eye, Edit, ChevronDown
} from 'lucide-react';

interface Recipe {
  id: number;
  title: string;
  reported: boolean;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  registeredDate: string;
  reportCount?: number;
  reportReason?: string;
  reported: boolean;
  recipes: Recipe[];
}

// Enhanced mock data - would come from API
const users: User[] = [
  { id: 1, name: 'John Smith', email: 'john@example.com', role: 'User', status: 'Active', registeredDate: '2023-09-15', reported: true, reportCount: 2, reportReason: 'Inappropriate behavior', recipes: [{ id: 101, title: 'Spicy Pasta', reported: true }, { id: 102, title: 'Chocolate Cake', reported: false }] },
  { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com', role: 'Host', status: 'Active', registeredDate: '2023-08-22', reported: false, recipes: [{ id: 103, title: 'Vegetable Stir Fry', reported: false }, { id: 104, title: 'Banana Bread', reported: false }] },
  { id: 3, name: 'Michael Brown', email: 'michael@example.com', role: 'User', status: 'Banned', registeredDate: '2023-10-05', reported: true, reportCount: 3, reportReason: 'Inappropriate behavior', recipes: [{ id: 105, title: 'Suspicious Recipe', reported: true }, { id: 106, title: 'Spam Dish', reported: true }] },
  { id: 4, name: 'Emma Wilson', email: 'emma@example.com', role: 'Host', status: 'Active', registeredDate: '2023-07-18', reported: false, recipes: [{ id: 107, title: 'Lemon Pie', reported: false }, { id: 108, title: 'Grilled Salmon', reported: false }] },
  { id: 5, name: 'James Taylor', email: 'james@example.com', role: 'User', status: 'Active', registeredDate: '2023-11-01', reported: false, recipes: [{ id: 109, title: 'Mushroom Risotto', reported: false }, { id: 110, title: 'Apple Crumble', reported: false }] },
];

export default function UsersPage() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [viewType, setViewType] = useState<'all' | 'reported' | 'normal'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const reportedUsers = users.filter(user => user.reported);
  const normalUsers = users.filter(user => !user.reported);
  const filteredUsers = users.filter(user => user.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleViewUserDetails = (user: User) => {
    setSelectedUser(user);
  };

  const handleCloseUserDetails = () => {
    setSelectedUser(null);
  };

  const handleBanUser = (userId: number) => {
    console.log(`Banning user ${userId}`);
  };

  const handleRemoveRecipe = (userId: number, recipeId: number) => {
    console.log(`Removing recipe ${recipeId} from user ${userId}`);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
            Export Data
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="mb-6">
        <div className="flex gap-2 items-center">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center px-4 py-2 bg-white border rounded-md hover:bg-gray-50">
            <Filter size={18} className="mr-2" />
            Filter
          </button>
        </div>
      </div>

      {/* User details modal/overlay */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-screen overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">User Details</h2>
                <button onClick={handleCloseUserDetails} className="p-1 rounded-full hover:bg-gray-100">
                  <XCircle size={24} />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 text-2xl">
                  {selectedUser.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <h3 className="font-semibold flex items-center gap-2">
                        <User size={16} /> Profile Information
                      </h3>
                      <div className="mt-2 space-y-2">
                        <p><span className="font-medium">Name:</span> {selectedUser.name}</p>
                        <p><span className="font-medium">Email:</span> {selectedUser.email}</p>
                        <p><span className="font-medium">Role:</span> {selectedUser.role}</p>
                        <p>
                          <span className="font-medium">Status:</span> 
                          <span className={`ml-2 ${selectedUser.status === 'Active' ? 'text-green-600' : 'text-red-600'}`}>
                            {selectedUser.status === 'Active' ? (
                              <span className="flex items-center">
                                <CheckCircle size={16} className="mr-1" />
                                Active
                              </span>
                            ) : (
                              <span className="flex items-center">
                                <XCircle size={16} className="mr-1" />
                                Banned
                              </span>
                            )}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold flex items-center gap-2">
                        <Calendar size={16} /> Account Information
                      </h3>
                      <div className="mt-2 space-y-2">
                        <p><span className="font-medium">Registered:</span> {selectedUser.registeredDate}</p>
                        {selectedUser.reported && (
                          <>
                            <p className="text-red-600 flex items-center">
                              <Flag size={16} className="mr-1" />
                              <span className="font-medium">Reported {selectedUser.reportCount} times</span>
                            </p>
                            <p><span className="font-medium">Report Reason:</span> {selectedUser.reportReason}</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="font-semibold mb-3">User Recipes</h3>
                    <table className="w-full text-sm">
                      <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left">Recipe</th>
                          <th className="px-4 py-2 text-left">Status</th>
                          <th className="px-4 py-2 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedUser.recipes.map(recipe => (
                          <tr key={recipe.id} className="border-b">
                            <td className="px-4 py-3">{recipe.title}</td>
                            <td className="px-4 py-3">
                              {recipe.reported ? (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                                  <AlertTriangle size={12} className="mr-1" />
                                  Reported
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                                  <CheckCircle size={12} className="mr-1" />
                                  Normal
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex items-center justify-end space-x-2">
                                <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                                  <Eye size={16} />
                                </button>
                                <button className="p-1 text-yellow-600 hover:bg-yellow-50 rounded">
                                  <Edit size={16} />
                                </button>
                                <button
                                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                                  onClick={() => handleRemoveRecipe(selectedUser.id, recipe.id)}
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t flex justify-end gap-2">
              <button
                onClick={handleCloseUserDetails}
                className="px-4 py-2 border rounded-md hover:bg-gray-50"
              >
                Close
              </button>
              {selectedUser.status === 'Active' ? (
                <button
                  onClick={() => handleBanUser(selectedUser.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
                >
                  <Ban size={16} className="mr-2" />
                  Ban User
                </button>
              ) : (
                <button
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
                >
                  <CheckCircle size={16} className="mr-2" />
                  Restore User
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main User Table */}
      <Card>
        <div className="p-4 bg-gray-50 flex items-center justify-between">
          <div className="flex items-center">
            <User size={20} className="text-gray-600 mr-2" />
            <h2 className="text-lg font-semibold">All Users</h2>
            <span className="ml-2 bg-gray-200 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {filteredUsers.length}
            </span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3">User</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Registered Date</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 mr-3">
                        {user.name.charAt(0)}
                      </div>
                      {user.name}
                    </div>
                  </td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${user.role === 'Host' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`flex items-center ${user.status === 'Active' ? 'text-green-600' : 'text-red-600'}`}>
                      {user.status === 'Active' ? (
                        <CheckCircle size={16} className="mr-1" />
                      ) : (
                        <XCircle size={16} className="mr-1" />
                      )}
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">{user.registeredDate}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        className="text-blue-600 hover:underline"
                        onClick={() => handleViewUserDetails(user)}
                      >
                        View
                      </button>
                      <button className="text-yellow-600 hover:underline">Edit</button>
                      <button
                        className={`${user.status === 'Active' ? 'text-red-600' : 'text-green-600'} hover:underline`}
                        onClick={() => handleBanUser(user.id)}
                      >
                        {user.status === 'Active' ? 'Ban' : 'Unban'}
                      </button>
                      <button>
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
