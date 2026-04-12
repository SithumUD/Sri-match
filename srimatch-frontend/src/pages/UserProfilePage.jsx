import React, { useEffect, useState, Children } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { dummyProfiles } from "../data/dummyData";
import { useAuth } from "../context/AuthContext";
import {
  HeartIcon,
  UserPlusIcon,
  MessageCircleIcon,
  CheckIcon,
  XIcon,
  InfoIcon,
  MapPinIcon,
  BriefcaseIcon,
  GraduationCapIcon,
  HeartHandshakeIcon,
  StarIcon,
  BookIcon,
  ArrowLeftIcon,
  CakeIcon,
  UsersIcon,
  LanguagesIcon,
  CircleDollarSign,
  RulerIcon,
  WineIcon,
  CoffeeIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";

const UserProfilePage = () => {
  const { id } = useParams();
  const { user, likedProfiles, sentRequests, toggleLike, toggleFriendRequest } =
    useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("about");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showGallery, setShowGallery] = useState(false);

  useEffect(() => {
    const fetchProfile = () => {
      setLoading(true);
      setTimeout(() => {
        const foundProfile = dummyProfiles.find((p) => p.id === id);
        setProfile(foundProfile || null);
        setLoading(false);
      }, 500);
    };
    fetchProfile();
  }, [id]);

  const nextImage = (e) => {
    e.stopPropagation();
    if (profile && profile.profileImages && profile.profileImages.length > 1) {
      setCurrentImageIndex((prev) =>
        prev === profile.profileImages.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = (e) => {
    e.stopPropagation();
    if (profile && profile.profileImages && profile.profileImages.length > 1) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? profile.profileImages.length - 1 : prev - 1
      );
    }
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Profile Not Found
        </h2>
        <p className="text-gray-600 mb-6">
          The profile you're looking for doesn't exist or has been removed.
        </p>
        <Link
          to="/home"
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 rounded-full font-medium transition duration-200"
        >
          Return to Browse
        </Link>
      </div>
    );
  }

  const isLiked = likedProfiles.includes(profile.id);
  const hasRequestSent = sentRequests.includes(profile.id);
  const currentImage =
    profile.profileImages && profile.profileImages.length > 0
      ? profile.profileImages[currentImageIndex]
      : profile.profileImage;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center text-purple-600 hover:text-purple-800"
      >
        <ArrowLeftIcon className="h-4 w-4 mr-1" />
        Back to browse
      </button>

      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
        <div className="relative h-96 md:h-[400px] bg-gradient-to-r from-purple-600 to-pink-600">
          {/* Profile Image Gallery */}
          <div className="absolute inset-0">
            <img
              src={currentImage}
              alt={`${profile.firstName} ${profile.lastName}`}
              className="w-full h-full object-cover cursor-pointer"
              onClick={() => setShowGallery(true)}
            />
            {profile.profileImages && profile.profileImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2"
                >
                  <ChevronLeftIcon className="h-6 w-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2"
                >
                  <ChevronRightIcon className="h-6 w-6" />
                </button>
                {/* Thumbnail indicators */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {profile.profileImages.map((_, i) => (
                    <button
                      key={i}
                      onClick={(e) => {
                        e.stopPropagation();
                        goToImage(i);
                      }}
                      className={`w-2 h-2 rounded-full ${
                        i === currentImageIndex
                          ? "bg-white scale-125"
                          : "bg-white/50"
                      } transition-all`}
                      aria-label={`Go to image ${i + 1}`}
                    />
                  ))}
                </div>
                {/* Image counter */}
                <div className="absolute top-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                  {currentImageIndex + 1} / {profile.profileImages.length}
                </div>
              </>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="flex justify-between items-end">
              <div>
                <div className="flex items-center mb-2">
                  <h1 className="text-3xl font-bold">
                    {profile.firstName}, {profile.age}
                  </h1>
                  {profile.isVerified && (
                    <div className="ml-3 bg-purple-500 bg-opacity-80 text-white text-xs font-medium px-2.5 py-1 rounded-full flex items-center">
                      <CheckIcon className="h-3 w-3 mr-1" />
                      Verified
                    </div>
                  )}
                </div>
                <div className="flex items-center text-white/90 text-sm mb-1">
                  <MapPinIcon className="h-4 w-4 mr-1" />
                  <span>
                    {profile.city}, {profile.district}
                  </span>
                </div>
                <div className="flex items-center text-white/90 text-sm">
                  <BriefcaseIcon className="h-4 w-4 mr-1" />
                  <span>
                    {profile.profession} • {profile.education}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="py-6 px-8">
          <div className="flex flex-wrap gap-3 justify-center sm:justify-between">
            <div className="flex space-x-3">
              <button
                onClick={() => toggleLike(profile.id)}
                className={`flex items-center px-4 py-2 rounded-full font-medium ${
                  isLiked
                    ? "bg-pink-100 text-pink-600"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
              >
                <HeartIcon className="h-5 w-5 mr-1" />
                {isLiked ? "Liked" : "Like"}
              </button>
              <button
                onClick={() => toggleFriendRequest(profile.id)}
                className={`flex items-center px-4 py-2 rounded-full font-medium ${
                  hasRequestSent
                    ? "bg-purple-100 text-purple-600"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
              >
                <UserPlusIcon className="h-5 w-5 mr-1" />
                {hasRequestSent ? "Request Sent" : "Connect"}
              </button>
            </div>
            <Link
              to={`/messages?user=${profile.id}`}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full font-medium"
            >
              <MessageCircleIcon className="h-5 w-5 mr-1" />
              Message
            </Link>
          </div>
        </div>
      </div>

      {/* Profile Tabs */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto">
            <button
              onClick={() => setActiveTab("about")}
              className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
                activeTab === "about"
                  ? "border-b-2 border-purple-600 text-purple-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              About
            </button>
            <button
              onClick={() => setActiveTab("details")}
              className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
                activeTab === "details"
                  ? "border-b-2 border-purple-600 text-purple-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Details
            </button>
            <button
              onClick={() => setActiveTab("interests")}
              className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
                activeTab === "interests"
                  ? "border-b-2 border-purple-600 text-purple-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Interests
            </button>
            <button
              onClick={() => setActiveTab("lifestyle")}
              className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
                activeTab === "lifestyle"
                  ? "border-b-2 border-purple-600 text-purple-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Lifestyle
            </button>
            <button
              onClick={() => setActiveTab("compatibility")}
              className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
                activeTab === "compatibility"
                  ? "border-b-2 border-purple-600 text-purple-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Compatibility
            </button>
            <button
              onClick={() => setActiveTab("preferences")}
              className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
                activeTab === "preferences"
                  ? "border-b-2 border-purple-600 text-purple-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Preferences
            </button>
          </nav>
        </div>
        <div className="p-6">
          {activeTab === "about" && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                About {profile.firstName}
              </h3>
              <p className="text-gray-600 mb-6">{profile.about}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-md font-semibold text-gray-700 mb-2 flex items-center">
                    <CakeIcon className="h-4 w-4 mr-2 text-purple-600" />
                    Basic Information
                  </h4>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start">
                      <span className="font-medium w-32">Age:</span>
                      <span>{profile.age} years</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-medium w-32">Marital Status:</span>
                      <span className="capitalize">
                        {profile.maritalStatus}
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-medium w-32">Has Children:</span>
                      <span>{profile.hasChildren ? "Yes" : "No"}</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-md font-semibold text-gray-700 mb-2 flex items-center">
                    <MapPinIcon className="h-4 w-4 mr-2 text-purple-600" />
                    Location
                  </h4>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start">
                      <span className="font-medium w-32">Current City:</span>
                      <span>{profile.city}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-medium w-32">District:</span>
                      <span>{profile.district}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-medium w-32">Place of Birth:</span>
                      <span>{profile.placeOfBirth || "Not specified"}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === "details" && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-md font-semibold text-gray-700 mb-3 flex items-center">
                    <BookIcon className="h-4 w-4 mr-2 text-purple-600" />
                    Religion & Background
                  </h4>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start">
                      <span className="font-medium w-32">Religion:</span>
                      <span>{profile.religion}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-medium w-32">
                        Religious Practices:
                      </span>
                      <span>
                        {profile.religiousPractices || "Not specified"}
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-medium w-32">Ethnicity:</span>
                      <span>{profile.ethnicity || "Not specified"}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-medium w-32">Mother Tongue:</span>
                      <span>
                        {profile.languages && profile.languages.length > 0
                          ? profile.languages[0]
                          : "Not specified"}
                      </span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-md font-semibold text-gray-700 mb-3 flex items-center">
                    <UsersIcon className="h-4 w-4 mr-2 text-purple-600" />
                    Family & Cultural Values
                  </h4>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start">
                      <span className="font-medium w-32">
                        Family Background:
                      </span>
                      <span>{profile.familyBackground || "Not specified"}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-medium w-32">Cultural Values:</span>
                      <span>{profile.culturalValues || "Not specified"}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-medium w-32">
                        Family Involvement:
                      </span>
                      <span>
                        {profile.familyInvolvement || "Not specified"}
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-medium w-32">
                        Wedding Preferences:
                      </span>
                      <span>
                        {profile.weddingPreferences || "Not specified"}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-md font-semibold text-gray-700 mb-3 flex items-center">
                      <GraduationCapIcon className="h-4 w-4 mr-2 text-purple-600" />
                      Education & Career
                    </h4>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start">
                        <span className="font-medium w-32">Education:</span>
                        <span>{profile.education}</span>
                      </li>
                      <li className="flex items-start">
                        <span className="font-medium w-32">
                          Field of Study:
                        </span>
                        <span>{profile.fieldOfStudy || "Not specified"}</span>
                      </li>
                      <li className="flex items-start">
                        <span className="font-medium w-32">Profession:</span>
                        <span>{profile.profession}</span>
                      </li>
                      <li className="flex items-start">
                        <span className="font-medium w-32">Employer:</span>
                        <span>{profile.employer || "Not specified"}</span>
                      </li>
                      <li className="flex items-start">
                        <span className="font-medium w-32">Industry:</span>
                        <span>{profile.industry || "Not specified"}</span>
                      </li>
                      <li className="flex items-start">
                        <span className="font-medium w-32">Work Location:</span>
                        <span>{profile.workLocation || "Not specified"}</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-md font-semibold text-gray-700 mb-3 flex items-center">
                      <LanguagesIcon className="h-4 w-4 mr-2 text-purple-600" />
                      Languages
                    </h4>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {profile.languages && profile.languages.length > 0 ? (
                        profile.languages.map((language, index) => (
                          <span
                            key={index}
                            className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm"
                          >
                            {language}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-600">
                          No languages specified
                        </span>
                      )}
                    </div>
                    <h4 className="text-md font-semibold text-gray-700 mb-3 mt-6 flex items-center">
                      <CircleDollarSign className="h-4 w-4 mr-2 text-purple-600" />
                      Income Range
                    </h4>
                    <p className="text-gray-600">
                      {profile.income || "Not specified"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "interests" && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Interests & Hobbies
              </h3>
              <div className="flex flex-wrap gap-2 mb-6">
                {profile.interests.map((interest, index) => (
                  <span
                    key={index}
                    className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm"
                  >
                    {interest}
                  </span>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-md font-semibold text-gray-700 mb-3">
                    Favorite Things
                  </h4>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start">
                      <span className="font-medium w-32">Food:</span>
                      <span>
                        {profile.favoriteThings?.food || "Not specified"}
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-medium w-32">Books:</span>
                      <span>
                        {profile.favoriteThings?.books || "Not specified"}
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-medium w-32">Movies:</span>
                      <span>
                        {profile.favoriteThings?.movies || "Not specified"}
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-medium w-32">Places:</span>
                      <span>
                        {profile.favoriteThings?.places || "Not specified"}
                      </span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-md font-semibold text-gray-700 mb-3">
                    Travel & Personality
                  </h4>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start">
                      <span className="font-medium w-32">
                        Travel Preferences:
                      </span>
                      <span>
                        {profile.travelPreferences || "Not specified"}
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-medium w-32">
                        Personality Traits:
                      </span>
                      <span>
                        {profile.personalityTraits || "Not specified"}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === "lifestyle" && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Lifestyle & Appearance
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-md font-semibold text-gray-700 mb-3 flex items-center">
                    <RulerIcon className="h-4 w-4 mr-2 text-purple-600" />
                    Physical Appearance
                  </h4>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start">
                      <span className="font-medium w-32">Height:</span>
                      <span>{profile.height} cm</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-medium w-32">Body Type:</span>
                      <span>{profile.bodyType || "Not specified"}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-medium w-32">Complexion:</span>
                      <span>{profile.complexion || "Not specified"}</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-md font-semibold text-gray-700 mb-3 flex items-center">
                    <CoffeeIcon className="h-4 w-4 mr-2 text-purple-600" />
                    Habits & Lifestyle
                  </h4>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start">
                      <span className="font-medium w-32">Smoking:</span>
                      <span>{profile.smoking || "Not specified"}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-medium w-32">Drinking:</span>
                      <span>{profile.drinking || "Not specified"}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-medium w-32">Diet:</span>
                      <span>
                        {profile.dietaryPreferences || "Not specified"}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="mt-8">
                <h4 className="text-md font-semibold text-gray-700 mb-3">
                  Health & Fitness
                </h4>
                <p className="text-gray-600">
                  {profile.healthHabits || "No information provided"}
                </p>
                <h4 className="text-md font-semibold text-gray-700 mb-3 mt-6">
                  Lifestyle Description
                </h4>
                <p className="text-gray-600">
                  {profile.lifestyle || "No information provided"}
                </p>
              </div>
            </div>
          )}

          {activeTab === "compatibility" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800">
                  Horoscope Compatibility
                </h3>
                <div className="text-sm text-gray-500 flex items-center">
                  <InfoIcon className="h-4 w-4 mr-1" />
                  Based on traditional astrology
                </div>
              </div>
              {user && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 flex items-center justify-center text-white text-lg font-bold shadow-md">
                        {profile.matchPercentage}%
                      </div>
                      <div className="ml-4">
                        <h4 className="font-medium text-gray-800">
                          Overall Match Score
                        </h4>
                        <p className="text-sm text-gray-600">
                          Between you and {profile.firstName}
                        </p>
                      </div>
                    </div>
                    <div>
                      <HeartHandshakeIcon className="h-8 w-8 text-purple-600" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Your Sign</p>
                      <p className="font-medium">Leo</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Their Sign</p>
                      <p className="font-medium">{profile.horoscope.sign}</p>
                    </div>
                  </div>
                </div>
              )}
              <div className="space-y-4">
                <div className="border-b border-gray-100 pb-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      Emotional Compatibility
                    </span>
                    <span className="text-sm text-gray-600">
                      {profile.matchPercentage > 80
                        ? "Excellent"
                        : profile.matchPercentage > 60
                        ? "Good"
                        : "Average"}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full"
                      style={{
                        width: `${profile.matchPercentage}%`,
                      }}
                    ></div>
                  </div>
                </div>
                <div className="border-b border-gray-100 pb-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      Communication
                    </span>
                    <span className="text-sm text-gray-600">
                      {profile.matchPercentage - 5 > 80
                        ? "Excellent"
                        : profile.matchPercentage - 5 > 60
                        ? "Good"
                        : "Average"}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full"
                      style={{
                        width: `${profile.matchPercentage - 5}%`,
                      }}
                    ></div>
                  </div>
                </div>
                <div className="border-b border-gray-100 pb-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      Trust & Values
                    </span>
                    <span className="text-sm text-gray-600">
                      {profile.matchPercentage + 8 > 80
                        ? "Excellent"
                        : profile.matchPercentage + 8 > 60
                        ? "Good"
                        : "Average"}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full"
                      style={{
                        width: `${Math.min(profile.matchPercentage + 8, 100)}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="mt-6 text-sm text-gray-500 bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                <p className="flex items-start">
                  <StarIcon className="h-4 w-4 mr-2 mt-0.5 text-yellow-500" />
                  <span>
                    Horoscope compatibility is just one factor in a
                    relationship. Personal values and communication are equally
                    important. This match score is based on traditional Sri
                    Lankan astrological principles.
                  </span>
                </p>
              </div>
              <div className="mt-6">
                <h4 className="text-md font-semibold text-gray-700 mb-3">
                  Detailed Horoscope Information
                </h4>
                <p className="text-gray-600">
                  {profile.horoscope.sign} - {profile.horoscope.details}
                </p>
              </div>
            </div>
          )}

          {activeTab === "preferences" && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Partner Preferences
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-md font-semibold text-gray-700 mb-3">
                    Basic Preferences
                  </h4>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start">
                      <span className="font-medium w-32">Age Range:</span>
                      <span>
                        {(profile.partnerPreferences?.ageRange || []).join(
                          " - "
                        )}{" "}
                        years
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-medium w-32">Location:</span>
                      <span>
                        {profile.partnerPreferences?.locationPreference ||
                          "Not specified"}
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-medium w-32">Education:</span>
                      <span>
                        {profile.partnerPreferences?.educationLevel ||
                          "Not specified"}
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-medium w-32">Religion:</span>
                      <span>
                        {profile.partnerPreferences?.religionPreference ||
                          "Not specified"}
                      </span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-md font-semibold text-gray-700 mb-3">
                    Additional Preferences
                  </h4>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start">
                      <span className="font-medium w-32">Marital Status:</span>
                      <span>
                        {profile.partnerPreferences?.maritalStatusPreference ||
                          "Not specified"}
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-medium w-32">Height:</span>
                      <span>
                        {profile.partnerPreferences?.heightPreference
                          ? profile.partnerPreferences.heightPreference.join(
                              " - "
                            ) + " cm"
                          : "Not specified"}
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-medium w-32">Lifestyle:</span>
                      <span>
                        {profile.partnerPreferences?.lifestyleCompatibility ||
                          "Not specified"}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="mt-8">
                <h4 className="text-md font-semibold text-gray-700 mb-3">
                  Dealbreakers
                </h4>
                <p className="text-gray-600">
                  {profile.dealbreakers || "No specific dealbreakers mentioned"}
                </p>
              </div>
              <div className="mt-8">
                <h4 className="text-md font-semibold text-gray-700 mb-3">
                  Future Aspirations
                </h4>
                <p className="text-gray-600">
                  {profile.futureAspirations || "Not specified"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Suggested Actions */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Suggested Next Steps
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to={`/messages?user=${profile.id}`}
            className="flex items-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg hover:from-purple-100 hover:to-pink-100 transition duration-200"
          >
            <div className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white mr-4">
              <MessageCircleIcon className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-medium text-gray-800">
                Start a Conversation
              </h4>
              <p className="text-sm text-gray-600">
                Send a message to break the ice
              </p>
            </div>
          </Link>
          <button
            onClick={() => toggleFriendRequest(profile.id)}
            className="flex items-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg hover:from-purple-100 hover:to-pink-100 transition duration-200"
          >
            <div className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white mr-4">
              <UserPlusIcon className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-medium text-gray-800">
                {hasRequestSent
                  ? "Cancel Connection Request"
                  : "Send Connection Request"}
              </h4>
              <p className="text-sm text-gray-600">
                {hasRequestSent
                  ? "Remove your pending request"
                  : "Let them know you're interested"}
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Photo Gallery Modal */}
      {showGallery && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
          <div className="relative w-full max-w-4xl h-full max-h-[80vh] p-4">
            <button
              onClick={() => setShowGallery(false)}
              className="absolute top-4 right-4 bg-black/30 text-white p-2 rounded-full z-10 hover:bg-black/50"
            >
              <XIcon className="h-6 w-6" />
            </button>
            <div className="w-full h-full flex flex-col">
              {/* Main Image */}
              <div className="relative flex-1 flex items-center justify-center">
                <img
                  src={profile.profileImages[currentImageIndex]}
                  alt={`${profile.firstName} ${currentImageIndex + 1}`}
                  className="max-w-full max-h-full object-contain"
                />
                {profile.profileImages.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2"
                    >
                      <ChevronLeftIcon className="h-8 w-8" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2"
                    >
                      <ChevronRightIcon className="h-8 w-8" />
                    </button>
                  </>
                )}
                {/* Image counter */}
                <div className="absolute top-4 left-4 bg-black/50 text-white text-sm px-3 py-1 rounded-full">
                  {currentImageIndex + 1} / {profile.profileImages.length}
                </div>
              </div>
              {/* Thumbnails */}
              <div className="mt-4 flex justify-center gap-2 overflow-x-auto">
                {profile.profileImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => goToImage(idx)}
                    className={`w-16 h-16 flex-shrink-0 ${
                      idx === currentImageIndex ? "ring-2 ring-purple-500" : ""
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfilePage;
