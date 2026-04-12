import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { dummyProfiles } from "../data/dummyData";
import {
  UserPlusIcon,
  CheckIcon,
  XIcon,
  UserIcon,
  MessageCircleIcon,
} from "lucide-react";
import { Link } from "react-router-dom";

const ConnectionRequests = () => {
  const { receivedRequests, acceptFriendRequest, rejectFriendRequest } =
    useAuth();
  const [showRequests, setShowRequests] = useState(false);

  // Get profile data for received requests
  const requestProfiles = dummyProfiles.filter((profile) =>
    receivedRequests.includes(profile.id)
  );

  return (
    <div className="relative">
      <button
        onClick={() => setShowRequests(!showRequests)}
        className="relative p-2 rounded-full hover:bg-gray-100 focus:outline-none"
      >
        <UserPlusIcon className="h-6 w-6 text-gray-700" />
        {receivedRequests.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            {receivedRequests.length}
          </span>
        )}
      </button>
      {showRequests && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-3 border-b border-gray-200">
            <h3 className="font-medium text-gray-800">Connection Requests</h3>
          </div>
          {requestProfiles.length > 0 ? (
            <div className="max-h-96 overflow-y-auto">
              {requestProfiles.map((profile) => (
                <div
                  key={profile.id}
                  className="p-3 border-b border-gray-100 hover:bg-gray-50"
                >
                  <div className="flex items-center">
                    <img
                      src={profile.profileImage}
                      alt={profile.firstName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="ml-3 flex-1">
                      <Link
                        to={`/profile/${profile.id}`}
                        className="font-medium text-gray-800 hover:text-purple-600"
                      >
                        {profile.firstName}, {profile.age}
                      </Link>
                      <p className="text-xs text-gray-500">
                        {profile.profession} • {profile.city}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex justify-between">
                    <button
                      onClick={() => acceptFriendRequest(profile.id)}
                      className="flex-1 mr-2 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-md text-sm flex items-center justify-center"
                    >
                      <CheckIcon className="h-4 w-4 mr-1" />
                      Accept
                    </button>
                    <button
                      onClick={() => rejectFriendRequest(profile.id)}
                      className="flex-1 py-1.5 bg-gray-100 text-gray-700 rounded-md text-sm flex items-center justify-center hover:bg-gray-200"
                    >
                      <XIcon className="h-4 w-4 mr-1" />
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center">
              <div className="mx-auto h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                <UserIcon className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-gray-600">No connection requests</p>
              <p className="text-sm text-gray-500 mt-1">
                When someone sends you a connection request, it will appear here
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ConnectionRequests;
