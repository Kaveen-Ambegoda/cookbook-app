// src/app/users/page.tsx
import { Card } from '../../../Components/Card';
import { 
  Search, Filter, MoreVertical, 
  CheckCircle, XCircle 
} from 'lucide-react';

// Mock data - would come from API
const users = [
  { 
    id: 1, 
    name: 'John Smith', 
    email: 'john@example.com', 
    role: 'User', 
    status: 'Active',
    registeredDate: '2023-09-15' 
  },
  { 
    id: 2, 
    name: 'Sarah Johnson', 
    email: 'sarah@example.com', 
    role: 'Host', 
    status: 'Active',
    registeredDate: '2023-08-22'
  },
  { 
    id: 3, 
    name: 'Michael Brown', 
    email: 'michael@example.com', 
    role: 'User', 
    status: 'Banned',
    registeredDate: '2023-10-05'
  },
  { 
    id: 4, 
    name: 'Emma Wilson', 
    email: 'emma@example.com', 
    role: 'Host', 
    status: 'Active',
    registeredDate: '2023-07-18'
  },
  { 
    id: 5, 
    name: 'James Taylor', 
    email: 'james@example.com', 
    role: 'User',
    status: 'Active', 
    registeredDate: '2023-11-01'
  },
];

export default function UsersPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
          Export Data
        </button>
      </div>

      <Card className="mb-8">
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Search users..."
              />
            </div>
            <div className="flex gap-2">
              <button className="flex items-center px-4 py-2 bg-white border rounded-md hover:bg-gray-50">
                <Filter size={18} className="mr-2" />
                Filter
              </button>
              <select className="px-4 py-2 bg-white border rounded-md hover:bg-gray-50">
                <option>All Roles</option>
                <option>Users</option>
                <option>Hosts</option>
              </select>
              <select className="px-4 py-2 bg-white border rounded-md hover:bg-gray-50">
                <option>All Status</option>
                <option>Active</option>
                <option>Banned</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      <Card>
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
              {users.map((user) => (
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
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.role === 'Host' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`flex items-center ${
                      user.status === 'Active' 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
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
                      <button className="text-blue-600 hover:underline">View</button>
                      <button className="text-yellow-600 hover:underline">Edit</button>
                      <button className={`${
                        user.status === 'Active' 
                          ? 'text-red-600' 
                          : 'text-green-600'
                      } hover:underline`}>
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
        <div className="flex justify-between items-center p-4 border-t">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">1</span> to <span className="font-medium">5</span> of <span className="font-medium">100</span> results
          </div>
          <div className="flex space-x-1">
            <button className="px-3 py-1 border rounded-md hover:bg-gray-50">Previous</button>
            <button className="px-3 py-1 bg-indigo-600 text-white rounded-md">1</button>
            <button className="px-3 py-1 border rounded-md hover:bg-gray-50">2</button>
            <button className="px-3 py-1 border rounded-md hover:bg-gray-50">3</button>
            <button className="px-3 py-1 border rounded-md hover:bg-gray-50">Next</button>
          </div>
        </div>
      </Card>
    </div>
  );
}