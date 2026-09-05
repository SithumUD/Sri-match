"use client";

import React from "react";
import Link from 'next/link';
import Footer from "../components/Footer";
import { HeartIcon, StarIcon, QuoteIcon } from "lucide-react";

const SuccessStoriesPage = () => {
  const successStories = [
    {
      id: 1,
      names: "Priya & Sanjay",
      location: "Colombo",
      story:
        "We matched on SriMatch in January 2022. After chatting for two weeks, we decided to meet at a café in Colombo. The connection was immediate! Our families were thrilled when they discovered our horoscopes were highly compatible. We got married in a traditional ceremony in December 2022 and are now expecting our first child. Thank you SriMatch for bringing us together!",
      image:
        "https://images.unsplash.com/photo-1529519195486-16945f0fb37d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGluZGlhbiUyMGNvdXBsZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
      marriageDate: "December 2022",
      rating: 5,
    },
    {
      id: 2,
      names: "Dinesh & Kumari",
      location: "Kandy",
      story:
        "Being a doctor with a busy schedule, I had little time for traditional matchmaking. I joined SriMatch after my cousin's recommendation. Within a month, I matched with Kumari, a software engineer. We both appreciated how the platform respected our cultural values while giving us space to know each other. After six months of dating, I proposed during a trip to Ella. We've been married for a year now and couldn't be happier!",
      image:
        "https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGluZGlhbiUyMGNvdXBsZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
      marriageDate: "March 2022",
      rating: 5,
    },
    {
      id: 3,
      names: "Malini & Ashan",
      location: "Galle",
      story:
        "I was skeptical about online matchmaking, but my friend convinced me to try SriMatch. The verification process made me feel safe. I connected with Ashan, who shared my passion for traditional dance and literature. What I loved most was how we could blend modern dating with our traditional values. Our families met after two months, and they got along wonderfully. We had our engagement ceremony last month and are planning our wedding for next year.",
      image:
        "https://images.unsplash.com/photo-1591604466107-ec97de577aff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aW5kaWFuJTIwY291cGxlfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
      marriageDate: "Engaged, Wedding in 2024",
      rating: 5,
    },
    {
      id: 4,
      names: "Rajiv & Anushka",
      location: "Negombo",
      story:
        "After my divorce, I thought finding love again would be impossible, especially with a young daughter. SriMatch surprised me by how inclusive it was. I was transparent about my situation in my profile. When I matched with Anushka, she was understanding and wanted to meet both me and my daughter. She's now not only my wife but an amazing mother to my child. SriMatch helped me find not just a partner, but a complete family.",
      image:
        "https://images.unsplash.com/photo-1623596711744-1cfa5e4321e0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGluZGlhbiUyMGNvdXBsZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
      marriageDate: "August 2021",
      rating: 5,
    },
    {
      id: 5,
      names: "Nimal & Dilani",
      location: "Matara",
      story:
        "We both lived abroad—I in Australia and Dilani in Singapore—but wanted to connect with someone from our Sri Lankan heritage. SriMatch's detailed profiles helped us find each other despite the distance. We video-called for six months before I flew to Singapore to meet her. The connection was even stronger in person! We had a beautiful beach wedding in Matara with both our families present. Now we're settled in Sri Lanka, building our life together.",
      image:
        "https://images.unsplash.com/photo-1537390238848-0da5991e7c4a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8aW5kaWFuJTIwY291cGxlfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
      marriageDate: "January 2023",
      rating: 5,
    },
    {
      id: 6,
      names: "Chaminda & Lakshmi",
      location: "Jaffna",
      story:
        "I'm Buddhist and Lakshmi is Hindu. We both worried about finding someone who would respect our different religious backgrounds. On SriMatch, we could specify our openness to interfaith relationships. When we matched, we were delighted to discover our shared values despite our different religions. Our families were initially hesitant but came around when they saw how happy we made each other. Our wedding incorporated both Buddhist and Hindu traditions, symbolizing our united future.",
      image:
        "https://images.unsplash.com/photo-1583889659384-6d9b2196f2ba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8aW5kaWFuJTIwY291cGxlfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
      marriageDate: "November 2022",
      rating: 5,
    },
  ];

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
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <div className="inline-block bg-pink-100 p-2 rounded-full mb-3">
              <HeartIcon className="h-8 w-8 text-pink-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Success Stories
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Read inspiring stories from couples who found their perfect match
              through SriMatch. These real-life success stories showcase how our
              platform helps Sri Lankans find meaningful relationships that
              honor both tradition and personal connection.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mb-16">
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl text-center shadow-md">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                5,000+
              </div>
              <p className="text-gray-700">Successful Matches</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl text-center shadow-md">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                1,200+
              </div>
              <p className="text-gray-700">Marriages</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl text-center shadow-md">
              <div className="text-3xl font-bold text-purple-600 mb-2">95%</div>
              <p className="text-gray-700">Satisfaction Rate</p>
            </div>
          </div>

          {/* Featured Story */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-16">
            <div className="md:flex">
              <div className="md:w-1/2">
                <img
                  src="https://images.unsplash.com/photo-1513279922550-250c2129b13a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW5kaWFuJTIwd2VkZGluZ3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
                  alt="Featured Success Story"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="md:w-1/2 p-8">
                <div className="flex items-center mb-4">
                  <QuoteIcon className="h-8 w-8 text-pink-500 mr-2" />
                  <h2 className="text-2xl font-bold text-gray-800">
                    Featured Story
                  </h2>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Tharushi & Vikram
                </h3>
                <div className="flex mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon key={star} className="h-5 w-5 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "We were both living abroad—I in Canada and Vikram in the
                  UK—but wanted to connect with someone who shared our Sri
                  Lankan heritage. SriMatch made it possible for us to find each
                  other despite being thousands of miles apart."
                </p>
                <p className="text-gray-600 mb-4">
                  "After three months of video calls, we decided to meet in Sri
                  Lanka during our holiday. Our families were involved from the
                  beginning, which was important to both of us. The horoscope
                  matching feature was particularly valuable to our parents!"
                </p>
                <p className="text-gray-600 mb-4">
                  "We had a traditional wedding in Colombo last year, and now
                  we're settled in Canada, building our life together while
                  keeping our cultural traditions alive. Thank you, SriMatch,
                  for making our cross-continental love story possible!"
                </p>
                <p className="text-gray-500 italic">Married in June 2022</p>
              </div>
            </div>
          </div>

          {/* Success Stories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {successStories.map((story) => (
              <div
                key={story.id}
                className="bg-white rounded-xl shadow-md overflow-hidden"
              >
                <div className="h-64 overflow-hidden">
                  <img
                    src={story.image}
                    alt={story.names}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {story.names}
                  </h3>
                  <div className="flex items-center mb-4">
                    <div className="flex mr-3">
                      {[...Array(story.rating)].map((_, i) => (
                        <StarIcon key={i} className="h-4 w-4 text-yellow-400" />
                      ))}
                    </div>
                    <span className="text-gray-500 text-sm">
                      {story.location}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{story.story}</p>
                  <p className="text-gray-500 italic">{story.marriageDate}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Video Testimonials */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Video Testimonials
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="aspect-w-16 aspect-h-9 bg-gray-200 relative">
                  <img
                    src="https://images.unsplash.com/photo-1511424323603-701a9fa269be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8aW5kaWFuJTIwY291cGxlfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
                    alt="Video Testimonial"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <div className="bg-white rounded-full p-3">
                      <svg
                        className="h-8 w-8 text-purple-600"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800">Ravi & Meena</h3>
                  <p className="text-gray-500 text-sm">Married for 2 years</p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="aspect-w-16 aspect-h-9 bg-gray-200 relative">
                  <img
                    src="https://images.unsplash.com/photo-1609439547168-c973842210e1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGluZGlhbiUyMGNvdXBsZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60"
                    alt="Video Testimonial"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <div className="bg-white rounded-full p-3">
                      <svg
                        className="h-8 w-8 text-purple-600"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800">Sunil & Amali</h3>
                  <p className="text-gray-500 text-sm">Married for 1 year</p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="aspect-w-16 aspect-h-9 bg-gray-200 relative">
                  <img
                    src="https://images.unsplash.com/photo-1565677913671-ce5a5c0ae655?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGluZGlhbiUyMGNvdXBsZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60"
                    alt="Video Testimonial"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <div className="bg-white rounded-full p-3">
                      <svg
                        className="h-8 w-8 text-purple-600"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800">
                    Pradeep & Gayathri
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Engaged, Wedding in 2023
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Share Your Story */}
          <div className="bg-gradient-to-r from-purple-700 via-fuchsia-600 to-pink-600 text-white rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">
              Share Your Success Story
            </h2>
            <p className="mb-6 max-w-2xl mx-auto">
              Found your perfect match through SriMatch? We'd love to hear your
              story! Share your experience and inspire others on their journey
              to finding love.
            </p>
            <button className="bg-white text-purple-700 px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition duration-200">
              Submit Your Story
            </button>
          </div>

          {/* Join CTA */}
          <div className="mt-16 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Ready to Write Your Own Success Story?
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Join thousands of Sri Lankans who have found meaningful
              relationships through SriMatch. Your perfect match might be just a
              click away!
            </p>
            <Link href="/register"
              className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full font-medium hover:opacity-90 transition duration-200"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SuccessStoriesPage;
