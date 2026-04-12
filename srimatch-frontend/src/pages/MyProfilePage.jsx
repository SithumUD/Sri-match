import React, { useState, Children } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  User,
  MapPin,
  GraduationCap,
  Briefcase,
  Heart,
  Settings,
  Edit3,
  Save,
  X,
  Camera,
  FileText,
  BookOpen,
  Languages,
  Users,
  Star,
  Coffee,
  Activity,
  ChevronDown,
  ChevronUp,
  Check,
  Image as ImageIcon,
  Plus,
} from "lucide-react";
import { profileOptions } from "../data/dummyData";

const MyProfilePage = () => {
  const { user, updateUserProfile } = useAuth();

  const [activeTab, setActiveTab] = useState("about");
  const [editMode, setEditMode] = useState(null);
  const [formData, setFormData] = useState({
    ...user,
  });

  const [expandedSections, setExpandedSections] = useState(["basic"]);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  if (!user) return <div>Loading...</div>;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNestedChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleArrayChange = (field, value) => {
    const currentArray = formData[field] || [];
    if (currentArray.includes(value)) {
      setFormData((prev) => ({
        ...prev,
        [field]: currentArray.filter((item) => item !== value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: [...currentArray, value],
      }));
    }
  };

  const handleRangeChange = (field, value, index) => {
    const currentRange = formData[field] || [0, 100];
    setFormData((prev) => ({
      ...prev,
      [field]:
        index === 0 ? [value, currentRange[1]] : [currentRange[0], value],
    }));
  };

  const handleSave = (section) => {
    updateUserProfile({
      ...formData,
    });
    setEditMode(null);
  };

  const handleCancel = (section) => {
    setFormData((prev) => ({
      ...prev,
      ...user,
    }));
    setEditMode(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = () => {
    if (previewImage) {
      // In a real app, you would upload the image to a server
      // For now, we'll just update the profile image in state
      updateUserProfile({
        ...user,
        profileImage: previewImage,
        profileImages: [...(user.profileImages || []), previewImage],
      });
      setShowImageUpload(false);
      setSelectedImage(null);
      setPreviewImage(null);
    }
  };

  const toggleSection = (section) => {
    if (expandedSections.includes(section)) {
      setExpandedSections(expandedSections.filter((s) => s !== section));
    } else {
      setExpandedSections([...expandedSections, section]);
    }
  };

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return "";
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const renderEditButton = (section) => {
    if (editMode === section) {
      return (
        <div className="flex space-x-2">
          <button
            onClick={() => handleSave(section)}
            className="text-green-600 hover:text-green-700 flex items-center"
          >
            <Save className="h-4 w-4 mr-1" />
            Save
          </button>
          <button
            onClick={() => handleCancel(section)}
            className="text-red-600 hover:text-red-700 flex items-center"
          >
            <X className="h-4 w-4 mr-1" />
            Cancel
          </button>
        </div>
      );
    }
    return (
      <button
        onClick={() => setEditMode(section)}
        className="text-purple-600 hover:text-purple-700 flex items-center"
      >
        <Edit3 className="h-4 w-4 mr-1" />
        Edit
      </button>
    );
  };

  const renderSectionHeader = (title, section, icon) => (
    <div
      className="flex justify-between items-center py-4 px-6 cursor-pointer border-b border-gray-200"
      onClick={() => toggleSection(section)}
    >
      <div className="flex items-center">
        {icon}
        <h3 className="text-lg font-semibold text-gray-800 ml-2">{title}</h3>
      </div>
      <div className="flex items-center">
        {expandedSections.includes(section) ? (
          <ChevronUp className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
        <div className="h-64 bg-gradient-to-r from-purple-600 to-pink-600 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            {user.profileImage ? (
              <img
                src={user.profileImage}
                alt="Profile Cover"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-white/50 flex flex-col items-center">
                <ImageIcon className="h-12 w-12 mb-2" />
                <span>No cover photo</span>
              </div>
            )}
            <div className="absolute inset-0 bg-black/30"></div>
          </div>
          <button
            onClick={() => setShowImageUpload(true)}
            className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30"
          >
            <Camera className="h-5 w-5" />
          </button>
        </div>

        <div className="relative px-8 pb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-16 sm:-mt-20 mb-6 relative z-10">
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-4 border-white shadow-md overflow-hidden bg-white">
                {user.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                    <User className="h-12 w-12" />
                  </div>
                )}
              </div>
              <button
                onClick={() => setShowImageUpload(true)}
                className="absolute bottom-0 right-0 bg-purple-600 text-white p-1.5 rounded-full hover:bg-purple-700"
              >
                <Camera className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left">
              <h1 className="text-2xl font-bold text-gray-900">
                {user.firstName} {user.lastName}
              </h1>
              <div className="flex flex-wrap items-center justify-center sm:justify-start mt-1 text-gray-600 text-sm">
                <div className="flex items-center mr-4">
                  <MapPin className="h-4 w-4 mr-1" />
                  {user.city}, {user.district}
                </div>
                <div className="flex items-center">
                  <Briefcase className="h-4 w-4 mr-1" />
                  {user.profession}
                </div>
              </div>
            </div>

            <div className="mt-4 sm:mt-0 sm:ml-auto flex space-x-2">
              <Link
                to="/settings"
                className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200"
              >
                <Settings className="h-4 w-4 mr-1" />
                Settings
              </Link>
              <button
                onClick={() => setEditMode("basic")}
                className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700"
              >
                <Edit3 className="h-4 w-4 mr-1" />
                Edit Profile
              </button>
            </div>
          </div>

          <div className="flex border-b border-gray-200 overflow-x-auto">
            <button
              onClick={() => setActiveTab("about")}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
                activeTab === "about"
                  ? "border-b-2 border-purple-600 text-purple-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              About
            </button>
            <button
              onClick={() => setActiveTab("photos")}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
                activeTab === "photos"
                  ? "border-b-2 border-purple-600 text-purple-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Photos
            </button>
            <button
              onClick={() => setActiveTab("preferences")}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
                activeTab === "preferences"
                  ? "border-b-2 border-purple-600 text-purple-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Partner Preferences
            </button>
            <button
              onClick={() => setActiveTab("privacy")}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
                activeTab === "privacy"
                  ? "border-b-2 border-purple-600 text-purple-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Privacy
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {activeTab === "about" && (
          <div>
            {/* Basic Information */}
            <div>
              {renderSectionHeader(
                "Basic Information",
                "basic",
                <User className="h-5 w-5 text-purple-600" />
              )}
              {expandedSections.includes("basic") && (
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-md font-medium text-gray-700">
                      Personal Details
                    </h4>
                    {renderEditButton("basic")}
                  </div>

                  {editMode === "basic" ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            First Name
                          </label>
                          <input
                            type="text"
                            name="firstName"
                            value={formData.firstName || ""}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Last Name
                          </label>
                          <input
                            type="text"
                            name="lastName"
                            value={formData.lastName || ""}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Date of Birth
                          </label>
                          <input
                            type="date"
                            name="dateOfBirth"
                            value={formData.dateOfBirth || ""}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Gender
                          </label>
                          <select
                            name="gender"
                            value={formData.gender || ""}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Marital Status
                          </label>
                          <select
                            name="maritalStatus"
                            value={formData.maritalStatus || ""}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          >
                            <option value="">Select Marital Status</option>
                            {profileOptions.maritalStatus.map((status) => (
                              <option key={status} value={status.toLowerCase()}>
                                {status}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Children
                          </label>
                          <select
                            name="hasChildren"
                            value={
                              formData.hasChildren !== undefined
                                ? String(formData.hasChildren)
                                : ""
                            }
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                hasChildren: e.target.value === "true",
                              }))
                            }
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          >
                            <option value="">Select</option>
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm font-medium text-gray-500">
                            Full Name
                          </span>
                          <p className="text-gray-800">
                            {user.firstName} {user.lastName}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">
                            Date of Birth
                          </span>
                          <p className="text-gray-800">
                            {user.dateOfBirth
                              ? new Date(user.dateOfBirth).toLocaleDateString()
                              : "Not specified"}
                            {user.dateOfBirth &&
                              ` (${calculateAge(user.dateOfBirth)} years)`}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">
                            Email
                          </span>
                          <p className="text-gray-800">{user.email}</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <span className="text-sm font-medium text-gray-500">
                            Gender
                          </span>
                          <p className="text-gray-800 capitalize">
                            {user.gender || "Not specified"}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">
                            Marital Status
                          </span>
                          <p className="text-gray-800 capitalize">
                            {user.maritalStatus || "Not specified"}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">
                            Children
                          </span>
                          <p className="text-gray-800">
                            {user.hasChildren !== undefined
                              ? user.hasChildren
                                ? "Yes"
                                : "No"
                              : "Not specified"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Location */}
            <div>
              {renderSectionHeader(
                "Location & Background",
                "location",
                <MapPin className="h-5 w-5 text-purple-600" />
              )}
              {expandedSections.includes("location") && (
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-md font-medium text-gray-700">
                      Where You Live
                    </h4>
                    {renderEditButton("location")}
                  </div>

                  {editMode === "location" ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            District
                          </label>
                          <select
                            name="district"
                            value={formData.district || ""}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          >
                            <option value="">Select District</option>
                            {profileOptions.districts.map((district) => (
                              <option key={district} value={district}>
                                {district}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            City
                          </label>
                          <input
                            type="text"
                            name="city"
                            value={formData.city || ""}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Place of Birth
                        </label>
                        <input
                          type="text"
                          name="placeOfBirth"
                          value={formData.placeOfBirth || ""}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="e.g. Colombo, Kandy"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Ethnicity
                          </label>
                          <select
                            name="ethnicity"
                            value={formData.ethnicity || ""}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          >
                            <option value="">Select Ethnicity</option>
                            {profileOptions.ethnicities.map((ethnicity) => (
                              <option key={ethnicity} value={ethnicity}>
                                {ethnicity}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Religion
                          </label>
                          <select
                            name="religion"
                            value={formData.religion || ""}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          >
                            <option value="">Select Religion</option>
                            {profileOptions.religions.map((religion) => (
                              <option key={religion} value={religion}>
                                {religion}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Religious Practices
                        </label>
                        <textarea
                          name="religiousPractices"
                          value={formData.religiousPractices || ""}
                          onChange={handleChange}
                          rows={2}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="e.g. Regular temple visits, daily prayers"
                        ></textarea>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Languages
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {profileOptions.languages.map((language) => (
                            <div
                              key={language}
                              onClick={() =>
                                handleArrayChange("languages", language)
                              }
                              className={`
                                px-3 py-1.5 rounded-full text-sm cursor-pointer transition-colors
                                ${
                                  (formData.languages || []).includes(language)
                                    ? "bg-purple-100 text-purple-800 border border-purple-300"
                                    : "bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200"
                                }
                              `}
                            >
                              {language}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm font-medium text-gray-500">
                            Current Location
                          </span>
                          <p className="text-gray-800">
                            {user.city || "Not specified"},{" "}
                            {user.district || "Not specified"}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">
                            Place of Birth
                          </span>
                          <p className="text-gray-800">
                            {user.placeOfBirth || "Not specified"}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">
                            Ethnicity
                          </span>
                          <p className="text-gray-800">
                            {user.ethnicity || "Not specified"}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <span className="text-sm font-medium text-gray-500">
                            Religion
                          </span>
                          <p className="text-gray-800">
                            {user.religion || "Not specified"}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">
                            Religious Practices
                          </span>
                          <p className="text-gray-800">
                            {user.religiousPractices || "Not specified"}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">
                            Languages
                          </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {user.languages && user.languages.length > 0 ? (
                              user.languages.map((language, idx) => (
                                <span
                                  key={idx}
                                  className="bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded-full"
                                >
                                  {language}
                                </span>
                              ))
                            ) : (
                              <span className="text-gray-500">
                                Not specified
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Education & Career */}
            <div>
              {renderSectionHeader(
                "Education & Career",
                "career",
                <GraduationCap className="h-5 w-5 text-purple-600" />
              )}
              {expandedSections.includes("career") && (
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-md font-medium text-gray-700">
                      Professional Background
                    </h4>
                    {renderEditButton("career")}
                  </div>

                  {editMode === "career" ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Education Level
                          </label>
                          <select
                            name="education"
                            value={formData.education || ""}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          >
                            <option value="">Select Education Level</option>
                            {profileOptions.educationLevels.map((level) => (
                              <option key={level} value={level}>
                                {level}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Field of Study
                          </label>
                          <input
                            type="text"
                            name="fieldOfStudy"
                            value={formData.fieldOfStudy || ""}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="e.g. Computer Science, Medicine"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Profession
                          </label>
                          <input
                            type="text"
                            name="profession"
                            value={formData.profession || ""}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="e.g. Software Engineer, Doctor"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Industry
                          </label>
                          <select
                            name="industry"
                            value={formData.industry || ""}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          >
                            <option value="">Select Industry</option>
                            {profileOptions.industries.map((industry) => (
                              <option key={industry} value={industry}>
                                {industry}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Employer
                          </label>
                          <input
                            type="text"
                            name="employer"
                            value={formData.employer || ""}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="e.g. ABC Company"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Work Location
                          </label>
                          <input
                            type="text"
                            name="workLocation"
                            value={formData.workLocation || ""}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="e.g. Colombo, Remote"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Income Range (Monthly in LKR)
                        </label>
                        <select
                          name="income"
                          value={formData.income || ""}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="">Select Income Range</option>
                          {profileOptions.incomeRanges.map((range) => (
                            <option key={range} value={range}>
                              {range}
                            </option>
                          ))}
                        </select>
                        <p className="mt-1 text-xs text-gray-500">
                          This information will be kept private and only used
                          for matching purposes.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm font-medium text-gray-500">
                            Education
                          </span>
                          <p className="text-gray-800">
                            {user.education || "Not specified"}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">
                            Field of Study
                          </span>
                          <p className="text-gray-800">
                            {user.fieldOfStudy || "Not specified"}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">
                            Profession
                          </span>
                          <p className="text-gray-800">
                            {user.profession || "Not specified"}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">
                            Industry
                          </span>
                          <p className="text-gray-800">
                            {user.industry || "Not specified"}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <span className="text-sm font-medium text-gray-500">
                            Employer
                          </span>
                          <p className="text-gray-800">
                            {user.employer || "Not specified"}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">
                            Work Location
                          </span>
                          <p className="text-gray-800">
                            {user.workLocation || "Not specified"}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">
                            Income Range
                          </span>
                          <p className="text-gray-800">
                            {user.income || "Not specified"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Physical Appearance & Lifestyle */}
            <div>
              {renderSectionHeader(
                "Physical Appearance & Lifestyle",
                "lifestyle",
                <Activity className="h-5 w-5 text-purple-600" />
              )}
              {expandedSections.includes("lifestyle") && (
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-md font-medium text-gray-700">
                      Physical Attributes & Habits
                    </h4>
                    {renderEditButton("lifestyle")}
                  </div>

                  {editMode === "lifestyle" ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Height (cm)
                          </label>
                          <input
                            type="number"
                            name="height"
                            min="140"
                            max="220"
                            value={formData.height || ""}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="e.g. 170"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Body Type
                          </label>
                          <select
                            name="bodyType"
                            value={formData.bodyType || ""}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          >
                            <option value="">Select Body Type</option>
                            {profileOptions.bodyTypes.map((type) => (
                              <option key={type} value={type}>
                                {type}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Complexion
                          </label>
                          <select
                            name="complexion"
                            value={formData.complexion || ""}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          >
                            <option value="">Select Complexion</option>
                            {profileOptions.complexions.map((complexion) => (
                              <option key={complexion} value={complexion}>
                                {complexion}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Health & Fitness Habits
                        </label>
                        <textarea
                          name="healthHabits"
                          rows={2}
                          value={formData.healthHabits || ""}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="e.g. Regular gym, yoga, balanced diet"
                        ></textarea>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Smoking Habits
                          </label>
                          <select
                            name="smoking"
                            value={formData.smoking || ""}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          >
                            <option value="">Select</option>
                            {profileOptions.smokingHabits.map((habit) => (
                              <option key={habit} value={habit}>
                                {habit}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Drinking Habits
                          </label>
                          <select
                            name="drinking"
                            value={formData.drinking || ""}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          >
                            <option value="">Select</option>
                            {profileOptions.drinkingHabits.map((habit) => (
                              <option key={habit} value={habit}>
                                {habit}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Dietary Preferences
                          </label>
                          <select
                            name="dietaryPreferences"
                            value={formData.dietaryPreferences || ""}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          >
                            <option value="">Select</option>
                            {profileOptions.dietaryPreferences.map((pref) => (
                              <option key={pref} value={pref}>
                                {pref}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Lifestyle Description
                        </label>
                        <textarea
                          name="lifestyle"
                          rows={2}
                          value={formData.lifestyle || ""}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="e.g. Early riser, organized, enjoys outdoors"
                        ></textarea>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm font-medium text-gray-500">
                            Height
                          </span>
                          <p className="text-gray-800">
                            {user.height
                              ? `${user.height} cm`
                              : "Not specified"}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">
                            Body Type
                          </span>
                          <p className="text-gray-800">
                            {user.bodyType || "Not specified"}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">
                            Complexion
                          </span>
                          <p className="text-gray-800">
                            {user.complexion || "Not specified"}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">
                            Health & Fitness
                          </span>
                          <p className="text-gray-800">
                            {user.healthHabits || "Not specified"}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <span className="text-sm font-medium text-gray-500">
                            Smoking
                          </span>
                          <p className="text-gray-800">
                            {user.smoking || "Not specified"}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">
                            Drinking
                          </span>
                          <p className="text-gray-800">
                            {user.drinking || "Not specified"}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">
                            Dietary Preferences
                          </span>
                          <p className="text-gray-800">
                            {user.dietaryPreferences || "Not specified"}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">
                            Lifestyle
                          </span>
                          <p className="text-gray-800">
                            {user.lifestyle || "Not specified"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Cultural & Family */}
            <div>
              {renderSectionHeader(
                "Cultural & Family Aspects",
                "cultural",
                <Users className="h-5 w-5 text-purple-600" />
              )}
              {expandedSections.includes("cultural") && (
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-md font-medium text-gray-700">
                      Family & Cultural Background
                    </h4>
                    {renderEditButton("cultural")}
                  </div>

                  {editMode === "cultural" ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Family Background
                        </label>
                        <textarea
                          name="familyBackground"
                          rows={2}
                          value={formData.familyBackground || ""}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="e.g. Parents (father - businessman, mother - teacher), two siblings"
                        ></textarea>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Cultural Values
                        </label>
                        <textarea
                          name="culturalValues"
                          rows={2}
                          value={formData.culturalValues || ""}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="e.g. Traditional values, respects elders"
                        ></textarea>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Family Involvement
                        </label>
                        <textarea
                          name="familyInvolvement"
                          rows={2}
                          value={formData.familyInvolvement || ""}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="e.g. Close with family, weekly gatherings"
                        ></textarea>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Wedding Preferences
                        </label>
                        <textarea
                          name="weddingPreferences"
                          rows={2}
                          value={formData.weddingPreferences || ""}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="e.g. Traditional Buddhist ceremony, simple civil ceremony"
                        ></textarea>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Horoscope Sign
                          </label>
                          <select
                            name="horoscopeSign"
                            value={formData.horoscopeSign || ""}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          >
                            <option value="">Select Horoscope Sign</option>
                            {profileOptions.horoscopeSigns.map((sign) => (
                              <option key={sign} value={sign}>
                                {sign}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Additional Horoscope Details
                          </label>
                          <textarea
                            name="horoscopeDetails"
                            rows={2}
                            value={formData.horoscopeDetails || ""}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="e.g. Moon in 7th house, Venus in 2nd house"
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm font-medium text-gray-500">
                            Family Background
                          </span>
                          <p className="text-gray-800">
                            {user.familyBackground || "Not specified"}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">
                            Cultural Values
                          </span>
                          <p className="text-gray-800">
                            {user.culturalValues || "Not specified"}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">
                            Family Involvement
                          </span>
                          <p className="text-gray-800">
                            {user.familyInvolvement || "Not specified"}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <span className="text-sm font-medium text-gray-500">
                            Wedding Preferences
                          </span>
                          <p className="text-gray-800">
                            {user.weddingPreferences || "Not specified"}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">
                            Horoscope
                          </span>
                          <p className="text-gray-800">
                            {user.horoscope ? (
                              <>
                                {user.horoscope.sign} - {user.horoscope.details}
                              </>
                            ) : (
                              "Not specified"
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* About & Interests */}
            <div>
              {renderSectionHeader(
                "About Me & Interests",
                "about-interests",
                <FileText className="h-5 w-5 text-purple-600" />
              )}
              {expandedSections.includes("about-interests") && (
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-md font-medium text-gray-700">
                      About Me & Personal Interests
                    </h4>
                    {renderEditButton("about-interests")}
                  </div>

                  {editMode === "about-interests" ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          About Me
                        </label>
                        <textarea
                          name="about"
                          rows={4}
                          value={formData.about || ""}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Tell potential matches about yourself, your interests, and what you're looking for..."
                        ></textarea>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Interests & Hobbies
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto p-2 border border-gray-200 rounded-md">
                          {profileOptions.interests.map((interest) => (
                            <div
                              key={interest}
                              onClick={() =>
                                handleArrayChange("interests", interest)
                              }
                              className={`
                                px-3 py-2 rounded-full text-sm cursor-pointer transition-colors
                                ${
                                  (formData.interests || []).includes(interest)
                                    ? "bg-purple-100 text-purple-800 border border-purple-300"
                                    : "bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200"
                                }
                              `}
                            >
                              {interest}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Favorite Food
                          </label>
                          <input
                            type="text"
                            value={(formData.favoriteThings || {}).food || ""}
                            onChange={(e) => {
                              const favoriteThings =
                                formData.favoriteThings || {};
                              handleNestedChange(
                                "favoriteThings",
                                "food",
                                e.target.value
                              );
                            }}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="e.g. Rice and curry, Italian cuisine"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Favorite Movies/TV Shows
                          </label>
                          <input
                            type="text"
                            value={(formData.favoriteThings || {}).movies || ""}
                            onChange={(e) => {
                              const favoriteThings =
                                formData.favoriteThings || {};
                              handleNestedChange(
                                "favoriteThings",
                                "movies",
                                e.target.value
                              );
                            }}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="e.g. Drama, documentaries"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Travel Preferences
                        </label>
                        <textarea
                          name="travelPreferences"
                          rows={2}
                          value={formData.travelPreferences || ""}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="e.g. Enjoys both local and international travel"
                        ></textarea>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Personality Traits
                        </label>
                        <input
                          type="text"
                          name="personalityTraits"
                          value={formData.personalityTraits || ""}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="e.g. Patient, kind, organized"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div>
                        <h5 className="text-md font-medium text-gray-700 mb-2">
                          About Me
                        </h5>
                        <p className="text-gray-800">
                          {user.about || "No information provided"}
                        </p>
                      </div>

                      <div>
                        <h5 className="text-md font-medium text-gray-700 mb-2">
                          Interests & Hobbies
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {user.interests && user.interests.length > 0 ? (
                            user.interests.map((interest, idx) => (
                              <span
                                key={idx}
                                className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm"
                              >
                                {interest}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-500">
                              No interests specified
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <div>
                            <span className="text-sm font-medium text-gray-500">
                              Favorite Food
                            </span>
                            <p className="text-gray-800">
                              {(user.favoriteThings || {}).food ||
                                "Not specified"}
                            </p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-500">
                              Favorite Movies/TV Shows
                            </span>
                            <p className="text-gray-800">
                              {(user.favoriteThings || {}).movies ||
                                "Not specified"}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <span className="text-sm font-medium text-gray-500">
                              Travel Preferences
                            </span>
                            <p className="text-gray-800">
                              {user.travelPreferences || "Not specified"}
                            </p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-500">
                              Personality Traits
                            </span>
                            <p className="text-gray-800">
                              {user.personalityTraits || "Not specified"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "photos" && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800">My Photos</h3>
              <button
                onClick={() => setShowImageUpload(true)}
                className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add New Photo
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {(user.profileImages || []).map((image, index) => (
                <div
                  key={index}
                  className="relative group rounded-lg overflow-hidden aspect-square"
                >
                  <img
                    src={image}
                    alt={`Profile ${index + 1}`}
                    className={`w-full h-full object-cover ${
                      user.profileImage === image
                        ? "ring-2 ring-purple-600"
                        : ""
                    }`}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="flex space-x-2">
                      <button
                        onClick={() =>
                          updateUserProfile({
                            ...user,
                            profileImage: image,
                          })
                        }
                        className="p-2 bg-purple-600 text-white rounded-full"
                        title="Set as primary photo"
                      >
                        <Star className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => {
                          const updatedImages = [...(user.profileImages || [])];
                          updatedImages.splice(index, 1);
                          // If we're removing the primary image, set a new one if available
                          if (
                            image === user.profileImage &&
                            updatedImages.length > 0
                          ) {
                            updateUserProfile({
                              ...user,
                              profileImages: updatedImages,
                              profileImage: updatedImages[0],
                            });
                          } else {
                            updateUserProfile({
                              ...user,
                              profileImages: updatedImages,
                            });
                          }
                        }}
                        className="p-2 bg-red-600 text-white rounded-full"
                        title="Remove photo"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  {user.profileImage === image && (
                    <div className="absolute top-2 right-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                      Primary
                    </div>
                  )}
                </div>
              ))}

              {(user.profileImages || []).length === 0 && (
                <div className="col-span-full text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                  <div className="flex flex-col items-center">
                    <ImageIcon className="h-12 w-12 text-gray-400 mb-2" />
                    <p className="text-gray-500">No photos uploaded yet</p>
                    <button
                      onClick={() => setShowImageUpload(true)}
                      className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                    >
                      Add Photos
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 text-sm text-gray-500">
              <p>
                * You can upload up to 6 photos. The primary photo will be
                displayed in search results.
              </p>
              <p>
                * For best results, upload clear, recent photos with good
                lighting.
              </p>
            </div>
          </div>
        )}

        {activeTab === "preferences" && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800">
                Partner Preferences
              </h3>
              {renderEditButton("preferences")}
            </div>

            {editMode === "preferences" ? (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Partner Age Range (years)
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Minimum:{" "}
                        {(formData.partnerPreferences?.ageRange || [])[0] || 18}
                      </label>
                      <input
                        type="range"
                        min="18"
                        max="60"
                        value={
                          (formData.partnerPreferences?.ageRange || [])[0] || 18
                        }
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          const currentPrefs =
                            formData.partnerPreferences || {};
                          const currentRange = currentPrefs.ageRange || [
                            18, 60,
                          ];
                          handleNestedChange("partnerPreferences", "ageRange", [
                            value,
                            Math.max(value, currentRange[1]),
                          ]);
                        }}
                        className="w-full accent-purple-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Maximum:{" "}
                        {(formData.partnerPreferences?.ageRange || [])[1] || 60}
                      </label>
                      <input
                        type="range"
                        min="18"
                        max="60"
                        value={
                          (formData.partnerPreferences?.ageRange || [])[1] || 60
                        }
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          const currentPrefs =
                            formData.partnerPreferences || {};
                          const currentRange = currentPrefs.ageRange || [
                            18, 60,
                          ];
                          handleNestedChange("partnerPreferences", "ageRange", [
                            Math.min(value, currentRange[0]),
                            value,
                          ]);
                        }}
                        className="w-full accent-purple-600"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location Preference
                  </label>
                  <input
                    type="text"
                    value={
                      (formData.partnerPreferences || {}).locationPreference ||
                      ""
                    }
                    onChange={(e) =>
                      handleNestedChange(
                        "partnerPreferences",
                        "locationPreference",
                        e.target.value
                      )
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g. Colombo or willing to relocate"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Education Level Preference
                    </label>
                    <input
                      type="text"
                      value={
                        (formData.partnerPreferences || {}).educationLevel || ""
                      }
                      onChange={(e) =>
                        handleNestedChange(
                          "partnerPreferences",
                          "educationLevel",
                          e.target.value
                        )
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="e.g. Bachelor's degree or higher"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Religion Preference
                    </label>
                    <input
                      type="text"
                      value={
                        (formData.partnerPreferences || {})
                          .religionPreference || ""
                      }
                      onChange={(e) =>
                        handleNestedChange(
                          "partnerPreferences",
                          "religionPreference",
                          e.target.value
                        )
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="e.g. Buddhist, Open to all religions"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Marital Status Preference
                  </label>
                  <input
                    type="text"
                    value={
                      (formData.partnerPreferences || {})
                        .maritalStatusPreference || ""
                    }
                    onChange={(e) =>
                      handleNestedChange(
                        "partnerPreferences",
                        "maritalStatusPreference",
                        e.target.value
                      )
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g. Never married, Open to all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Height Preference Range (cm)
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Minimum:{" "}
                        {(formData.partnerPreferences?.heightPreference ||
                          [])[0] || 150}
                      </label>
                      <input
                        type="range"
                        min="140"
                        max="200"
                        value={
                          (formData.partnerPreferences?.heightPreference ||
                            [])[0] || 150
                        }
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          const currentPrefs =
                            formData.partnerPreferences || {};
                          const currentRange =
                            currentPrefs.heightPreference || [150, 180];
                          handleNestedChange(
                            "partnerPreferences",
                            "heightPreference",
                            [value, Math.max(value, currentRange[1])]
                          );
                        }}
                        className="w-full accent-purple-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Maximum:{" "}
                        {(formData.partnerPreferences?.heightPreference ||
                          [])[1] || 180}
                      </label>
                      <input
                        type="range"
                        min="140"
                        max="200"
                        value={
                          (formData.partnerPreferences?.heightPreference ||
                            [])[1] || 180
                        }
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          const currentPrefs =
                            formData.partnerPreferences || {};
                          const currentRange =
                            currentPrefs.heightPreference || [150, 180];
                          handleNestedChange(
                            "partnerPreferences",
                            "heightPreference",
                            [Math.min(value, currentRange[0]), value]
                          );
                        }}
                        className="w-full accent-purple-600"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lifestyle Compatibility
                  </label>
                  <textarea
                    value={
                      (formData.partnerPreferences || {})
                        .lifestyleCompatibility || ""
                    }
                    onChange={(e) =>
                      handleNestedChange(
                        "partnerPreferences",
                        "lifestyleCompatibility",
                        e.target.value
                      )
                    }
                    rows={2}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g. Health-conscious, non-smoker"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dealbreakers
                  </label>
                  <textarea
                    name="dealbreakers"
                    rows={2}
                    value={formData.dealbreakers || ""}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g. Smoking, excessive drinking, dishonesty"
                  ></textarea>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-500">
                        Age Range
                      </span>
                      <p className="text-gray-800">
                        {(user.partnerPreferences?.ageRange || []).join(
                          " - "
                        ) || "Not specified"}{" "}
                        years
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">
                        Location
                      </span>
                      <p className="text-gray-800">
                        {user.partnerPreferences?.locationPreference ||
                          "Not specified"}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">
                        Education Level
                      </span>
                      <p className="text-gray-800">
                        {user.partnerPreferences?.educationLevel ||
                          "Not specified"}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">
                        Religion
                      </span>
                      <p className="text-gray-800">
                        {user.partnerPreferences?.religionPreference ||
                          "Not specified"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-500">
                        Marital Status
                      </span>
                      <p className="text-gray-800">
                        {user.partnerPreferences?.maritalStatusPreference ||
                          "Not specified"}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">
                        Height
                      </span>
                      <p className="text-gray-800">
                        {user.partnerPreferences?.heightPreference
                          ? `${user.partnerPreferences.heightPreference.join(
                              " - "
                            )} cm`
                          : "Not specified"}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">
                        Lifestyle Compatibility
                      </span>
                      <p className="text-gray-800">
                        {user.partnerPreferences?.lifestyleCompatibility ||
                          "Not specified"}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">
                        Dealbreakers
                      </span>
                      <p className="text-gray-800">
                        {user.dealbreakers || "Not specified"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "privacy" && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800">
                Privacy Settings
              </h3>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="font-medium text-gray-800 mb-4">
                  Profile Visibility
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-700">Who can see my profile</p>
                      <p className="text-sm text-gray-500">
                        Control who can view your full profile details
                      </p>
                    </div>
                    <select className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500">
                      <option>Everyone</option>
                      <option>Only members I like</option>
                      <option>Only members I've matched with</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-700">Show my online status</p>
                      <p className="text-sm text-gray-500">
                        Let others know when you're active on the platform
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        defaultChecked
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-700">Show my location</p>
                      <p className="text-sm text-gray-500">
                        Display your city/district to other users
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        defaultChecked
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="font-medium text-gray-800 mb-4">
                  Communication Privacy
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-700">Who can message me</p>
                      <p className="text-sm text-gray-500">
                        Control who can send you direct messages
                      </p>
                    </div>
                    <select className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500">
                      <option>Everyone</option>
                      <option>Only members I like</option>
                      <option>Only members I've matched with</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-700">Read receipts</p>
                      <p className="text-sm text-gray-500">
                        Let others know when you've read their messages
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        defaultChecked
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-700">Show when I'm typing</p>
                      <p className="text-sm text-gray-500">
                        Display typing indicator in chat
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        defaultChecked
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="font-medium text-gray-800 mb-4">
                  Information Privacy
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-700">Show my income</p>
                      <p className="text-sm text-gray-500">
                        Display your income range to other users
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-700">Show my horoscope details</p>
                      <p className="text-sm text-gray-500">
                        Make your detailed horoscope information visible
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        defaultChecked
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-700">Show my family details</p>
                      <p className="text-sm text-gray-500">
                        Display information about your family background
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        defaultChecked
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Image Upload Modal */}
      {showImageUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Upload Profile Photo</h3>

            {previewImage ? (
              <img
                src={previewImage}
                alt="Preview"
                className="w-full h-64 object-contain mb-4"
              />
            ) : (
              <div className="w-full h-64 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mb-4">
                <div className="text-center">
                  <Camera className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-1 text-sm text-gray-500">
                    Click to select an image
                  </p>
                </div>
                <input
                  type="file"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setShowImageUpload(false);
                  setSelectedImage(null);
                  setPreviewImage(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleImageUpload}
                disabled={!previewImage}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-md disabled:opacity-50"
              >
                Upload Photo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProfilePage;
