import React, { useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import { ChevronDownIcon, SearchIcon } from "lucide-react";

const FAQPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("general");
  const [openQuestions, setOpenQuestions] = useState([]);

  const toggleQuestion = (id) => {
    if (openQuestions.includes(id)) {
      setOpenQuestions(openQuestions.filter((q) => q !== id));
    } else {
      setOpenQuestions([...openQuestions, id]);
    }
  };

  const faqCategories = [
    {
      id: "general",
      name: "General Questions",
    },
    {
      id: "account",
      name: "Account & Profile",
    },
    {
      id: "matching",
      name: "Matching & Connections",
    },
    {
      id: "messaging",
      name: "Messaging",
    },
    {
      id: "premium",
      name: "Premium Membership",
    },
    {
      id: "privacy",
      name: "Privacy & Security",
    },
    {
      id: "payment",
      name: "Payment & Billing",
    },
  ];

  const faqs = {
    general: [
      {
        id: "general-1",
        question: "What is SriMatch?",
        answer:
          "SriMatch is a matchmaking platform specifically designed for Sri Lankan singles. We combine traditional values with modern technology to help you find a compatible partner who shares your cultural background, beliefs, and aspirations.",
      },
      {
        id: "general-2",
        question: "How is SriMatch different from other dating sites?",
        answer:
          "SriMatch focuses specifically on Sri Lankan cultural values and traditions. We offer unique features like horoscope matching, verified profiles, and cultural compatibility matching that are specifically tailored to Sri Lankan matchmaking customs.",
      },
      {
        id: "general-3",
        question: "Is SriMatch only for Sri Lankans?",
        answer:
          "While SriMatch is primarily designed for Sri Lankans, it welcomes anyone interested in Sri Lankan culture and traditions. Our platform is popular among Sri Lankans living abroad who want to connect with partners who share their heritage.",
      },
      {
        id: "general-4",
        question: "Can I use SriMatch for free?",
        answer:
          "Yes, SriMatch offers a free basic membership that allows you to create a profile, browse matches, and send a limited number of messages. For full access to all features, we offer premium membership options.",
      },
      {
        id: "general-5",
        question: "Is SriMatch available as a mobile app?",
        answer:
          "Yes, SriMatch is available as both a web platform and mobile app. You can download our app from the Apple App Store or Google Play Store for a seamless matchmaking experience on the go.",
      },
    ],
    account: [
      {
        id: "account-1",
        question: "How do I create an account on SriMatch?",
        answer:
          'To create an account, click the "Register" button on our homepage. Fill out the required information, including your email address, create a password, and complete your basic profile details. You\'ll then be guided through the process of completing your full profile.',
      },
      {
        id: "account-2",
        question: "Why do I need to verify my profile?",
        answer:
          "Profile verification helps ensure the safety and authenticity of our community. Verified profiles receive a badge, gain more trust from other members, and are prioritized in search results. Verification involves providing a valid ID and completing a brief video verification process.",
      },
      {
        id: "account-3",
        question: "How many photos can I upload to my profile?",
        answer:
          "Free members can upload up to 5 photos, while premium members can upload up to 10 photos. We recommend uploading clear, recent photos that show your face clearly and represent you authentically.",
      },
      {
        id: "account-4",
        question:
          "Can I create a profile for someone else (like my son or daughter)?",
        answer:
          "Yes, you can create a profile on behalf of a family member. However, the person you're creating the profile for must be aware and consent to it. During registration, there's an option to indicate that you're creating the profile on someone else's behalf.",
      },
      {
        id: "account-5",
        question: "How do I delete my account?",
        answer:
          'To delete your account, go to "Settings" in your profile, scroll to the bottom, and select "Delete Account." You\'ll be asked to confirm your decision. Please note that account deletion is permanent and all your data will be removed from our system.',
      },
    ],
    matching: [
      {
        id: "matching-1",
        question: "How does SriMatch's matching algorithm work?",
        answer:
          "Our matching algorithm considers multiple factors, including your personal preferences, education, profession, religion, cultural background, lifestyle, and horoscope compatibility (if provided). We use this data to suggest profiles that are most compatible with yours.",
      },
      {
        id: "matching-2",
        question: "How accurate is the horoscope matching feature?",
        answer:
          "Our horoscope matching is based on traditional Sri Lankan astrological principles. The accuracy depends on the completeness and correctness of the birth information provided. It's meant to be one factor in your decision-making process, not the sole determinant.",
      },
      {
        id: "matching-3",
        question: "How many connection requests can I send?",
        answer:
          "Free members can send up to 10 connection requests per month. Premium members can send unlimited connection requests. If you've reached your limit as a free member, you'll need to wait until the next month or upgrade to premium.",
      },
      {
        id: "matching-4",
        question: "What happens when I send a connection request?",
        answer:
          "When you send a connection request, the recipient will receive a notification. They can either accept or decline your request. If accepted, you'll be connected and can start messaging each other. If declined, you'll be notified that the request wasn't accepted.",
      },
      {
        id: "matching-5",
        question: "Can I see who has viewed my profile?",
        answer:
          "Profile view information is a premium feature. Premium members can see who has viewed their profile, while free members can only see the number of views but not the specific users who viewed their profile.",
      },
    ],
    messaging: [
      {
        id: "messaging-1",
        question: "Can I message anyone on SriMatch?",
        answer:
          "You can only message users who have accepted your connection request or whose connection request you have accepted. This ensures that conversations are between mutually interested parties.",
      },
      {
        id: "messaging-2",
        question: "How many messages can I send as a free member?",
        answer:
          "Free members can send up to 30 messages per month across all their connections. Premium members enjoy unlimited messaging.",
      },
      {
        id: "messaging-3",
        question: "Can I share photos in messages?",
        answer:
          "Yes, you can share additional photos in private messages once you've established a connection. However, we encourage responsible sharing and prohibit inappropriate content.",
      },
      {
        id: "messaging-4",
        question: "Are messages on SriMatch private?",
        answer:
          "Yes, all messages exchanged on SriMatch are private and can only be seen by you and the recipient. Our system does monitor messages for inappropriate content to maintain community standards, but the content is not accessible to other users.",
      },
      {
        id: "messaging-5",
        question: "How do I know if someone has read my message?",
        answer:
          "Read receipts are a premium feature. Premium members can see when their messages have been read, while free members do not have access to this feature.",
      },
    ],
    premium: [
      {
        id: "premium-1",
        question: "What are the benefits of Premium membership?",
        answer:
          "Premium members enjoy benefits such as unlimited connections, unlimited messaging, advanced search filters, profile boosts, read receipts, seeing who likes you, detailed horoscope matching reports, and priority customer support.",
      },
      {
        id: "premium-2",
        question: "How much does Premium membership cost?",
        answer:
          "We offer several Premium plans: 1-month plan at $19.99/month, 3-month plan at $14.99/month (billed as $44.97), and 6-month plan at $9.99/month (billed as $59.94). All plans include the same features, but longer commitments offer better value.",
      },
      {
        id: "premium-3",
        question: "How do I upgrade to Premium?",
        answer:
          'To upgrade, go to the "Subscription" page in your account settings, select your preferred plan, and follow the payment instructions. You can pay using credit/debit cards, PayPal, or local payment methods.',
      },
      {
        id: "premium-4",
        question: "Can I cancel my Premium membership?",
        answer:
          'Yes, you can cancel your Premium membership at any time. Go to "Subscription" in your account settings and select "Cancel Subscription." Your Premium benefits will continue until the end of your current billing period.',
      },
      {
        id: "premium-5",
        question: "What is a Profile Boost and how does it work?",
        answer:
          "A Profile Boost temporarily places your profile at the top of search results and match recommendations for 24 hours, significantly increasing your visibility. Premium members receive one free boost per month and can purchase additional boosts.",
      },
    ],
    privacy: [
      {
        id: "privacy-1",
        question: "How does SriMatch protect my privacy?",
        answer:
          "We take privacy seriously and employ multiple measures: your contact information is never publicly displayed, you control who can view your full profile, all data is encrypted, and we follow strict data protection policies in compliance with global privacy standards.",
      },
      {
        id: "privacy-2",
        question: "Who can see my profile on SriMatch?",
        answer:
          "By default, only registered SriMatch members can see your profile. You can further restrict visibility in your privacy settings to show your profile only to members who match specific criteria (e.g., age range, location).",
      },
      {
        id: "privacy-3",
        question: "Can I hide my profile temporarily?",
        answer:
          'Yes, you can hide your profile by going to "Privacy Settings" and selecting "Hide My Profile." While hidden, your profile won\'t appear in search results or match recommendations, but you\'ll maintain your connections and messages.',
      },
      {
        id: "privacy-4",
        question: "How secure is my personal information?",
        answer:
          "We use industry-standard security measures, including encryption, secure servers, and regular security audits to protect your information. We never share your personal data with third parties without your explicit consent.",
      },
      {
        id: "privacy-5",
        question: "How do I report inappropriate behavior?",
        answer:
          'If you encounter inappropriate behavior, you can report it by clicking the "Report" button on the user\'s profile or in your conversation with them. Our moderation team reviews all reports within 24 hours and takes appropriate action.',
      },
    ],
    payment: [
      {
        id: "payment-1",
        question: "What payment methods are accepted?",
        answer:
          "We accept major credit and debit cards (Visa, MasterCard, American Express), PayPal, and various local payment methods depending on your country. All payments are processed securely.",
      },
      {
        id: "payment-2",
        question: "Is my payment information secure?",
        answer:
          "Yes, we use industry-standard encryption and secure payment processors. We do not store your complete credit card information on our servers.",
      },
      {
        id: "payment-3",
        question: "Are Premium memberships automatically renewed?",
        answer:
          "Yes, Premium memberships are automatically renewed at the end of your billing cycle unless you cancel. You'll receive an email reminder 3 days before renewal.",
      },
      {
        id: "payment-4",
        question: "Can I get a refund if I'm not satisfied?",
        answer:
          "We offer a 7-day money-back guarantee for first-time Premium subscribers. If you're not satisfied, contact our customer support within 7 days of your initial purchase for a full refund. Please see our Refund Policy for complete details.",
      },
      {
        id: "payment-5",
        question: "How do I update my payment information?",
        answer:
          'To update your payment information, go to "Subscription" in your account settings, then select "Payment Methods." From there, you can add a new payment method or update existing ones.',
      },
    ],
  };

  const filteredFaqs = searchTerm
    ? Object.values(faqs)
        .flat()
        .filter(
          (faq) =>
            faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
        )
    : faqs[activeCategory];

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
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
            Frequently Asked Questions
          </h1>
          {/* Search Bar */}
          <div className="mb-8 max-w-2xl mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search for questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          </div>
          {!searchTerm && (
            <div className="mb-8 overflow-x-auto">
              <div className="flex space-x-2 min-w-max pb-2">
                {faqCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                      activeCategory === category.id
                        ? "bg-purple-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          )}
          {/* FAQ Accordion */}
          <div className="space-y-4">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq) => (
                <div
                  key={faq.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <button
                    className="w-full text-left p-4 focus:outline-none flex justify-between items-center"
                    onClick={() => toggleQuestion(faq.id)}
                  >
                    <span className="font-medium text-gray-800">
                      {faq.question}
                    </span>
                    <ChevronDownIcon
                      className={`h-5 w-5 text-purple-600 transition-transform ${
                        openQuestions.includes(faq.id)
                          ? "transform rotate-180"
                          : ""
                      }`}
                    />
                  </button>
                  {openQuestions.includes(faq.id) && (
                    <div className="px-4 pb-4 text-gray-600">
                      <div className="border-t border-gray-200 pt-4">
                        {faq.answer}
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  No questions found matching your search.
                </p>
                <button
                  onClick={() => setSearchTerm("")}
                  className="mt-2 text-purple-600 hover:text-purple-800"
                >
                  Clear search
                </button>
              </div>
            )}
          </div>
          {/* Contact Support */}
          <div className="mt-12 bg-gradient-to-r from-purple-700 via-fuchsia-600 to-pink-600 text-white rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Still Have Questions?</h2>
            <p className="mb-6">
              Our customer support team is here to help you with any questions
              you may have.
            </p>
            <Link
              to="/contact"
              className="inline-block bg-white text-purple-700 px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition duration-200"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FAQPage;
