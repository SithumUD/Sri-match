import React from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import {
  UserPlusIcon,
  ShieldCheckIcon,
  SearchIcon,
  HeartIcon,
  MessageCircleIcon,
  CalendarIcon,
  CheckCircleIcon,
  StarIcon,
} from "lucide-react";

const HowItWorksPage = () => {
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
            How SriMatch Works
          </h1>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            SriMatch combines traditional Sri Lankan matchmaking values with
            modern technology to help you find your perfect partner. Follow
            these simple steps to begin your journey.
          </p>
          {/* Steps */}
          <div className="space-y-16 mb-16">
            {/* Step 1 */}
            <div className="flex flex-col md:flex-row items-center bg-white rounded-xl shadow-md overflow-hidden">
              <div className="md:w-1/3 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-8 flex flex-col items-center justify-center md:h-full">
                <div className="bg-white/20 rounded-full p-4 mb-4">
                  <UserPlusIcon className="h-10 w-10" />
                </div>
                <h2 className="text-2xl font-bold text-center">Step 1</h2>
                <p className="text-center text-white/80 mt-2">
                  Create Your Profile
                </p>
              </div>
              <div className="md:w-2/3 p-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Sign Up and Complete Your Profile
                </h3>
                <p className="text-gray-600 mb-4">
                  Begin by creating your SriMatch account. Fill out your
                  detailed profile, including:
                </p>
                <ul className="space-y-2 text-gray-600 mb-4">
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-purple-600 mr-2 mt-0.5" />
                    <span>
                      Personal information (age, location, education,
                      profession)
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-purple-600 mr-2 mt-0.5" />
                    <span>
                      Cultural background (religion, ethnicity, language)
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-purple-600 mr-2 mt-0.5" />
                    <span>Lifestyle preferences and interests</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-purple-600 mr-2 mt-0.5" />
                    <span>Horoscope details (optional but recommended)</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-purple-600 mr-2 mt-0.5" />
                    <span>Upload clear, recent photos (minimum 3)</span>
                  </li>
                </ul>
                <p className="text-gray-600">
                  The more complete your profile, the better matches you'll
                  receive. Our algorithm uses this information to find
                  compatible partners.
                </p>
              </div>
            </div>
            {/* Step 2 */}
            <div className="flex flex-col md:flex-row items-center bg-white rounded-xl shadow-md overflow-hidden">
              <div className="md:w-1/3 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-8 flex flex-col items-center justify-center md:h-full">
                <div className="bg-white/20 rounded-full p-4 mb-4">
                  <ShieldCheckIcon className="h-10 w-10" />
                </div>
                <h2 className="text-2xl font-bold text-center">Step 2</h2>
                <p className="text-center text-white/80 mt-2">
                  Verify Your Identity
                </p>
              </div>
              <div className="md:w-2/3 p-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Complete the Verification Process
                </h3>
                <p className="text-gray-600 mb-4">
                  To ensure the safety and authenticity of our community, we
                  require all members to verify their identity:
                </p>
                <ul className="space-y-2 text-gray-600 mb-4">
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-purple-600 mr-2 mt-0.5" />
                    <span>Upload a copy of your National ID or passport</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-purple-600 mr-2 mt-0.5" />
                    <span>Complete a brief video verification call</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-purple-600 mr-2 mt-0.5" />
                    <span>Provide additional documents if requested</span>
                  </li>
                </ul>
                <p className="text-gray-600">
                  Verified profiles receive a badge and are prioritized in
                  search results. This process typically takes 24-48 hours.
                </p>
              </div>
            </div>
            {/* Step 3 */}
            <div className="flex flex-col md:flex-row items-center bg-white rounded-xl shadow-md overflow-hidden">
              <div className="md:w-1/3 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-8 flex flex-col items-center justify-center md:h-full">
                <div className="bg-white/20 rounded-full p-4 mb-4">
                  <SearchIcon className="h-10 w-10" />
                </div>
                <h2 className="text-2xl font-bold text-center">Step 3</h2>
                <p className="text-center text-white/80 mt-2">
                  Discover Matches
                </p>
              </div>
              <div className="md:w-2/3 p-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Browse Compatible Profiles
                </h3>
                <p className="text-gray-600 mb-4">
                  Once your profile is complete and verified, you can start
                  discovering potential matches:
                </p>
                <ul className="space-y-2 text-gray-600 mb-4">
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-purple-600 mr-2 mt-0.5" />
                    <span>
                      View daily match suggestions based on compatibility
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-purple-600 mr-2 mt-0.5" />
                    <span>Search for profiles using advanced filters</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-purple-600 mr-2 mt-0.5" />
                    <span>Check horoscope compatibility if desired</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-purple-600 mr-2 mt-0.5" />
                    <span>Save favorites for later review</span>
                  </li>
                </ul>
                <p className="text-gray-600">
                  Our matching algorithm considers not just basic preferences
                  but also cultural compatibility, values, and lifestyle for
                  meaningful connections.
                </p>
              </div>
            </div>
            {/* Step 4 */}
            <div className="flex flex-col md:flex-row items-center bg-white rounded-xl shadow-md overflow-hidden">
              <div className="md:w-1/3 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-8 flex flex-col items-center justify-center md:h-full">
                <div className="bg-white/20 rounded-full p-4 mb-4">
                  <HeartIcon className="h-10 w-10" />
                </div>
                <h2 className="text-2xl font-bold text-center">Step 4</h2>
                <p className="text-center text-white/80 mt-2">
                  Express Interest
                </p>
              </div>
              <div className="md:w-2/3 p-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Connect With Potential Matches
                </h3>
                <p className="text-gray-600 mb-4">
                  When you find someone interesting, it's time to make a
                  connection:
                </p>
                <ul className="space-y-2 text-gray-600 mb-4">
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-purple-600 mr-2 mt-0.5" />
                    <span>
                      Send a connection request with a personalized message
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-purple-600 mr-2 mt-0.5" />
                    <span>"Like" profiles to show interest</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-purple-600 mr-2 mt-0.5" />
                    <span>Respond to incoming connection requests</span>
                  </li>
                </ul>
                <p className="text-gray-600">
                  Free members can send a limited number of connection requests
                  per month, while Premium members enjoy unlimited connections.
                </p>
              </div>
            </div>
            {/* Step 5 */}
            <div className="flex flex-col md:flex-row items-center bg-white rounded-xl shadow-md overflow-hidden">
              <div className="md:w-1/3 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-8 flex flex-col items-center justify-center md:h-full">
                <div className="bg-white/20 rounded-full p-4 mb-4">
                  <MessageCircleIcon className="h-10 w-10" />
                </div>
                <h2 className="text-2xl font-bold text-center">Step 5</h2>
                <p className="text-center text-white/80 mt-2">Communicate</p>
              </div>
              <div className="md:w-2/3 p-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Start Meaningful Conversations
                </h3>
                <p className="text-gray-600 mb-4">
                  Once a connection is established, you can begin communicating:
                </p>
                <ul className="space-y-2 text-gray-600 mb-4">
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-purple-600 mr-2 mt-0.5" />
                    <span>
                      Exchange messages through our secure messaging system
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-purple-600 mr-2 mt-0.5" />
                    <span>
                      Share additional photos in private conversations
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-purple-600 mr-2 mt-0.5" />
                    <span>
                      Use conversation starters if you're unsure how to begin
                    </span>
                  </li>
                </ul>
                <p className="text-gray-600">
                  Our platform offers privacy controls that let you decide when
                  to share contact information outside the platform.
                </p>
              </div>
            </div>
            {/* Step 6 */}
            <div className="flex flex-col md:flex-row items-center bg-white rounded-xl shadow-md overflow-hidden">
              <div className="md:w-1/3 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-8 flex flex-col items-center justify-center md:h-full">
                <div className="bg-white/20 rounded-full p-4 mb-4">
                  <CalendarIcon className="h-10 w-10" />
                </div>
                <h2 className="text-2xl font-bold text-center">Step 6</h2>
                <p className="text-center text-white/80 mt-2">Meet in Person</p>
              </div>
              <div className="md:w-2/3 p-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Take Your Relationship Forward
                </h3>
                <p className="text-gray-600 mb-4">
                  When you're ready to meet in person:
                </p>
                <ul className="space-y-2 text-gray-600 mb-4">
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-purple-600 mr-2 mt-0.5" />
                    <span>Arrange meetings in safe, public locations</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-purple-600 mr-2 mt-0.5" />
                    <span>
                      Use our meeting scheduler to plan your first date
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-purple-600 mr-2 mt-0.5" />
                    <span>
                      Follow our safety guidelines for in-person meetings
                    </span>
                  </li>
                </ul>
                <p className="text-gray-600">
                  Remember to take your time and ensure you're comfortable
                  before meeting someone in person.
                </p>
              </div>
            </div>
          </div>
          {/* Premium Features */}
          <section className="bg-white rounded-xl shadow-md p-8 mb-12">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-full mr-4">
                <StarIcon className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                Premium Features
              </h2>
            </div>
            <p className="text-gray-600 mb-6">
              Upgrade to SriMatch Premium to enhance your matchmaking experience
              with these exclusive features:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border border-purple-100 rounded-lg p-4 bg-purple-50">
                <h3 className="font-semibold text-gray-800 mb-2">
                  Unlimited Connections
                </h3>
                <p className="text-gray-600 text-sm">
                  Send unlimited connection requests to potential matches.
                </p>
              </div>
              <div className="border border-purple-100 rounded-lg p-4 bg-purple-50">
                <h3 className="font-semibold text-gray-800 mb-2">
                  Advanced Filters
                </h3>
                <p className="text-gray-600 text-sm">
                  Use detailed search filters to find your ideal match.
                </p>
              </div>
              <div className="border border-purple-100 rounded-lg p-4 bg-purple-50">
                <h3 className="font-semibold text-gray-800 mb-2">
                  Profile Boosts
                </h3>
                <p className="text-gray-600 text-sm">
                  Get featured at the top of search results for more visibility.
                </p>
              </div>
              <div className="border border-purple-100 rounded-lg p-4 bg-purple-50">
                <h3 className="font-semibold text-gray-800 mb-2">
                  Read Receipts
                </h3>
                <p className="text-gray-600 text-sm">
                  See when your messages have been read.
                </p>
              </div>
              <div className="border border-purple-100 rounded-lg p-4 bg-purple-50">
                <h3 className="font-semibold text-gray-800 mb-2">
                  Detailed Horoscope Matching
                </h3>
                <p className="text-gray-600 text-sm">
                  Access comprehensive astrological compatibility reports.
                </p>
              </div>
              <div className="border border-purple-100 rounded-lg p-4 bg-purple-50">
                <h3 className="font-semibold text-gray-800 mb-2">
                  See Who Likes You
                </h3>
                <p className="text-gray-600 text-sm">
                  Discover who has shown interest in your profile.
                </p>
              </div>
            </div>
            <div className="mt-8 text-center">
              <Link
                to="/subscription"
                className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full font-medium hover:opacity-90 transition duration-200"
              >
                Upgrade to Premium
              </Link>
            </div>
          </section>
          {/* Get Started CTA */}
          <section className="bg-gradient-to-r from-purple-700 via-fuchsia-600 to-pink-600 text-white rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">
              Ready to Find Your Perfect Match?
            </h2>
            <p className="mb-6 max-w-2xl mx-auto">
              Join thousands of Sri Lankans who have found meaningful
              relationships through SriMatch. Your journey to finding the
              perfect partner starts here!
            </p>
            <Link
              to="/register"
              className="inline-block bg-white text-purple-700 px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition duration-200"
            >
              Create Your Free Account
            </Link>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HowItWorksPage;
