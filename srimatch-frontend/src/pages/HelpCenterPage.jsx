import React, { useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import {
  SearchIcon,
  UserIcon,
  HeartIcon,
  MessageCircleIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  SettingsIcon,
  ChevronRightIcon,
  BookOpenIcon,
  PlayCircleIcon,
} from "lucide-react";

const HelpCenterPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const categories = [
    {
      id: "getting-started",
      title: "Getting Started",
      icon: <BookOpenIcon className="h-6 w-6" />,
      color: "bg-blue-100 text-blue-600",
      articles: [
        {
          id: "create-account",
          title: "How to create an account",
        },
        {
          id: "complete-profile",
          title: "Completing your profile",
        },
        {
          id: "verify-account",
          title: "Account verification process",
        },
        {
          id: "upload-photos",
          title: "Uploading and managing photos",
        },
        {
          id: "privacy-settings",
          title: "Setting up privacy preferences",
        },
      ],
    },
    {
      id: "account-profile",
      title: "Account & Profile",
      icon: <UserIcon className="h-6 w-6" />,
      color: "bg-purple-100 text-purple-600",
      articles: [
        {
          id: "edit-profile",
          title: "Editing your profile information",
        },
        {
          id: "change-password",
          title: "Changing your password",
        },
        {
          id: "deactivate-account",
          title: "Temporarily deactivating your account",
        },
        {
          id: "delete-account",
          title: "Deleting your account",
        },
        {
          id: "recover-account",
          title: "Recovering a deleted account",
        },
      ],
    },
    {
      id: "matching-connections",
      title: "Matching & Connections",
      icon: <HeartIcon className="h-6 w-6" />,
      color: "bg-pink-100 text-pink-600",
      articles: [
        {
          id: "matching-algorithm",
          title: "How our matching algorithm works",
        },
        {
          id: "connection-requests",
          title: "Sending and receiving connection requests",
        },
        {
          id: "horoscope-matching",
          title: "Understanding horoscope compatibility",
        },
        {
          id: "search-filters",
          title: "Using search filters effectively",
        },
        {
          id: "boost-profile",
          title: "Boosting your profile visibility",
        },
      ],
    },
    {
      id: "messaging",
      title: "Messaging",
      icon: <MessageCircleIcon className="h-6 w-6" />,
      color: "bg-green-100 text-green-600",
      articles: [
        {
          id: "start-conversation",
          title: "Starting a conversation",
        },
        {
          id: "messaging-etiquette",
          title: "Messaging etiquette guidelines",
        },
        {
          id: "share-photos",
          title: "Sharing photos in messages",
        },
        {
          id: "block-report",
          title: "Blocking and reporting users",
        },
        {
          id: "read-receipts",
          title: "Understanding read receipts",
        },
      ],
    },
    {
      id: "safety-security",
      title: "Safety & Security",
      icon: <ShieldCheckIcon className="h-6 w-6" />,
      color: "bg-orange-100 text-orange-600",
      articles: [
        {
          id: "safe-dating",
          title: "Online dating safety tips",
        },
        {
          id: "report-behavior",
          title: "Reporting inappropriate behavior",
        },
        {
          id: "privacy-controls",
          title: "Understanding privacy controls",
        },
        {
          id: "first-meeting",
          title: "Safety tips for first meetings",
        },
        {
          id: "account-security",
          title: "Keeping your account secure",
        },
      ],
    },
    {
      id: "billing-subscription",
      title: "Billing & Subscription",
      icon: <CreditCardIcon className="h-6 w-6" />,
      color: "bg-teal-100 text-teal-600",
      articles: [
        {
          id: "premium-features",
          title: "Premium membership features",
        },
        {
          id: "payment-methods",
          title: "Managing payment methods",
        },
        {
          id: "cancel-subscription",
          title: "Cancelling your subscription",
        },
        {
          id: "refund-policy",
          title: "Understanding our refund policy",
        },
        {
          id: "billing-issues",
          title: "Troubleshooting billing issues",
        },
      ],
    },
  ];

  const filteredCategories = searchTerm
    ? categories
        .map((category) => ({
          ...category,
          articles: category.articles.filter((article) =>
            article.title.toLowerCase().includes(searchTerm.toLowerCase())
          ),
        }))
        .filter((category) => category.articles.length > 0)
    : categories;

  const popularArticles = [
    {
      id: "safe-dating",
      title: "Online Dating Safety Tips",
      category: "Safety & Security",
    },
    {
      id: "premium-features",
      title: "Premium Membership Features",
      category: "Billing & Subscription",
    },
    {
      id: "matching-algorithm",
      title: "How Our Matching Algorithm Works",
      category: "Matching & Connections",
    },
    {
      id: "verify-account",
      title: "Account Verification Process",
      category: "Getting Started",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-700 via-fuchsia-600 to-pink-600 text-white">
        <div className="container mx-auto px-4 py-6">
          <Link to="/" className="text-3xl font-bold">
            <span className="text-yellow-300">Sri</span>
            <span className="text-white">Match</span>
            <span className="text-pink-300 ml-1">♥</span>
          </Link>
        </div>
      </header>
      {/* Main Content */}
      <main className="flex-grow py-10 px-4">
        <div className="container mx-auto max-w-5xl">
          <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
            Help Center
          </h1>
          {/* Search Bar */}
          <div className="mb-10 max-w-2xl mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search for help articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          </div>
          {/* Video Tutorials */}
          {!searchTerm && (
            <div className="mb-12 bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <PlayCircleIcon className="h-6 w-6 text-purple-600 mr-2" />
                  Video Tutorials
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-100 rounded-lg overflow-hidden">
                    <div className="aspect-w-16 aspect-h-9 bg-gray-200 relative">
                      <img
                        src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2FtZXJhJTIwcmVjb3JkaW5nfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
                        alt="Getting Started Tutorial"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-white/80 p-3 rounded-full">
                          <PlayCircleIcon className="h-8 w-8 text-purple-600" />
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-800">
                        Getting Started Guide
                      </h3>
                      <p className="text-gray-600 text-sm mt-1">3:45 min</p>
                    </div>
                  </div>
                  <div className="bg-gray-100 rounded-lg overflow-hidden">
                    <div className="aspect-w-16 aspect-h-9 bg-gray-200 relative">
                      <img
                        src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHBlb3BsZSUyMHRhbGtpbmd8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60"
                        alt="Messaging Tutorial"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-white/80 p-3 rounded-full">
                          <PlayCircleIcon className="h-8 w-8 text-purple-600" />
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-800">
                        Messaging Tips
                      </h3>
                      <p className="text-gray-600 text-sm mt-1">2:30 min</p>
                    </div>
                  </div>
                  <div className="bg-gray-100 rounded-lg overflow-hidden">
                    <div className="aspect-w-16 aspect-h-9 bg-gray-200 relative">
                      <img
                        src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHByb2ZpbGUlMjBwaG90b3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60"
                        alt="Profile Tutorial"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-white/80 p-3 rounded-full">
                          <PlayCircleIcon className="h-8 w-8 text-purple-600" />
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-800">
                        Creating a Great Profile
                      </h3>
                      <p className="text-gray-600 text-sm mt-1">4:15 min</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Popular Articles */}
          {!searchTerm && (
            <div className="mb-12 bg-white rounded-xl shadow-md p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Popular Articles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {popularArticles.map((article) => (
                  <a
                    key={article.id}
                    href={`#${article.id}`}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-purple-50 transition-colors"
                  >
                    <h3 className="font-semibold text-gray-800">
                      {article.title}
                    </h3>
                    <p className="text-gray-500 text-sm mt-1">
                      {article.category}
                    </p>
                  </a>
                ))}
              </div>
            </div>
          )}
          {/* Help Categories */}
          <div className="space-y-8">
            {filteredCategories.map((category) => (
              <div
                key={category.id}
                id={category.id}
                className="bg-white rounded-xl shadow-md p-6 md:p-8"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <div className={`p-2 rounded-full mr-3 ${category.color}`}>
                    {category.icon}
                  </div>
                  {category.title}
                </h2>
                <div className="space-y-2">
                  {category.articles.map((article) => (
                    <a
                      key={article.id}
                      href={`#${article.id}`}
                      className="block p-3 rounded-lg hover:bg-purple-50 transition-colors flex justify-between items-center"
                    >
                      <span className="text-gray-800">{article.title}</span>
                      <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {filteredCategories.length === 0 && (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <SearchIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                No results found
              </h3>
              <p className="text-gray-600">
                We couldn't find any help articles matching your search.
              </p>
              <button
                onClick={() => setSearchTerm("")}
                className="mt-4 text-purple-600 hover:text-purple-800"
              >
                Clear search
              </button>
            </div>
          )}
          {/* Contact Support */}
          <div className="mt-12 bg-gradient-to-r from-purple-700 via-fuchsia-600 to-pink-600 text-white rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">
              Can't Find What You're Looking For?
            </h2>
            <p className="mb-6">
              Our customer support team is ready to assist you with any
              questions or issues.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/contact"
                className="bg-white text-purple-700 px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition duration-200"
              >
                Contact Support
              </Link>
              <Link
                to="/faq"
                className="bg-transparent border border-white text-white px-6 py-3 rounded-full font-medium hover:bg-white/10 transition duration-200"
              >
                View FAQ
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HelpCenterPage;
