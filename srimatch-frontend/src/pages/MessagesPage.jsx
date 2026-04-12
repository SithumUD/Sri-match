import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { dummyMessages, dummyProfiles } from "../data/dummyData";
import { useAuth } from "../context/AuthContext";
import {
  SearchIcon,
  SendIcon,
  SmileIcon,
  PaperclipIcon,
  ImageIcon,
  MicIcon,
  MessageCircleIcon,
  PhoneIcon,
  VideoIcon,
  UserPlusIcon,
  CheckIcon,
  XIcon,
  InfoIcon,
  LockIcon,
} from "lucide-react";

const MessagesPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialUserId = queryParams.get("user");

  const {
    user,
    connections,
    subscription,
    sentRequests,
    acceptFriendRequest,
    toggleFriendRequest,
  } = useAuth();

  const [conversations, setConversations] = useState(dummyMessages);
  const [activeConversation, setActiveConversation] = useState(null);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [messagesBeforeConnect, setMessagesBeforeConnect] = useState(0);
  const messageEndRef = useRef(null);

  useEffect(() => {
    if (initialUserId) {
      const conversation = conversations.find(
        (conv) => conv.userId === initialUserId
      );
      if (conversation) {
        setActiveConversation(conversation);
      } else {
        // Create a new conversation if it doesn't exist
        const profile = dummyProfiles.find((p) => p.id === initialUserId);
        if (profile) {
          const newConversation = {
            id: `conv-${Date.now()}`,
            userId: profile.id,
            name: `${profile.firstName} ${profile.lastName}`,
            messages: [],
            unread: 0,
            lastMessageTime: "Just now",
            avatar: profile.profileImage,
          };
          setConversations((prev) => [...prev, newConversation]);
          setActiveConversation(newConversation);
        }
      }
    } else if (conversations.length > 0 && !activeConversation) {
      setActiveConversation(conversations[0]);
    }
  }, [initialUserId, conversations, activeConversation]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [activeConversation]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim() || !activeConversation) return;

    const isConnected = connections.includes(activeConversation.userId);
    const isPremium = subscription.plan === "premium";

    // Check if user can send message
    if (!isConnected && !isPremium) {
      alert(
        "You need to be connected to this user to send messages. Send a connection request first."
      );
      return;
    }

    // For premium users, track messages before connection
    if (!isConnected && isPremium) {
      if (messagesBeforeConnect >= subscription.features.messageBeforeAccept) {
        alert(
          "You've reached the maximum number of messages before connection. Wait for them to accept your request."
        );
        return;
      }
      setMessagesBeforeConnect((prev) => prev + 1);
    }

    const newMessage = {
      id: `m${Date.now()}`,
      sender: user?.id,
      content: message,
      timestamp: new Date().toISOString(),
      read: true,
    };

    const updatedConversations = conversations.map((conv) => {
      if (conv.id === activeConversation.id) {
        return {
          ...conv,
          messages: [...conv.messages, newMessage],
          lastMessageTime: "Just now",
        };
      }
      return conv;
    });

    setConversations(updatedConversations);
    setActiveConversation({
      ...activeConversation,
      messages: [...activeConversation.messages, newMessage],
    });
    setMessage("");
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Check if user is connected to the active conversation user
  const isConnected = activeConversation
    ? connections.includes(activeConversation.userId)
    : false;

  // Check if user has sent a request to the active conversation user
  const hasSentRequest = activeConversation
    ? sentRequests.includes(activeConversation.userId)
    : false;

  // Get profile data for active conversation
  const activeProfile = activeConversation
    ? dummyProfiles.find((profile) => profile.id === activeConversation.userId)
    : null;

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-6">
        Messages
      </h1>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3">
          {/* Conversations List */}
          <div className="border-r border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div className="overflow-y-auto h-[600px]">
              {filteredConversations.length > 0 ? (
                filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`p-4 border-b border-gray-100 hover:bg-purple-50 cursor-pointer transition duration-150 ${
                      activeConversation?.id === conversation.id
                        ? "bg-purple-50"
                        : conversation.unread > 0
                        ? "bg-pink-50"
                        : ""
                    }`}
                    onClick={() => {
                      setActiveConversation(conversation);
                      setMessagesBeforeConnect(0); // Reset messages counter when changing conversation
                    }}
                  >
                    <div className="flex items-center">
                      <div className="relative">
                        <img
                          src={conversation.avatar}
                          alt={conversation.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div
                          className={`absolute bottom-0 right-0 w-3 h-3 ${
                            Math.random() > 0.5 ? "bg-green-500" : "bg-gray-300"
                          } rounded-full border-2 border-white`}
                        ></div>
                      </div>

                      <div className="ml-4 flex-1">
                        <div className="flex justify-between">
                          <h3
                            className={`font-medium ${
                              conversation.unread > 0
                                ? "text-gray-900"
                                : "text-gray-800"
                            }`}
                          >
                            {conversation.name}
                          </h3>
                          <span className="text-xs text-gray-500">
                            {conversation.lastMessageTime}
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <p
                            className={`text-sm truncate max-w-[150px] ${
                              conversation.unread > 0
                                ? "text-gray-900 font-medium"
                                : "text-gray-500"
                            }`}
                          >
                            {conversation.messages.length > 0
                              ? conversation.messages[
                                  conversation.messages.length - 1
                                ]?.content
                              : "Start a conversation..."}
                          </p>

                          {conversation.unread > 0 && (
                            <span className="bg-pink-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                              {conversation.unread}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No conversations found
                </div>
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="col-span-2 flex flex-col h-[600px]">
            {activeConversation ? (
              <>
                <div className="p-4 border-b border-gray-200 flex items-center bg-gradient-to-r from-purple-50 to-pink-50">
                  <img
                    src={activeConversation.avatar}
                    alt={activeConversation.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />

                  <div className="ml-3 flex-1">
                    <h3 className="font-medium text-gray-800">
                      {activeConversation.name}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {Math.random() > 0.5
                        ? "Online"
                        : "Last seen 10 minutes ago"}
                    </p>
                  </div>

                  <div className="flex space-x-2">
                    {/* Call buttons - only visible for premium or connected users */}
                    {(isConnected || subscription.plan === "premium") && (
                      <>
                        <button
                          className="p-2 rounded-full hover:bg-gray-100"
                          title={
                            subscription.features.canVoiceVideoCall
                              ? "Voice Call"
                              : "Upgrade to Premium for Voice Calls"
                          }
                          disabled={!subscription.features.canVoiceVideoCall}
                          onClick={() =>
                            !subscription.features.canVoiceVideoCall &&
                            alert(
                              "Voice calls are a premium feature. Please upgrade to make calls."
                            )
                          }
                        >
                          <PhoneIcon
                            className={`h-5 w-5 ${
                              subscription.features.canVoiceVideoCall
                                ? "text-gray-500"
                                : "text-gray-300"
                            }`}
                          />
                        </button>

                        <button
                          className="p-2 rounded-full hover:bg-gray-100"
                          title={
                            subscription.features.canVoiceVideoCall
                              ? "Video Call"
                              : "Upgrade to Premium for Video Calls"
                          }
                          disabled={!subscription.features.canVoiceVideoCall}
                          onClick={() =>
                            !subscription.features.canVoiceVideoCall &&
                            alert(
                              "Video calls are a premium feature. Please upgrade to make calls."
                            )
                          }
                        >
                          <VideoIcon
                            className={`h-5 w-5 ${
                              subscription.features.canVoiceVideoCall
                                ? "text-gray-500"
                                : "text-gray-300"
                            }`}
                          />
                        </button>
                      </>
                    )}

                    {/* Connection status/button */}
                    {!isConnected &&
                      (hasSentRequest ? (
                        <button
                          className="p-2 rounded-full bg-purple-100 text-purple-600"
                          title="Request Sent"
                        >
                          <UserPlusIcon className="h-5 w-5" />
                        </button>
                      ) : (
                        <button
                          className="p-2 rounded-full hover:bg-gray-100"
                          onClick={() =>
                            toggleFriendRequest(activeConversation.userId)
                          }
                          title="Send Connection Request"
                        >
                          <UserPlusIcon className="h-5 w-5 text-gray-500" />
                        </button>
                      ))}

                    <button className="p-2 rounded-full hover:bg-gray-100">
                      <SearchIcon className="h-5 w-5 text-gray-500" />
                    </button>
                  </div>
                </div>

                {/* Connection Status Banner */}
                {!isConnected && (
                  <div
                    className={`px-4 py-2 text-sm flex items-center justify-between ${
                      hasSentRequest
                        ? "bg-purple-50 text-purple-700"
                        : "bg-yellow-50 text-yellow-700"
                    }`}
                  >
                    <div className="flex items-center">
                      {hasSentRequest ? (
                        <>
                          <InfoIcon className="h-4 w-4 mr-2" />
                          <span>
                            Connection request sent. Waiting for{" "}
                            {activeProfile?.firstName} to accept.
                          </span>
                        </>
                      ) : (
                        <>
                          <LockIcon className="h-4 w-4 mr-2" />
                          <span>
                            {subscription.plan === "premium"
                              ? `You can send ${
                                  subscription.features.messageBeforeAccept -
                                  messagesBeforeConnect
                                } messages before connecting.`
                              : "Send a connection request to start messaging."}
                          </span>
                        </>
                      )}
                    </div>

                    {!hasSentRequest && (
                      <button
                        onClick={() =>
                          toggleFriendRequest(activeConversation.userId)
                        }
                        className="px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full text-xs"
                      >
                        Connect
                      </button>
                    )}
                  </div>
                )}

                <div className="flex-1 p-4 overflow-y-auto bg-gradient-to-br from-purple-50/30 to-pink-50/30">
                  <div className="space-y-4">
                    {activeConversation.messages.length > 0 ? (
                      activeConversation.messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${
                            msg.sender === user?.id
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-xs md:max-w-md rounded-2xl py-2 px-4 ${
                              msg.sender === user?.id
                                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                                : "bg-white border border-gray-200"
                            }`}
                          >
                            <p
                              className={
                                msg.sender === user?.id
                                  ? "text-white"
                                  : "text-gray-800"
                              }
                            >
                              {msg.content}
                            </p>
                            <span
                              className={`text-xs block mt-1 ${
                                msg.sender === user?.id
                                  ? "text-purple-100"
                                  : "text-gray-500"
                              }`}
                            >
                              {formatTimestamp(msg.timestamp)}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <div className="mx-auto h-16 w-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                            <MessageCircleIcon className="h-8 w-8 text-purple-600" />
                          </div>
                          <h3 className="text-lg font-medium text-gray-900">
                            Start a conversation
                          </h3>
                          <p className="mt-1 text-gray-500">
                            Send a message to {activeProfile?.firstName}
                          </p>
                        </div>
                      </div>
                    )}
                    <div ref={messageEndRef} />
                  </div>
                </div>

                <div className="p-4 border-t border-gray-200 bg-white">
                  <form
                    onSubmit={handleSendMessage}
                    className="flex items-center"
                  >
                    <button
                      type="button"
                      className="p-2 rounded-full text-gray-500 hover:bg-gray-100 mr-2"
                    >
                      <SmileIcon className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      className="p-2 rounded-full text-gray-500 hover:bg-gray-100 mr-2"
                    >
                      <PaperclipIcon className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      className="p-2 rounded-full text-gray-500 hover:bg-gray-100 mr-2"
                    >
                      <ImageIcon className="h-5 w-5" />
                    </button>

                    <input
                      type="text"
                      placeholder={
                        !isConnected && subscription.plan !== "premium"
                          ? "Connect to send messages..."
                          : "Type a message..."
                      }
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                      disabled={!isConnected && subscription.plan !== "premium"}
                    />

                    <button
                      type="submit"
                      disabled={
                        !message.trim() ||
                        (!isConnected && subscription.plan !== "premium")
                      }
                      className="ml-2 p-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white disabled:opacity-50"
                    >
                      <SendIcon className="h-5 w-5" />
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
                <div className="text-center">
                  <div className="mx-auto h-16 w-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                    <MessageCircleIcon className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">
                    No conversation selected
                  </h3>
                  <p className="mt-1 text-gray-500">
                    Choose a conversation to start chatting
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
