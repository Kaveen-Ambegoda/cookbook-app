"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Bell, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface Notification {
  id: number
  title: string
  message: string
  isRead: boolean
  createdAt: string
  type: string
  actionUrl?: string
  actionText?: string
  recipe?: {
    id: number
    title: string
    image: string
  }
  user?: {
    id: string
    name: string
  }
}

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token")

        const response = await axios.get("https://localhost:7024/api/Notifications", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        setNotifications(response.data)
      } catch (error) {
        console.error("Error fetching notifications:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Bell className="w-6 h-6" />
        Notifications
      </h1>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
        </div>
      ) : notifications.length === 0 ? (
        <p className="text-gray-500">No notifications found.</p>
      ) : (
        <div className="space-y-4">
          {notifications.map((n) => (
            <Card key={n.id} className={n.isRead ? "opacity-70" : ""}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="font-semibold text-lg">{n.title}</h2>
                    <p className="text-sm text-gray-600">{n.message}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(n.createdAt).toLocaleString()}
                    </p>
                  </div>

                  {n.recipe?.image && (
                    <img
                      src={n.recipe.image}
                      alt={n.recipe.title}
                      className="w-16 h-16 object-cover rounded-md ml-4"
                    />
                  )}
                </div>

                {n.actionUrl && (
                  <a
                    href={n.actionUrl}
                    className="text-blue-600 text-sm font-medium mt-2 inline-block"
                  >
                    {n.actionText || "View"}
                  </a>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default NotificationsPage
