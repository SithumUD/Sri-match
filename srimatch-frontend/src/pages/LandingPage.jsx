import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { HeartIcon, ShieldCheckIcon, StarIcon, UsersIcon } from "lucide-react";
import Footer from "../components/Footer";

const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-purple-700 via-fuchsia-600 to-pink-600 text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="text-3xl font-bold">
              <span className="text-yellow-300">Sri</span>Match
              <span className="text-pink-300 ml-1">♥</span>
            </div>
            <div className="flex space-x-4">
              <Link
                to="/login"
                className="text-white hover:text-pink-200 transition duration-200"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-pink-500 hover:bg-pink-600 text-white px-5 py-2 rounded-full font-medium transition duration-200"
              >
                Join Free
              </Link>
            </div>
          </div>
        </div>
      </header>
      {/* Main Content */}
      <main className="flex-grow">
        {/* Hero Banner */}
        <section className="relative py-24 md:py-32 bg-gradient-to-b from-purple-700 via-fuchsia-600 to-pink-600 text-white overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1545289305-8c3aeeaade63?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80')",
            }}
          ></div>
          {/* Decorative elements */}
          <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-pink-500 opacity-20 animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-purple-500 opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 rounded-full bg-yellow-500 opacity-20 animate-pulse delay-500"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Find Your Perfect Match with Sri Lankan Values
                <span className="text-yellow-300 ml-2">♥</span>
              </h1>
              <p className="text-xl mb-8 text-pink-100">
                SriMatch helps you connect with compatible partners who share
                your cultural values and traditions
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register"
                  className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-full font-medium text-lg transition duration-200 shadow-lg"
                >
                  Create Account
                </Link>
                <Link
                  to="/login"
                  className="bg-white hover:bg-gray-100 text-purple-700 px-8 py-3 rounded-full font-medium text-lg transition duration-200 shadow-lg"
                >
                  Login
                </Link>
              </div>
            </div>
          </div>
        </section>
        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
              Why Choose SriMatch?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-xl text-center shadow-md transition transform hover:scale-105 duration-300">
                <div className="bg-gradient-to-br from-purple-100 to-pink-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                  <UsersIcon className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  Cultural Values
                </h3>
                <p className="text-gray-600">
                  Our matching system respects Sri Lankan traditions and
                  cultural values, helping you find a compatible partner.
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-xl text-center shadow-md transition transform hover:scale-105 duration-300">
                <div className="bg-gradient-to-br from-purple-100 to-pink-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                  <ShieldCheckIcon className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  Verified Profiles
                </h3>
                <p className="text-gray-600">
                  All profiles are verified using National ID to ensure
                  authenticity and safety for our members.
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-xl text-center shadow-md transition transform hover:scale-105 duration-300">
                <div className="bg-gradient-to-br from-purple-100 to-pink-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                  <StarIcon className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  Horoscope Matching
                </h3>
                <p className="text-gray-600">
                  Our unique horoscope compatibility feature helps you find
                  matches according to traditional astrological beliefs.
                </p>
              </div>
            </div>
          </div>
        </section>
        {/* How It Works */}
        <section className="py-16 bg-gradient-to-br from-purple-50 to-pink-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
              How SriMatch Works
            </h2>
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row items-center mb-12">
                <div className="md:w-1/3 mb-6 md:mb-0">
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold mx-auto shadow-lg">
                    1
                  </div>
                </div>
                <div className="md:w-2/3">
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">
                    Create Your Profile
                  </h3>
                  <p className="text-gray-600">
                    Sign up and complete your detailed profile, including
                    personal information, preferences, and horoscope details.
                  </p>
                </div>
              </div>
              <div className="flex flex-col md:flex-row items-center mb-12">
                <div className="md:w-1/3 mb-6 md:mb-0">
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold mx-auto shadow-lg">
                    2
                  </div>
                </div>
                <div className="md:w-2/3">
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">
                    Verify Your Identity
                  </h3>
                  <p className="text-gray-600">
                    Complete the verification process using your National ID to
                    ensure the safety and authenticity of our community.
                  </p>
                </div>
              </div>
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/3 mb-6 md:mb-0">
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold mx-auto shadow-lg">
                    3
                  </div>
                </div>
                <div className="md:w-2/3">
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">
                    Connect With Matches
                  </h3>
                  <p className="text-gray-600">
                    Browse compatible profiles, send connection requests, and
                    start meaningful conversations with your matches.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Testimonials */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
              Success Stories
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl shadow-md">
                <div className="flex items-center mb-4">
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cHJvZmlsZSUyMGluZGlhbiUyMHdvbWFufGVufDB8fDB8fHww&auto=format&fit=crop&w=100&q=60"
                    alt="Testimonial"
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-pink-300"
                  />
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-800">
                      Priya & Sanjay
                    </h4>
                    <p className="text-sm text-gray-500">Colombo</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon key={star} className="h-4 w-4 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 italic">
                  "SriMatch helped us find each other based on our traditional
                  values and horoscope compatibility. We're now happily married
                  for 2 years!"
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl shadow-md">
                <div className="flex items-center mb-4">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHByb2ZpbGUlMjBpbmRpYW4lMjBtYW58ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=100&q=60"
                    alt="Testimonial"
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-pink-300"
                  />
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-800">
                      Nimal & Kumari
                    </h4>
                    <p className="text-sm text-gray-500">Kandy</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon key={star} className="h-4 w-4 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 italic">
                  "The detailed profiles and verification process made us feel
                  safe. We connected over our shared interests and values, and
                  got engaged last month!"
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl shadow-md">
                <div className="flex items-center mb-4">
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZSUyMGluZGlhbiUyMHdvbWFufGVufDB8fDB8fHww&auto=format&fit=crop&w=100&q=60"
                    alt="Testimonial"
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-pink-300"
                  />
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-800">
                      Dilshan & Malini
                    </h4>
                    <p className="text-sm text-gray-500">Galle</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon key={star} className="h-4 w-4 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 italic">
                  "The horoscope matching feature was incredibly accurate! Our
                  families were impressed with how well our charts aligned.
                  Thank you SriMatch!"
                </p>
              </div>
            </div>
          </div>
        </section>
        {/* CTA */}
        <section className="py-16 bg-gradient-to-r from-purple-700 via-fuchsia-600 to-pink-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">
              Ready to Find Your Perfect Match?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-pink-100">
              Join thousands of Sri Lankans who have found meaningful
              relationships through SriMatch
            </p>
            <Link
              to="/register"
              className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-full font-medium text-lg transition duration-200 shadow-lg inline-flex items-center"
            >
              Create Your Free Account
              <HeartIcon className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
