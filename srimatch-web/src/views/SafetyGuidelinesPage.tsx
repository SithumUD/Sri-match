"use client";

import React from "react";
import Link from 'next/link';
import Footer from "../components/Footer";
import {
  ShieldIcon,
  EyeIcon,
  LockIcon,
  UserIcon,
  MapPinIcon,
  AlertTriangleIcon,
  PhoneIcon,
  MessageSquareIcon,
  CheckIcon,
} from "lucide-react";

const SafetyGuidelinesPage = () => {
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
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-8 relative">
              <div className="flex items-center">
                <ShieldIcon className="h-12 w-12 mr-4" />
                <div>
                  <h1 className="text-3xl font-bold">
                    Safety & Security Guidelines
                  </h1>
                  <p className="mt-2 text-white/80">
                    Your safety is our priority. Follow these guidelines for a
                    secure matchmaking experience.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8">
              <p className="text-gray-700 mb-8">
                At SriMatch, we are committed to creating a safe and respectful
                environment for all our users. While we implement various
                security measures on our platform, your personal safety depends
                significantly on how you interact online and offline. Please
                read and follow these guidelines carefully.
              </p>

              <div className="space-y-10">
                {/* Online Safety */}
                <section>
                  <div className="flex items-center mb-4">
                    <div className="bg-purple-100 p-2 rounded-full mr-3">
                      <LockIcon className="h-6 w-6 text-purple-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      Online Safety
                    </h2>
                  </div>

                  <div className="space-y-4 ml-12">
                    <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
                      <h3 className="font-semibold text-gray-800 mb-2">
                        Protect Your Personal Information
                      </h3>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start">
                          <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>
                            Never share sensitive personal information (full
                            name, home address, financial details,
                            identification numbers) early in a conversation
                          </span>
                        </li>
                        <li className="flex items-start">
                          <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>
                            Use SriMatch's messaging system until you feel
                            comfortable moving to another platform
                          </span>
                        </li>
                        <li className="flex items-start">
                          <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>
                            Consider creating a separate email address or phone
                            number specifically for matchmaking purposes
                          </span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
                      <h3 className="font-semibold text-gray-800 mb-2">
                        Be Cautious with Profile Information
                      </h3>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start">
                          <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>
                            Avoid including identifying information in your
                            profile (workplace details, specific addresses)
                          </span>
                        </li>
                        <li className="flex items-start">
                          <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>
                            Be mindful of what's visible in your photos (home
                            address, workplace logos, etc.)
                          </span>
                        </li>
                        <li className="flex items-start">
                          <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>
                            Consider what information could be used to find you
                            on other social media platforms
                          </span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
                      <h3 className="font-semibold text-gray-800 mb-2">
                        Recognize Red Flags
                      </h3>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start">
                          <AlertTriangleIcon className="h-5 w-5 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>
                            Be wary of users who ask for money or financial
                            assistance
                          </span>
                        </li>
                        <li className="flex items-start">
                          <AlertTriangleIcon className="h-5 w-5 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>
                            Be cautious if someone seems too perfect or their
                            story is inconsistent
                          </span>
                        </li>
                        <li className="flex items-start">
                          <AlertTriangleIcon className="h-5 w-5 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>
                            Be suspicious if someone pressures you to move
                            communication off the platform very quickly
                          </span>
                        </li>
                        <li className="flex items-start">
                          <AlertTriangleIcon className="h-5 w-5 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>
                            Be alert if someone avoids video calls or meeting in
                            person
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* Meeting in Person */}
                <section>
                  <div className="flex items-center mb-4">
                    <div className="bg-purple-100 p-2 rounded-full mr-3">
                      <UserIcon className="h-6 w-6 text-purple-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      Meeting in Person
                    </h2>
                  </div>

                  <div className="space-y-4 ml-12">
                    <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
                      <h3 className="font-semibold text-gray-800 mb-2">
                        Before the Meeting
                      </h3>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start">
                          <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>
                            Take time to get to know the person through messages
                            and video calls before meeting in person
                          </span>
                        </li>
                        <li className="flex items-start">
                          <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>
                            Research the person online to verify their identity
                            (social media, professional profiles)
                          </span>
                        </li>
                        <li className="flex items-start">
                          <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>
                            Trust your instincts—if something feels wrong, it
                            probably is
                          </span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
                      <h3 className="font-semibold text-gray-800 mb-2">
                        Planning the First Meeting
                      </h3>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start">
                          <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>
                            Always meet in a public place with plenty of people
                            around
                          </span>
                        </li>
                        <li className="flex items-start">
                          <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>
                            Schedule meetings during daylight hours if possible
                          </span>
                        </li>
                        <li className="flex items-start">
                          <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>
                            Arrange your own transportation to and from the
                            meeting
                          </span>
                        </li>
                        <li className="flex items-start">
                          <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>
                            Consider a group meeting with friends for the first
                            encounter
                          </span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
                      <h3 className="font-semibold text-gray-800 mb-2">
                        During the Meeting
                      </h3>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start">
                          <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>
                            Tell a friend or family member about your plans,
                            including where you're going and when you expect to
                            return
                          </span>
                        </li>
                        <li className="flex items-start">
                          <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>
                            Keep your phone charged and with you at all times
                          </span>
                        </li>
                        <li className="flex items-start">
                          <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>
                            Stay sober and alert—limit alcohol consumption
                          </span>
                        </li>
                        <li className="flex items-start">
                          <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Never leave food or drinks unattended</span>
                        </li>
                        <li className="flex items-start">
                          <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>
                            Have a safety call planned with a friend during the
                            date
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* Reporting Concerns */}
                <section>
                  <div className="flex items-center mb-4">
                    <div className="bg-purple-100 p-2 rounded-full mr-3">
                      <AlertTriangleIcon className="h-6 w-6 text-purple-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      Reporting Concerns
                    </h2>
                  </div>

                  <div className="space-y-4 ml-12">
                    <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
                      <h3 className="font-semibold text-gray-800 mb-2">
                        When to Report to SriMatch
                      </h3>
                      <p className="text-gray-700 mb-3">
                        Please report users who:
                      </p>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start">
                          <AlertTriangleIcon className="h-5 w-5 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Ask for money or financial assistance</span>
                        </li>
                        <li className="flex items-start">
                          <AlertTriangleIcon className="h-5 w-5 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Harass or send inappropriate messages</span>
                        </li>
                        <li className="flex items-start">
                          <AlertTriangleIcon className="h-5 w-5 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Appear to be underage</span>
                        </li>
                        <li className="flex items-start">
                          <AlertTriangleIcon className="h-5 w-5 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Have fake or misleading profiles</span>
                        </li>
                        <li className="flex items-start">
                          <AlertTriangleIcon className="h-5 w-5 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>
                            Exhibit any behavior that makes you uncomfortable
                          </span>
                        </li>
                      </ul>
                      <p className="text-gray-700 mt-3">
                        You can report a user directly from their profile or
                        from any message they send by using the "Report" button.
                      </p>
                    </div>

                    <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
                      <h3 className="font-semibold text-gray-800 mb-2">
                        When to Contact Authorities
                      </h3>
                      <p className="text-gray-700 mb-3">
                        Contact local authorities immediately if:
                      </p>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start">
                          <AlertTriangleIcon className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>You feel physically threatened or unsafe</span>
                        </li>
                        <li className="flex items-start">
                          <AlertTriangleIcon className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Someone threatens to harm you or others</span>
                        </li>
                        <li className="flex items-start">
                          <AlertTriangleIcon className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>
                            You are the victim of assault, fraud, or other
                            crimes
                          </span>
                        </li>
                        <li className="flex items-start">
                          <AlertTriangleIcon className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>You witness illegal activity</span>
                        </li>
                      </ul>
                      <p className="text-gray-700 mt-3">
                        Sri Lanka Emergency Services: 119
                        <br />
                        Women's Helpline: 1938
                      </p>
                    </div>
                  </div>
                </section>

                {/* Privacy Protection */}
                <section>
                  <div className="flex items-center mb-4">
                    <div className="bg-purple-100 p-2 rounded-full mr-3">
                      <EyeIcon className="h-6 w-6 text-purple-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      Privacy Protection
                    </h2>
                  </div>

                  <div className="space-y-4 ml-12">
                    <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
                      <h3 className="font-semibold text-gray-800 mb-2">
                        Managing Your Digital Footprint
                      </h3>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start">
                          <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>
                            Regularly review your privacy settings on SriMatch
                            and other social media platforms
                          </span>
                        </li>
                        <li className="flex items-start">
                          <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>
                            Consider what information about you is publicly
                            available online
                          </span>
                        </li>
                        <li className="flex items-start">
                          <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>
                            Use different photos for your dating profile than
                            those on your social media accounts
                          </span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
                      <h3 className="font-semibold text-gray-800 mb-2">
                        Account Security
                      </h3>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start">
                          <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>
                            Use a strong, unique password for your SriMatch
                            account
                          </span>
                        </li>
                        <li className="flex items-start">
                          <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>
                            Enable two-factor authentication if available
                          </span>
                        </li>
                        <li className="flex items-start">
                          <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>
                            Log out of your account when using shared or public
                            devices
                          </span>
                        </li>
                        <li className="flex items-start">
                          <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>
                            Regularly check for any suspicious activity on your
                            account
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </section>
              </div>

              {/* Emergency Contact */}
              <div className="mt-12 bg-red-50 p-6 rounded-lg border border-red-200">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <PhoneIcon className="h-5 w-5 text-red-600 mr-2" />
                  Emergency Contacts
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-gray-800 mb-1">
                      Sri Lanka Police Emergency
                    </h3>
                    <p className="text-gray-700">119</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800 mb-1">
                      Ambulance Service
                    </h3>
                    <p className="text-gray-700">110</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800 mb-1">
                      Women's Helpline
                    </h3>
                    <p className="text-gray-700">1938</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800 mb-1">
                      National Child Protection Authority
                    </h3>
                    <p className="text-gray-700">1929</p>
                  </div>
                </div>
              </div>

              {/* Contact Us */}
              <div className="mt-12 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-lg">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  <MessageSquareIcon className="h-5 w-5 mr-2" />
                  Need Help?
                </h2>
                <p className="mb-4">
                  If you have any safety concerns or questions, our support team
                  is here to help you.
                </p>
                <Link href="/contact"
                  className="inline-block bg-white text-purple-700 px-6 py-2 rounded-full font-medium hover:bg-gray-100 transition duration-200"
                >
                  Contact Support
                </Link>
              </div>

              <div className="mt-10 pt-6 border-t border-gray-200">
                <p className="text-gray-600 text-sm">
                  These safety guidelines are provided to help you have a safe
                  experience on SriMatch. While we work hard to create a secure
                  platform, we cannot guarantee the conduct of our users. Always
                  prioritize your safety and use your best judgment when
                  interacting with others.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SafetyGuidelinesPage;
