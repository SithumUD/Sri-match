import React from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import {
  HeartIcon,
  UsersIcon,
  GlobeIcon,
  ShieldCheckIcon,
  AwardIcon,
  TrophyIcon,
} from "lucide-react";

const AboutUsPage = () => {
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
            About SriMatch
          </h1>
          {/* Mission */}
          <section className="mb-12 bg-white rounded-xl shadow-md p-8">
            <div className="flex items-center mb-4">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-full mr-4">
                <HeartIcon className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Our Mission</h2>
            </div>
            <p className="text-gray-600 mb-4">
              At SriMatch, our mission is to help Sri Lankan singles find
              meaningful relationships that respect cultural values and
              traditions while embracing modern sensibilities. We believe that
              successful relationships are built on shared values, cultural
              compatibility, and genuine connections.
            </p>
            <p className="text-gray-600">
              We are committed to creating a safe, respectful, and inclusive
              platform where people can discover compatible partners who share
              their background, beliefs, and aspirations.
            </p>
          </section>
          {/* Our Story */}
          <section className="mb-12 bg-white rounded-xl shadow-md p-8">
            <div className="flex items-center mb-4">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-full mr-4">
                <GlobeIcon className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Our Story</h2>
            </div>
            <p className="text-gray-600 mb-4">
              SriMatch was founded in 2020 by a group of Sri Lankan
              professionals who recognized the need for a matrimonial platform
              that bridges traditional values with contemporary lifestyles.
              Having experienced the challenges of finding compatible partners
              who respect cultural heritage, our founders set out to create a
              solution tailored specifically for Sri Lankan singles worldwide.
            </p>
            <p className="text-gray-600">
              What began as a small community has now grown into one of Sri
              Lanka's most trusted matchmaking platforms, with thousands of
              success stories and marriages to our credit. We continue to evolve
              our platform based on user feedback while staying true to our core
              mission of honoring Sri Lankan traditions in the matchmaking
              process.
            </p>
          </section>
          {/* What Makes Us Different */}
          <section className="mb-12 bg-white rounded-xl shadow-md p-8">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-full mr-4">
                <AwardIcon className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                What Makes Us Different
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-gray-100 rounded-lg p-4 bg-purple-50">
                <div className="flex items-center mb-2">
                  <ShieldCheckIcon className="h-5 w-5 text-purple-600 mr-2" />
                  <h3 className="font-semibold text-gray-800">
                    Verified Profiles
                  </h3>
                </div>
                <p className="text-gray-600 text-sm">
                  We verify all profiles using National ID to ensure
                  authenticity and build trust within our community.
                </p>
              </div>
              <div className="border border-gray-100 rounded-lg p-4 bg-pink-50">
                <div className="flex items-center mb-2">
                  <UsersIcon className="h-5 w-5 text-pink-600 mr-2" />
                  <h3 className="font-semibold text-gray-800">
                    Cultural Compatibility
                  </h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Our matching algorithm considers cultural background,
                  traditions, and values for more meaningful connections.
                </p>
              </div>
              <div className="border border-gray-100 rounded-lg p-4 bg-purple-50">
                <div className="flex items-center mb-2">
                  <TrophyIcon className="h-5 w-5 text-purple-600 mr-2" />
                  <h3 className="font-semibold text-gray-800">
                    Horoscope Matching
                  </h3>
                </div>
                <p className="text-gray-600 text-sm">
                  We offer traditional horoscope compatibility analysis for
                  those who value this aspect of Sri Lankan matchmaking.
                </p>
              </div>
              <div className="border border-gray-100 rounded-lg p-4 bg-pink-50">
                <div className="flex items-center mb-2">
                  <HeartIcon className="h-5 w-5 text-pink-600 mr-2" />
                  <h3 className="font-semibold text-gray-800">
                    Family Involvement
                  </h3>
                </div>
                <p className="text-gray-600 text-sm">
                  We respect the role of family in Sri Lankan relationships and
                  provide features that allow appropriate family involvement.
                </p>
              </div>
            </div>
          </section>
          {/* Team */}
          <section className="mb-12 bg-white rounded-xl shadow-md p-8">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-full mr-4">
                <UsersIcon className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Our Team</h2>
            </div>
            <p className="text-gray-600 mb-6">
              SriMatch is powered by a diverse team of professionals who are
              passionate about bringing people together. Our team includes
              experts in relationship psychology, technology, data security, and
              Sri Lankan cultural traditions.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <img
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80"
                  alt="CEO"
                  className="w-24 h-24 rounded-full mx-auto mb-3 object-cover"
                />
                <h3 className="font-semibold text-gray-800">Rajiv Perera</h3>
                <p className="text-gray-500 text-sm">CEO & Founder</p>
              </div>
              <div className="text-center">
                <img
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80"
                  alt="CTO"
                  className="w-24 h-24 rounded-full mx-auto mb-3 object-cover"
                />
                <h3 className="font-semibold text-gray-800">
                  Priya Jayawardena
                </h3>
                <p className="text-gray-500 text-sm">
                  Chief Technology Officer
                </p>
              </div>
              <div className="text-center">
                <img
                  src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80"
                  alt="CMO"
                  className="w-24 h-24 rounded-full mx-auto mb-3 object-cover"
                />
                <h3 className="font-semibold text-gray-800">Dinesh Fernando</h3>
                <p className="text-gray-500 text-sm">Chief Marketing Officer</p>
              </div>
            </div>
          </section>
          {/* Contact CTA */}
          <section className="bg-gradient-to-r from-purple-700 via-fuchsia-600 to-pink-600 text-white rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
            <p className="mb-6">
              Have questions about SriMatch? We'd love to hear from you!
            </p>
            <Link
              to="/contact"
              className="inline-block bg-white text-purple-700 px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition duration-200"
            >
              Contact Us
            </Link>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AboutUsPage;
