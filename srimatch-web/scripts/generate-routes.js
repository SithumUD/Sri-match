const fs = require('fs');
const path = require('path');

const rootApp = path.join(__dirname, '../src/app');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// 1. Root / Landing
ensureDir(rootApp);
fs.writeFileSync(path.join(rootApp, 'page.tsx'), `import LandingPage from "@/views/LandingPage";

export const metadata = {
  title: "SriMatch — The Soul of Sri Lankan Matrimony",
  description: "Sri Lanka's premier matrimonial platform connecting hearts across borders.",
};

export default function Page() {
  return <LandingPage />;
}
`);

// 2. Public / Static Pages Map
const publicPages = [
  { route: 'login', view: 'LoginPage', title: 'Sign In | SriMatch' },
  { route: 'register', view: 'RegisterPage', title: 'Create an Account | SriMatch' },
  { route: 'about', view: 'AboutUsPage', title: 'About Us | SriMatch' },
  { route: 'how-it-works', view: 'HowItWorksPage', title: 'How It Works | SriMatch' },
  { route: 'faq', view: 'FAQPage', title: 'Frequently Asked Questions | SriMatch' },
  { route: 'contact', view: 'ContactUsPage', title: 'Contact Us | SriMatch' },
  { route: 'customer-support', view: 'CustomerSupportPage', title: 'Customer Support | SriMatch' },
  { route: 'help-center', view: 'HelpCenterPage', title: 'Help Center | SriMatch' },
  { route: 'privacy', view: 'PrivacyPolicyPage', title: 'Privacy Policy | SriMatch' },
  { route: 'terms', view: 'TermsConditionsPage', title: 'Terms & Conditions | SriMatch' },
  { route: 'refund-policy', view: 'RefundPolicyPage', title: 'Refund Policy | SriMatch' },
  { route: 'cookie-policy', view: 'CookiePolicyPage', title: 'Cookie Policy | SriMatch' },
  { route: 'safety-guidelines', view: 'SafetyGuidelinesPage', title: 'Safety Guidelines | SriMatch' },
  { route: 'success-stories', view: 'SuccessStoriesPage', title: 'Success Stories | SriMatch' },
  { route: 'mobile-selfie', view: 'MobileSelfiePage', title: 'Mobile Identity Verification | SriMatch' },
];

publicPages.forEach(({ route, view, title }) => {
  const dir = path.join(rootApp, route);
  ensureDir(dir);
  fs.writeFileSync(path.join(dir, 'page.tsx'), `import ${view} from "@/views/${view}";

export const metadata = {
  title: "${title}",
};

export default function Page() {
  return <${view} />;
}
`);
});

// Profile Creation (Protected standalone)
ensureDir(path.join(rootApp, 'profile-creation'));
fs.writeFileSync(path.join(rootApp, 'profile-creation/page.tsx'), `import ProtectedRoute from "@/components/ProtectedRoute";
import ProfileCreationPage from "@/views/ProfileCreationPage";

export const metadata = {
  title: "Complete Your Profile | SriMatch",
};

export default function Page() {
  return (
    <ProtectedRoute>
      <ProfileCreationPage />
    </ProtectedRoute>
  );
}
`);

// 3. Authenticated Route Group: (authenticated)
const authDir = path.join(rootApp, '(authenticated)');
ensureDir(authDir);

// Layout for (authenticated)
fs.writeFileSync(path.join(authDir, 'layout.tsx'), `"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <Layout>
        {children}
      </Layout>
    </ProtectedRoute>
  );
}
`);

const authPages = [
  { route: 'home', view: 'HomePage', title: 'Discover Matches | SriMatch' },
  { route: 'profile/[id]', view: 'UserProfilePage', title: 'Member Profile | SriMatch' },
  { route: 'my-profile', view: 'MyProfilePage', title: 'My Profile | SriMatch' },
  { route: 'verification', view: 'VerificationPage', title: 'Identity Verification | SriMatch' },
  { route: 'connections', view: 'ConnectionsPage', title: 'My Connections | SriMatch' },
  { route: 'messages', view: 'MessagesPage', title: 'Messages & Chat | SriMatch' },
  { route: 'settings', view: 'SettingsPage', title: 'Account Settings | SriMatch' },
  { route: 'subscription', view: 'SubscriptionPage', title: 'Membership Plans | SriMatch' },
];

authPages.forEach(({ route, view, title }) => {
  const dir = path.join(authDir, route);
  ensureDir(dir);
  fs.writeFileSync(path.join(dir, 'page.tsx'), `import ${view} from "@/views/${view}";

export const metadata = {
  title: "${title}",
};

export default function Page() {
  return <${view} />;
}
`);
});

// 4. Admin Portal Routes
const adminDir = path.join(rootApp, 'admin');
ensureDir(adminDir);

// Admin Login
ensureDir(path.join(adminDir, 'login'));
fs.writeFileSync(path.join(adminDir, 'login/page.tsx'), `import AdminLoginPage from "@/views/Admin/AdminLoginPage";

export const metadata = {
  title: "Admin Sign In | SriMatch",
};

export default function Page() {
  return <AdminLoginPage />;
}
`);

// Admin Portal Route Group: (portal)
const adminPortalDir = path.join(adminDir, '(portal)');
ensureDir(adminPortalDir);

fs.writeFileSync(path.join(adminPortalDir, 'layout.tsx'), `"use client";

import AdminProtectedRoute from "@/components/AdminProtectedRoute";
import AdminLayout from "@/components/AdminLayout";

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminProtectedRoute>
      <AdminLayout>
        {children}
      </AdminLayout>
    </AdminProtectedRoute>
  );
}
`);

const adminPages = [
  { route: '', view: 'Admin/AdminPanel', title: 'Admin Dashboard | SriMatch' },
  { route: 'users', view: 'AdminUsers', title: 'User Management | Admin Portal' },
  { route: 'settings', view: 'AdminSettings', title: 'Platform Settings | Admin Portal' },
  { route: 'payments', view: 'AdminPayments', title: 'Payment Approvals | Admin Portal' },
  { route: 'reports', view: 'AdminReports', title: 'User Reports & Moderation | Admin Portal' },
  { route: 'support', view: 'AdminSupport', title: 'Support Inquiries | Admin Portal' },
  { route: 'packages', view: 'AdminPackages', title: 'Package Management | Admin Portal' },
  { route: 'locations', view: 'AdminLocations', title: 'Location Management | Admin Portal' },
  { route: 'audits', view: 'AdminAudits', title: 'Administrative Audits | Admin Portal' },
  { route: 'user-verify', view: 'AdminUserVerify', title: 'Identity Approvals | Admin Portal' },
  { route: 'tiktok-promotions', view: 'AdminTikTokPromotions', title: 'TikTok Spotlight | Admin Portal' },
];

adminPages.forEach(({ route, view, title }) => {
  const dir = route ? path.join(adminPortalDir, route) : adminPortalDir;
  ensureDir(dir);
  const importName = view.includes('/') ? view.split('/')[1] : view;
  fs.writeFileSync(path.join(dir, 'page.tsx'), `import ${importName} from "@/views/${view}";

export const metadata = {
  title: "${title}",
};

export default function Page() {
  return <${importName} />;
}
`);
});

console.log("Successfully created all Next.js App Router routes!");
