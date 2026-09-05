# 📖 Sri-Match: Full Frontend End-to-End System Testing Guide

A comprehensive, step-by-step testing manual to validate the entire **Sri-Match** matrimonial platform directly through the Frontend user interface.

---

## 📑 Table of Contents
1. [Prerequisites & System Startup](#1-prerequisites--system-startup)
2. [1-Click Automated Frontend Testing (Playwright)](#2-1-click-automated-frontend-testing-playwright)
3. [Complete Step-by-Step Manual Frontend Testing](#3-complete-step-by-step-manual-frontend-testing)
   - [Step 1: Landing Page & Navigation](#step-1-landing-page--navigation)
   - [Step 2: User Registration](#step-2-user-registration)
   - [Step 3: Email OTP Verification](#step-3-email-otp-verification)
   - [Step 4: User Login & Session Handling](#step-4-user-login--session-handling)
   - [Step 5: Profile Creation Wizard](#step-5-profile-creation-wizard)
   - [Step 6: Discovery Feed & Filtered Search](#step-6-discovery-feed--filtered-search)
   - [Step 7: Likes & Mutual Match Engine](#step-7-likes--mutual-match-engine)
   - [Step 8: Real-Time Chat & Messaging](#step-8-real-time-chat--messaging)
   - [Step 9: 10-Porutham Astrological Compatibility](#step-9-10-porutham-astrological-compatibility)
   - [Step 10: Premium Membership & Bank Transfer](#step-10-premium-membership--bank-transfer)
   - [Step 11: Customer Support & Safety Reporting](#step-11-customer-support--safety-reporting)
   - [Step 12: Admin Management Portal](#step-12-admin-management-portal)
   - [Step 13: Logout & Token Invalidation](#step-13-logout--token-invalidation)
4. [Useful Database Verification Commands](#4-useful-database-verification-commands)
5. [Troubleshooting & FAQs](#5-troubleshooting--faqs)

---

## 1. Prerequisites & System Startup

Make sure all services are running before starting testing:

### 1.1 Start Database & Cache (Docker)
```powershell
docker start srimatch-postgres srimatch-redis
```
- **PostgreSQL**: Port `5433` (`srimatch_dev`)
- **Redis**: Port `6379`

### 1.2 Start Backend (Spring Boot 3.3.4 / Java 21)
Open a terminal in `srimatch-backend`:
```powershell
cd c:\Users\sithu\OneDrive\Documents\GitHub\Sri-match\srimatch-backend
mvn spring-boot:run "-Dspring-boot.run.profiles=dev" "-Dspring-boot.run.jvmArguments=-DDB_PORT=5433"
```
*Backend runs on `http://localhost:8080/api`.*

### 1.3 Start Frontend (Vite + React)
Open a separate terminal in `srimatch-frontend`:
```powershell
cd c:\Users\sithu\OneDrive\Documents\GitHub\Sri-match\srimatch-frontend
npm run dev
```
*Frontend runs on `http://localhost:5173/`.*

---

## 2. 1-Click Automated Frontend Testing (Playwright)

You can run automated browser testing covering all 9 core UI flows in headless mode:

```powershell
cd c:\Users\sithu\OneDrive\Documents\GitHub\Sri-match
node scratch/frontend_auto_test.mjs
```

### ✅ Expected Output:
```
═══════════════════════════════════════════════════════════════════════════
🌐 SRIMATCH FRONTEND AUTOMATED PLAYWRIGHT UI TEST SUITE
═══════════════════════════════════════════════════════════════════════════
✅ [PASS] 1. Landing Page UI & Features
✅ [PASS] 2. How It Works Page & Guidelines
✅ [PASS] 3. User Registration Form & Validation
✅ [PASS] 4. OTP Verification Execution
✅ [PASS] 5. User Authentication & Login Flow
✅ [PASS] 6. Discovery & Match Feed UI (/home)
✅ [PASS] 7. Premium Membership Plans (/subscription)
✅ [PASS] 8. Messages & Chat Interface (/messages)
✅ [PASS] 9. Admin Panel Dashboard & User Table
═══════════════════════════════════════════════════════════════════════════
📊 FRONTEND TEST RESULTS: 9/9 PASSED (100.0%) | 0 FAILED
═══════════════════════════════════════════════════════════════════════════
```

---

## 3. Complete Step-by-Step Manual Frontend Testing

---

### Step 1: Landing Page & Navigation
1. Open your browser and navigate to: **`http://localhost:5173/`**
2. **Verify the following UI elements**:
   - **Hero Section**: Headline *"Where Traditions Meet Forever"*, dynamic background, CTA button *"Find Your Match"*.
   - **Features & Culture Section**: Sri Lankan cultural values, 10-Porutham badge, ID Verification highlight.
   - **How It Works**: 3-step guide (Create Profile → Match by Porutham → Connect).
   - **Footer Links**: About Us, How It Works, Pricing, Terms & Conditions, Privacy Policy.
3. **Click "How It Works"** in the top navbar or footer to verify navigation to `/how-it-works`.

---

### Step 2: User Registration
1. In the top navbar, click **"Sign Up"** or visit: **`http://localhost:5173/register`**
2. **Fill out the registration form**:
   - **First Name**: `Nuwan`
   - **Last Name**: `Fernando`
   - **Email Address**: `nuwan.test@srimatch.com` *(or any unique email)*
   - **Password**: `Password123!`
   - **Confirm Password**: `Password123!`
   - **Referral Code**: *(optional, leave blank)*
   - Check the **"I agree to the Terms & Conditions and Privacy Policy"** checkbox.
3. **Click "Create Account"**:
   - Verify a success toast appears: *"Account created! Please verify your email."*
   - Verify the UI transitions automatically to the **Email Verification Screen**.

---

### Step 3: Email OTP Verification
1. On the verification screen, you will see a prompt: *"We've sent a 6-digit verification code to nuwan.test@srimatch.com"*.
2. **Retrieve the OTP code from the database** by running this command in your terminal:
   ```powershell
   docker exec srimatch-postgres psql -U srimatch_user -d srimatch_dev -t -A -c "SELECT otp FROM otp_verifications WHERE LOWER(identifier) = 'nuwan.test@srimatch.com' ORDER BY created_at DESC LIMIT 1;"
   ```
   *(Example output: `525683`)*
3. **Enter the 6-digit code** into the input boxes.
4. **Click "Verify & Continue"**:
   - Verify success toast: *"Email verified successfully!"*
   - The app automatically logs you in and redirects you to the **Profile Creation Wizard** (`/profile-creation`).

---

### Step 4: User Login & Session Handling
1. To test the login form separately, log out or visit: **`http://localhost:5173/login`**
2. **Test Password Validation**:
   - Enter `nuwan.test@srimatch.com` and a wrong password `WrongPassword!`.
   - Click **"Sign In"** → Verify error toast: *"Invalid email or password"*.
3. **Enter Correct Credentials**:
   - **Email**: `nuwan.test@srimatch.com`
   - **Password**: `Password123!`
   - Check **"Remember me"**.
4. **Click "Sign In"**:
   - Verify toast *"Welcome back!"* and redirection to your user dashboard / profile setup.

---

### Step 5: Profile Creation Wizard
1. On **`http://localhost:5173/profile-creation`**, complete your profile details:
   - **Basic Info**: Gender (`Male`), Date of Birth (`1996-05-14`), Height (`175 cm`), Complexion (`Fair`).
   - **Location & Heritage**: District (`Colombo`), City (`Nugegoda`), Religion (`Buddhist`), Ethnicity/Caste (`Sinhala / Govigama`).
      - **Education & Career**: Education (`BSc Software Engineering`), Profession (`Senior Software Engineer`), Industry (`Technology`).
   - **Lifestyle**: Dietary (`Vegetarian`), Smoking (`Never`), Drinking (`Never`).
   - **Partner Preferences**: Preferred Age (`22-28`), Preferred Religion (`Buddhist`), Preferred District (`Colombo, Kandy, Gampaha`).
2. **Click "Save & Complete Profile"**.

---

### Step 6: Discovery Feed & Filtered Search
1. Navigate to **`http://localhost:5173/home`** (or click **Discovery** in the navbar).
2. **Verify Feed Elements**:
   - **Profile Cards**: Profile picture, Name, Age, Profession, District, and Religion tags.
   - **Compatibility Badge**: Overall match score percentage badge.
3. **Test Search & Filters**:
   - Open the **Filter Panel**.
   - Filter by **District**: Select `Kandy` or `Colombo`.
   - Filter by **Religion**: Select `Buddhist`.
   - Click **"Apply Filters"** → Verify the cards reload with filtered results.

---

### Step 7: Likes & Mutual Match Engine
1. **Send a Like**:
   - On a profile card (e.g., `Sanduni Perera`), click the **Heart / Like button**.
   - Verify toast confirms the like is sent and remaining daily like quota updates.
2. **Trigger a Mutual Match**:
   - Open an incognito window and log in as the other user (`sanduni.perera@srimatch.com` / `Password123!`).
   - Navigate to `/connections` or `/home`.
   - Send a like back to `Nuwan Fernando`.
   - Verify a **"It's a Match! 🎉"** popup modal appears confirming the mutual match!

---

### Step 8: Real-Time Chat & Messaging
1. In the top navbar, click **"Messages"** or visit: **`http://localhost:5173/messages`**
2. **Select your matched conversation** from the left panel.
3. **Send a Message**:
   - Type: *"Ayubowan! Nice to connect with you on Sri-Match."*
   - Press **Enter** or click the **Send** button.
   - Verify the message bubble appears with timestamp and delivery checkmark.
4. **Switch to User B's browser window**:
   - Verify the message appears in real time via WebSocket without refreshing the page!
   - Reply back: *"Ayubowan! Nice to meet you too."*

---

### Step 9: 10-Porutham Astrological Compatibility
1. Open your match's profile or view mutual compatibility details.
2. **Verify the 10-Porutham Compatibility Report**:
   - **Total Score**: e.g., `32 / 36` (80%+ Auspicious alignment).
   - **Porutham Breakdown Cards**:
     - `Dina Porutham` (Health & Prosperity) — ✅ GOOD
     - `Gana Porutham` (Temperament) — ✅ EXCELLENT
     - `Mahendra Porutham` (Progeny & Lineage) — ✅ GOOD
     - `Stree Deergha` (Longevity of Wealth) — ✅ EXCELLENT
     - `Yoni Porutham` (Physical Harmony) — ✅ MODERATE
     - `Rasi Porutham` (Family Harmony) — ✅ GOOD
     - `Rasyadhipathi` (Mutual Friendship) — ✅ GOOD
     - `Vasya Porutham` (Mutual Attraction) — ✅ EXCELLENT
     - `Rajju Porutham` (Mangalya Strength) — ✅ PASS
     - `Vedha Porutham` (Absence of Affliction) — ✅ PASS
   - **Astrological Conclusion**: Auspicious alignment summary text.

---

### Step 10: Premium Membership & Bank Transfer
1. Navigate to **`http://localhost:5173/subscription`** (or click **"Upgrade"**).
2. **Inspect Packages**:
   - **Silver Plan**: LKR 2,500 / month (Unlimited Likes, 5 Direct Messages).
   - **Gold Plan**: LKR 5,000 / 3 months (Unlimited Chat, Profile Boost).
   - **Platinum VIP**: LKR 10,000 / 6 months (Dedicated Matchmaker, Unlimited Porutham, Top Search Priority).
3. **Test Bank Transfer Payment Flow**:
   - Click **"Choose Plan"** on the **Gold Plan**.
   - Select **Bank Wire / Deposit Transfer**.
   - Verify Company Bank Account Details are displayed (Bank Name, Account Number, Branch, Beneficiary Name).
   - Upload a payment receipt screenshot and click **"Submit Payment Proof"**.
   - Verify confirmation toast: *"Payment submitted for admin approval."*

---

### Step 11: Customer Support & Safety Reporting
1. **Submit a Support Ticket**:
   - Navigate to `/customer-support` or `/help-center`.
   - Subject: *"Question regarding ID Verification"*.
   - Category: `Verification`.
   - Message: *"How long does the passport/NIC verification take?"*
   - Click **"Submit Ticket"** → Verify ticket reference number is generated.
2. **Submit a Safety / Moderation Report**:
   - Visit any user's profile.
   - Click the **Options (•••) → "Report Profile"**.
   - Reason: `Inappropriate Content` / `Fake Profile`.
   - Details: *"Testing safety moderation flow."*
   - Click **"Submit Report"** → Verify report is submitted to admin queue.

---

### Step 12: Admin Management Portal
1. Navigate to: **`http://localhost:5173/admin/login`**
2. **Elevate your user to Admin** via PostgreSQL:
   ```powershell
   docker exec srimatch-postgres psql -U srimatch_user -d srimatch_dev -c "UPDATE users SET role = 'ADMIN' WHERE email = 'nuwan.test@srimatch.com';"
   ```
3. **Log In to Admin Panel**:
   - **Email**: `nuwan.test@srimatch.com`
   - **Password**: `Password123!`
   - Click **"Sign In"** → You will be redirected to **`http://localhost:5173/admin`**.
4. **Explore Admin Features**:
   - **Dashboard Analytics**: Total Registered Users, Active Subscriptions, Pending Verifications, Monthly Revenue Chart.
   - **User Management (`/admin/users`)**: Search, filter, inspect profiles, suspend or verify accounts.
   - **Payments & Receipts (`/admin/payments`)**: Approve or reject pending bank transfer slips.
   - **Moderation Reports (`/admin/reports`)**: Review flagged profiles and take moderation action.
   - **System Settings (`/admin/settings`)**: Toggle maintenance mode, like limits, and feature flags.

---

### Step 13: Logout & Token Invalidation
1. In the top navigation user menu, click **"Log Out"**.
2. **Verify Security Behavior**:
   - User is redirected to `/login`.
   - Auth cookies and local storage tokens are cleared.
   - Try navigating back to `/home` or `/my-profile` → Verify you are blocked and redirected to `/login`!

---

## 4. Useful Database Verification Commands

| Action | PowerShell Command |
|---|---|
| **Get Latest OTP Code** | `docker exec srimatch-postgres psql -U srimatch_user -d srimatch_dev -t -A -c "SELECT otp FROM otp_verifications ORDER BY created_at DESC LIMIT 1;"` |
| **Verify User Email Manually** | `docker exec srimatch-postgres psql -U srimatch_user -d srimatch_dev -c "UPDATE users SET is_email_verified = true WHERE email = 'YOUR_EMAIL';"` |
| **Make User an Admin** | `docker exec srimatch-postgres psql -U srimatch_user -d srimatch_dev -c "UPDATE users SET role = 'ADMIN' WHERE email = 'YOUR_EMAIL';"` |
| **View All Users** | `docker exec srimatch-postgres psql -U srimatch_user -d srimatch_dev -c "SELECT id, first_name, last_name, email, role, is_email_verified FROM users ORDER BY created_at DESC LIMIT 10;"` |
| **View Active Matches** | `docker exec srimatch-postgres psql -U srimatch_user -d srimatch_dev -c "SELECT * FROM matches ORDER BY created_at DESC LIMIT 5;"` |
| **View Blacklisted JWT Tokens** | `docker exec srimatch-postgres psql -U srimatch_user -d srimatch_dev -c "SELECT id, created_at, expires_at FROM jwt_blacklist ORDER BY created_at DESC LIMIT 5;"` |

---

## 5. Troubleshooting & FAQs

### Q1: Why do I see a 403 Forbidden error during login/register?
- **Solution**: Ensure your frontend is accessing `http://localhost:5173` or `http://127.0.0.1:5173`. Backend CORS configuration in `application-dev.properties` allows both origins.

### Q2: Why is the OTP code not arriving in my real email inbox?
- **Solution**: In local development mode, OTPs are generated and logged directly to the database. Query the `otp_verifications` table using the command in [Section 4](#4-useful-database-verification-commands).

### Q3: What if the backend fails to connect to PostgreSQL?
- **Solution**: Check if Docker container `srimatch-postgres` is running on port **5433**:
  ```powershell
  docker ps
  docker start srimatch-postgres
  ```

---

*Testing guide created for Sri-Match Matrimonial System. All test suites verified with 100% pass rate.*
