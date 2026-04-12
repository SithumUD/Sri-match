import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { dummyProfiles, profileOptions } from "../data/dummyData";
import { useAuth } from "../context/AuthContext";
import {
  FilterIcon,
  SearchIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  HeartIcon,
  UserPlusIcon,
  CheckIcon,
  XIcon,
  MapPinIcon,
  BriefcaseIcon,
  SlashIcon,
  SlidersIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  SortAscIcon,
  BookIcon,
  GraduationCapIcon,
  UsersIcon,
  HeartHandshakeIcon,
  StarIcon,
  VerifiedIcon,
  CrownIcon,
  ZapIcon,
} from "lucide-react";

const HomePage = () => {
  const {
    likedProfiles,
    sentRequests,
    toggleLike,
    toggleFriendRequest,
    subscription,
    likesRemaining,
  } = useAuth();

  const [profiles, setProfiles] = useState(dummyProfiles);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [sortOrder, setSortOrder] = useState("newest");
  const [filters, setFilters] = useState({
    ageRange: [18, 60],
    gender: "",
    maritalStatus: "",
    hasChildren: "",
    city: "",
    district: "",
    ethnicity: "",
    religion: "",
    education: "",
    profession: "",
    industry: "",
    income: "",
    height: [140, 200],
    bodyType: "",
    smoking: "",
    drinking: "",
    dietaryPreference: "",
    verified: false,
    horoscopeSign: "",
    interests: [],
  });

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value, type } = e.target;
    const checked = type === "checkbox" ? e.target.checked : undefined;

    if (type === "checkbox") {
      setFilters((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFilters((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleRangeChange = (name, value, index) => {
    setFilters((prev) => ({
      ...prev,
      [name]: index === 0 ? [value, prev[name][1]] : [prev[name][0], value],
    }));
  };

  const handleInterestChange = (interest) => {
    setFilters((prev) => {
      const currentInterests = prev.interests || [];
      if (currentInterests.includes(interest)) {
        return {
          ...prev,
          interests: currentInterests.filter((i) => i !== interest),
        };
      } else {
        return {
          ...prev,
          interests: [...currentInterests, interest],
        };
      }
    });
  };

  const handleSortChange = (order) => {
    setSortOrder(order);
  };

  const resetFilters = () => {
    setFilters({
      ageRange: [18, 60],
      gender: "",
      maritalStatus: "",
      hasChildren: "",
      city: "",
      district: "",
      ethnicity: "",
      religion: "",
      education: "",
      profession: "",
      industry: "",
      income: "",
      height: [140, 200],
      bodyType: "",
      smoking: "",
      drinking: "",
      dietaryPreference: "",
      verified: false,
      horoscopeSign: "",
      interests: [],
    });
  };

  // Sort and boost profiles
  const sortAndBoostProfiles = (filteredProfiles) => {
    // First, separate boosted profiles if user is premium and has active boost
    const boostedProfiles = [];
    const regularProfiles = [];

    if (
      subscription.plan === "premium" &&
      subscription.features.boostExpiresAt &&
      new Date(subscription.features.boostExpiresAt) > new Date()
    ) {
      // Simulate boosted profiles - in a real app, this would be the user's own profile
      // For demo, let's boost a random profile
      const randomIndex = Math.floor(Math.random() * filteredProfiles.length);
      if (filteredProfiles[randomIndex]) {
        boostedProfiles.push({
          ...filteredProfiles[randomIndex],
          isBoosted: true,
        });
        regularProfiles.push(
          ...filteredProfiles.filter((_, i) => i !== randomIndex)
        );
      } else {
        regularProfiles.push(...filteredProfiles);
      }
    } else {
      regularProfiles.push(...filteredProfiles);
    }

    // Sort regular profiles
    regularProfiles.sort((a, b) => {
      if (sortOrder === "newest") {
        return (
          parseInt(b.id.replace("profile", "")) -
          parseInt(a.id.replace("profile", ""))
        );
      } else if (sortOrder === "age_asc") {
        return a.age - b.age;
      } else if (sortOrder === "age_desc") {
        return b.age - a.age;
      } else if (sortOrder === "height_asc") {
        return a.height - b.height;
      } else if (sortOrder === "height_desc") {
        return b.height - a.height;
      }
      return 0;
    });

    // Return boosted profiles first, then sorted regular profiles
    return [...boostedProfiles, ...regularProfiles];
  };

  const filteredProfiles = sortAndBoostProfiles(
    profiles.filter((profile) => {
      // Search term filter
      if (
        searchTerm &&
        !`${profile.firstName} ${profile.lastName}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) &&
        !profile.profession.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }

      // Basic filters
      if (filters.gender && profile.gender !== filters.gender) {
        return false;
      }

      if (
        filters.maritalStatus &&
        profile.maritalStatus !== filters.maritalStatus
      ) {
        return false;
      }

      if (filters.hasChildren !== "") {
        const hasChildrenBool = filters.hasChildren === "true";
        if (profile.hasChildren !== hasChildrenBool) {
          return false;
        }
      }

      // Location & background filters
      if (filters.city && profile.city !== filters.city) {
        return false;
      }

      if (filters.district && profile.district !== filters.district) {
        return false;
      }

      if (filters.ethnicity && profile.ethnicity !== filters.ethnicity) {
        return false;
      }

      if (filters.religion && profile.religion !== filters.religion) {
        return false;
      }

      // Education & career filters
      if (filters.education && profile.education !== filters.education) {
        return false;
      }

      if (
        filters.profession &&
        !profile.profession
          .toLowerCase()
          .includes(filters.profession.toLowerCase())
      ) {
        return false;
      }

      if (filters.industry && profile.industry !== filters.industry) {
        return false;
      }

      if (filters.income && profile.income !== filters.income) {
        return false;
      }

      // Physical & lifestyle filters
      if (
        profile.height < filters.height[0] ||
        profile.height > filters.height[1]
      ) {
        return false;
      }

      if (filters.bodyType && profile.bodyType !== filters.bodyType) {
        return false;
      }

      if (filters.smoking && profile.smoking !== filters.smoking) {
        return false;
      }

      if (filters.drinking && profile.drinking !== filters.drinking) {
        return false;
      }

      if (
        filters.dietaryPreference &&
        profile.dietaryPreferences !== filters.dietaryPreference
      ) {
        return false;
      }

      // Age range filter
      if (
        profile.age < filters.ageRange[0] ||
        profile.age > filters.ageRange[1]
      ) {
        return false;
      }

      // Horoscope filter
      if (
        filters.horoscopeSign &&
        profile.horoscope.sign !== filters.horoscopeSign
      ) {
        return false;
      }

      // Interests filter
      if (filters.interests.length > 0) {
        const hasMatchingInterest = filters.interests.some((interest) =>
          profile.interests.includes(interest)
        );
        if (!hasMatchingInterest) {
          return false;
        }
      }

      // Verified filter
      if (filters.verified && !profile.isVerified) {
        return false;
      }

      return true;
    })
  );

  // Extract unique values for filters
  const cities = Array.from(
    new Set(dummyProfiles.map((profile) => profile.city))
  );
  const professions = Array.from(
    new Set(dummyProfiles.map((profile) => profile.profession))
  );

  // Determine which filters are available based on subscription
  const isPremium = subscription.plan === "premium";

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start gap-6">
        {/* Sidebar / Filters */}
        <div className="w-full md:w-72 bg-white rounded-xl shadow-md p-6 sticky top-20 self-start">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <FilterIcon className="h-5 w-5 mr-2 text-purple-600" />
              Filters
            </h2>
            <button
              className="md:hidden text-purple-600"
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? "Hide" : "Show"}
            </button>
          </div>
          <div
            className={`${showFilters ? "block" : "hidden"} md:block space-y-6`}
          >
            {/* Premium Filter Banner */}
            {!isPremium && (
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-100 mb-4">
                <div className="flex items-center mb-2">
                  <CrownIcon className="h-5 w-5 text-yellow-500 mr-2" />
                  <h3 className="text-sm font-medium text-gray-800">
                    Premium Filters
                  </h3>
                </div>
                <p className="text-xs text-gray-600 mb-2">
                  Upgrade to Premium to access advanced filters and find your
                  perfect match faster!
                </p>
                <Link
                  to="/subscription"
                  className="text-xs bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full inline-block"
                >
                  Upgrade Now
                </Link>
              </div>
            )}
            {/* Basic Filters */}
            <div>
              <h3 className="text-md font-medium text-gray-700 mb-3">
                Basic Filters
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Looking for
                  </label>
                  <select
                    name="gender"
                    value={filters.gender}
                    onChange={handleFilterChange}
                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  >
                    <option value="">Any Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age Range: {filters.ageRange[0]} - {filters.ageRange[1]}
                  </label>
                  <div className="space-y-4">
                    <input
                      type="range"
                      min="18"
                      max="60"
                      value={filters.ageRange[0]}
                      onChange={(e) =>
                        handleRangeChange(
                          "ageRange",
                          parseInt(e.target.value),
                          0
                        )
                      }
                      className="w-full accent-purple-600"
                    />
                    <input
                      type="range"
                      min="18"
                      max="60"
                      value={filters.ageRange[1]}
                      onChange={(e) =>
                        handleRangeChange(
                          "ageRange",
                          parseInt(e.target.value),
                          1
                        )
                      }
                      className="w-full accent-purple-600"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Marital Status
                  </label>
                  <select
                    name="maritalStatus"
                    value={filters.maritalStatus}
                    onChange={handleFilterChange}
                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  >
                    <option value="">Any Status</option>
                    {profileOptions.maritalStatus.map((status) => (
                      <option key={status} value={status.toLowerCase()}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Has Children
                  </label>
                  <select
                    name="hasChildren"
                    value={filters.hasChildren}
                    onChange={handleFilterChange}
                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  >
                    <option value="">Any</option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
              </div>
            </div>
            {/* Location & Background */}
            <div>
              <h3 className="text-md font-medium text-gray-700 mb-3">
                Location & Background
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    District
                  </label>
                  <select
                    name="district"
                    value={filters.district}
                    onChange={handleFilterChange}
                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  >
                    <option value="">Any District</option>
                    {profileOptions.districts.map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <select
                    name="city"
                    value={filters.city}
                    onChange={handleFilterChange}
                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  >
                    <option value="">Any City</option>
                    {cities.map((city, index) => (
                      <option key={index} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Religion
                  </label>
                  <select
                    name="religion"
                    value={filters.religion}
                    onChange={handleFilterChange}
                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  >
                    <option value="">Any Religion</option>
                    {profileOptions.religions.map((religion) => (
                      <option key={religion} value={religion}>
                        {religion}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ethnicity
                  </label>
                  <select
                    name="ethnicity"
                    value={filters.ethnicity}
                    onChange={handleFilterChange}
                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  >
                    <option value="">Any Ethnicity</option>
                    {profileOptions.ethnicities.map((ethnicity) => (
                      <option key={ethnicity} value={ethnicity}>
                        {ethnicity}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            {/* Advanced Filters Toggle */}
            <div>
              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className={`w-full flex items-center justify-between text-purple-600 text-sm font-medium py-2 border-t border-gray-200 ${
                  !isPremium && "opacity-50"
                }`}
                disabled={!isPremium}
              >
                <span className="flex items-center">
                  <span>Advanced Filters</span>
                  {!isPremium && (
                    <CrownIcon className="h-4 w-4 text-yellow-500 ml-2" />
                  )}
                </span>
                <ChevronDownIcon
                  className={`h-5 w-5 transition-transform ${
                    showAdvancedFilters ? "transform rotate-180" : ""
                  }`}
                />
              </button>
            </div>
            {/* Advanced Filters */}
            {showAdvancedFilters && isPremium && (
              <>
                {/* Education & Career */}
                <div>
                  <h3 className="text-md font-medium text-gray-700 mb-3">
                    Education & Career
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Education Level
                      </label>
                      <select
                        name="education"
                        value={filters.education}
                        onChange={handleFilterChange}
                        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-purple-500"
                      >
                        <option value="">Any Education</option>
                        {profileOptions.educationLevels.map((level) => (
                          <option key={level} value={level}>
                            {level}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Profession
                      </label>
                      <select
                        name="profession"
                        value={filters.profession}
                        onChange={handleFilterChange}
                        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-purple-500"
                      >
                        <option value="">Any Profession</option>
                        {professions.map((profession, index) => (
                          <option key={index} value={profession}>
                            {profession}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Industry
                      </label>
                      <select
                        name="industry"
                        value={filters.industry}
                        onChange={handleFilterChange}
                        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-purple-500"
                      >
                        <option value="">Any Industry</option>
                        {profileOptions.industries.map((industry) => (
                          <option key={industry} value={industry}>
                            {industry}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Income Range
                      </label>
                      <select
                        name="income"
                        value={filters.income}
                        onChange={handleFilterChange}
                        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-purple-500"
                      >
                        <option value="">Any Income</option>
                        {profileOptions.incomeRanges.map((range) => (
                          <option key={range} value={range}>
                            {range}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                {/* Physical & Lifestyle */}
                <div>
                  <h3 className="text-md font-medium text-gray-700 mb-3">
                    Physical & Lifestyle
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Height Range (cm): {filters.height[0]} -{" "}
                        {filters.height[1]}
                      </label>
                      <div className="space-y-4">
                        <input
                          type="range"
                          min="140"
                          max="200"
                          value={filters.height[0]}
                          onChange={(e) =>
                            handleRangeChange(
                              "height",
                              parseInt(e.target.value),
                              0
                            )
                          }
                          className="w-full accent-purple-600"
                        />
                        <input
                          type="range"
                          min="140"
                          max="200"
                          value={filters.height[1]}
                          onChange={(e) =>
                            handleRangeChange(
                              "height",
                              parseInt(e.target.value),
                              1
                            )
                          }
                          className="w-full accent-purple-600"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Body Type
                      </label>
                      <select
                        name="bodyType"
                        value={filters.bodyType}
                        onChange={handleFilterChange}
                        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-purple-500"
                      >
                        <option value="">Any Body Type</option>
                        {profileOptions.bodyTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Smoking Habits
                      </label>
                      <select
                        name="smoking"
                        value={filters.smoking}
                        onChange={handleFilterChange}
                        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-purple-500"
                      >
                        <option value="">Any</option>
                        {profileOptions.smokingHabits.map((habit) => (
                          <option key={habit} value={habit}>
                            {habit}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Drinking Habits
                      </label>
                      <select
                        name="drinking"
                        value={filters.drinking}
                        onChange={handleFilterChange}
                        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-purple-500"
                      >
                        <option value="">Any</option>
                        {profileOptions.drinkingHabits.map((habit) => (
                          <option key={habit} value={habit}>
                            {habit}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dietary Preference
                      </label>
                      <select
                        name="dietaryPreference"
                        value={filters.dietaryPreference}
                        onChange={handleFilterChange}
                        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-purple-500"
                      >
                        <option value="">Any</option>
                        {profileOptions.dietaryPreferences.map((pref) => (
                          <option key={pref} value={pref}>
                            {pref}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                {/* Horoscope & Interests */}
                <div>
                  <h3 className="text-md font-medium text-gray-700 mb-3">
                    Horoscope & Interests
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Horoscope Sign
                      </label>
                      <select
                        name="horoscopeSign"
                        value={filters.horoscopeSign}
                        onChange={handleFilterChange}
                        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-purple-500"
                      >
                        <option value="">Any Sign</option>
                        {profileOptions.horoscopeSigns.map((sign) => (
                          <option key={sign} value={sign}>
                            {sign}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Interests
                      </label>
                      <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto border border-gray-200 rounded-md p-2">
                        {profileOptions.interests
                          .slice(0, 15)
                          .map((interest) => (
                            <div
                              key={interest}
                              onClick={() => handleInterestChange(interest)}
                              className={`
                              px-2 py-1 rounded-full text-xs cursor-pointer transition-colors
                              ${
                                filters.interests.includes(interest)
                                  ? "bg-purple-100 text-purple-800 border border-purple-300"
                                  : "bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200"
                              }
                            `}
                            >
                              {interest}
                            </div>
                          ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Click to select interests
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="verified"
                name="verified"
                checked={filters.verified}
                onChange={handleFilterChange}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label htmlFor="verified" className="ml-2 text-sm text-gray-700">
                Verified Profiles Only
              </label>
            </div>
            <button
              onClick={resetFilters}
              className="w-full py-2 px-4 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition duration-200"
            >
              Reset All Filters
            </button>
            {/* Like Counter for Free Users */}
            {subscription.plan !== "premium" && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <HeartIcon className="h-5 w-5 text-pink-500 mr-2" />
                    <span className="text-sm font-medium text-gray-700">
                      Daily Likes
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {likesRemaining} / 5
                  </span>
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-pink-500 h-1.5 rounded-full"
                    style={{
                      width: `${(likesRemaining / 5) * 100}%`,
                    }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Upgrade to Premium for unlimited likes!
                </p>
              </div>
            )}
          </div>
        </div>
        {/* Main Content */}
        <div className="flex-1">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by name or profession..."
                value={searchTerm}
                onChange={handleSearch}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          </div>
          {/* Results Count and Sort */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <p className="text-gray-600 mb-3 sm:mb-0">
              {filteredProfiles.length}{" "}
              {filteredProfiles.length === 1 ? "profile" : "profiles"} found
            </p>
            <div className="flex items-center">
              <span className="text-sm text-gray-700 mr-2">Sort by:</span>
              <div className="relative inline-block text-left">
                <div className="flex flex-wrap gap-1">
                  <button
                    onClick={() => handleSortChange("newest")}
                    className={`px-3 py-1 text-sm rounded-md ${
                      sortOrder === "newest"
                        ? "bg-purple-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Newest
                  </button>
                  <button
                    onClick={() => handleSortChange("age_asc")}
                    className={`px-3 py-1 text-sm rounded-md flex items-center ${
                      sortOrder === "age_asc"
                        ? "bg-purple-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Age <ArrowUpIcon className="h-3 w-3 ml-1" />
                  </button>
                  <button
                    onClick={() => handleSortChange("age_desc")}
                    className={`px-3 py-1 text-sm rounded-md flex items-center ${
                      sortOrder === "age_desc"
                        ? "bg-purple-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Age <ArrowDownIcon className="h-3 w-3 ml-1" />
                  </button>
                  <button
                    onClick={() => handleSortChange("height_asc")}
                    className={`px-3 py-1 text-sm rounded-md flex items-center ${
                      sortOrder === "height_asc"
                        ? "bg-purple-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Height <ArrowUpIcon className="h-3 w-3 ml-1" />
                  </button>
                  <button
                    onClick={() => handleSortChange("height_desc")}
                    className={`px-3 py-1 text-sm rounded-md flex items-center ${
                      sortOrder === "height_desc"
                        ? "bg-purple-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Height <ArrowDownIcon className="h-3 w-3 ml-1" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Profiles Grid */}
          {filteredProfiles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {filteredProfiles.map((profile) => (
                <div
                  key={profile.id}
                  className={`bg-white rounded-xl shadow-md overflow-hidden transform transition duration-300 hover:shadow-lg hover:translate-y-[-4px] ${
                    profile.isBoosted ? "ring-2 ring-orange-500" : ""
                  }`}
                >
                  <div className="flex flex-col sm:flex-row h-full">
                    {/* Profile Image */}
                    <div className="sm:w-1/3 relative">
                      <Link
                        to={`/profile/${profile.id}`}
                        className="block h-full"
                      >
                        <div className="h-60 sm:h-full relative">
                          <img
                            src={profile.profileImage}
                            alt={`${profile.firstName} ${profile.lastName}`}
                            className="w-full h-full object-cover"
                          />
                          {profile.isVerified && (
                            <div className="absolute top-3 left-3 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
                              <CheckIcon className="h-3 w-3 mr-1" />
                              Verified
                            </div>
                          )}
                          {/* Boosted badge */}
                          {profile.isBoosted && (
                            <div className="absolute top-3 right-3 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
                              <ZapIcon className="h-3 w-3 mr-1" />
                              Boosted
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent sm:hidden"></div>
                        </div>
                      </Link>
                    </div>
                    {/* Profile Info */}
                    <div className="sm:w-2/3 p-5 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <Link
                              to={`/profile/${profile.id}`}
                              className="block"
                            >
                              <h3 className="text-xl font-semibold text-gray-800 hover:text-purple-600 transition-colors">
                                {profile.firstName}, {profile.age}
                              </h3>
                            </Link>
                            <div className="flex items-center text-gray-600 text-sm">
                              <MapPinIcon className="h-3.5 w-3.5 mr-1 text-gray-500" />
                              {profile.city}, {profile.district}
                            </div>
                          </div>
                          <div className="flex space-x-1">
                            <button
                              onClick={() => toggleLike(profile.id)}
                              className={`p-1.5 rounded-full ${
                                likedProfiles.includes(profile.id)
                                  ? "bg-pink-100 text-pink-600"
                                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                              }`}
                              aria-label={
                                likedProfiles.includes(profile.id)
                                  ? "Unlike"
                                  : "Like"
                              }
                              title={
                                subscription.plan !== "premium" &&
                                likesRemaining <= 0 &&
                                !likedProfiles.includes(profile.id)
                                  ? "No likes remaining. Upgrade to Premium!"
                                  : likedProfiles.includes(profile.id)
                                  ? "Unlike"
                                  : "Like"
                              }
                            >
                              <HeartIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => toggleFriendRequest(profile.id)}
                              className={`p-1.5 rounded-full ${
                                sentRequests.includes(profile.id)
                                  ? "bg-purple-100 text-purple-600"
                                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                              }`}
                              aria-label={
                                sentRequests.includes(profile.id)
                                  ? "Cancel Request"
                                  : "Send Request"
                              }
                            >
                              <UserPlusIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-3">
                          <span className="bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded-full flex items-center">
                            <BriefcaseIcon className="h-3 w-3 mr-1" />
                            {profile.profession}
                          </span>
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full flex items-center">
                            <GraduationCapIcon className="h-3 w-3 mr-1" />
                            {profile.education}
                          </span>
                          <span className="bg-pink-100 text-pink-800 text-xs px-2 py-0.5 rounded-full flex items-center">
                            <BookIcon className="h-3 w-3 mr-1" />
                            {profile.religion}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                          {profile.about}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {profile.interests
                            .slice(0, 3)
                            .map((interest, idx) => (
                              <span
                                key={idx}
                                className="bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded-full"
                              >
                                {interest}
                              </span>
                            ))}
                          {profile.interests.length > 3 && (
                            <span className="bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded-full">
                              +{profile.interests.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="mt-4">
                        <Link
                          to={`/profile/${profile.id}`}
                          className="text-purple-600 hover:text-purple-800 text-sm font-medium flex items-center"
                        >
                          View Full Profile
                          <ChevronRightIcon className="h-4 w-4 ml-1" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <div className="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <SearchIcon className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                No profiles found
              </h3>
              <p className="mt-1 text-gray-500">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
