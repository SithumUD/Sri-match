import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  ShieldCheckIcon,
  CameraIcon,
  UploadIcon,
  CheckCircleIcon,
  ClockIcon,
  AlertCircleIcon,
  XCircleIcon,
  InfoIcon,
} from "lucide-react";

const VerificationPage = () => {
  const { user, updateUserProfile } = useAuth();
  const [verificationStep, setVerificationStep] = useState(1);
  const [idType, setIdType] = useState("national-id");
  const [idFrontImage, setIdFrontImage] = useState(null);
  const [idBackImage, setIdBackImage] = useState(null);
  const [selfieImage, setSelfieImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(
    user?.isVerified ? "verified" : "not-submitted"
  );

  // Simulate file upload
  const handleFileUpload = (event, setImage) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitVerification = () => {
    setIsSubmitting(true);
    // Simulate API call delay
    setTimeout(() => {
      setVerificationStatus("pending");
      setIsSubmitting(false);
      // In a real app, you would send the verification data to the backend
      // For demo purposes, we'll simulate verification after 3 seconds
      setTimeout(() => {
        setVerificationStatus("verified");
        updateUserProfile({
          isVerified: true,
        });
      }, 3000);
    }, 1500);
  };

  if (verificationStatus === "verified") {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-8 text-center">
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircleIcon className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Account Verified!
            </h1>
            <p className="text-gray-600 mb-6">
              Your identity has been successfully verified. Enjoy all the
              features of SriMatch with your verified account.
            </p>
            <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full">
              <ShieldCheckIcon className="h-5 w-5 mr-2" />
              Verified Account
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (verificationStatus === "pending") {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-8 text-center">
            <div className="mx-auto w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
              <ClockIcon className="h-10 w-10 text-yellow-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Verification in Progress
            </h1>
            <p className="text-gray-600 mb-6">
              Your verification documents are being reviewed by our team. This
              process typically takes 24-48 hours.
            </p>
            <div className="inline-flex items-center px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full">
              <ClockIcon className="h-5 w-5 mr-2" />
              Pending Review
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (verificationStatus === "rejected") {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-8 text-center">
            <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
              <XCircleIcon className="h-10 w-10 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Verification Failed
            </h1>
            <p className="text-gray-600 mb-6">
              Unfortunately, we couldn't verify your identity with the provided
              documents. Please try again with clearer images.
            </p>
            <button
              onClick={() => setVerificationStatus("not-submitted")}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 md:p-8">
          <div className="flex items-center mb-6">
            <div className="bg-purple-100 p-3 rounded-full mr-4">
              <ShieldCheckIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Account Verification
              </h1>
              <p className="text-gray-600">
                Verify your identity to get a verified badge and build trust
              </p>
            </div>
          </div>

          {/* Verification steps progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    verificationStep >= 1
                      ? "bg-purple-600 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  1
                </div>
                <span className="text-xs mt-1">ID Type</span>
              </div>
              <div
                className={`flex-1 h-1 mx-2 ${
                  verificationStep > 1 ? "bg-purple-600" : "bg-gray-200"
                }`}
              ></div>
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    verificationStep >= 2
                      ? "bg-purple-600 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  2
                </div>
                <span className="text-xs mt-1">ID Upload</span>
              </div>
              <div
                className={`flex-1 h-1 mx-2 ${
                  verificationStep > 2 ? "bg-purple-600" : "bg-gray-200"
                }`}
              ></div>
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    verificationStep >= 3
                      ? "bg-purple-600 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  3
                </div>
                <span className="text-xs mt-1">Selfie</span>
              </div>
              <div
                className={`flex-1 h-1 mx-2 ${
                  verificationStep > 3 ? "bg-purple-600" : "bg-gray-200"
                }`}
              ></div>
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    verificationStep >= 4
                      ? "bg-purple-600 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  4
                </div>
                <span className="text-xs mt-1">Review</span>
              </div>
            </div>
          </div>

          {/* Step 1: ID Type Selection */}
          {verificationStep === 1 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Select ID Type
              </h2>
              <p className="text-gray-600 mb-6">
                Choose the type of identification document you want to use for
                verification.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <button
                  onClick={() => setIdType("national-id")}
                  className={`p-4 border rounded-lg flex flex-col items-center ${
                    idType === "national-id"
                      ? "border-purple-600 bg-purple-50"
                      : "border-gray-200 hover:border-purple-300"
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                      idType === "national-id" ? "bg-purple-100" : "bg-gray-100"
                    }`}
                  >
                    <ShieldCheckIcon
                      className={`h-6 w-6 ${
                        idType === "national-id"
                          ? "text-purple-600"
                          : "text-gray-500"
                      }`}
                    />
                  </div>
                  <span className="font-medium text-center">National ID</span>
                </button>
                <button
                  onClick={() => setIdType("passport")}
                  className={`p-4 border rounded-lg flex flex-col items-center ${
                    idType === "passport"
                      ? "border-purple-600 bg-purple-50"
                      : "border-gray-200 hover:border-purple-300"
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                      idType === "passport" ? "bg-purple-100" : "bg-gray-100"
                    }`}
                  >
                    <ShieldCheckIcon
                      className={`h-6 w-6 ${
                        idType === "passport"
                          ? "text-purple-600"
                          : "text-gray-500"
                      }`}
                    />
                  </div>
                  <span className="font-medium text-center">Passport</span>
                </button>
                <button
                  onClick={() => setIdType("drivers-license")}
                  className={`p-4 border rounded-lg flex flex-col items-center ${
                    idType === "drivers-license"
                      ? "border-purple-600 bg-purple-50"
                      : "border-gray-200 hover:border-purple-300"
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                      idType === "drivers-license"
                        ? "bg-purple-100"
                        : "bg-gray-100"
                    }`}
                  >
                    <ShieldCheckIcon
                      className={`h-6 w-6 ${
                        idType === "drivers-license"
                          ? "text-purple-600"
                          : "text-gray-500"
                      }`}
                    />
                  </div>
                  <span className="font-medium text-center">
                    Driver's License
                  </span>
                </button>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => setVerificationStep(2)}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full font-medium"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 2: ID Upload */}
          {verificationStep === 2 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Upload ID Document
              </h2>
              <p className="text-gray-600 mb-6">
                Please upload clear photos of the front and back of your{" "}
                {idType === "national-id"
                  ? "National ID"
                  : idType === "passport"
                  ? "Passport"
                  : "Driver's License"}
                .
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Front of ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Front of ID
                  </label>
                  {idFrontImage ? (
                    <div className="relative">
                      <img
                        src={idFrontImage}
                        alt="ID Front"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => setIdFrontImage(null)}
                        className="absolute top-2 right-2 bg-red-100 text-red-600 p-1 rounded-full"
                      >
                        <XCircleIcon className="h-5 w-5" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <UploadIcon className="h-10 w-10 text-gray-400 mb-3" />
                        <p className="text-sm text-gray-500">
                          Click to upload front image
                        </p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, setIdFrontImage)}
                      />
                    </label>
                  )}
                </div>
                {/* Back of ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Back of ID
                  </label>
                  {idBackImage ? (
                    <div className="relative">
                      <img
                        src={idBackImage}
                        alt="ID Back"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => setIdBackImage(null)}
                        className="absolute top-2 right-2 bg-red-100 text-red-600 p-1 rounded-full"
                      >
                        <XCircleIcon className="h-5 w-5" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <UploadIcon className="h-10 w-10 text-gray-400 mb-3" />
                        <p className="text-sm text-gray-500">
                          Click to upload back image
                        </p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, setIdBackImage)}
                      />
                    </label>
                  )}
                </div>
              </div>
              <div className="flex justify-between">
                <button
                  onClick={() => setVerificationStep(1)}
                  className="px-6 py-2 border border-gray-300 rounded-full text-gray-700 font-medium"
                >
                  Back
                </button>
                <button
                  onClick={() => setVerificationStep(3)}
                  disabled={!idFrontImage || !idBackImage}
                  className={`bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full font-medium ${
                    !idFrontImage || !idBackImage
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Selfie */}
          {verificationStep === 3 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Take a Selfie
              </h2>
              <p className="text-gray-600 mb-6">
                Please upload a clear selfie of yourself holding your ID
                document.
              </p>
              <div className="mb-6">
                {selfieImage ? (
                  <div className="relative">
                    <img
                      src={selfieImage}
                      alt="Selfie with ID"
                      className="w-full max-h-80 object-contain rounded-lg"
                    />
                    <button
                      onClick={() => setSelfieImage(null)}
                      className="absolute top-2 right-2 bg-red-100 text-red-600 p-1 rounded-full"
                    >
                      <XCircleIcon className="h-5 w-5" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <CameraIcon className="h-12 w-12 text-gray-400 mb-3" />
                      <p className="text-sm text-gray-500 mb-2">
                        Click to take or upload a selfie
                      </p>
                      <p className="text-xs text-gray-500">
                        Hold your ID next to your face
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, setSelfieImage)}
                    />
                  </label>
                )}
              </div>
              <div className="flex justify-between">
                <button
                  onClick={() => setVerificationStep(2)}
                  className="px-6 py-2 border border-gray-300 rounded-full text-gray-700 font-medium"
                >
                  Back
                </button>
                <button
                  onClick={() => setVerificationStep(4)}
                  disabled={!selfieImage}
                  className={`bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full font-medium ${
                    !selfieImage ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {verificationStep === 4 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Review & Submit
              </h2>
              <p className="text-gray-600 mb-6">
                Please review your verification documents before submitting.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Front of ID
                  </p>
                  <img
                    src={idFrontImage}
                    alt="ID Front"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Back of ID
                  </p>
                  <img
                    src={idBackImage}
                    alt="ID Back"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Selfie with ID
                  </p>
                  <img
                    src={selfieImage}
                    alt="Selfie with ID"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start">
                <InfoIcon className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Privacy Notice</p>
                  <p>
                    Your ID documents will be securely processed and stored
                    according to our privacy policy. We will never share your
                    personal information with third parties without your
                    consent.
                  </p>
                </div>
              </div>
              <div className="flex justify-between">
                <button
                  onClick={() => setVerificationStep(3)}
                  className="px-6 py-2 border border-gray-300 rounded-full text-gray-700 font-medium"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmitVerification}
                  disabled={isSubmitting}
                  className={`bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full font-medium flex items-center ${
                    isSubmitting ? "opacity-75" : ""
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    "Submit for Verification"
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerificationPage;
