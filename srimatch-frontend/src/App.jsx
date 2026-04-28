import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import LoadingScreen from "./components/LoadingScreen";

// Lazy-loaded Pages
const LandingPage = lazy(() => import("./pages/LandingPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const ProfileCreationPage = lazy(() => import("./pages/ProfileCreationPage"));
const HomePage = lazy(() => import("./pages/HomePage"));
const UserProfilePage = lazy(() => import("./pages/UserProfilePage"));
const MyProfilePage = lazy(() => import("./pages/MyProfilePage"));
const VerificationPage = lazy(() => import("./pages/VerificationPage"));
const MessagesPage = lazy(() => import("./pages/MessagesPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const SubscriptionPage = lazy(() => import("./pages/SubscriptionPage"));
const ConnectionsPage = lazy(() => import("./pages/ConnectionsPage"));

// Lazy-loaded Static Pages
const AboutUsPage = lazy(() => import("./pages/AboutUsPage"));
const HowItWorksPage = lazy(() => import("./pages/HowItWorksPage"));
const FAQPage = lazy(() => import("./pages/FAQPage"));
const ContactUsPage = lazy(() => import("./pages/ContactUsPage"));
const CustomerSupportPage = lazy(() => import("./pages/CustomerSupportPage"));
const HelpCenterPage = lazy(() => import("./pages/HelpCenterPage"));
const PrivacyPolicyPage = lazy(() => import("./pages/PrivacyPolicyPage"));
const TermsConditionsPage = lazy(() => import("./pages/TermsConditionsPage"));
const RefundPolicyPage = lazy(() => import("./pages/RefundPolicyPage"));
const CookiePolicyPage = lazy(() => import("./pages/CookiePolicyPage"));
const SafetyGuidelinesPage = lazy(() => import("./pages/SafetyGuidelinesPage"));
const SuccessStoriesPage = lazy(() => import("./pages/SuccessStoriesPage"));
const MobileSelfiePage = lazy(() => import("./pages/MobileSelfiePage"));

// Lazy-loaded Admin Pages
const AdminLoginPage = lazy(() => import("./pages/Admin/AdminLoginPage"));
const AdminLayout = lazy(() => import("./components/AdminLayout"));
const AdminProtectedRoute = lazy(() => import("./components/AdminProtectedRoute"));
const AdminPanel = lazy(() => import("./pages/Admin/AdminPanel"));
const AdminUsers = lazy(() => import("./pages/AdminUsers"));
const AdminSettings = lazy(() => import("./pages/AdminSettings"));
const AdminPayments = lazy(() => import("./pages/AdminPayments"));
const AdminReports = lazy(() => import("./pages/AdminReports"));
const AdminSupport = lazy(() => import("./pages/AdminSupport"));
const AdminPackages = lazy(() => import("./pages/AdminPackages"));
const AdminLocations = lazy(() => import("./pages/AdminLocations"));
const AdminAudits = lazy(() => import("./pages/AdminAudits"));
const AdminUserVerify = lazy(() => import("./pages/AdminUserVerify"));

export function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/contact" element={<ContactUsPage />} />
          <Route path="/customer-support" element={<CustomerSupportPage />} />
          <Route path="/help-center" element={<HelpCenterPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsConditionsPage />} />
          <Route path="/refund-policy" element={<RefundPolicyPage />} />
          <Route path="/cookie-policy" element={<CookiePolicyPage />} />
          <Route path="/safety-guidelines" element={<SafetyGuidelinesPage />} />
          <Route path="/success-stories" element={<SuccessStoriesPage />} />
          <Route path="/mobile-selfie" element={<MobileSelfiePage />} />

          <Route
            path="/profile-creation"
            element={
              <ProtectedRoute>
                <ProfileCreationPage />
              </ProtectedRoute>
            }
          />

          <Route path="/admin/login" element={<AdminLoginPage />} />
          
          <Route path="/admin" element={<AdminProtectedRoute><AdminLayout /></AdminProtectedRoute>}>
            <Route index element={<AdminPanel />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="payments" element={<AdminPayments />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="support" element={<AdminSupport />} />
            <Route path="packages" element={<AdminPackages />} />
            <Route path="locations" element={<AdminLocations />} />
            <Route path="audits" element={<AdminAudits />} />
            <Route path="user-verify" element={<AdminUserVerify />} />
          </Route>

          <Route element={<Layout />}>
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile/:id"
              element={
                <ProtectedRoute>
                  <UserProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-profile"
              element={
                <ProtectedRoute>
                  <MyProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/verification"
              element={
                <ProtectedRoute>
                  <VerificationPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/connections"
              element={
                <ProtectedRoute>
                  <ConnectionsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/messages"
              element={
                <ProtectedRoute>
                  <MessagesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/subscription"
              element={
                <ProtectedRoute>
                  <SubscriptionPage />
                </ProtectedRoute>
              }
            />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}
