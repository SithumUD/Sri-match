import React from "react";
import { Link } from "react-router-dom";
import {
  HeartIcon,
  MessageCircleIcon,
  UserPlusIcon,
  StarIcon,
} from "lucide-react";

const dummyNotifications = [
  {
    id: "n1",
    type: "like",
    message: "Nirmala Silva liked your profile",
    timestamp: "10 minutes ago",
    read: false,
    profileId: "profile1",
    profileImage:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cHJvZmlsZSUyMGluZGlhbiUyMHdvbWFufGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    profileName: "Nirmala Silva",
  },
  {
    id: "n2",
    type: "message",
    message: "Priyanka Jayawardena sent you a message",
    timestamp: "1 hour ago",
    read: false,
    profileId: "profile5",
    profileImage:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZSUyMGluZGlhbiUyMHdvbWFufGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    profileName: "Priyanka Jayawardena",
  },
  {
    id: "n3",
    type: "connection",
    message: "Dinesh Rajapaksa sent you a connection request",
    timestamp: "3 hours ago",
    read: false,
    profileId: "profile2",
    profileImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHByb2ZpbGUlMjBpbmRpYW4lMjBtYW58ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
    profileName: "Dinesh Rajapaksa",
  },
  {
    id: "n4",
    type: "match",
    message: "You matched with Kumari Bandara! You can now message each other.",
    timestamp: "1 day ago",
    read: true,
    profileId: "profile3",
    profileImage:
      "https://images.unsplash.com/photo-1664575599736-c5197c684de0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGluZGlhbiUyMHdvbWFufGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    profileName: "Kumari Bandara",
  },
  {
    id: "n5",
    type: "system",
    message:
      "Your profile verification was successful! Your profile now has a verified badge.",
    timestamp: "2 days ago",
    read: true,
  },
];

const NotificationIcon = ({ type }) => {
  switch (type) {
    case "like":
      return <HeartIcon className="h-5 w-5 text-pink-500" />;
    case "message":
      return <MessageCircleIcon className="h-5 w-5 text-blue-500" />;
    case "connection":
      return <UserPlusIcon className="h-5 w-5 text-purple-500" />;
    case "match":
      return <StarIcon className="h-5 w-5 text-yellow-500" />;
    default:
      return <div className="h-5 w-5 bg-gray-400 rounded-full" />;
  }
};

const NotificationsDropdown = () => {
  const handleMarkAllAsRead = () => {
    // In a real app, this would update the notifications in the context/state
    console.log("Mark all as read");
  };

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-20">
      <div className="p-3 bg-purple-50 border-b border-gray-200 flex justify-between items-center">
        <h3 className="font-medium text-purple-800">Notifications</h3>
        <button
          onClick={handleMarkAllAsRead}
          className="text-xs text-purple-600 hover:text-purple-800"
        >
          Mark all as read
        </button>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {dummyNotifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No notifications yet
          </div>
        ) : (
          <div>
            {dummyNotifications.map((notification) => (
              <Link
                key={notification.id}
                to={
                  notification.profileId
                    ? `/profile/${notification.profileId}`
                    : "#"
                }
                className={`block p-3 border-b border-gray-100 hover:bg-gray-50 ${
                  notification.read ? "" : "bg-purple-50"
                }`}
              >
                <div className="flex items-start">
                  {notification.profileImage ? (
                    <img
                      src={notification.profileImage}
                      alt={notification.profileName || ""}
                      className="w-10 h-10 rounded-full object-cover mr-3"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                      <NotificationIcon type={notification.type} />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-sm text-gray-800">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {notification.timestamp}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <div className="p-2 border-t border-gray-200 bg-gray-50">
        <Link
          to="/notifications"
          className="block w-full text-center text-sm text-purple-600 hover:text-purple-800 py-1"
        >
          View all notifications
        </Link>
      </div>
    </div>
  );
};

export default NotificationsDropdown;
