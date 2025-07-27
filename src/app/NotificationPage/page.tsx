"use client";

import React, { useEffect, useState } from "react";
import { Bell, Star, Clock, CheckCircle, X } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

interface NotificationDto {
  id: number;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
  actionText?: string;
  userName?: string;
  recipeName?: string;
  recipeImage?: string;
}

const getIcon = (type: string) => {
  switch (type) {
    case "recipe_like":
      return <Star className="text-yellow-500" />;
    case "recipe_posted":
      return <CheckCircle className="text-green-500" />;
    case "comment":
      return <MessageCircle className="text-blue-500" />;
    default:
      return <Bell />;
  }
};

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<NotificationDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("https://localhost:7205/api/Notifications", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setNotifications(response.data);
      } catch (error) {
        console.error("Failed to fetch notifications", error);
        toast.error("Unable to load notifications");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const filteredNotifications =
    filter === "all"
      ? notifications
      : notifications.filter((n) => (filter === "unread" ? !n.isRead : n.isRead));

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 mt-12">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-green-800">Notifications</h1>
        <div className="flex gap-2">
          <button
            className={`px-4 py-2 rounded-lg text-sm ${
              filter === "all"
                ? "bg-gray-900 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-sm ${
              filter === "unread"
                ? "bg-gray-900 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
            onClick={() => setFilter("unread")}
          >
            Unread
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-sm ${
              filter === "read"
                ? "bg-gray-900 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
            onClick={() => setFilter("read")}
          >
            Read
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center text-gray-600">Loading notifications...</div>
      ) : filteredNotifications.length === 0 ? (
        <div className="text-center text-gray-600">No notifications found.</div>
      ) : (
        <div className="space-y-4">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`border rounded-xl p-4 shadow-sm ${
                notification.isRead ? "bg-white" : "bg-blue-50"
              }`}
            >
              <div className="flex items-center gap-4">
                {getIcon(notification.type)}
                <div className="flex-1">
                  <h2 className="font-semibold">{notification.title}</h2>
                  <p className="text-sm text-gray-600">{notification.message}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
                {notification.actionUrl && (
                  <a
                    href={notification.actionUrl}
                    className="text-sm text-blue-500 hover:underline"
                  >
                    {notification.actionText || "View"}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
