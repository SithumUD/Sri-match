import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { dummyProfiles } from '../data/dummyData';
import { UserPlusIcon, UserIcon, CheckIcon, XIcon, MessageCircleIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const ConnectionsPage = () => {
  const [activeTab, setActiveTab] = useState('connections');
  const {
    connections,
    receivedRequests,
    acceptFriendRequest,
    rejectFriendRequest
  } = useAuth();
  
  // Filter dummy profiles to get connected profiles
  const connectedProfiles = dummyProfiles.filter(profile => connections.includes(profile.id));
  
  // Filter dummy profiles to get received request profiles
  const requestProfiles = dummyProfiles.filter(profile => receivedRequests.includes(profile.id));
  
  return <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Your Connections
          </h1>
          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            <button onClick={() => setActiveTab('connections')} className={`px-4 py-2 font-medium text-sm ${activeTab === 'connections' ? 'border-b-2 border-purple-600 text-purple-600' : 'text-gray-500 hover:text-gray-700'}`}>
              Connections ({connections.length})
            </button>
            <button onClick={() => setActiveTab('requests')} className={`px-4 py-2 font-medium text-sm ${activeTab === 'requests' ? 'border-b-2 border-purple-600 text-purple-600' : 'text-gray-500 hover:text-gray-700'}`}>
              Requests ({receivedRequests.length})
            </button>
          </div>
          {/* Connections Tab Content */}
          {activeTab === 'connections' && <div>
              {connectedProfiles.length === 0 ? <div className="text-center py-8">
                  <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                    <UserIcon className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    No connections yet
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Start connecting with people to build your network
                  </p>
                  <Link to="/home" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full font-medium">
                    Browse Profiles
                  </Link>
                </div> : <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {connectedProfiles.map(profile => <div key={profile.id} className="flex items-center p-4 border border-gray-200 rounded-lg">
                      <img src={profile.profileImage} alt={profile.firstName} className="w-16 h-16 rounded-full object-cover mr-4" />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800">
                          {profile.firstName} {profile.lastName}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {profile.age} • {profile.city}
                        </p>
                        <p className="text-gray-600 text-sm">
                          {profile.profession}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Link to={`/profile/${profile.id}`} className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-full" title="View Profile">
                          <UserIcon className="h-5 w-5" />
                        </Link>
                        <Link to={`/messages?user=${profile.id}`} className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-full" title="Send Message">
                          <MessageCircleIcon className="h-5 w-5" />
                        </Link>
                      </div>
                    </div>)}
                </div>}
            </div>}
          {/* Requests Tab Content */}
          {activeTab === 'requests' && <div>
              {requestProfiles.length === 0 ? <div className="text-center py-8">
                  <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                    <UserPlusIcon className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    No pending requests
                  </h3>
                  <p className="text-gray-600">
                    When someone sends you a connection request, it will appear
                    here
                  </p>
                </div> : <div className="space-y-4">
                  {requestProfiles.map(profile => <div key={profile.id} className="flex items-center p-4 border border-gray-200 rounded-lg">
                      <img src={profile.profileImage} alt={profile.firstName} className="w-16 h-16 rounded-full object-cover mr-4" />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800">
                          {profile.firstName} {profile.lastName}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {profile.age} • {profile.city}
                        </p>
                        <p className="text-gray-600 text-sm">
                          {profile.profession}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button onClick={() => acceptFriendRequest(profile.id)} className="p-2 bg-purple-100 text-purple-600 hover:bg-purple-200 rounded-full" title="Accept Request">
                          <CheckIcon className="h-5 w-5" />
                        </button>
                        <button onClick={() => rejectFriendRequest(profile.id)} className="p-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-full" title="Decline Request">
                          <XIcon className="h-5 w-5" />
                        </button>
                        <Link to={`/profile/${profile.id}`} className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-full" title="View Profile">
                          <UserIcon className="h-5 w-5" />
                        </Link>
                      </div>
                    </div>)}
                </div>}
            </div>}
        </div>
      </div>
    </div>;
};

export default ConnectionsPage;