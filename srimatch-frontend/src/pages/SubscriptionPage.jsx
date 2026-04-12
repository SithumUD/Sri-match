import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  CheckIcon,
  XIcon,
  CrownIcon,
  HeartIcon,
  EyeIcon,
  PhoneCallIcon,
  SlidersIcon,
  MessageCircleIcon,
  TrendingUpIcon,
  ZapIcon,
  ChevronRightIcon,
  CreditCardIcon,
  StarIcon,
} from "lucide-react";

const SubscriptionPage = () => {
  const {
    subscription,
    upgradeSubscription,
    cancelSubscription,
    activateBoost,
  } = useAuth();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState("monthly");
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const plans = [
    {
      id: "monthly",
      name: "1 Month",
      price: 29.99,
      perMonth: 29.99,
      save: "0%",
      popular: false,
    },
    {
      id: "3month",
      name: "3 Months",
      price: 79.99,
      perMonth: 26.66,
      save: "11%",
      popular: true,
    },
    {
      id: "6month",
      name: "6 Months",
      price: 149.99,
      perMonth: 25.0,
      save: "17%",
      popular: false,
    },
    {
      id: "yearly",
      name: "12 Months",
      price: 239.99,
      perMonth: 20.0,
      save: "33%",
      popular: false,
    },
  ];

  const features = [
    {
      name: "Daily Likes",
      free: "5 per day",
      premium: "Unlimited",
      icon: <HeartIcon className="h-5 w-5 text-pink-500" />,
    },
    {
      name: "See Who Liked You",
      free: false,
      premium: true,
      icon: <EyeIcon className="h-5 w-5 text-blue-500" />,
    },
    {
      name: "Voice & Video Calls",
      free: false,
      premium: true,
      icon: <PhoneCallIcon className="h-5 w-5 text-green-500" />,
    },
    {
      name: "Advanced Filters",
      free: false,
      premium: true,
      icon: <SlidersIcon className="h-5 w-5 text-purple-500" />,
    },
    {
      name: "Messages Before Connection",
      free: "0",
      premium: "3",
      icon: <MessageCircleIcon className="h-5 w-5 text-yellow-500" />,
    },
    {
      name: "Profile Boost",
      free: false,
      premium: "1 boost (5 days)",
      icon: <TrendingUpIcon className="h-5 w-5 text-orange-500" />,
    },
  ];

  const handleUpgrade = () => {
    setShowPaymentModal(true);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    upgradeSubscription(selectedPlan);
    setShowPaymentModal(false);
    // Show success message
    alert("Subscription successfully upgraded! Enjoy your premium features.");
  };

  const handleCancel = () => {
    if (
      window.confirm(
        "Are you sure you want to cancel your premium subscription? You will lose access to all premium features."
      )
    ) {
      cancelSubscription();
      alert(
        "Your subscription has been canceled. You can upgrade again at any time."
      );
    }
  };

  const handleActivateBoost = () => {
    if (subscription.features.boostExpiresAt) {
      const boostExpiry = new Date(subscription.features.boostExpiresAt);
      if (boostExpiry > new Date()) {
        alert(
          `You already have an active boost that expires on ${boostExpiry.toLocaleDateString()}`
        );
        return;
      }
    }
    activateBoost();
    alert(
      "Your profile boost has been activated! Your profile will be featured at the top of browse results for the next 5 days."
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-6">
        Subscription Plans
      </h1>

      {/* Current Plan Status */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Your Current Plan
            </h2>
            <div className="flex items-center mt-2">
              {subscription.plan === "premium" ? (
                <>
                  <CrownIcon className="h-5 w-5 text-yellow-500 mr-2" />
                  <span className="text-lg font-medium text-yellow-700">
                    Premium
                  </span>
                  {subscription.expiresAt && (
                    <span className="ml-2 text-sm text-gray-500">
                      (Expires:{" "}
                      {new Date(subscription.expiresAt).toLocaleDateString()})
                    </span>
                  )}
                </>
              ) : (
                <>
                  <span className="text-lg font-medium text-gray-700">
                    Free Plan
                  </span>
                </>
              )}
            </div>
          </div>

          {subscription.plan === "premium" ? (
            <div className="flex space-x-4">
              <button
                onClick={handleActivateBoost}
                className={`flex items-center px-4 py-2 rounded-full ${
                  subscription.features.boostExpiresAt &&
                  new Date(subscription.features.boostExpiresAt) > new Date()
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600"
                }`}
                disabled={
                  subscription.features.boostExpiresAt &&
                  new Date(subscription.features.boostExpiresAt) > new Date()
                }
              >
                <ZapIcon className="h-5 w-5 mr-1" />
                {subscription.features.boostExpiresAt &&
                new Date(subscription.features.boostExpiresAt) > new Date()
                  ? "Boost Active"
                  : "Activate Boost"}
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100"
              >
                Cancel Subscription
              </button>
            </div>
          ) : (
            <button
              onClick={handleUpgrade}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full hover:from-purple-700 hover:to-pink-700"
            >
              Upgrade to Premium
            </button>
          )}
        </div>
      </div>

      {/* Plan Comparison */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Plan Comparison
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Feature
                </th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-500">
                  Free Plan
                </th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-500 bg-purple-50">
                  Premium Plan
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {features.map((feature, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <td className="px-6 py-4 text-sm text-gray-800 flex items-center">
                    {feature.icon}
                    <span className="ml-2">{feature.name}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {typeof feature.free === "boolean" ? (
                      feature.free ? (
                        <CheckIcon className="h-5 w-5 text-green-500 mx-auto" />
                      ) : (
                        <XIcon className="h-5 w-5 text-red-500 mx-auto" />
                      )
                    ) : (
                      <span className="text-sm text-gray-600">
                        {feature.free}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center bg-purple-50">
                    {typeof feature.premium === "boolean" ? (
                      feature.premium ? (
                        <CheckIcon className="h-5 w-5 text-green-500 mx-auto" />
                      ) : (
                        <XIcon className="h-5 w-5 text-red-500 mx-auto" />
                      )
                    ) : (
                      <span className="text-sm font-medium text-purple-700">
                        {feature.premium}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Premium Plans */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Premium Plans
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`border rounded-xl p-6 relative transition-all hover:shadow-md ${
                selectedPlan === plan.id
                  ? "border-purple-500 shadow-md"
                  : "border-gray-200"
              }`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  Most Popular
                </div>
              )}
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-800">
                  {plan.name}
                </h3>
                <div className="mt-2">
                  <span className="text-3xl font-bold">${plan.price}</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  ${plan.perMonth.toFixed(2)}/month
                </p>
                {plan.save !== "0%" && (
                  <p className="text-sm text-green-600 font-medium mt-1">
                    Save {plan.save}
                  </p>
                )}
              </div>
              <div className="mt-6">
                <button
                  onClick={handleUpgrade}
                  className={`w-full py-2 rounded-full text-center ${
                    selectedPlan === plan.id
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                >
                  {selectedPlan === plan.id ? "Selected" : "Select"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800">
                Complete Your Purchase
              </h3>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-6 p-4 bg-purple-50 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium text-gray-800">
                    Premium Plan -{" "}
                    {plans.find((p) => p.id === selectedPlan)?.name}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    All premium features included
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">
                    ${plans.find((p) => p.id === selectedPlan)?.price}
                  </p>
                  <p className="text-xs text-gray-500">One-time payment</p>
                </div>
              </div>
            </div>

            <form onSubmit={handlePaymentSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Information
                </label>
                <div className="border border-gray-300 rounded-md p-3 flex items-center">
                  <CreditCardIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <input
                    type="text"
                    placeholder="Card number"
                    className="flex-1 outline-none"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 mt-3">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="border border-gray-300 rounded-md p-3 outline-none"
                    required
                  />
                  <input
                    type="text"
                    placeholder="CVC"
                    className="border border-gray-300 rounded-md p-3 outline-none"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name on Card
                </label>
                <input
                  type="text"
                  placeholder="Full name"
                  className="w-full border border-gray-300 rounded-md p-3 outline-none"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Billing Address
                </label>
                <input
                  type="text"
                  placeholder="Address"
                  className="w-full border border-gray-300 rounded-md p-3 outline-none mb-3"
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="City"
                    className="border border-gray-300 rounded-md p-3 outline-none"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Postal Code"
                    className="border border-gray-300 rounded-md p-3 outline-none"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-between items-center mb-6">
                <div>
                  <p className="font-medium">Total:</p>
                  <p className="text-sm text-gray-600">Includes all taxes</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-xl">
                    ${plans.find((p) => p.id === selectedPlan)?.price}
                  </p>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full hover:from-purple-700 hover:to-pink-700 font-medium"
              >
                Pay & Upgrade Now
              </button>

              <p className="text-xs text-center text-gray-500 mt-4">
                By completing this purchase, you agree to our Terms of Service
                and Privacy Policy.
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionPage;
