"use client";

import React from "react";
import Link from 'next/link';
import Footer from "../components/Footer";
import { CreditCardIcon } from "lucide-react";

const RefundPolicyPage = () => {
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
              <CreditCardIcon className="h-8 w-8 text-purple-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-800">
                Refund Policy
              </h1>
            </div>

            <p className="text-gray-600 mb-6">Last Updated: June 1, 2023</p>

            <div className="prose max-w-none text-gray-700">
              <p>
                This Refund Policy outlines the terms and conditions regarding
                refunds for subscription payments made to SriMatch. We strive to
                provide a high-quality service and ensure customer satisfaction,
                but we understand that there may be circumstances where a refund
                is appropriate.
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-4">
                1. Subscription Purchases
              </h2>
              <p>
                When you purchase a Premium subscription on SriMatch, you agree
                to the following refund terms:
              </p>

              <h3 className="text-lg font-medium mt-6 mb-3">
                1.1 First-Time Subscribers
              </h3>
              <p>
                If you are a first-time Premium subscriber, we offer a 7-day
                money-back guarantee. If you are not satisfied with our Premium
                service for any reason, you may request a full refund within 7
                days of your initial purchase by contacting our customer support
                team.
              </p>

              <h3 className="text-lg font-medium mt-6 mb-3">
                1.2 Subscription Renewals
              </h3>
              <p>
                Automatic subscription renewals are not eligible for refunds. It
                is your responsibility to cancel your subscription before it
                renews if you do not wish to continue using our Premium
                services.
              </p>

              <h3 className="text-lg font-medium mt-6 mb-3">
                1.3 Cancellation of Subscription
              </h3>
              <p>
                You may cancel your subscription at any time through your
                account settings or by contacting our customer support. Upon
                cancellation, your subscription will remain active until the end
                of your current billing period. No refunds will be provided for
                the unused portion of your subscription period.
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-4">
                2. Refund Eligibility
              </h2>
              <p>Refunds may be considered in the following circumstances:</p>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>
                  Technical issues that severely impact your ability to use the
                  service, which our support team has been unable to resolve
                  within a reasonable timeframe
                </li>
                <li>Unauthorized charges or billing errors</li>
                <li>Failure to deliver the advertised Premium features</li>
                <li>
                  Other exceptional circumstances, evaluated on a case-by-case
                  basis
                </li>
              </ul>

              <h2 className="text-xl font-semibold mt-8 mb-4">
                3. Non-Refundable Purchases
              </h2>
              <p>
                The following purchases are generally not eligible for refunds:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>Profile Boosts or other one-time consumable features</li>
                <li>Subscription renewals (as mentioned in section 1.2)</li>
                <li>
                  Subscriptions that have been active for more than 7 days (for
                  first-time subscribers)
                </li>
                <li>
                  Subscriptions that have been used extensively (e.g., if you
                  have sent multiple messages, made connections, or otherwise
                  actively used the Premium features)
                </li>
                <li>Purchases where there is evidence of fraud or abuse</li>
              </ul>

              <h2 className="text-xl font-semibold mt-8 mb-4">
                4. How to Request a Refund
              </h2>
              <p>
                To request a refund, please contact our customer support through
                one of the following methods:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>Email: billing@srimatch.com</li>
                <li>Contact form on our website</li>
                <li>In-app support chat</li>
              </ul>

              <p>
                Please include the following information in your refund request:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>
                  Your full name and email address associated with your account
                </li>
                <li>Date of purchase</li>
                <li>Subscription plan purchased</li>
                <li>Reason for requesting a refund</li>
                <li>
                  Any relevant details or documentation supporting your request
                </li>
              </ul>

              <h2 className="text-xl font-semibold mt-8 mb-4">
                5. Refund Processing
              </h2>
              <p>If your refund request is approved:</p>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>
                  The refund will be processed using the same payment method
                  used for the original purchase
                </li>
                <li>
                  Processing times may vary depending on your payment provider,
                  typically 5-10 business days
                </li>
                <li>
                  You will receive an email confirmation once the refund has
                  been processed
                </li>
              </ul>

              <h2 className="text-xl font-semibold mt-8 mb-4">
                6. Account Status After Refund
              </h2>
              <p>If a refund is issued for a Premium subscription:</p>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>Your account will be downgraded to a free account</li>
                <li>You will lose access to all Premium features</li>
                <li>
                  Any Premium-only data (such as seeing who liked your profile)
                  will no longer be accessible
                </li>
              </ul>

              <h2 className="text-xl font-semibold mt-8 mb-4">
                7. Disputes and Chargebacks
              </h2>
              <p>
                We encourage you to contact our customer support team before
                initiating a chargeback with your payment provider. Unauthorized
                chargebacks may result in the suspension or termination of your
                SriMatch account.
              </p>
              <p>
                If you believe there has been an error in billing, please
                contact us first so we can investigate and resolve the issue.
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-4">
                8. Changes to This Policy
              </h2>
              <p>
                We reserve the right to modify this Refund Policy at any time.
                Changes will be effective when posted on this page, with the
                "Last Updated" date revised accordingly. We encourage you to
                review this Refund Policy periodically for any changes.
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-4">9. Contact Us</h2>
              <p>
                If you have any questions about our Refund Policy, please
                contact us at:
              </p>
              <p className="mt-2">
                <strong>Email:</strong> billing@srimatch.com
                <br />
                <strong>Postal Address:</strong> 42 Galle Road, Colombo 03, Sri
                Lanka
                <br />
                <strong>Phone:</strong> +94 11 234 5678
              </p>
            </div>

            <div className="mt-10 pt-6 border-t border-gray-200">
              <p className="text-gray-600 text-sm">
                This Refund Policy is part of our Terms and Conditions and is
                subject to change without notice.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RefundPolicyPage;
