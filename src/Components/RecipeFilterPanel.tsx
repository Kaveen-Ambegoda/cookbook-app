"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bell } from "lucide-react";
import Link from "next/link";

const NotificationBell = () => {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await axios.get("/api/notification/unread-count", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // adjust to how you're storing the token
          },
        });
        setUnreadCount(response.data);
      } catch (error) {
        console.error("Failed to fetch unread count", error);
      }
    };

    fetchUnreadCount();
  }, []);

  return (
    <Link href="/notifications" className="relative">
      <Bell className="w-6 h-6" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full">
          {unreadCount}
        </span>
      )}
    </Link>
  );
};

export default NotificationBell;
