"use client";

import React from "react";
import Link from 'next/link';
import Footer from "../components/Footer";
import {
  HelpCircleIcon,
  MessageCircleIcon,
  PhoneIcon,
  FileTextIcon,
  ClockIcon,
  HeadphonesIcon,
  BookOpenIcon,
  UsersIcon,
  ShieldIcon,
} from "lucide-react";

const CustomerSupportPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-700 via-fuchsia-600 to-pink-600 text-white">
        <div className="container mx-auto px-4 py-6">
          <Link href="/" className="text-3xl font-bold">
            <span className="text-yellow-300">Sri</span>
            <span className="text-white">Match</span>
            <span className="text-pink-300 ml-1">♥</span>
          </Link>
        </div>
      </header>
      {/* Main Content */}
      <main className="flex-grow py-10 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 text-center">
            Customer Support
          </h1>
          <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
            We're here to help you with any questions or issues you may have.
            Choose from the support options below.
          </p>
          {/* Support Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <Link href="/contact"
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-full mr-4">
                  <MessageCircleIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    Contact Us
                  </h2>
                  <p className="text-gray-600">
                    Send us a message and we'll get back to you within 24 hours.
                  </p>
                </div>
              </div>
            </Link>
            <Link href="/help-center"
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-full mr-4">
                  <HelpCircleIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    Help Center
                  </h2>
                  <p className="text-gray-600">
                    Browse our knowledge base for tutorials and guides.
                  </p>
                </div>
              </div>
            </Link>
            <Link href="/faq"
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-full mr-4">
                  <FileTextIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    FAQ
                  </h2>
                  <p className="text-gray-600">
                    Find answers to frequently asked questions.
                  </p>
                </div>
              </div>
            </Link>
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-start">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-full mr-4">
                  <PhoneIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    Call Support
                  </h2>
                  <p className="text-gray-600 mb-2">
                    For urgent issues, call our support team.
                  </p>
                  <p className="text-purple-600 font-medium">+94 11 234 5678</p>
                  <p className="text-gray-500 text-sm mt-1 flex items-center">
                    <ClockIcon className="h-4 w-4 mr-1" />
                    Mon-Fri, 9:00 AM - 5:00 PM
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Live Chat */}
          <div className="bg-gradient-to-r from-purple-700 via-fuchsia-600 to-pink-600 text-white rounded-xl p-8 mb-12">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/4 flex justify-center mb-6 md:mb-0">
                <div className="bg-white/20 p-4 rounded-full">
                  <HeadphonesIcon className="h-16 w-16" />
                </div>
              </div>
              <div className="md:w-3/4 text-center md:text-left md:pl-6">
                <h2 className="text-2xl font-bold mb-2">Live Chat Support</h2>
                <p className="mb-4">
                  Need immediate assistance? Chat with our support team now.
                </p>
                <button className="bg-white text-purple-700 px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition duration-200">
                  Start Live Chat
                </button>
                <p className="mt-2 text-sm text-white/80">
                  Available 24/7 for Premium members, 9AM-5PM for Free members
                </p>
              </div>
            </div>
          </div>
          {/* Support Categories */}
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Support Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <div className="bg-purple-100 p-3 rounded-full inline-flex mx-auto mb-4">
                <UsersIcon className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">
                Account Support
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Help with registration, login issues, profile management, and
                account settings.
              </p>
              <Link href="/help-center#account"
                className="text-purple-600 hover:text-purple-800 text-sm font-medium"
              >
                Learn More
              </Link>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <div className="bg-purple-100 p-3 rounded-full inline-flex mx-auto mb-4">
                <BookOpenIcon className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">
                Billing & Subscriptions
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Assistance with payments, premium features, subscription
                management, and refunds.
              </p>
              <Link href="/help-center#billing"
                className="text-purple-600 hover:text-purple-800 text-sm font-medium"
              >
                Learn More
              </Link>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <div className="bg-purple-100 p-3 rounded-full inline-flex mx-auto mb-4">
                <ShieldIcon className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">
                Safety & Security
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Help with privacy concerns, reporting inappropriate behavior,
                and account security.
              </p>
              <Link href="/safety-guidelines"
                className="text-purple-600 hover:text-purple-800 text-sm font-medium"
              >
                Learn More
              </Link>
            </div>
          </div>
          {/* Premium Support */}
          <div className="bg-white rounded-xl shadow-md p-8 border border-purple-200 mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              Premium Support Benefits
            </h2>
            <p className="text-center text-gray-600 mb-6">
              Upgrade to Premium for priority customer support and additional
              benefits.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start">
                <div className="bg-purple-100 p-2 rounded-full mr-3">
                  <ClockIcon className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">
                    Priority Response
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Get faster responses to your support inquiries.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-purple-100 p-2 rounded-full mr-3">
                  <HeadphonesIcon className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">24/7 Live Chat</h3>
                  <p className="text-gray-600 text-sm">
                    Access to round-the-clock live chat support.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-purple-100 p-2 rounded-full mr-3">
                  <PhoneIcon className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">
                    Dedicated Phone Line
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Direct access to premium support specialists.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-purple-100 p-2 rounded-full mr-3">
                  <UsersIcon className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">
                    Personal Account Manager
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Get personalized assistance for your account.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-6 text-center">
              <Link href="/subscription"
                className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full font-medium hover:opacity-90 transition duration-200"
              >
                Upgrade to Premium
              </Link>
            </div>
          </div>
          {/* Contact CTA */}
          <div className="bg-purple-50 rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Still Need Help?
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              If you couldn't find the information you're looking for, our
              friendly support team is just a message away.
            </p>
            <Link href="/contact"
              className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full font-medium hover:opacity-90 transition duration-200"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CustomerSupportPage;
