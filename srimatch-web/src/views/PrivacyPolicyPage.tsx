"use client";

import React from "react";
import Link from 'next/link';
import Footer from "../components/Footer";
import { ShieldIcon } from "lucide-react";

const PrivacyPolicyPage = () => {
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
        <div className="container mx-auto max-w-3xl">
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="flex items-center mb-6">
              <ShieldIcon className="h-8 w-8 text-purple-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-800">
                Privacy Policy
              </h1>
            </div>

            <p className="text-gray-600 mb-6">Last Updated: June 1, 2023</p>

            <div className="prose max-w-none text-gray-700">
              <p>
                SriMatch ("we," "our," or "us") is committed to protecting your
                privacy. This Privacy Policy explains how we collect, use,
                disclose, and safeguard your information when you use our
                website and mobile application (collectively, the "Platform").
              </p>
              <p>
                Please read this Privacy Policy carefully. By accessing or using
                the Platform, you acknowledge that you have read, understood,
                and agree to be bound by all the terms of this Privacy Policy.
                If you do not agree with our policies and practices, please do
                not use our Platform.
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-4">
                1. Information We Collect
              </h2>

              <h3 className="text-lg font-medium mt-6 mb-3">
                1.1 Personal Information
              </h3>
              <p>
                We may collect personal information that you voluntarily provide
                when you:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>Create an account and profile</li>
                <li>Complete your profile information</li>
                <li>Upload photos</li>
                <li>Verify your identity</li>
                <li>Communicate with other users</li>
                <li>Participate in surveys or promotions</li>
                <li>Contact our customer support</li>
                <li>Subscribe to premium services</li>
              </ul>

              <p>This information may include:</p>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>Contact information (name, email address, phone number)</li>
                <li>
                  Demographic information (age, gender, location, ethnicity,
                  religion)
                </li>
                <li>
                  Profile information (education, profession, interests,
                  preferences)
                </li>
                <li>Photos and videos</li>
                <li>Identity verification documents</li>
                <li>Payment information</li>
                <li>Communication content with other users</li>
              </ul>

              <h3 className="text-lg font-medium mt-6 mb-3">
                1.2 Automatically Collected Information
              </h3>
              <p>
                When you use our Platform, we may automatically collect certain
                information about your device and usage, including:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>
                  Device information (IP address, device type, operating system,
                  browser type)
                </li>
                <li>
                  Log information (access times, pages viewed, features used)
                </li>
                <li>Location information (with your consent)</li>
                <li>Usage patterns and preferences</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>

              <h2 className="text-xl font-semibold mt-8 mb-4">
                2. How We Use Your Information
              </h2>
              <p>
                We may use the information we collect for various purposes,
                including to:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>Create and manage your account</li>
                <li>Provide and improve our services</li>
                <li>Match you with compatible partners</li>
                <li>Facilitate communication between users</li>
                <li>Process payments and manage subscriptions</li>
                <li>Verify your identity and prevent fraud</li>
                <li>Send you updates, notifications, and support messages</li>
                <li>Personalize your experience</li>
                <li>Analyze usage patterns and improve our Platform</li>
                <li>Comply with legal obligations</li>
              </ul>

              <h2 className="text-xl font-semibold mt-8 mb-4">
                3. Sharing Your Information
              </h2>
              <p>
                We may share your information in the following circumstances:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>
                  With other users, as part of your profile information visible
                  to them
                </li>
                <li>
                  With service providers who perform services on our behalf
                </li>
                <li>With payment processors to facilitate transactions</li>
                <li>
                  In response to legal requirements, court orders, or to protect
                  our rights
                </li>
                <li>
                  In connection with a merger, acquisition, or sale of assets
                </li>
                <li>With your consent or at your direction</li>
              </ul>

              <p>We do not sell your personal information to third parties.</p>

              <h2 className="text-xl font-semibold mt-8 mb-4">
                4. Your Privacy Controls
              </h2>
              <p>
                You have several options to control your privacy on SriMatch:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>
                  Profile visibility settings to control who can view your
                  profile
                </li>
                <li>Communication preferences to manage who can contact you</li>
                <li>
                  Notification settings to control what alerts you receive
                </li>
                <li>Option to hide or delete your profile</li>
                <li>Ability to request your personal data</li>
              </ul>

              <h2 className="text-xl font-semibold mt-8 mb-4">
                5. Data Security
              </h2>
              <p>
                We implement appropriate technical and organizational measures
                to protect your personal information, including:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>Encryption of sensitive data</li>
                <li>Regular security assessments</li>
                <li>Access controls for our employees and contractors</li>
                <li>Secure data storage practices</li>
                <li>Regular security training for our team</li>
              </ul>

              <p>
                However, no method of transmission over the Internet or
                electronic storage is 100% secure. While we strive to use
                commercially acceptable means to protect your personal
                information, we cannot guarantee its absolute security.
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-4">
                6. Data Retention
              </h2>
              <p>
                We retain your personal information for as long as necessary to
                fulfill the purposes outlined in this Privacy Policy, unless a
                longer retention period is required or permitted by law. When
                determining how long to retain information, we consider:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>The amount, nature, and sensitivity of the information</li>
                <li>
                  The potential risk of harm from unauthorized use or disclosure
                </li>
                <li>The purposes for which we process the information</li>
                <li>Legal requirements</li>
              </ul>

              <h2 className="text-xl font-semibold mt-8 mb-4">
                7. Children's Privacy
              </h2>
              <p>
                Our Platform is not intended for children under 18 years of age.
                We do not knowingly collect personal information from children
                under 18. If you are a parent or guardian and believe that your
                child has provided us with personal information, please contact
                us. If we become aware that we have collected personal
                information from children without verification of parental
                consent, we will take steps to remove that information from our
                servers.
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-4">
                8. International Data Transfers
              </h2>
              <p>
                Your information may be transferred to and processed in
                countries other than the country in which you reside. These
                countries may have different data protection laws than your
                country of residence. We will take appropriate measures to
                ensure that your personal information remains protected in
                accordance with this Privacy Policy and applicable law.
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-4">
                9. Changes to This Privacy Policy
              </h2>
              <p>
                We may update our Privacy Policy from time to time. We will
                notify you of any changes by posting the new Privacy Policy on
                this page and updating the "Last Updated" date. You are advised
                to review this Privacy Policy periodically for any changes.
                Changes to this Privacy Policy are effective when they are
                posted on this page.
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-4">
                10. Contact Us
              </h2>
              <p>
                If you have any questions or concerns about this Privacy Policy
                or our privacy practices, please contact us at:
              </p>
              <p className="mt-2">
                <strong>Email:</strong> privacy@srimatch.com
                <br />
                <strong>Postal Address:</strong> 42 Galle Road, Colombo 03, Sri
                Lanka
                <br />
                <strong>Phone:</strong> +94 11 234 5678
              </p>
            </div>

            <div className="mt-10 pt-6 border-t border-gray-200">
              <p className="text-gray-600 text-sm">
                By using SriMatch, you acknowledge that you have read and
                understood this Privacy Policy and agree to its terms.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;
