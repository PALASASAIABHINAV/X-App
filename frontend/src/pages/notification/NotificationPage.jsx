import { Link } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { IoSettingsOutline } from "react-icons/io5";
import { FaTimes, FaUser } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import LoadingSpinner from "../common/LoadingSpinner";
import { useNotification } from "../../store/notificationStore";
import toast from "react-hot-toast";

const NotificationPage = () => {
  const { 
    notifications, 
    getNotifications, 
    isLoading, 
    deleteNotification, 
    deleteSingle 
  } = useNotification();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        await getNotifications();
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
        toast.error("Failed to load notifications");
      }
    };

    fetchNotifications();
  }, [getNotifications]);

  // Format time function
  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now - date) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInSeconds < 60) return `${diffInSeconds}s`;
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInHours < 24) return `${diffInHours}h`;
    return `${diffInDays}d`;
  };

  // Sort notifications by time
  const sortedNotifications = useMemo(() => {
    if (!notifications) return [];
    return [...notifications].sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, [notifications]);

  const handleDeleteAll = async () => {
    try {
      await deleteNotification();
      toast.success("All notifications deleted successfully");
    } catch (error) {
      console.error("Failed to delete notifications:", error);
      toast.error("Failed to delete notifications");
    }
  };

  const handleDeleteSingle = async (notificationId) => {
    try {
      await deleteSingle(notificationId);
      // Refresh notifications after successful deletion
      await getNotifications();
      toast.success("Notification deleted successfully");
    } catch (error) {
      console.error("Failed to delete notification:", error);
      toast.error("Failed to delete notification");
    }
  };

  const renderNotificationIcon = (type) => {
    switch (type) {
      case "follow":
        return <FaUser className="w-7 h-7 text-primary" />;
      case "like":
        return <FaHeart className="w-7 h-7 text-red-500" />;
      default:
        return null;
    }
  };

  const renderNotificationContent = (notification) => {
    const actionText = notification.type === "follow" 
      ? "followed you" 
      : "liked your post";

    return (
      <Link
        to={`/profile/${notification.from.username}`}
        className="flex items-center gap-2 hover:bg-gray-800/50 transition-colors duration-200"
      >
        <div className="avatar">
          <div className="w-8 rounded-full">
            <img
              src={notification.from.profileImg || "/avatar-placeholder.png"}
              alt={`${notification.from.username}'s profile`}
            />
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex gap-1 items-center">
            <span className="font-bold">@{notification.from.username}</span>
            <span className="text-gray-400">{actionText}</span>
          </div>
          <span className="text-xs text-gray-500">
            {formatTimeAgo(notification.createdAt)}
          </span>
        </div>
      </Link>
    );
  };

  return (
    <div className="flex-[4_4_0] border-l border-r border-gray-700 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-700">
        <h1 className="font-bold text-xl">Notifications</h1>
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="m-1 hover:bg-gray-800/50 p-2 rounded-full transition-colors duration-200">
            <IoSettingsOutline className="w-5 h-5" />
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <button 
                onClick={handleDeleteAll}
                className="text-red-500 hover:text-red-600"
              >
                Delete all notifications
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center h-32 items-center">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {/* Empty State */}
      {!isLoading && sortedNotifications.length === 0 && (
        <div className="text-center p-8 text-gray-400">
          No notifications yet
        </div>
      )}

      {/* Notifications List */}
      {!isLoading && sortedNotifications.map((notification) => (
        <div
          className="border-b border-gray-700 relative hover:bg-gray-800/50 transition-colors duration-200"
          key={notification._id}
        >
          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-red-500 p-2 rounded-full hover:bg-gray-700/50 transition-colors duration-200"
            onClick={() => handleDeleteSingle(notification._id)}
          >
            <FaTimes className="w-4 h-4" />
          </button>

          <div className="flex gap-2 p-4">
            {renderNotificationIcon(notification.type)}
            {renderNotificationContent(notification)}
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationPage;
