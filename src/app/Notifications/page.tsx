"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Bell, Heart, MessageCircle, Trophy, ChefHat, Users, Star, Clock, CheckCircle, X, Filter } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import SimpleFooter from "@/components/SimpleFooter"

// Define notification types
type NotificationType =
  | "recipe_like"
  | "recipe_comment"
  | "recipe_review"
  | "challenge_update"
  | "new_follower"
  | "recipe_featured"
  | "system"
  | "forum_reply"

interface NotificationDto {
  id: string
  type: NotificationType
  title: string
  message: string
  isRead: boolean
  createdAt: string
  actionUrl?: string
  actionText?: string
  userName?: string
  recipeName?: string
  recipeImage?: string
}

// Mock data for preview
const mockNotifications: NotificationDto[] = [
  {
    id: "1",
    type: "recipe_like",
    title: "Someone liked your recipe!",
    message: "John Doe liked your 'Chocolate Chip Cookies' recipe",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    actionUrl: "/recipes/chocolate-chip-cookies",
    actionText: "View Recipe",
    userName: "John Doe",
    recipeName: "Chocolate Chip Cookies",
    recipeImage: "/placeholder.svg?height=48&width=48",
  },
  {
    id: "2",
    type: "recipe_comment",
    title: "New comment on your recipe",
    message: "Sarah commented: 'This looks amazing! Can't wait to try it.'",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    actionUrl: "/recipes/pasta-carbonara#comments",
    actionText: "Reply",
    userName: "Sarah Wilson",
    recipeName: "Pasta Carbonara",
  },
  {
    id: "3",
    type: "new_follower",
    title: "You have a new follower!",
    message: "Mike Johnson started following you",
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    actionUrl: "/profile/mike-johnson",
    actionText: "View Profile",
    userName: "Mike Johnson",
  },
  {
    id: "4",
    type: "recipe_featured",
    title: "Your recipe was featured!",
    message: "Congratulations! Your 'Homemade Pizza' recipe was featured on our homepage",
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    actionUrl: "/featured-recipes",
    actionText: "See Featured",
    recipeName: "Homemade Pizza",
    recipeImage: "/placeholder.svg?height=48&width=48",
  },
  {
    id: "5",
    type: "challenge_update",
    title: "Weekly Challenge Update",
    message: "The 'Healthy Breakfast' challenge ends in 2 days. Submit your entry now!",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
    actionUrl: "/challenges/healthy-breakfast",
    actionText: "Join Challenge",
  },
]

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case "recipe_like":
      return <Heart className="h-5 w-5 text-red-500" />
    case "recipe_comment":
    case "forum_reply":
      return <MessageCircle className="h-5 w-5 text-blue-500" />
    case "recipe_review":
      return <Star className="h-5 w-5 text-yellow-500" />
    case "challenge_update":
      return <Trophy className="h-5 w-5 text-purple-500" />
    case "new_follower":
      return <Users className="h-5 w-5 text-green-500" />
    case "recipe_featured":
      return <ChefHat className="h-5 w-5 text-orange-500" />
    case "system":
      return <Bell className="h-5 w-5 text-gray-500" />
    default:
      return <Bell className="h-5 w-5 text-gray-500" />
  }
}

const getNotificationColor = (type: NotificationType) => {
  switch (type) {
    case "recipe_like":
      return "bg-red-50 border-red-200"
    case "recipe_comment":
    case "forum_reply":
      return "bg-blue-50 border-blue-200"
    case "recipe_review":
      return "bg-yellow-50 border-yellow-200"
    case "challenge_update":
      return "bg-purple-50 border-purple-200"
    case "new_follower":
      return "bg-green-50 border-green-200"
    case "recipe_featured":
      return "bg-orange-50 border-orange-200"
    case "system":
      return "bg-gray-50 border-gray-200"
    default:
      return "bg-gray-50 border-gray-200"
  }
}

export default function NotificationsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [notifications, setNotifications] = useState<NotificationDto[]>(mockNotifications)
  const [filter, setFilter] = useState<"all" | "unread">("all")
  const [loading, setLoading] = useState(false)

  // Mark notification as read
  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, isRead: true } : notification)),
    )
  }

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, isRead: true })))
  }

  // Delete notification
  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  // Handle notification click
  const handleNotificationClick = (notification: NotificationDto) => {
    if (!notification.isRead) {
      markAsRead(notification.id)
    }
    // In a real app, you would navigate to the actionUrl
    console.log("Navigate to:", notification.actionUrl)
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length
  const filteredNotifications = filter === "unread" ? notifications.filter((n) => !n.isRead) : notifications

  return (
    <div className="flex flex-col mt-16 min-h-screen bg-gray-50">

      <div className="flex flex-1">


        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Bell className="h-8 w-8 text-yellow-600" />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
                  <p className="text-gray-600">
                    {unreadCount > 0
                      ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
                      : "All caught up!"}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as "all" | "unread")}
                    className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    <option value="all">All Notifications</option>
                    <option value="unread">Unread Only</option>
                  </select>
                </div>
                {unreadCount > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={markAllAsRead}
                    className="flex items-center gap-2 bg-transparent"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Mark All Read
                  </Button>
                )}
              </div>
            </div>

            {/* Notifications List */}
            <div className="space-y-4">
              {filteredNotifications.length === 0 ? (
                <div className="text-center py-12">
                  <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {filter === "unread" ? "No unread notifications" : "No notifications yet"}
                  </h3>
                  <p className="text-gray-500">
                    {filter === "unread"
                      ? "You're all caught up! Check back later for new updates."
                      : "When you get notifications, they'll show up here."}
                  </p>
                </div>
              ) : (
                filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`
                      relative p-4 rounded-lg border transition-all duration-200 cursor-pointer
                      ${notification.isRead ? "bg-white border-gray-200" : getNotificationColor(notification.type)}
                      hover:shadow-md hover:border-gray-300
                    `}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    {/* Unread indicator */}
                    {!notification.isRead && (
                      <div className="absolute top-4 right-4">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      </div>
                    )}

                    {/* Delete button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteNotification(notification.id)
                      }}
                      className="absolute top-2 right-8 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                    >
                      <X className="h-4 w-4" />
                    </button>

                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h3
                              className={`text-sm font-medium ${!notification.isRead ? "text-gray-900" : "text-gray-700"}`}
                            >
                              {notification.title}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{notification.message}</p>

                            {/* Additional info */}
                            {notification.userName && (
                              <p className="text-xs text-gray-500 mt-1">by {notification.userName}</p>
                            )}
                            {notification.recipeName && (
                              <p className="text-xs text-gray-500 mt-1">Recipe: {notification.recipeName}</p>
                            )}

                            {/* Time and action */}
                            <div className="flex items-center justify-between mt-3">
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <Clock className="h-3 w-3" />
                                {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                              </div>
                              {notification.actionText && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-xs h-6 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleNotificationClick(notification)
                                  }}
                                >
                                  {notification.actionText}
                                </Button>
                              )}
                            </div>
                          </div>

                          {/* Recipe Image */}
                          {notification.recipeImage && (
                            <div className="flex-shrink-0">
                              <img
                                src={notification.recipeImage || "/placeholder.svg"}
                                alt={notification.recipeName}
                                className="w-12 h-12 rounded-md object-cover"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>

      <SimpleFooter/>
    </div>
  )
}
