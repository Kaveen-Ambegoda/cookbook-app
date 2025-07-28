"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { Bell } from "lucide-react";

const NotificationBell = () => {
  const [unreadCount, setUnreadCount] = useState<number>(0);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/Notifications/unread-count`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUnreadCount(response.data); // Make sure backend returns just the number
      } catch (error) {
        console.error("Failed to fetch unread notification count:", error);
      }
    };

    fetchUnreadCount();
  }, []);

  return (
    <Link href="/notifications" className="relative w-fit h-fit">
      <Bell className="w-6 h-6 text-gray-700" />

      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </Link>
  );
};

export default NotificationBell;
