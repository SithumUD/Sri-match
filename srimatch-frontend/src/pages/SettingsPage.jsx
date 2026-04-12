import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  Settings,
  Bell,
  Shield,
  Eye,
  Globe,
  Mail,
  Key,
  Download,
  LogOut,
  AlertTriangle,
  Lock,
  Smartphone,
  CreditCard,
  HelpCircle,
  MessageCircleIcon,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  UserIcon,
} from "lucide-react";

const SettingsPage = () => {
  const { logout, user } = useAuth();

  const [activeSection, setActiveSection] = useState("account");
  const [expandedSections, setExpandedSections] = useState([
    "personal-info",
    "security",
  ]);

  const [emailNotifications, setEmailNotifications] = useState({
    messages: true,
    matches: true,
    profileViews: false,
    promotions: false,
  });

  const [pushNotifications, setPushNotifications] = useState({
    messages: true,
    matches: true,
    profileViews: true,
    promotions: false,
  });

  const toggleSection = (section) => {
    if (expandedSections.includes(section)) {
      setExpandedSections(expandedSections.filter((s) => s !== section));
    } else {
      setExpandedSections([...expandedSections, section]);
    }
  };

  const renderSectionHeader = (title, section, icon) => (
    <div
      className="flex justify-between items-center py-4 px-6 cursor-pointer border-b border-gray-200"
      onClick={() => toggleSection(section)}
    >
      <div className="flex items-center">
        {icon}
        <h3 className="text-lg font-semibold text-gray-800 ml-2">{title}</h3>
      </div>
      <div className="flex items-center">
        {expandedSections.includes(section) ? (
          <ChevronUp className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
        <p className="text-gray-600 mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <button
              onClick={() => setActiveSection("account")}
              className={`w-full text-left px-4 py-3 flex items-center ${
                activeSection === "account"
                  ? "bg-purple-50 text-purple-700 border-l-4 border-purple-600"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Settings className="h-5 w-5 mr-3" />
              <span>Account</span>
            </button>

            <button
              onClick={() => setActiveSection("privacy")}
              className={`w-full text-left px-4 py-3 flex items-center ${
                activeSection === "privacy"
                  ? "bg-purple-50 text-purple-700 border-l-4 border-purple-600"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Eye className="h-5 w-5 mr-3" />
              <span>Privacy</span>
            </button>

            <button
              onClick={() => setActiveSection("notifications")}
              className={`w-full text-left px-4 py-3 flex items-center ${
                activeSection === "notifications"
                  ? "bg-purple-50 text-purple-700 border-l-4 border-purple-600"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Bell className="h-5 w-5 mr-3" />
              <span>Notifications</span>
            </button>

            <button
              onClick={() => setActiveSection("security")}
              className={`w-full text-left px-4 py-3 flex items-center ${
                activeSection === "security"
                  ? "bg-purple-50 text-purple-700 border-l-4 border-purple-600"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Shield className="h-5 w-5 mr-3" />
              <span>Security</span>
            </button>

            <button
              onClick={() => setActiveSection("billing")}
              className={`w-full text-left px-4 py-3 flex items-center ${
                activeSection === "billing"
                  ? "bg-purple-50 text-purple-700 border-l-4 border-purple-600"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <CreditCard className="h-5 w-5 mr-3" />
              <span>Billing</span>
            </button>

            <button
              onClick={() => setActiveSection("help")}
              className={`w-full text-left px-4 py-3 flex items-center ${
                activeSection === "help"
                  ? "bg-purple-50 text-purple-700 border-l-4 border-purple-600"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <HelpCircle className="h-5 w-5 mr-3" />
              <span>Help & Support</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-3">
          {activeSection === "account" && (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Account Settings
                </h2>
              </div>

              <div>
                {renderSectionHeader(
                  "Personal Information",
                  "personal-info",
                  <UserIcon className="h-5 w-5 text-purple-600" />
                )}

                {expandedSections.includes("personal-info") && (
                  <div className="p-6">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                          </label>
                          <input
                            type="email"
                            defaultValue={user?.email}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            readOnly
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            placeholder="Add your phone number"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Default Language
                        </label>
                        <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500">
                          <option>English</option>
                          <option>සිංහල (Sinhala)</option>
                          <option>தமிழ் (Tamil)</option>
                        </select>
                      </div>

                      <div className="pt-2">
                        <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">
                          Update Information
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {renderSectionHeader(
                  "Security",
                  "security",
                  <Lock className="h-5 w-5 text-purple-600" />
                )}

                {expandedSections.includes("security") && (
                  <div className="p-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Change Password
                        </label>
                        <div className="space-y-2">
                          <input
                            type="password"
                            placeholder="Current password"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                          <input
                            type="password"
                            placeholder="New password"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                          <input
                            type="password"
                            placeholder="Confirm new password"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                      </div>

                      <div className="pt-2">
                        <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">
                          Update Password
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {renderSectionHeader(
                  "Two-Factor Authentication",
                  "2fa",
                  <Shield className="h-5 w-5 text-purple-600" />
                )}

                {expandedSections.includes("2fa") && (
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-md font-medium text-gray-800">
                          Enable Two-Factor Authentication
                        </h3>
                        <p className="text-sm text-gray-500">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>

                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 mb-4">
                      <p className="text-sm text-yellow-800 flex items-start">
                        <AlertTriangle className="h-5 w-5 mr-2 text-yellow-500 flex-shrink-0" />
                        <span>
                          Two-factor authentication adds an extra layer of
                          security by requiring a code from your phone in
                          addition to your password.
                        </span>
                      </p>
                    </div>

                    <div className="pt-2">
                      <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
                        Set Up Two-Factor Authentication
                      </button>
                    </div>
                  </div>
                )}

                {renderSectionHeader(
                  "Account Actions",
                  "account-actions",
                  <AlertTriangle className="h-5 w-5 text-purple-600" />
                )}

                {expandedSections.includes("account-actions") && (
                  <div className="p-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-md font-medium text-gray-800 mb-2">
                          Download Your Data
                        </h3>
                        <p className="text-sm text-gray-500 mb-3">
                          Request a copy of your personal data that we store
                        </p>
                        <button className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
                          <Download className="h-4 w-4 mr-2" />
                          Request Data Download
                        </button>
                      </div>

                      <div className="border-t border-gray-200 pt-4">
                        <h3 className="text-md font-medium text-gray-800 mb-2">
                          Log Out
                        </h3>
                        <p className="text-sm text-gray-500 mb-3">
                          Sign out from your account on this device
                        </p>
                        <button
                          onClick={logout}
                          className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Log Out
                        </button>
                      </div>

                      <div className="border-t border-gray-200 pt-4">
                        <h3 className="text-md font-medium text-red-600 mb-2">
                          Delete Account
                        </h3>
                        <p className="text-sm text-gray-500 mb-3">
                          Permanently delete your account and all your data
                        </p>
                        <button className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                          <AlertTriangle className="h-4 w-4 mr-2" />
                          Delete My Account
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeSection === "privacy" && (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Privacy Settings
                </h2>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-md font-semibold text-gray-800 mb-4">
                    Profile Visibility
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-700">Who can see my profile</p>
                        <p className="text-sm text-gray-500">
                          Control who can view your full profile details
                        </p>
                      </div>
                      <select className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500">
                        <option>Everyone</option>
                        <option>Only members I like</option>
                        <option>Only members I've matched with</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-700">Show my online status</p>
                        <p className="text-sm text-gray-500">
                          Let others know when you're active on the platform
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          defaultChecked
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-700">Show distance</p>
                        <p className="text-sm text-gray-500">
                          Display approximate distance between you and other
                          users
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          defaultChecked
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-md font-semibold text-gray-800 mb-4">
                    Communication Privacy
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-700">Who can message me</p>
                        <p className="text-sm text-gray-500">
                          Control who can send you direct messages
                        </p>
                      </div>
                      <select className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500">
                        <option>Everyone</option>
                        <option>Only members I like</option>
                        <option>Only members I've matched with</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-700">Read receipts</p>
                        <p className="text-sm text-gray-500">
                          Let others know when you've read their messages
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          defaultChecked
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-md font-semibold text-gray-800 mb-4">
                    Information Privacy
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-700">Show my income</p>
                        <p className="text-sm text-gray-500">
                          Display your income range to other users
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-700">
                          Show my horoscope details
                        </p>
                        <p className="text-sm text-gray-500">
                          Make your detailed horoscope information visible
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          defaultChecked
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-700">Incognito browsing</p>
                        <p className="text-sm text-gray-500">
                          Browse profiles without being seen in their visitors
                          list
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-md font-semibold text-gray-800 mb-4">
                    Blocked Users
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Manage users you've blocked from contacting you
                  </p>
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                    Manage Blocked Users
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeSection === "notifications" && (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Notification Settings
                </h2>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-md font-semibold text-gray-800 mb-4">
                    Email Notifications
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-700">New Messages</p>
                        <p className="text-sm text-gray-500">
                          Get notified when you receive new messages
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={emailNotifications.messages}
                          onChange={() =>
                            setEmailNotifications({
                              ...emailNotifications,
                              messages: !emailNotifications.messages,
                            })
                          }
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-700">New Matches</p>
                        <p className="text-sm text-gray-500">
                          Get notified when you have a new match
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={emailNotifications.matches}
                          onChange={() =>
                            setEmailNotifications({
                              ...emailNotifications,
                              matches: !emailNotifications.matches,
                            })
                          }
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-700">Profile Views</p>
                        <p className="text-sm text-gray-500">
                          Get notified when someone views your profile
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={emailNotifications.profileViews}
                          onChange={() =>
                            setEmailNotifications({
                              ...emailNotifications,
                              profileViews: !emailNotifications.profileViews,
                            })
                          }
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-700">Promotions & Tips</p>
                        <p className="text-sm text-gray-500">
                          Receive special offers and dating tips
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={emailNotifications.promotions}
                          onChange={() =>
                            setEmailNotifications({
                              ...emailNotifications,
                              promotions: !emailNotifications.promotions,
                            })
                          }
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-md font-semibold text-gray-800 mb-4">
                    Push Notifications
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-700">New Messages</p>
                        <p className="text-sm text-gray-500">
                          Get notified when you receive new messages
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={pushNotifications.messages}
                          onChange={() =>
                            setPushNotifications({
                              ...pushNotifications,
                              messages: !pushNotifications.messages,
                            })
                          }
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-700">New Matches</p>
                        <p className="text-sm text-gray-500">
                          Get notified when you have a new match
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={pushNotifications.matches}
                          onChange={() =>
                            setPushNotifications({
                              ...pushNotifications,
                              matches: !pushNotifications.matches,
                            })
                          }
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-700">Profile Views</p>
                        <p className="text-sm text-gray-500">
                          Get notified when someone views your profile
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={pushNotifications.profileViews}
                          onChange={() =>
                            setPushNotifications({
                              ...pushNotifications,
                              profileViews: !pushNotifications.profileViews,
                            })
                          }
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-700">Promotions & Tips</p>
                        <p className="text-sm text-gray-500">
                          Receive special offers and dating tips
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={pushNotifications.promotions}
                          onChange={() =>
                            setPushNotifications({
                              ...pushNotifications,
                              promotions: !pushNotifications.promotions,
                            })
                          }
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">
                    Save Notification Settings
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeSection === "security" && (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Security Settings
                </h2>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-md font-semibold text-gray-800 mb-4">
                    Password Management
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Change Password
                      </label>
                      <div className="space-y-2">
                        <input
                          type="password"
                          placeholder="Current password"
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <input
                          type="password"
                          placeholder="New password"
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <input
                          type="password"
                          placeholder="Confirm new password"
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div className="mt-4">
                        <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">
                          Update Password
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-md font-semibold text-gray-800 mb-4">
                    Two-Factor Authentication
                  </h3>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-gray-700">
                        Enable Two-Factor Authentication
                      </p>
                      <p className="text-sm text-gray-500">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 mb-4">
                    <p className="text-sm text-yellow-800 flex items-start">
                      <AlertTriangle className="h-5 w-5 mr-2 text-yellow-500 flex-shrink-0" />
                      <span>
                        Two-factor authentication adds an extra layer of
                        security by requiring a code from your phone in addition
                        to your password.
                      </span>
                    </p>
                  </div>

                  <div>
                    <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
                      Set Up Two-Factor Authentication
                    </button>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-md font-semibold text-gray-800 mb-4">
                    Login Sessions
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    These are the devices that are currently logged into your
                    account
                  </p>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 border border-gray-200 rounded-md">
                      <div className="flex items-center">
                        <Smartphone className="h-6 w-6 text-gray-500 mr-3" />
                        <div>
                          <p className="font-medium text-gray-800">
                            iPhone • Colombo, Sri Lanka
                          </p>
                          <p className="text-xs text-gray-500">
                            Current session
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center text-green-600 text-sm">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Active now
                      </div>
                    </div>

                    <div className="flex justify-between items-center p-3 border border-gray-200 rounded-md">
                      <div className="flex items-center">
                        <Globe className="h-6 w-6 text-gray-500 mr-3" />
                        <div>
                          <p className="font-medium text-gray-800">
                            Chrome • Windows • Kandy, Sri Lanka
                          </p>
                          <p className="text-xs text-gray-500">
                            Last active: 2 days ago
                          </p>
                        </div>
                      </div>
                      <button className="text-red-600 text-sm hover:text-red-800">
                        Log out
                      </button>
                    </div>
                  </div>

                  <div className="mt-4">
                    <button className="text-red-600 text-sm font-medium hover:text-red-800">
                      Log Out From All Devices
                    </button>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-md font-semibold text-gray-800 mb-4">
                    Login History
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Recent login activity on your account
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-start p-3 border border-gray-200 rounded-md">
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">
                          Successful login
                        </p>
                        <p className="text-sm text-gray-500">
                          iPhone • Colombo, Sri Lanka
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Today, 10:23 AM
                        </p>
                      </div>
                      <div className="text-green-600">
                        <CheckCircle className="h-5 w-5" />
                      </div>
                    </div>

                    <div className="flex items-start p-3 border border-gray-200 rounded-md">
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">
                          Successful login
                        </p>
                        <p className="text-sm text-gray-500">
                          Chrome • Windows • Kandy, Sri Lanka
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          2 days ago, 8:45 PM
                        </p>
                      </div>
                      <div className="text-green-600">
                        <CheckCircle className="h-5 w-5" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === "billing" && (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Billing & Subscription
                </h2>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-md font-semibold text-gray-800 mb-4">
                    Current Plan
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                      <p className="font-medium text-gray-800">Free Plan</p>
                      <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                        Current
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">
                      Basic features with limited daily swipes and matches
                    </p>
                    <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">
                      Upgrade to Premium
                    </button>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-md font-semibold text-gray-800 mb-4">
                    Premium Plans
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-100">
                      <div className="flex justify-between items-center mb-2">
                        <p className="font-medium text-gray-800">Monthly</p>
                        <span className="font-bold text-purple-600">
                          $9.99/month
                        </span>
                      </div>
                      <ul className="text-sm text-gray-600 space-y-2 mb-4">
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                          <span>Unlimited swipes</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                          <span>See who likes you</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                          <span>Advanced filters</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                          <span>Incognito mode</span>
                        </li>
                      </ul>
                      <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">
                        Choose Monthly
                      </button>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-100 relative">
                      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs px-2 py-1 rounded-full">
                        Best Value
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <p className="font-medium text-gray-800">Yearly</p>
                        <div className="text-right">
                          <span className="font-bold text-purple-600">
                            $59.99/year
                          </span>
                          <p className="text-xs text-green-600">Save 50%</p>
                        </div>
                      </div>
                      <ul className="text-sm text-gray-600 space-y-2 mb-4">
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                          <span>All Monthly features</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                          <span>Priority matching</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                          <span>Monthly profile boost</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                          <span>Detailed horoscope matching</span>
                        </li>
                      </ul>
                      <button className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-md hover:from-purple-700 hover:to-pink-700">
                        Choose Yearly
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === "help" && (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Help & Support
                </h2>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-md font-semibold text-gray-800 mb-4">
                    Frequently Asked Questions
                  </h3>
                  <div className="space-y-3">
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <h4 className="font-medium text-gray-800 mb-2">
                        How do I edit my profile?
                      </h4>
                      <p className="text-sm text-gray-600">
                        You can edit your profile by going to the "My Profile"
                        page and clicking the "Edit" button in each section.
                      </p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <h4 className="font-medium text-gray-800 mb-2">
                        How does matching work?
                      </h4>
                      <p className="text-sm text-gray-600">
                        Our matching algorithm considers your preferences,
                        interests, and compatibility factors to suggest
                        potential matches.
                      </p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <h4 className="font-medium text-gray-800 mb-2">
                        How can I change my password?
                      </h4>
                      <p className="text-sm text-gray-600">
                        You can change your password in the Security section of
                        your account settings.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-md font-semibold text-gray-800 mb-4">
                    Contact Support
                  </h3>
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Need help with something specific? Our support team is
                      here to assist you.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button className="flex-1 flex items-center justify-center px-4 py-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                        <Mail className="h-5 w-5 mr-2" />
                        Email Support
                      </button>
                      <button className="flex-1 flex items-center justify-center px-4 py-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                        <MessageCircleIcon className="h-5 w-5 mr-2" />
                        Live Chat
                      </button>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-md font-semibold text-gray-800 mb-4">
                    Safety Tips
                  </h3>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <ul className="text-sm text-blue-800 space-y-2">
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-blue-600 mr-2 mt-0.5" />
                        <span>
                          Always meet in public places for your first few
                          meetings
                        </span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-blue-600 mr-2 mt-0.5" />
                        <span>
                          Tell a friend or family member about your plans
                        </span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-blue-600 mr-2 mt-0.5" />
                        <span>
                          Trust your instincts - if something feels wrong, it
                          probably is
                        </span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-blue-600 mr-2 mt-0.5" />
                        <span>
                          Report suspicious behavior to our support team
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
