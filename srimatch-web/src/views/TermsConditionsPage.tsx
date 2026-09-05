"use client";

import React from "react";
import Link from 'next/link';
import Footer from "../components/Footer";
import { FileTextIcon } from "lucide-react";

const TermsConditionsPage = () => {
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
              <FileTextIcon className="h-8 w-8 text-purple-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-800">
                Terms and Conditions
              </h1>
            </div>
            <p className="text-gray-600 mb-6">Last Updated: June 1, 2023</p>

            <div className="prose max-w-none text-gray-700">
              <p>
                Welcome to SriMatch. These Terms and Conditions ("Terms") govern
                your access to and use of the SriMatch website and mobile
                application (collectively, the "Platform"). Please read these
                Terms carefully before using our Platform.
              </p>
              <p>
                By accessing or using the Platform, you agree to be bound by
                these Terms. If you disagree with any part of these Terms, you
                may not access or use our Platform.
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-4">
                1. Acceptance of Terms
              </h2>
              <p>
                By creating an account, accessing, or using our Platform, you
                agree to be bound by these Terms, our Privacy Policy, and any
                other guidelines or rules applicable to specific services that
                may be posted on the Platform. These Terms constitute a legal
                agreement between you and SriMatch.
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-4">
                2. Eligibility
              </h2>
              <p>To use the Platform, you must:</p>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>Be at least 18 years old</li>
                <li>Be legally able to enter into binding contracts</li>
                <li>
                  Not be prohibited from using the Platform under applicable
                  laws
                </li>
                <li>
                  Not have been convicted of a felony or indictable offense (or
                  crime of similar severity), a sex crime, or any crime
                  involving violence
                </li>
                <li>
                  Not be required to register as a sex offender on any state,
                  federal, or local sex offender registry
                </li>
              </ul>
              <p>
                By using the Platform, you represent and warrant that you meet
                all eligibility requirements.
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-4">
                3. Account Creation and Security
              </h2>
              <p>When you create an account, you agree to:</p>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and promptly update your account information</li>
                <li>Keep your login credentials secure and confidential</li>
                <li>
                  Notify us immediately of any unauthorized use of your account
                </li>
                <li>
                  Be responsible for all activities that occur under your
                  account
                </li>
              </ul>
              <p>
                You may not share your account with anyone else or create
                multiple accounts. We reserve the right to suspend or terminate
                your account if we suspect that you have violated these
                requirements.
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-4">
                4. User Conduct
              </h2>
              <p>You agree not to:</p>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>
                  Use the Platform for any illegal purpose or in violation of
                  any laws
                </li>
                <li>
                  Post, upload, or share inappropriate, offensive, or harmful
                  content
                </li>
                <li>Harass, bully, stalk, intimidate, or defame other users</li>
                <li>
                  Impersonate any person or entity, or falsely state or
                  misrepresent yourself
                </li>
                <li>Solicit money or other items of value from other users</li>
                <li>
                  Attempt to obtain passwords or personal information from other
                  users
                </li>
                <li>Use the Platform to advertise or solicit business</li>
                <li>
                  Engage in data mining, scraping, or similar data gathering
                  activities
                </li>
                <li>
                  Use the Platform in any manner that could disable, overburden,
                  damage, or impair the Platform
                </li>
                <li>
                  Attempt to circumvent any content-filtering techniques we
                  employ
                </li>
                <li>Interfere with the proper working of the Platform</li>
              </ul>
              <p>
                We reserve the right to investigate and take appropriate legal
                action against anyone who violates these provisions.
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-4">5. Content</h2>
              <h3 className="text-lg font-medium mt-6 mb-3">
                5.1 User Content
              </h3>
              <p>
                "User Content" means any content that you submit to the
                Platform, including profile information, photos, messages, and
                other communications. You retain ownership rights in your User
                Content, but you grant us a worldwide, non-exclusive,
                royalty-free license to use, reproduce, modify, adapt, publish,
                translate, create derivative works from, distribute, and display
                such User Content on the Platform and for our business purposes.
              </p>

              <h3 className="text-lg font-medium mt-6 mb-3">
                5.2 Content Guidelines
              </h3>
              <p>
                You are solely responsible for your User Content. You represent
                and warrant that:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>
                  You own or have the necessary rights to the User Content you
                  post
                </li>
                <li>
                  Your User Content does not infringe upon the rights of any
                  third party
                </li>
                <li>
                  Your User Content does not violate these Terms or any
                  applicable laws
                </li>
                <li>Your User Content is accurate and not misleading</li>
                <li>
                  Your User Content does not contain any viruses, worms, or
                  other harmful code
                </li>
              </ul>
              <p>
                We reserve the right to remove any User Content that violates
                these Terms or that we find objectionable for any reason,
                without prior notice.
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-4">
                6. Subscriptions and Payments
              </h2>
              <h3 className="text-lg font-medium mt-6 mb-3">
                6.1 Free and Premium Services
              </h3>
              <p>
                SriMatch offers both free and premium subscription services.
                Features available to free and premium users are described on
                our Platform.
              </p>

              <h3 className="text-lg font-medium mt-6 mb-3">
                6.2 Payment Terms
              </h3>
              <p>If you choose to purchase a premium subscription:</p>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>
                  You agree to pay all fees in accordance with the pricing and
                  payment terms in effect at the time of purchase
                </li>
                <li>
                  You authorize us to charge your chosen payment method for all
                  fees
                </li>
                <li>
                  Subscription fees are billed in advance and are non-refundable
                  except as expressly provided in our Refund Policy
                </li>
                <li>
                  Subscriptions automatically renew unless cancelled at least 24
                  hours before the end of the current period
                </li>
                <li>
                  You are responsible for any taxes applicable to your purchase
                </li>
              </ul>

              <h3 className="text-lg font-medium mt-6 mb-3">
                6.3 Cancellation and Refunds
              </h3>
              <p>
                You may cancel your subscription at any time through your
                account settings or by contacting customer support. Upon
                cancellation, your subscription will remain active until the end
                of your current billing period. Please refer to our Refund
                Policy for information about potential refunds.
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-4">
                7. Intellectual Property
              </h2>
              <p>
                The Platform and its original content (excluding User Content),
                features, and functionality are owned by SriMatch and are
                protected by international copyright, trademark, patent, trade
                secret, and other intellectual property or proprietary rights
                laws.
              </p>
              <p>
                You may not copy, modify, create derivative works from, publicly
                display, publicly perform, republish, download, store, transmit,
                sell, or otherwise exploit any content on our Platform without
                our express prior written permission or the permission of the
                respective rights holder.
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-4">
                8. Disclaimer of Warranties
              </h2>
              <p>
                THE PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT
                WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING,
                BUT NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY,
                FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
              </p>
              <p>WE DO NOT WARRANT THAT:</p>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>
                  THE PLATFORM WILL FUNCTION UNINTERRUPTED, SECURE, OR AVAILABLE
                  AT ANY PARTICULAR TIME OR LOCATION
                </li>
                <li>ANY ERRORS OR DEFECTS WILL BE CORRECTED</li>
                <li>
                  THE PLATFORM IS FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS
                </li>
                <li>
                  THE RESULTS OF USING THE PLATFORM WILL MEET YOUR REQUIREMENTS
                </li>
              </ul>
              <p>YOU USE THE PLATFORM AT YOUR OWN RISK.</p>

              <h2 className="text-xl font-semibold mt-8 mb-4">
                9. Limitation of Liability
              </h2>
              <p>
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL
                SRIMATCH, ITS DIRECTORS, EMPLOYEES, PARTNERS, AGENTS, SUPPLIERS,
                OR AFFILIATES, BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
                CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT
                LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER
                INTANGIBLE LOSSES, RESULTING FROM:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>
                  YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE
                  PLATFORM
                </li>
                <li>
                  ANY CONDUCT OR CONTENT OF ANY THIRD PARTY ON THE PLATFORM
                </li>
                <li>ANY CONTENT OBTAINED FROM THE PLATFORM</li>
                <li>
                  UNAUTHORIZED ACCESS, USE, OR ALTERATION OF YOUR TRANSMISSIONS
                  OR CONTENT
                </li>
              </ul>
              <p>
                IN NO EVENT SHALL OUR TOTAL LIABILITY TO YOU FOR ALL CLAIMS
                EXCEED THE AMOUNT PAID BY YOU, IF ANY, FOR ACCESSING THE
                PLATFORM DURING THE 12 MONTHS PRIOR TO SUCH CLAIM.
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-4">
                10. Indemnification
              </h2>
              <p>
                You agree to defend, indemnify, and hold harmless SriMatch, its
                officers, directors, employees, and agents, from and against any
                claims, liabilities, damages, losses, and expenses, including,
                without limitation, reasonable legal and accounting fees,
                arising out of or in any way connected with your access to or
                use of the Platform, your User Content, or your violation of
                these Terms.
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-4">
                11. Termination
              </h2>
              <p>
                We may terminate or suspend your account and access to the
                Platform immediately, without prior notice or liability, for any
                reason whatsoever, including, without limitation, if you breach
                these Terms.
              </p>
              <p>
                Upon termination, your right to use the Platform will
                immediately cease. All provisions of these Terms which by their
                nature should survive termination shall survive termination,
                including, without limitation, ownership provisions, warranty
                disclaimers, indemnity, and limitations of liability.
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-4">
                12. Governing Law
              </h2>
              <p>
                These Terms shall be governed by and construed in accordance
                with the laws of Sri Lanka, without regard to its conflict of
                law provisions. Any legal action or proceeding arising under
                these Terms shall be brought exclusively in the courts located
                in Colombo, Sri Lanka, and you hereby consent to the personal
                jurisdiction and venue therein.
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-4">
                13. Changes to Terms
              </h2>
              <p>
                We reserve the right, at our sole discretion, to modify or
                replace these Terms at any time. If a revision is material, we
                will provide at least 30 days' notice prior to any new terms
                taking effect. What constitutes a material change will be
                determined at our sole discretion.
              </p>
              <p>
                By continuing to access or use our Platform after any revisions
                become effective, you agree to be bound by the revised terms. If
                you do not agree to the new terms, you are no longer authorized
                to use the Platform.
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-4">
                14. Contact Us
              </h2>
              <p>
                If you have any questions about these Terms, please contact us
                at:
              </p>
              <p className="mt-2">
                <strong>Email:</strong> legal@srimatch.com
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
                understood these Terms and Conditions and agree to be bound by
                them.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsConditionsPage;
