# SriMatch - Complete Profile Fields & Data Schema

This document provides a comprehensive reference of all profile fields, data types, enum options, JSON structures, database mapping, the **Frontend Web Profile Creation Wizard** (8 Steps), the **Profile Details Page (Web & Mobile Display Specification)**, the **My Profile & Profile Edit Management Schema (Web & Mobile)**, the **Mobile App Profile Creation Wizard** (8 Steps), the **Mobile App Profile Details Screen (Native UI Specification)**, the **Mobile App My Profile Screen (Native Dashboard Specification)**, and the **Mobile App Edit Profile Screen (8-Tab Native Editor Specification)**.

---

## 1. Basic & Identity Information

| Field Name | Entity / Column | DB Data Type | Java / API Type | Allowed Values / Format | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `firstName` | `users.first_name` | `VARCHAR(50)` | `String` | Not blank, max 50 chars | User's first name |
| `lastName` | `users.last_name` | `VARCHAR(50)` | `String` | Not blank, max 50 chars | User's last name |
| `gender` | `profiles.gender` | `VARCHAR(20)` | `Enum (Gender)` | `MALE`, `FEMALE`, `OTHER` | Gender |
| `dateOfBirth` | `profiles.date_of_birth` | `DATE` | `LocalDate` | `YYYY-MM-DD` | Date of birth (calculates dynamic `age`) |
| `maritalStatus` | `profiles.marital_status`| `VARCHAR(30)` | `Enum (MaritalStatus)` | `NEVER_MARRIED`, `DIVORCED`, `WIDOWED`, `SEPARATED` | Marital status |
| `hasChildren` | `profiles.has_children` | `BOOLEAN` | `Boolean` | `true`, `false` | Whether user has children |
| `numberOfChildren` | `profiles.number_of_children` | `INTEGER` | `Integer` | Default `0` | Count of children |

---

## 2. Location Information

| Field Name | Entity / Column | DB Data Type | Java / API Type | Example / Format | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `city` | `profiles.city` | `VARCHAR(100)` | `String` | "Colombo", "Kandy", "Galle", "Nugegoda" | Residing city/town |
| `latitude` | `profiles.latitude` | `DOUBLE PRECISION`| `Double` | `6.9271` | Geographic latitude (optional) |
| `longitude` | `profiles.longitude` | `DOUBLE PRECISION`| `Double` | `79.8612` | Geographic longitude (optional) |

---

## 3. Cultural, Religion & Family Heritage

| Field Name | Entity / Column | DB Data Type | Java / API Type | Allowed Values / Format | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `religion` | `profiles.religion` | `VARCHAR(30)` | `Enum (Religion)` | `BUDDHIST`, `HINDU`, `ISLAM`, `ROMAN_CATHOLIC`, `NON_ROMAN_CATHOLIC`, `OTHER` | Religious belief |
| `religiousPractices` | `profiles.religious_practices` | `TEXT` | `String` | e.g. "Prays daily", "Temple visits on Poya days" | Level of religious practice |
| `ethnicity` | `profiles.ethnicity` | `VARCHAR(30)` | `Enum (Ethnicity)` | `SINHALESE`, `TAMIL`, `MUSLIM`, `BURGHER`, `MALAY`, `OTHER` | Ethnic background |
| `languages` | `profiles.languages` | `JSONB` | `List<String>` | `["Sinhala", "English", "Tamil"]` | Fluent languages |
| `familyType` | `profiles.family_type` | `VARCHAR(30)` | `Enum (FamilyType)` | `NUCLEAR`, `JOINT` | Living family structure |
| `familyBackground` | `profiles.family_background` | `TEXT` | `String` | Text description | Parents' background / ancestral roots |
| `culturalValues` | `profiles.cultural_values` | `TEXT` | `String` | "Traditional", "Moderate", "Liberal" | Cultural orientation |
| `familyInvolvement` | `profiles.family_involvement` | `TEXT` | `String` | Text description | Role of family in marriage decisions |
| `weddingPreferences`| `profiles.wedding_preferences`| `TEXT` | `String` | e.g. "Simple traditional ceremony" | Vision for wedding |

---

## 4. Education & Career

| Field Name | Entity / Column | DB Data Type | Java / API Type | Allowed Values / Format | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `education` | `profiles.education` | `VARCHAR(30)` | `Enum (EducationLevel)` | `HIGH_SCHOOL`, `DIPLOMA`, `BACHELORS`, `MASTERS`, `DOCTORATE`, `PROFESSIONAL`, `OTHER` | Highest level of education |
| `fieldOfStudy` | `profiles.field_of_study` | `VARCHAR(100)` | `String` | e.g. "Computer Science", "Medicine", "Civil Engineering" | Degree / Major |
| `profession` | `profiles.profession` | `VARCHAR(100)` | `String` | e.g. "Software Engineer", "Doctor", "Accountant" | Job designation |
| `industry` | `profiles.industry` | `VARCHAR(100)` | `String` | e.g. "Information Technology", "Healthcare", "Banking" | Industry sector |
| `employer` | `profiles.employer` | `VARCHAR(200)` | `String` | e.g. "WSO2", "General Hospital", "Commercial Bank" | Current employer |
| `workLocation` | `profiles.work_location` | `VARCHAR(100)` | `String` | e.g. "Colombo", "Remote", "Dubai", "London" | Work location |
| `income` | `profiles.income_range` | `VARCHAR(50)` | `String` | e.g. "100k - 200k", "200k - 500k", "500k+" | Income bracket |
| `relocationWillingness`| `profiles.relocation_willingness`| `VARCHAR(30)`| `Enum (RelocationWillingness)` | `NOT_WILLING`, `WITHIN_CURRENT_AREA`, `WITHIN_SRI_LANKA`, `ANYWHERE_INCLUDING_ABROAD` | Relocation preference |

---

## 5. Physical Attributes

| Field Name | Entity / Column | DB Data Type | Java / API Type | Allowed Values / Format | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `height` | `profiles.height` | `INTEGER` | `Integer` | Height in cm (e.g. `165`, `178`) | Physical height |
| `bodyType` | `profiles.body_type` | `VARCHAR(30)` | `Enum (BodyType)` | `SLIM`, `ATHLETIC`, `AVERAGE`, `HEAVY` | Body build |
| `complexion`| `profiles.complexion` | `VARCHAR(30)` | `Enum (Complexion)` | `FAIR`, `MEDIUM`, `TAN`, `DARK` | Skin complexion |

---

## 6. Lifestyle Habits

| Field Name | Entity / Column | DB Data Type | Java / API Type | Allowed Values / Format | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `smoking` | `profiles.smoking` | `VARCHAR(30)` | `Enum (SmokingHabit)` | `NEVER`, `OCCASIONALLY`, `REGULARLY` | Smoking habit |
| `drinking` | `profiles.drinking` | `VARCHAR(30)` | `Enum (DrinkingHabit)`| `NEVER`, `OCCASIONALLY`, `SOCIALLY`, `REGULARLY` | Alcohol consumption |
| `dietaryPreferences` | `profiles.dietary_preferences` | `VARCHAR(30)` | `Enum (DietaryPreference)` | `VEGETARIAN`, `NON_VEGETARIAN`, `VEGAN`, `HALAL`, `EGGETARIAN` | Dietary preference |
| `healthHabits` | `profiles.health_habits` | `TEXT` | `String` | e.g. "Gym 3x a week, Weekend jogging" | Fitness routine |
| `lifestyle` | `profiles.lifestyle` | `TEXT` | `String` | General lifestyle overview | General lifestyle |

---

## 7. Bio, Interests & Personality

| Field Name | Entity / Column | DB Data Type | Java / API Type | Example / Format | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `about` | `profiles.about` | `TEXT` | `String` | Paragraph description | Self-written bio / summary |
| `interests` | `profiles.interests` | `JSONB` | `List<String>` | `["Traveling", "Photography", "Music", "Reading"]` | Hobbies and passions |
| `favoriteThings` | `profiles.favorite_things` | `JSONB` | `Map<String, String>` | `{"food": "Kottu", "movies": "Interstellar", "places": "Ella", "books": "..."}` | Favorite food, movies, books, places |
| `personalityTraits` | `profiles.personality_traits` | `VARCHAR(500)` | `String` | e.g. "Ambitious, Family-oriented, Calm, Outgoing" | Character traits |
| `travelPreferences` | `profiles.travel_preferences` | `TEXT` | `String` | e.g. "Nature trails, Beach stays, Cultural heritage trips" | Travel interests |

---

## 8. Partner Preferences & Dealbreakers

| Field Name | Entity / Column | DB Data Type | Java / API Type | Example / Format | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `partnerPreferences` | `profiles.partner_preferences` | `JSONB` | `Map<String, Object>` | `{"minAge": 24, "maxAge": 30, "minHeight": 155, "maxHeight": 185, "religion": "Buddhist", "educationLevel": "Bachelors"}` | Match filters & ideal partner expectations |
| `dealbreakers` | `profiles.dealbreakers` | `TEXT` | `String` | e.g. "Smoking, Heavy drinking, Dishonesty" | Non-negotiable preferences |

---

## 9. Media & Interactive Features

| Field Name | Entity / Column | DB Data Type | Java / API Type | Example / Format | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `primaryImageUrl` | `profiles.primary_image_url` | `VARCHAR(500)` | `String` | `https://media.sithum-dev.online/profiles/photo.jpg` | Main display photo |
| `profileImages` | `profiles.profile_images` | `TEXT (JSON List)` | `List<String>` | Array of photo URLs (Max 6) | Full photo gallery |
| `quizAnswers` | `profiles.quiz_answers` | `TEXT (JSON Map)` | `Map<String, String>` | `{"family_structure": "Nuclear family", "career_vs_family": "Balanced"}` | Compatibility quiz choices |

---

## 10. System Status, Verification & Analytics

| Field Name | Entity / Column | DB Data Type | Java / API Type | Default | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `completionScore` | `profiles.completion_score` | `INTEGER` | `Integer` | `0` | Calculated profile completeness (0 - 100%) |
| `idVerified` | `profiles.id_verified` | `BOOLEAN` | `boolean` | `false` | Government ID verification status |
| `verificationStatus` | `profiles.verification_status`| `TEXT (JSON Map)` | `Map<String, Boolean>` | `{}` | Detailed step-by-step verification checklist |
| `isBoosted` | `profiles.is_boosted` | `BOOLEAN` | `boolean` | `false` | Profile spotlight / boost status |
| `boostExpiresAt` | `profiles.boost_expires_at` | `TIMESTAMP` | `LocalDateTime` | `null` | When profile boost expires |
| `profileViews` | `profiles.profile_views` | `INTEGER` | `Integer` | `0` | View count |
| `lastActiveAt` | `profiles.last_active_at` | `TIMESTAMP` | `LocalDateTime` | `now()` | Last user activity timestamp |
| `visible` | `profiles.is_visible` | `BOOLEAN` | `boolean` | `true` | Privacy toggle (hide profile from search) |
| `isDeleted` | `profiles.is_deleted` | `BOOLEAN` | `boolean` | `false` | Soft deletion flag |
| `createdAt` | `profiles.created_at` | `TIMESTAMP` | `LocalDateTime` | `now()` | Record creation timestamp |
| `updatedAt` | `profiles.updated_at` | `TIMESTAMP` | `LocalDateTime` | `now()` | Record last update timestamp |

---

## 11. Frontend Web Profile Creation Wizard (Step-by-Step UI Breakdown)

The web frontend (`srimatch-web/src/views/ProfileCreationPage.tsx`) presents an **8-Step Luxury Wizard** with real-time auto-saving to `localStorage` (`profileDraft`), image staging/preview, and dynamic completion scoring (0 - 100%).

### 📋 Step 1: Basic Info & Profile Photos
* **Profile Photos** (`profileImages`):
  * Up to 6 photo upload slots with instant local preview (`pendingImages`).
  * Image validation (JPEG, PNG, JPG, WEBP, max 5 MB, dimension checking).
  * Set primary photo badge & re-order / delete controls.
  * Uploaded automatically to backend / storage on final submission via `ProfileService.uploadProfileImage()`.
* **First Name** (`firstName`): Read-only prefilled from account registration (`pc-input-readonly`).
* **Last Name** (`lastName`): Read-only prefilled from account registration (`pc-input-readonly`).
* **Gender** (`gender`): Selection button group: `Male` (`male`), `Female` (`female`), `Other` (`other`).
* **Date of Birth** (`dateOfBirth`): Calendar Date picker input (`YYYY-MM-DD`, max 18 years prior), automatically computes and displays live age badge.
* **Marital Status** (`maritalStatus`): Dropdown options (`Never Married`, `Divorced`, `Widowed`, `Separated`, `Annulled`).
* **Do you have children?** (`hasChildren`): Boolean select (`Yes` / `No`).
* **Number of Children** (`numberOfChildren`): Numeric input (`1` to `20`, enabled only if `hasChildren` is `true`).

---

### 📍 Step 2: Location & Cultural Background
* **City / Current Town** (`city`): Searchable dropdown powered by `CitySearchDropdown` component (supports Sri Lankan cities and overseas locations). Required field.
* **Ethnicity** (`ethnicity`): Dropdown options (`Sinhalese`, `Tamil`, `Moor`, `Burgher`, `Malay`, `Other`).
* **Religion** (`religion`): Dropdown options (`Buddhist`, `Hindu`, `Muslim`, `Christian`, `Catholic`, `No Religion`, `Other`). Required field.
* **Religious Practices** (`religiousPractices`): Text area (e.g. "Daily prayers, regular temple visits", "Vegetarian on Poya days").
* **Languages Spoken** (`languages`): Multi-select pill chips (up to 5): `Sinhala`, `Tamil`, `English`, `French`, `German`, `Japanese`, `Arabic`.

---

### 🎓 Step 3: Education & Career
* **Education Level** (`education`): Dropdown options (`High School`, `Diploma`, `Bachelors`, `Masters`, `Doctorate`, `Professional Certification`, `Other`). Required field.
* **Field of Study** (`fieldOfStudy`): Free-text input (e.g. "Computer Science", "Medicine", "Civil Engineering").
* **Profession** (`profession`): Free-text input (e.g. "Software Engineer", "Doctor", "Accountant"). Required field.
* **Industry** (`industry`): Dropdown options (`Technology`, `Healthcare`, `Finance`, `Education`, `Engineering`, `Arts`, `Government`, `Other`).
* **Employer** (`employer`): Free-text input (e.g. Company name).
* **Work Location** (`workLocation`): Free-text input (e.g. "Colombo", "Remote", "London").
* **Monthly Income Range (LKR)** (`income`): Dropdown options (`Less than 50k`, `50k - 100k`, `100k - 200k`, `200k - 500k`, `Above 500k`). Note: Used for matching only, never shown publicly.
* **Relocation Willingness** (`relocationWillingness`): Dropdown options:
  * `NOT_WILLING`: "Not willing to relocate"
  * `WITHIN_DISTRICT`: "Within current area"
  * `WITHIN_SRI_LANKA`: "Within Sri Lanka"
  * `ANYWHERE`: "Anywhere (including abroad)"

---

### 🏃 Step 4: Lifestyle & Physical Attributes
* **Height (cm)** (`height`): Numeric input range 140 - 220 cm (e.g. `170`).
* **Body Type** (`bodyType`): Dropdown options (`Slim`, `Athletic`, `Average`, `Overweight`, `Plus Size`, `Muscular`).
* **Complexion** (`complexion`): Dropdown options (`Fair`, `Wheatish`, `Medium`, `Dusky`, `Dark`).
* **Smoking Habits** (`smoking`): Dropdown options (`Never`, `Occasionally`, `Regularly`, `Trying to Quit`).
* **Drinking Habits** (`drinking`): Dropdown options (`Never`, `Socially`, `Occasionally`, `Regularly`).
* **Dietary Preferences** (`dietaryPreferences`): Dropdown options (`Vegetarian`, `Vegan`, `Non Vegetarian`, `Pescatarian`, `No Preference`).
* **Lifestyle & Fitness** (`healthHabits`): Text area (e.g. "Regular gym, yoga, balanced diet, evening walks").
* **Daily Lifestyle** (`lifestyle`): Text area describing daily routines and hobbies.

---

### 🏡 Step 5: Cultural & Family Heritage
* **Family Type** (`familyType`): Dropdown options:
  * `NUCLEAR`: "Nuclear Family"
  * `EXTENDED`: "Extended Family"
* **Family Background** (`familyBackground`): Text area describing parents' background, professions, siblings (e.g. "Father is a businessman, mother a teacher...").
* **Cultural Values & Traditions** (`culturalValues`): Text area describing traditions, cultural customs (e.g. "Respecting elders, celebrating Sinhala New Year...").
* **Family Involvement in Married Life** (`familyInvolvement`): Text area describing preferred family involvement in decisions.
* **Wedding Preferences** (`weddingPreferences`): Text area describing wedding style (e.g. "Traditional ceremony, intimate civil wedding, destination wedding").

---

### 💖 Step 6: About You, Interests & Compatibility Quiz
* **About Me (Bio)** (`about`): Multi-line rich text area (recommended > 50 characters). Required field.
* **Interests & Hobbies** (`interests`): Multi-select tag chips with icons (min 3, max 10):
  * `Music`, `Travel`, `Photography`, `Reading`, `Movies`, `Gaming`, `Cooking`, `Sports`, `Yoga`, `Dancing`.
* **Favourite Food** (`favoriteThings.food`): Free-text input (e.g. "Rice and curry", "Kottu", "Italian").
* **Favourite Movies / Shows** (`favoriteThings.movies`): Free-text input (e.g. "Drama, documentaries", "Sci-Fi").
* **Travel Preferences** (`travelPreferences`): Text area describing travel destinations and style.
* **Personality Traits** (`personalityTraits`): Free-text input (e.g. "Patient, ambitious, humorous, caring").
* **Compatibility Quiz (Optional - 25 Questions in 10 Categories)** (`quizAnswers`):
  * **🌍 Values & Beliefs**:
    * `religion_importance`: "How important is religion in your life?" (`Very Important`, `Somewhat Important`, `Not Important`)
    * `religion_partner`: "Should your partner follow your religion?" (`Must`, `Preferred`, `Not necessary`)
    * `cultural_values`: "How important are cultural traditions?" (`Very Important`, `Moderate`, `Not Important`)
    * `political_views`: "Do political views matter in a relationship?" (`Very Important`, `Somewhat`, `Not Important`)
  * **💍 Relationship Goals**:
    * `relationship_goal`: "What are you looking for?" (`Marriage`, `Serious relationship`, `Friendship first`, `Not sure`)
    * `marriage_timeline`: "When do you plan to get married?" (`Soon`, `1-2 years`, `3+ years`, `Not sure`)
    * `long_distance`: "Are you open to long-distance relationships?" (`Yes`, `Maybe`, `No`)
  * **🏡 Family & Lifestyle**:
    * `family_size`: "What's your ideal family size?" (`1–2 children`, `3+ children`, `No children`, `Open`)
    * `living_arrangement`: "Preferred living arrangement after marriage?" (`With family`, `Nuclear`, `Close to parents`, `Open`)
    * `family_involvement`: "How involved should families be in your relationship?" (`Very involved`, `Moderate`, `Minimal`)
  * **💼 Career & Money**:
    * `career_priority`: "How important is career in your life?" (`Very Important`, `Balanced`, `Less Important`)
    * `partner_work`: "Should both partners work?" (`Yes`, `Optional`, `Prefer one works`)
    * `financial_management`: "How should finances be handled?" (`Shared`, `Separate`, `Mixed`)
  * **📍 Location & Future**:
    * `relocation`: "Would you consider relocating?" (`Anywhere`, `Sri Lanka only`, `Maybe`, `No`)
    * `abroad_plans`: "Do you plan to migrate abroad?" (`Yes`, `Maybe`, `No`)
  * **❤️ Personality & Lifestyle**:
    * `social_type`: "Are you more introverted or extroverted?" (`Introvert`, `Extrovert`, `Ambivert`)
    * `free_time`: "How do you prefer to spend free time?" (`At home`, `Outdoor`, `Social events`, `Mixed`)
    * `travel_interest`: "How important is travel to you?" (`Very Important`, `Sometimes`, `Not Important`)
  * **🚬 Habits**:
    * `smoking`: "Do you smoke?" (`Yes`, `Occasionally`, `No`)
    * `partner_smoking`: "Are you okay with a partner who smokes?" (`Yes`, `No`, `Depends`)
    * `drinking`: "Do you drink alcohol?" (`Yes`, `Occasionally`, `No`)
    * `partner_drinking`: "Are you okay with a partner who drinks?" (`Yes`, `No`, `Depends`)
  * **💞 Relationship Style**:
    * `love_language`: "What is your love language?" (`Words`, `Actions`, `Gifts`, `Time`, `Touch`)
    * `conflict_resolution`: "How do you handle conflicts?" (`Talk immediately`, `Take time then talk`, `Avoid conflict`)
    * `jealousy`: "How do you feel about jealousy in a relationship?" (`Normal`, `Sometimes`, `Not acceptable`)
  * **🧒 Children & Responsibility**:
    * `children_importance`: "How important is having children?" (`Very Important`, `Optional`, `Not Important`)
    * `parenting_style`: "Preferred parenting style?" (`Strict`, `Balanced`, `Relaxed`)
  * **📱 Modern Factors**:
    * `social_media`: "How active are you on social media?" (`Very active`, `Moderate`, `Not active`)
    * `privacy_level`: "How private are you?" (`Very private`, `Moderate`, `Open`)

---

### ⭐ Step 7: Partner Preferences & Dealbreakers
* **Partner Age Range** (`partnerPreferences.ageRange`): Dual slider inputs range `[min, max]` (18 to 60 years).
* **Partner Height Range** (`partnerPreferences.heightPreference`): Dual slider inputs range `[min, max]` (140 to 220 cm).
* **Location Preference** (`partnerPreferences.locationPreference`): Searchable dropdown with "Open to all" support.
* **Min. Education Level** (`partnerPreferences.educationLevel`): Dropdown options (`HIGH_SCHOOL`, `DIPLOMA`, `BACHELORS`, `MASTERS`, `DOCTORATE`, `PROFESSIONAL_CERTIFICATION`, `OTHER`, or No preference).
* **Religion Preference** (`partnerPreferences.religionPreference`): Dropdown options (`BUDDHIST`, `HINDU`, `MUSLIM`, `CHRISTIAN`, `CATHOLIC`, `NO_RELIGION`, `OTHER`, or No preference).
* **Preferred Gender** (`partnerPreferences.preferredGender`): Dropdown options (`MALE`, `FEMALE`, `OTHER`, or No preference).
* **Marital Status Preference** (`partnerPreferences.maritalStatusPreference`): Dropdown options (`NEVER_MARRIED`, `DIVORCED`, `WIDOWED`, `SEPARATED`, `ANNULLED`, or No preference).
* **Lifestyle Compatibility** (`partnerPreferences.lifestyleCompatibility`): Text area (e.g. "Health-conscious, non-smoker, active lifestyle").
* **Dealbreakers** (`dealbreakers`): Text area for non-negotiable partner criteria (e.g. "Smoking, dishonesty").

---

### ✅ Step 8: Review & Complete Profile
* **Profile Completeness Score (0 - 100%)**:
  * Photos: +10 pts (remote or pending)
  * About bio (> 50 chars): +10 pts
  * Interests (≥ 3): +10 pts
  * Education: +8 pts
  * Profession: +8 pts
  * Religion: +8 pts
  * Partner Preferences (any set): +10 pts
  * First Name: +5 pts
  * Gender: +5 pts
  * Date of Birth: +5 pts
  * City: +10 pts
  * Marital Status: +6 pts
* **Live Interactive Profile Preview Modal**: Floating Action Button (FAB) allowing real-time preview of how the profile appears to other users.
* **Section-by-Section Review**:
  * 1. Basic Information & Location
  * 2. Education & Career
  * 3. Physical & Lifestyle
  * 4. Cultural & Family Background
  * 5. About Me & Interests
  * 6. Partner Preferences & Dealbreakers
  * 7. Compatibility Quiz (if completed)
* **Auto-Save Draft & Resume**: Automatically syncs draft to `localStorage.profileDraft` every 3 seconds. Detects incomplete draft on load with 7-day validity.
* **Submission Flow**:
  1. Maps form values to uppercase backend ENUMs via `mapEnum()`.
  2. Sends profile data via `updateUserProfile(formattedData)`.
  3. Sequentially uploads all pending staged images via `ProfileService.uploadProfileImage()`.
  4. Clears draft from `localStorage` and navigates to `/home`.

---

## 12. Example Complete JSON Profile Payload

```json
{
  "firstName": "Kasun",
  "lastName": "Perera",
  "gender": "MALE",
  "dateOfBirth": "1996-08-20",
  "maritalStatus": "NEVER_MARRIED",
  "hasChildren": false,
  "numberOfChildren": 0,
  "city": "Colombo",
  "religion": "BUDDHIST",
  "religiousPractices": "Temple visits on Poya days",
  "ethnicity": "SINHALESE",
  "languages": ["Sinhala", "English"],
  "familyType": "NUCLEAR",
  "familyBackground": "Father is a retired engineer, mother is a teacher.",
  "culturalValues": "Moderate traditional values",
  "weddingPreferences": "Poruwa ceremony with close family",
  "education": "BACHELORS",
  "fieldOfStudy": "Software Engineering",
  "profession": "Senior Software Engineer",
  "industry": "Technology",
  "employer": "Tech Solutions PLC",
  "workLocation": "Colombo",
  "income": "200k - 500k",
  "relocationWillingness": "WITHIN_SRI_LANKA",
  "height": 178,
  "bodyType": "ATHLETIC",
  "complexion": "FAIR",
  "smoking": "NEVER",
  "drinking": "SOCIALLY",
  "dietaryPreferences": "NON_VEGETARIAN",
  "healthHabits": "Gym workouts 4 days a week",
  "about": "Passionate about software architecture, photography, and hiking in Sri Lanka.",
  "interests": ["Traveling", "Photography", "Badminton", "Tech"],
  "personalityTraits": "Ambitious, Calm, Friendly",
  "favoriteThings": {
    "food": "Kottu Roti",
    "movies": "Interstellar",
    "places": "Ella, Nuwara Eliya",
    "books": "Sapiens"
  },
  "partnerPreferences": {
    "minAge": 23,
    "maxAge": 28,
    "minHeight": 155,
    "maxHeight": 175,
    "religion": "BUDDHIST",
    "educationLevel": "BACHELORS",
    "maritalStatus": "NEVER_MARRIED"
  },
  "dealbreakers": "Smoking, Lack of family values",
  "primaryImageUrl": "https://media.sithum-dev.online/profiles/kasun.jpg",
  "profileImages": [
    "https://media.sithum-dev.online/profiles/kasun_1.jpg",
    "https://media.sithum-dev.online/profiles/kasun_2.jpg"
  ],
  "quizAnswers": {
    "religion_importance": "Somewhat Important",
    "relationship_goal": "Marriage",
    "marriage_timeline": "1-2 years",
    "family_size": "1–2 children",
    "financial_management": "Shared",
    "love_language": "Actions"
  }
}
```

---

## 13. Profile Details Page (Web & Mobile Display Specification)

The profile details page (`srimatch-web/src/views/UserProfilePage.tsx` and `srimatch-app/src/app/profile/[id].tsx`) presents the complete public-facing view of a user's matrimonial profile, organized into interactive galleries, status badges, and tabbed cards.

### 🌟 1. Hero & Media Showcase
* **Photo Carousel / Slider** (`profileImages` / `primaryImageUrl`):
  * Multi-image swiping carousel with dot indicators and photo counter (`e.g., 1/4`).
  * Interactive Full-Screen Image Lightbox / Modal for high-res inspection.
  * Gradient overlay for high-contrast typography.
* **Identity Header**:
  * **Full Name** (`firstName` + `lastName`): Formatted with Cormorant Garamond / bold typography.
  * **Age & Location** (`age` + `city`): Dynamic age computed from `dateOfBirth` + city badge.
  * **Profession** (`profession`): Displayed alongside location in the hero subline.
* **Badges & Statuses**:
  * 🛡️ **ID Verified Badge** (`idVerified`): Displayed when government ID verification has passed.
  * ⚡ **Spotlight / Boosted Badge** (`isBoosted`): Displayed when profile is actively boosted in search.
  * 💖 **Compatibility Score Gauge** (`compatibilityScore` / `matchPct`): Circular animated percentage gauge based on algorithm matching.
* **Action Bar & Engagement**:
  * 🤍 / 💖 **Like Button** (`NORMAL` like toggle).
  * ⭐ **Super-Like / Star Button** (`STAR` super-like toggle).
  * 🤝 **Connect / Match Request Button** (`PENDING`, `ACCEPTED`).
  * 💬 **Send Message Button**: Direct entry point to 1-on-1 chat (`/chat/[matchId]`) when matched.
  * 🚩 **Report Profile Button**: Modal dialog offering safety reporting options (`INAPPROPRIATE_CONTENT`, `FAKE_PROFILE`, `SCAM_OR_FRAUD`).

---

### 📝 2. Tab: About Me
* **Introductory Bio** (`about`): Rich text / sanitized HTML paragraph sharing the member's personal story and goals.
* **Basic Information Grid**:
  * **Age**: `X years` (computed from `dateOfBirth`).
  * **Marital Status**: Capitalized title (`Never Married`, `Divorced`, `Widowed`, `Separated`).
  * **Gender**: `Male`, `Female`, `Other`.
  * **Height**: `XXX cm`.
  * **Body Type**: `Slim`, `Athletic`, `Average`, `Overweight`, `Plus Size`, `Muscular`.
  * **Ethnicity**: `Sinhalese`, `Tamil`, `Moor`, `Burgher`, `Malay`, `Other`.
  * **Children Status**: `No children` or `X child(ren)` (`hasChildren` + `numberOfChildren`).
* **Location**:
  * **Current City / Town**: `city`.

---

### 🏛️ 3. Tab: Religion, Culture & Family Heritage
* **Religion & Beliefs**:
  * **Religion**: `Buddhist`, `Hindu`, `Muslim`, `Christian`, `Catholic`, `No Religion`, `Other`.
  * **Religious Practices**: `religiousPractices` (e.g., "Daily prayers, regular temple visits").
  * **Cultural Values**: `culturalValues` (e.g., "Moderate traditional values").
* **Family & Heritage**:
  * **Family Background**: `familyBackground` (Parents' careers, siblings, ancestral roots).
  * **Family Type**: `Nuclear Family` (`NUCLEAR`) or `Extended Family` (`EXTENDED`).
  * **Relocation Willingness**: `relocationWillingness` ("Within current area", "Within Sri Lanka", "Anywhere (including abroad)", "Not willing").
  * **Wedding Preferences**: `weddingPreferences` (Ceremony traditions, Poruwa preferences, reception style).
* **Languages**:
  * **Languages Spoken**: `languages` displayed as individual colored pill badges (`Sinhala`, `Tamil`, `English`, etc.).

---

### 🎓 4. Tab: Education & Career
* **Highest Education**: `education` / `educationLevel` (`High School`, `Diploma`, `Bachelors`, `Masters`, `Doctorate`, `Professional Certification`, `Other`).
* **Field of Study**: `fieldOfStudy` (Degree / Major specialization).
* **Profession / Designation**: `profession` (Current job title).
* **Industry Sector**: `industry` (Sector classification).
* **Employer / Organization**: `employer` (Company / workplace name).
* **Work Location**: `workLocation` (City or Remote).
* *(Note: `income` is kept private and never displayed on public profile details).*

---

### 🌿 5. Tab: Lifestyle & Health
* **Physical & Habits Grid**:
  * **Complexion**: `Fair`, `Wheatish`, `Medium`, `Dusky`, `Dark`.
  * **Height**: `XXX cm`.
  * **Smoking Habit**: `Never`, `Occasionally`, `Regularly`, `Trying to Quit`.
  * **Drinking Habit**: `Never`, `Socially`, `Occasionally`, `Regularly`.
  * **Dietary Preferences**: `Vegetarian`, `Vegan`, `Non Vegetarian`, `Pescatarian`, `No Preference`.
  * **Health & Fitness**: `healthHabits` (Gym, yoga, sports, dietary routines).
* **Daily Lifestyle**:
  * **Lifestyle Narrative**: `lifestyle` (Overview of work-life balance, morning routines, weekend activities).

---

### 🎨 6. Tab: Interests, Personality & Favourites
* **Interests & Passions**:
  * `interests`: Displayed as individual badge chips with custom icons (🎵 `Music`, ✈️ `Travel`, 📷 `Photography`, 📖 `Reading`, 🎬 `Movies`, 🎮 `Gaming`, ☕ `Cooking`, 🏋️ `Sports`, 🧘 `Yoga`, 😊 `Dancing`).
* **Personality & Travel**:
  * **Personality Traits**: `personalityTraits` (Key adjectives describing temperament and character).
  * **Travel Preferences**: `travelPreferences` (Favorite travel style, holiday types, bucket list).
* **Favourite Things**:
  * `favoriteThings`: Rendered as key-value metadata cards (`food`, `movies`, `books`, `places`, etc.).

---

### ⚡ 7. Tab: Compatibility & Quiz Answers
* **Compatibility Hero Banner**:
  * Large circular gauge displaying algorithm matching score (`0% - 100%`).
  * Summary text detailing alignment on lifestyle, goals, and values.
* **25 Compatibility Quiz Questions & Responses**:
  * Grouped into 10 categories (Values & Beliefs, Relationship Goals, Family & Lifestyle, Career & Money, Location & Future, Personality & Lifestyle, Habits, Relationship Style, Children, Modern Factors).
  * Displays the viewed user's response alongside mutual agreement indicator (`✓ Mutual`) when matching the logged-in viewer's answer.

---

### 🎯 8. Tab: Partner Preferences & Dealbreakers
* **Partner Search Criteria** (`partnerPreferences`):
  * **Age Range**: `minAge` – `maxAge` years (e.g. `23 – 28 years`).
  * **Height Range**: `minHeight` – `maxHeight` cm (e.g. `155 – 175 cm`).
  * **Location Preference**: `locationPreference` (Preferred city or "Open to all").
  * **Minimum Education**: `educationLevel` (`High School`, `Diploma`, `Bachelors`, `Masters`, `Doctorate`, etc.).
  * **Religion Preference**: `religionPreference`.
  * **Gender Preference**: `preferredGender`.
  * **Marital Status Preference**: `maritalStatusPreference`.
  * **Lifestyle Compatibility**: `lifestyleCompatibility`.
* **Dealbreakers** (`dealbreakers`):
  * Non-negotiable partner criteria and absolute boundaries.

---

## 14. My Profile & Profile Edit Management Schema (Web & Mobile)

The **My Profile & Profile Edit** interfaces (`srimatch-web/src/views/MyProfilePage.tsx` and `srimatch-app/src/app/edit-profile.tsx`) allow users to view, manage, and update their profile details in real-time.

### 🖼️ 1. Profile Header & Cover Management
* **Adaptive Cover Collage** (`profileImages`):
  * Dynamically arranges uploaded photos into a multi-tile hero collage (1 to 6 photos with a `+N more` badge if exceeding visible limits).
  * Quick photo upload action button.
* **Avatar & Core Identity**:
  * Profile avatar image with primary badge.
  * Direct camera button for quick avatar changes (`ProfileService.uploadProfileImage()`).
  * Full Name (`firstName`, `lastName`).
  * Sub-header metadata (`city`, `profession`, dynamic `age` in years).
  * Quick links: **Settings** (`/settings`) and **Edit Profile** modal/mode.

---

### 📋 2. Section 1: Basic Information / Personal Details
* **First Name** (`firstName`): Text input (editable).
* **Last Name** (`lastName`): Text input (editable).
* **Date of Birth** (`dateOfBirth`): Calendar Date input (`YYYY-MM-DD`). Automatically updates profile age.
* **Gender** (`gender`): Select dropdown: `MALE`, `FEMALE`, `OTHER`.
* **Marital Status** (`maritalStatus`): Select dropdown: `NEVER_MARRIED`, `DIVORCED`, `WIDOWED`, `SEPARATED`, `ANNULLED`.
* **Children Status** (`hasChildren`): Select dropdown (`Yes` / `No`).
* **Number of Children** (`numberOfChildren`): Numeric counter input (1 to 20, enabled only when `hasChildren` is `true`).

---

### 📍 3. Section 2: Location & Background / Where You Live
* **City / Current Town** (`city`): Searchable dropdown powered by `CitySearchDropdown` (required field).
* **Ethnicity** (`ethnicity`): Select dropdown: `SINHALESE`, `TAMIL`, `MOOR`, `BURGHER`, `MALAY`, `OTHER`.
* **Religion** (`religion`): Select dropdown: `BUDDHIST`, `HINDU`, `MUSLIM`, `CHRISTIAN`, `CATHOLIC`, `NO_RELIGION`, `OTHER`.
* **Religious Practices** (`religiousPractices`): Text area (e.g., "Regular temple visits, daily prayers, vegetarian on Poya").
* **Languages Spoken** (`languages`): Interactive chip picker allowing selection / unselection of fluent languages (`Sinhala`, `Tamil`, `English`, `French`, `German`, `Japanese`, `Arabic`).

---

### 🎓 4. Section 3: Education & Career / Professional Background
* **Education Level** (`education` / `educationLevel`): Select dropdown: `HIGH_SCHOOL`, `DIPLOMA`, `BACHELORS`, `MASTERS`, `DOCTORATE`, `PROFESSIONAL_CERTIFICATION`, `OTHER`.
* **Field of Study** (`fieldOfStudy`): Text input (e.g., "Computer Science", "Finance", "Civil Engineering").
* **Profession / Job Title** (`profession`): Text input (e.g., "Senior Software Engineer", "Doctor", "Lecturer").
* **Industry Sector** (`industry`): Select dropdown (`Technology`, `Healthcare`, `Finance`, `Education`, `Engineering`, `Arts`, `Government`, `Other`).
* **Employer / Organization** (`employer`): Text input (e.g., "ABC Company", "Ministry of Health").
* **Work Location** (`workLocation`): Text input (e.g., "Colombo", "Remote", "London").
* **Monthly Income Range (LKR)** (`income`): Select dropdown (`Less than 50k`, `50k - 100k`, `100k - 200k`, `200k - 500k`, `Above 500k`). Note: Kept strictly confidential, used solely for algorithm matching.
* **Relocation Willingness** (`relocationWillingness`): Select dropdown:
  * `NOT_WILLING`: "Not willing to relocate"
  * `WITHIN_DISTRICT`: "Within current area"
  * `WITHIN_SRI_LANKA`: "Within Sri Lanka"
  * `ANYWHERE`: "Anywhere (including abroad)"

---

### 🏃 5. Section 4: Physical Appearance & Lifestyle
* **Height (cm)** (`height`): Numeric input (140 to 220 cm).
* **Body Type** (`bodyType`): Select dropdown: `SLIM`, `ATHLETIC`, `AVERAGE`, `OVERWEIGHT`, `PLUS_SIZE`, `MUSCULAR`.
* **Complexion** (`complexion`): Select dropdown: `FAIR`, `WHEATISH`, `MEDIUM`, `DUSKY`, `DARK`.
* **Smoking Habits** (`smoking`): Select dropdown: `NEVER`, `OCCASIONALLY`, `REGULARLY`, `TRYING_TO_QUIT`.
* **Drinking Habits** (`drinking`): Select dropdown: `NEVER`, `SOCIALLY`, `OCCASIONALLY`, `REGULARLY`.
* **Dietary Preferences** (`dietaryPreferences`): Select dropdown: `VEGETARIAN`, `VEGAN`, `NON_VEGETARIAN`, `PESCATARIAN`, `NO_PREFERENCE`.
* **Health & Fitness Habits** (`healthHabits`): Text area describing exercise, sports, and fitness routines.
* **Daily Lifestyle Overview** (`lifestyle`): Text area describing general lifestyle and daily routines.

---

### 🏡 6. Section 5: Cultural & Family Heritage
* **Family Type** (`familyType`): Select dropdown: `NUCLEAR` ("Nuclear Family"), `EXTENDED` ("Extended Family").
* **Family Background** (`familyBackground`): Text area describing parents' professions, siblings, family traditions.
* **Cultural Values** (`culturalValues`): Text area describing family beliefs and traditional outlook.
* **Family Involvement** (`familyInvolvement`): Text area describing desired family involvement in matrimonial decisions.
* **Wedding Preferences** (`weddingPreferences`): Text area describing wedding style preferences.

---

### 💖 7. Section 6: About Me, Interests & Favourites
* **About Me (Bio)** (`about`): Rich text area for personal biography.
* **Interests & Hobbies** (`interests`): Chip picker allowing multi-selection of interests: `Music`, `Travel`, `Photography`, `Reading`, `Movies`, `Gaming`, `Cooking`, `Sports`, `Yoga`, `Dancing`.
* **Favourite Food** (`favoriteThings.food`): Text input.
* **Favourite Movies / Shows** (`favoriteThings.movies`): Text input.
* **Travel Preferences** (`travelPreferences`): Text area describing travel destinations and holiday preferences.
* **Personality Traits** (`personalityTraits`): Text input (e.g., "Patient, kind, organised, ambitious").

---

### 📸 8. Section 7: Photo Gallery Management
* **Upload New Photo**: Image picker with client-side compression (`compressImage`), supporting JPG, PNG, WEBP (Max 5 MB).
* **Set Primary Photo**: ⭐ Star button to designate main search/display photo (`ProfileService.setPrimaryImage()`).
* **Delete Photo**: ✕ Remove button with confirmation dialog (`ProfileService.deleteImage()`).
* **Maximum Capacity**: Up to 6 active profile photos.

---

### 🎯 9. Section 8: Partner Preferences & Future Goals
* **Partner Age Range** (`partnerPreferences.ageRange`): Dual interactive range sliders (Min / Max: 18 - 60 years).
* **Partner Height Range** (`partnerPreferences.heightPreference`): Dual interactive range sliders (Min / Max: 140 - 220 cm).
* **Location Preference** (`partnerPreferences.locationPreference`): Searchable dropdown with "Open to all" support.
* **Minimum Education** (`partnerPreferences.educationLevel`): Select dropdown (`High School`, `Diploma`, `Bachelors`, `Masters`, `Doctorate`, etc., or No preference).
* **Religion Preference** (`partnerPreferences.religionPreference`): Select dropdown (or No preference).
* **Preferred Gender** (`partnerPreferences.preferredGender`): Select dropdown (`Male`, `Female`, `Other`, or No preference).
* **Marital Status Preference** (`partnerPreferences.maritalStatusPreference`): Select dropdown (or No preference).
* **Lifestyle Compatibility** (`partnerPreferences.lifestyleCompatibility`): Text area describing ideal partner lifestyle.
* **Dealbreakers** (`dealbreakers`): Text area for absolute non-negotiable partner criteria.
* **Future Aspirations** (`futureAspirations`): Text area describing long-term goals and family plans.

---

### ⚡ 10. Section 9: Compatibility Quiz Editor
* **Interactive Quiz Editor**: Allows modifying answers across all 25 compatibility questions in 10 categories (Values & Beliefs, Relationship Goals, Family & Lifestyle, Career & Money, Location & Future, Personality & Lifestyle, Habits, Relationship Style, Children, Modern Factors).
* Real-time recalculation of mutual compatibility scores against other candidate profiles.

---

### 🔒 11. Section 10: Privacy & Visibility Controls (Web)
* **Profile Visibility**:
  * `Who can see my profile`: Options (`Everyone`, `Only members I like`, `Only matched members`).
  * `Show my online status`: Boolean toggle switch.
  * `Show my location`: Boolean toggle switch.
* **Communication Privacy**:
  * `Who can message me`: Options (`Everyone`, `Only members I like`, `Only matched members`).
  * `Read receipts`: Boolean toggle switch.
  * `Show when I'm typing`: Boolean toggle switch.
* **Information Privacy**:
  * `Show my income range`: Boolean toggle switch (Default: `false`).
  * `Show family details`: Boolean toggle switch (Default: `true`).

---

## 15. Mobile App Profile Creation Wizard (Step-by-Step Native App Specification)

The native mobile app (`srimatch-app/src/app/(auth)/profile-creation.tsx`) guides newly registered users through an **8-Step Mobile Setup Flow** with client-side image staging, interactive date picker modals, dynamic age feedback, and Sri Lankan district selectors.

### 📱 1. Step 1: Basic Info & Profile Photos
* **Profile Photos** (`profileImages`):
  * Up to 6 photo slots using native `ImagePicker.launchImageLibraryAsync()`.
  * Remote and pending local photo preview tiles.
  * Primary badge on first image slot + individual delete action buttons.
  * Uploaded via multipart `FormData` (`ProfileService.uploadProfileImage()`) upon profile creation.
* **First Name** (`firstName`): Native text input (`CustomInput`).
* **Last Name** (`lastName`): Native text input (`CustomInput`).
* **Gender** (`gender`): Native button group (`Male`, `Female`, `Other`).
* **Date of Birth** (`dateOfBirth`): Interactive `DatePickerModal` card (`YYYY-MM-DD`) displaying dynamic formatted birth date (`e.g., Aug 20, 1996`) and live age pill (`e.g., 28 Years Old`).
* **Marital Status** (`maritalStatus`): Horizontal chip selector (`Never Married`, `Divorced`, `Widowed`, `Separated`, `Annulled`).

---

### 📍 2. Step 2: Location & Heritage
* **District** (`district`): Horizontal scrolling chip selector containing all 25 Sri Lankan districts:
  * `Ampara`, `Anuradhapura`, `Badulla`, `Batticaloa`, `Colombo`, `Galle`, `Gampaha`, `Hambantota`, `Jaffna`, `Kalutara`, `Kandy`, `Kegalle`, `Kilinochchi`, `Kurunegala`, `Mannar`, `Matale`, `Matara`, `Moneragala`, `Mullaitivu`, `Nuwara Eliya`, `Polonnaruwa`, `Puttalam`, `Ratnapura`, `Trincomalee`, `Vavuniya`.
* **City / Town** (`city`): Native text input (`CustomInput`, e.g., "Colombo 03", "Dehiwala", "Kandy").
* **Religion** (`religion`): Chip selector (`Buddhist`, `Hindu`, `Muslim`, `Christian`, `Catholic`, `No Religion`, `Other`).
* **Ethnicity** (`ethnicity`): Chip selector (`Sinhalese`, `Tamil`, `Moor`, `Burgher`, `Malay`, `Other`).
* **Languages Spoken** (`languages`): Multi-select chip selector (up to 5: `Sinhala`, `Tamil`, `English`, `French`, `German`, `Japanese`, `Arabic`).

---

### 🎓 3. Step 3: Career & Education
* **Education Level** (`education`): Chip selector (`High School`, `Diploma`, `Bachelors`, `Masters`, `Doctorate`, `Professional Certification`, `Other`).
* **Field of Study** (`fieldOfStudy`): Native text input (e.g., "Computer Science", "Medicine", "Law").
* **Profession / Job Title** (`profession`): Native text input (e.g., "Software Engineer", "Doctor", "Accountant").
* **Industry Sector** (`industry`): Chip selector (`Technology`, `Healthcare`, `Finance`, `Education`, `Engineering`, `Arts`, `Government`, `Other`).
* **Employer / Company** (`employer`): Native text input (e.g., "WSO2", "Commercial Bank").
* **Monthly Income Range (LKR)** (`income`): Chip selector (`Less than 50k`, `50k - 100k`, `100k - 200k`, `200k - 500k`, `Above 500k`).

---

### 🏃 4. Step 4: Lifestyle & Appearance
* **Height (cm)** (`height`): Numeric keyboard input (e.g., `168`, `175`).
* **Body Type** (`bodyType`): Chip selector (`Slim`, `Athletic`, `Average`, `Overweight`, `Plus Size`, `Muscular`).
* **Complexion** (`complexion`): Chip selector (`Fair`, `Wheatish`, `Medium`, `Dusky`, `Dark`).
* **Dietary Preference** (`dietaryPreferences`): Chip selector (`Vegetarian`, `Vegan`, `Non Vegetarian`, `Pescatarian`, `No Preference`).
* **Smoking Habits** (`smoking`): Chip selector (`Never`, `Occasionally`, `Regularly`, `Trying to Quit`).
* **Drinking Habits** (`drinking`): Chip selector (`Never`, `Socially`, `Occasionally`, `Regularly`).

---

### 🏡 5. Step 5: Family & Cultural Values
* **Family Background** (`familyBackground`): Multi-line text input (e.g., parents' professions, siblings).
* **Cultural Values & Traditions** (`culturalValues`): Multi-line text input (e.g., traditional values, festivals, family orientation).
* **Wedding Preferences** (`weddingPreferences`): Multi-line text input (e.g., Poruwa ceremony, traditional reception, simple civil wedding).

---

### 💖 6. Step 6: About You & Passions
* **About Me Bio** (`about`): Multi-line rich text input (minimum 20 characters required).
* **Interests & Passions** (`interests`): Multi-select chip buttons (min 3, max 10: `Music`, `Travel`, `Photography`, `Reading`, `Movies`, `Gaming`, `Cooking`, `Sports`, `Yoga`, `Dancing`).
* **Favorite Food / Dishes** (`favoriteThings.food`): Text input.
* **Favorite Movies / Shows** (`favoriteThings.movies`): Text input.
* **Travel Preferences** (`travelPreferences`): Text input (e.g., nature trails, beach resorts, hill country).

---

### 🎯 7. Step 7: Partner Preferences & Dealbreakers
* **Location Preference** (`partnerPreferences.locationPreference`): Text input (e.g., "Western Province", "Kandy", "Open to relocate").
* **Preferred Education Level** (`partnerPreferences.educationLevel`): Chip selector (`High School`, `Diploma`, `Bachelors`, `Masters`, `Doctorate`, etc.).
* **Preferred Religion** (`partnerPreferences.religionPreference`): Chip selector (`Buddhist`, `Hindu`, `Muslim`, `Christian`, `Catholic`, `No Religion`, `Open to All`).
* **Dealbreakers & Essential Criteria** (`dealbreakers`): Multi-line text input (e.g., non-smoker, honesty, family-oriented).

---

### ✅ 8. Step 8: Review & Publish Profile
* **Summary Overview Card**:
  * Full Name (`firstName` + `lastName`).
  * Gender & Date of Birth.
  * Location (`city` + `district`).
  * Profession & Education.
  * Religion & Ethnicity.
  * Photos Attached count.
* **Privacy Assurance Notice**: Confirms personal contact information is kept private.
* **Complete Profile & Match Button**: Submits mapped payload via `ProfileService.createProfile(payload)`, sequentially uploads all staged local photos, refreshes auth profile, and redirects to main discovery tab (`/(tabs)`).

---

## 16. Mobile App Profile Details Screen (Native UI Specification)

The native mobile profile details screen (`srimatch-app/src/app/profile/[id].tsx`) delivers an Instagram-style immersive mobile experience for reviewing candidate profiles.

### 📸 1. Hero Gallery & Interactive Controls
* **Story-Style Top Progress Bars**: Horizontal segmented bars reflecting the active photo index in real-time.
* **Swipeable Photo Gallery** (`FlatList` paging): High-resolution photo slider.
* **Left & Right Quick-Tap Chevron Buttons**: On-screen floating chevron arrows (`ChevronLeft`, `ChevronRight`) allowing 1-tap photo navigation.
* **Photo Counter Badge**: Floating glassmorphism pill (`e.g., 1 / 4`).
* **Clickable Gallery Indicator Dots**: Direct tap-to-jump dot navigation.
* **Full-Screen Lightbox Modal**: `Maximize2` button launching high-res full-screen zoomable photo viewer.
* **Floating Header Action Buttons**:
  * ⬅️ **Back Button**: Navigates to previous screen.
  * ⛶ **Fullscreen Button**: Launches image modal.
  * 🚩 **Report Button**: Opens native alert report dialog (`INAPPROPRIATE_CONTENT`, `FAKE_PROFILE`, `SCAM_OR_FRAUD`).
* **Hero Identity Overlay**:
  * **Candidate Name & Age**: `firstName` + `lastName`, dynamic `age` in bold typography (`e.g., Kasun Perera, 28`).
  * 🛡️ **Verified Badge**: `ShieldCheck` icon with "Verified" badge.
  * **Location & Profession**: `city` (or "Sri Lanka") + `profession`.

---

### 💖 2. Compatibility Match Ribbon
* **Gradient Match Banner**: `LinearGradient` card featuring `Sparkles` icon:
  * e.g., *"88% Match with your lifestyle & values"*.

---

### 📑 3. 6-Tab Navigation System
The mobile screen categorizes profile information into 6 horizontal scrolling tabs:

#### 👤 Tab 1: About
* **Introductory Bio**: Narrative bio box (`about`).
* **Basic Information Table**:
  * `Age`: e.g. `28 years`.
  * `Marital Status`: e.g. `Never Married`, `Divorced`, `Widowed`.
  * `Gender`: `Male`, `Female`, `Other`.
  * `Height`: e.g. `175 cm`.
  * `Body Type`: e.g. `Athletic`, `Average`, `Slim`.
  * `Complexion`: e.g. `Fair`, `Wheatish`, `Medium`.
  * `Ethnicity`: e.g. `Sinhalese`, `Tamil`, `Moor`.
  * `Children`: `No children` or `X child(ren)`.
* **Location Table**:
  * `Current City`: `city`.

#### 📖 Tab 2: Background (Religion, Culture, Education & Career)
* **Religion & Culture**:
  * `Religion`: `Buddhist`, `Hindu`, `Muslim`, `Christian`, `Catholic`, `No Religion`, `Other`.
  * `Religious Practices`: Free-text routines.
  * `Cultural Values`: Family traditions and orientation.
  * `Family Background`: Parents' background, siblings.
  * `Family Type`: `Nuclear` / `Extended`.
  * `Family Involvement`: Desired family role.
  * `Wedding Preferences`: Preferred wedding style.
* **Languages Spoken**:
  * `languages`: Individual rounded tag badges.
* **Education & Career**:
  * `Education`: Highest qualification (`educationLevel` / `education`).
  * `Field of Study`: Major / discipline.
  * `Profession`: Job title.
  * `Industry`: Industry sector.
  * `Employer`: Company name.
  * `Work Location`: City / Remote.
  * `Annual Income`: Income range bracket.
  * `Relocation`: Willingness to relocate.

#### 🏃 Tab 3: Lifestyle
* **Habits & Lifestyle Table**:
  * `Dietary Preference`: `Vegetarian`, `Vegan`, `Non Vegetarian`, etc.
  * `Smoking`: `Never`, `Occasionally`, `Regularly`.
  * `Drinking`: `Never`, `Socially`, `Occasionally`.
  * `Health & Fitness`: Workout and health habits.
* **Daily Routine & Philosophy**:
  * `lifestyle`: Narrative paragraph describing daily lifestyle.

#### ✨ Tab 4: Interests & Favorites
* **Hobbies & Passions**:
  * `interests`: Tag chips with custom sparkle icons.
* **Personality & Travel**:
  * `Personality`: `personalityTraits` (character traits).
  * `Travel Preferences`: `travelPreferences` (travel style and destinations).
* **Favourite Things**:
  * Key-value metadata table: `food`, `movies`, `books`, `places`.

#### 🎯 Tab 5: Partner Preferences & Dealbreakers
* **What Candidate Is Looking For**:
  * `Age Range`: `minAge` – `maxAge` years.
  * `Height Range`: `minHeight` – `maxHeight` cm.
  * `Location Preference`: Preferred regions.
  * `Education Level`: Minimum qualification preference.
  * `Religion Preference`: Religious alignment.
  * `Marital Status Preference`: Marital status filter.
  * `Gender Preference`: Gender preference.
  * `Lifestyle Compatibility`: Ideal lifestyle alignment.
* **Dealbreakers Box**:
  * Highlighted red-accented warning container detailing non-negotiable criteria (`dealbreakers`).

#### ⚡ Tab 6: Compatibility Quiz
* **Quiz Category Cards**: 10 categories (Values, Goals, Family, Career, Location, Personality, Habits, Style, Children, Modern Factors).
* **Question & Candidate Answer**: Shows question title + candidate's response badge.
* **Mutual Match Pill**: Displays **`✓ Mutual Match`** badge with green checkmark when candidate's answer matches the current user's answer.

---

### 🔘 4. Sticky Bottom Action Bar
* **When Matched**:
  * 💬 **"Send Message (Matched! 💖)" Button**: Primary gradient button navigating directly to `/chat/[id]` with resolved `matchId`, `recipientName`, `recipientImage`, and `recipientId`.
* **When Not Matched**:
  * 🤍 / 💖 **Send Like Button** (`NORMAL` like toggle).
  * ⭐ **Star Like (Priority) Button** (`STAR` super-like toggle).

---

## 17. Mobile App My Profile Screen (Native Dashboard Specification)

> **Screen Path**: `srimatch-app/src/app/(tabs)/profile.tsx`  
> **Purpose**: Dedicated native hub for authenticated users to view profile snapshot, track verification status, monitor profile completion strength, upgrade subscriptions, manage account settings, and navigate to the profile editor.

### 🖼️ 1. Header & Hero Profile Summary Card

| UI Element | Source Field / Property | Visual Representation | Actions / Interactions |
| :--- | :--- | :--- | :--- |
| **Screen Header** | Static | `GradientHeader` ("My Profile", "Manage your account & identity") | Persistent top gradient header |
| **Avatar Photo** | `user.primaryImageUrl` \|\| `user.profileImages[0]` \|\| `user.images[0]` | 80x80 circular avatar frame (`borderRadius: 40`, peach border) | Fallback to default placeholder image if empty |
| **User Full Name** | `${user.firstName} ${user.lastName}` | Bold 18px text (`#2d1810`) | Truncates to 1 line with ellipsis if long |
| **Meta Subtitle** | `user.age` + `user.profession` | e.g. "28 yrs · Senior Software Engineer" | Dynamic age calculation from `dateOfBirth` |
| **Location Subtitle** | `user.city` | e.g. "Colombo, Sri Lanka" | Defaults to "Colombo, Sri Lanka" |
| **Verification Badge / CTA** | `user.verified` \|\| `user.isVerified` \|\| `user.idVerified` | Green pill (`Verified` with `ShieldCheck` icon) OR Orange outline button (`Get Verified`) | Tapping `Get Verified` routes to `/verification` |
| **Premium Membership Badge / CTA** | `user.premium` \|\| `user.subscription.plan` (`PRO`/`VIP`) | Gold pill (`Premium` with `Crown` icon) OR Peach outline button (`Free Plan`) | Tapping `Free Plan` routes to `/(tabs)/premium` |
| **Profile Strength Progress Bar** | `user.completionScore` \|\| `user.profileCompletionScore` (default `85%`) | "Profile Strength: XX%" header with horizontal animated filling progress track | Visual progress indicator of filled profile dimensions |

---

### 📋 2. Action Menu Sections & Navigation Routing

#### 🔒 Section 1: Profile & Trust
1. ✏️ **Edit Profile Details** (`Edit3` icon)
   * **Subtitle**: *"Photos, bio, lifestyle & partner preferences"*
   * **Route Target**: `/edit-profile`
2. 🛡️ **Identity Verification** (`ShieldCheck` icon)
   * **Subtitle**: *"Government ID & Selfie Authenticated ✓"* (if verified) vs *"Upload NIC / Passport to earn trusted tick"* (if unverified)
   * **Route Target**: `/verification`
3. 👑 **Membership & Subscription** (`Crown` icon)
   * **Subtitle**: *"Active Premium Plan details & boosts"* (if premium) vs *"Upgrade for unlimited likes & star likes"* (if free)
   * **Route Target**: `/(tabs)/premium`

#### ⚙️ Section 2: Preferences & Support
1. ⚙️ **Account Settings** (`Settings` icon)
   * **Subtitle**: *"Notifications, security & privacy"*
   * **Route Target**: `/settings`
2. ❓ **Help & Support** (`HelpCircle` icon)
   * **Subtitle**: *"FAQs, contact team & safety rules"*
   * **Route Target**: `/help`

#### 🚪 Section 3: Sign Out Action
* **Sign Out Button**: Red tinted icon (`LogOut`) with destructive text
* **Trigger**: Prompts native `Alert.alert("Sign Out", "Are you sure you want to sign out of SriMatch?", ...)`
* **On Confirm**: Invokes `useAuthStore.logout()` and replaces router state to `/(auth)/login`

---

## 18. Mobile App Edit Profile Screen (8-Tab Native Editor Specification)

> **Screen Path**: `srimatch-app/src/app/edit-profile.tsx`  
> **API Services**: `ProfileService.getMyProfile()`, `ProfileService.updateProfile(payload)`, `ProfileService.uploadProfileImage(formData)`, `ProfileService.deleteProfileImage(imageUrl)`

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      📸 PHOTO GALLERY MANAGER (Top)                     │
│  [ PRIMARY Photo 1 ]  [ Photo 2 (🗑️) ]  [ Photo 3 (🗑️) ]  [ + Add Photo ] │
├─────────────────────────────────────────────────────────────────────────┤
│                      📑 HORIZONTAL TAB SELECTOR                         │
│  [Basic] [Location] [Culture & Family] [Career] [Lifestyle] [Interests] │
│  [Preferences] [Compatibility Quiz]                                    │
├─────────────────────────────────────────────────────────────────────────┤
│                      📝 ACTIVE TAB FORM FIELDS                          │
│  (CustomInput, Horizontal Chip Scrollers, TextAreas, Sliders, Toggles)   │
├─────────────────────────────────────────────────────────────────────────┤
│                🔘 BOTTOM STICKY: [ Save Profile Changes ✦ ]             │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### 📸 1. Top Photo Gallery Manager (Global Sticky Section)

* **Photo Counter**: Displays current upload count: `Photo Gallery ({images.length}/6)`
* **Guidance Subtitle**: *"Upload high-quality portrait photos to increase match rate."*
* **Primary Photo Badge**: First image in array displays blue **`PRIMARY`** badge.
* **Delete Photo Action**: Each thumbnail features a red trash button overlay (`Trash2`) triggering confirmation alert and backend deletion via `ProfileService.deleteProfileImage(url)`.
* **Add Photo Action**: Dashed upload tile with `Plus` icon:
  * Prompts native permissions via `ImagePicker.requestMediaLibraryPermissionsAsync()`.
  * Opens native photo library via `ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.8 })`.
  * Uploads multipart payload to `/profiles/me/images` via `ProfileService.uploadProfileImage(formData)`.

---

### 📑 2. Tab-by-Tab Form Field Breakdown

#### 👤 Tab 1: Basic Identity (`activeTab === 'basic'`)

| Field Label | Form Key | Component / Input Type | Options / Validation Rules | Payload Transformation |
| :--- | :--- | :--- | :--- | :--- |
| **First Name** | `firstName` | `CustomInput` (text) | Required, max 50 chars | `firstName.trim()` |
| **Last Name** | `lastName` | `CustomInput` (text) | Required, max 50 chars | `lastName.trim()` |
| **Gender** | `gender` | Horizontal 2-chip toggle | `FEMALE`, `MALE` | `toUpperEnum(gender)` (`"FEMALE"` / `"MALE"`) |
| **Date of Birth** | `dateOfBirth` | `CustomInput` (text) | `YYYY-MM-DD` (e.g. `1996-05-14`) | `dateOfBirth` string |
| **Marital Status** | `maritalStatus` | Horizontal chip scroller | `Never Married`, `Divorced`, `Widowed`, `Separated`, `Annulled` | `toUpperEnum(maritalStatus)` (`"NEVER_MARRIED"`, etc.) |
| **Height** | `height` | `CustomInput` (numeric) | cm (default `165`) | `Number(height)` |
| **Children** | `hasChildren` | 2-chip toggle | `No Children` (`false`), `Has Children` (`true`) | `Boolean(hasChildren)` |
| **Number of Children** | `numberOfChildren`| `CustomInput` (numeric) | Conditional input (visible only when `hasChildren === true`) | `parseInt(numberOfChildren) \|\| 0` |
| **Body Type** | `bodyType` | Horizontal chip scroller | `Slim`, `Athletic`, `Average`, `Overweight`, `Plus Size`, `Muscular` | `toUpperEnum(bodyType)` (`"SLIM"`, `"AVERAGE"`, etc.) |
| **Complexion** | `complexion` | Horizontal chip scroller | `Fair`, `Wheatish`, `Medium`, `Dusky`, `Dark` | `toUpperEnum(complexion)` (`"FAIR"`, `"MEDIUM"`, etc.) |

*(Note: Place of birth has been removed in accordance with the updated privacy schema).*

---

#### 📍 Tab 2: Location & Origins (`activeTab === 'location'`)

| Field Label | Form Key | Component / Input Type | Placeholder / Value | Payload Field |
| :--- | :--- | :--- | :--- | :--- |
| **Current City / Town** | `city` | `CustomInput` (text) | "e.g. Colombo, Kandy, Nugegoda" | `city` |

---

#### 🛕 Tab 3: Cultural & Family Heritage (`activeTab === 'religion'`)

| Field Label | Form Key | Component / Input Type | Options / Input Format | Payload Field & Transformation |
| :--- | :--- | :--- | :--- | :--- |
| **Religion** | `religion` | Horizontal chip scroller | `Buddhist`, `Hindu`, `Muslim`, `Christian`, `Catholic`, `No Religion`, `Other` | `toUpperEnum(religion)` (`"BUDDHIST"`, `"HINDU"`, etc.) |
| **Religious Practices / Values** | `religiousPractices` | `CustomInput` (text) | "e.g. Regular temple visits, devout, moderate" | `religiousPractices` |
| **Ethnicity** | `ethnicity` | Horizontal chip scroller | `Sinhalese`, `Tamil`, `Moor`, `Burgher`, `Malay`, `Other` | `toUpperEnum(ethnicity)` (`"SINHALESE"`, `"TAMIL"`, etc.) |
| **Family Type** | `familyType` | 2-chip selector | `Nuclear`, `Extended` | `toUpperEnum(familyType)` (`"NUCLEAR"`, `"EXTENDED"`) |
| **Family Background & Siblings** | `familyBackground` | `CustomInput` (multiline, 3 rows) | "e.g. Parents are retired teachers, 1 younger brother" | `familyBackground` |
| **Cultural Values & Traditions** | `culturalValues` | `CustomInput` (text) | "e.g. Respect for elders, traditional Sri Lankan customs" | `culturalValues` |
| **Family Involvement in Decisions** | `familyInvolvement` | `CustomInput` (text) | "e.g. Values family guidance, balanced approach" | `familyInvolvement` |
| **Wedding Preferences** | `weddingPreferences` | `CustomInput` (text) | "e.g. Traditional Poruwa ceremony with close family" | `weddingPreferences` |

---

#### 🎓 Tab 4: Education & Career (`activeTab === 'career'`)

| Field Label | Form Key | Component / Input Type | Options / Input Format | Payload Field & Transformation |
| :--- | :--- | :--- | :--- | :--- |
| **Education Level** | `educationLevel` / `education` | Horizontal chip scroller | `High School`, `Diploma`, `Bachelors`, `Masters`, `Doctorate`, `Professional Certification`, `Other` | `toUpperEnum(educationLevel)` (`"BACHELORS"`, `"MASTERS"`, etc.) |
| **Field of Study / Degree** | `fieldOfStudy` | `CustomInput` (text) | "e.g. Computer Science, Accounting, Medicine" | `fieldOfStudy` |
| **Profession / Job Title** | `profession` | `CustomInput` (text) | "e.g. Senior Software Engineer" | `profession` |
| **Industry** | `industry` | Horizontal chip scroller | `Technology`, `Healthcare`, `Finance`, `Education`, `Engineering`, `Arts`, `Government`, `Other` | `industry` |
| **Employer / Company Name** | `employer` | `CustomInput` (text) | "e.g. Tech Solutions Lanka" | `employer` |
| **Work Location** | `workLocation` | `CustomInput` (text) | "e.g. Colombo / Hybrid" | `workLocation` |
| **Annual Income Range** | `income` | Horizontal chip scroller | `Less than 50k`, `50k - 100k`, `100k - 200k`, `200k - 500k`, `Above 500k` | `income` string |
| **Relocation Willingness** | `relocationWillingness` | Horizontal chip scroller | `Within current area`, `Within Sri Lanka`, `Anywhere (including abroad)` | Mapped to backend enum: `"WITHIN_CURRENT_AREA"`, `"WITHIN_SRI_LANKA"`, `"ANYWHERE_INCLUDING_ABROAD"` |

---

#### 🏃 Tab 5: Habits & Daily Lifestyle (`activeTab === 'lifestyle'`)

| Field Label | Form Key | Component / Input Type | Options / Input Format | Payload Field & Transformation |
| :--- | :--- | :--- | :--- | :--- |
| **Dietary Preference** | `dietaryPreferences` | Horizontal chip scroller | `Vegetarian`, `Vegan`, `Non Vegetarian`, `Pescatarian`, `No Preference` | `toUpperEnum(dietaryPreferences)` (`"NON_VEGETARIAN"`, etc.) |
| **Smoking** | `smoking` | Horizontal chip scroller | `Never`, `Occasionally`, `Regularly`, `Trying to Quit` | `toUpperEnum(smoking)` (`"NEVER"`, `"OCCASIONALLY"`, etc.) |
| **Drinking** | `drinking` | Horizontal chip scroller | `Never`, `Socially`, `Occasionally`, `Regularly` | `toUpperEnum(drinking)` (`"NEVER"`, `"SOCIALLY"`, etc.) |
| **Health & Fitness Habits** | `healthHabits` | `CustomInput` (text) | "e.g. Regular morning workout, jogging, yoga" | `healthHabits` |
| **Daily Routine & Philosophy** | `lifestyle` | `CustomInput` (multiline, 3 rows) | "e.g. Early riser, love calm weekends, family oriented" | `lifestyle` |
| **About Me (Biography)** | `about` | `CustomInput` (multiline, 4 rows) | Warm personal intro and life values | `about` |

---

#### ✨ Tab 6: Interests & Favourite Things (`activeTab === 'interests'`)

| Field Label | Form Key | Component / Input Type | Options / Input Format | Payload Structure |
| :--- | :--- | :--- | :--- | :--- |
| **Select Your Passions** | `interests` | Multi-select toggle chip cloud | `Music`, `Travel`, `Photography`, `Reading`, `Movies`, `Gaming`, `Cooking`, `Sports`, `Yoga`, `Dancing` | `interests: string[]` |
| **Personality Traits** | `personalityTraits` | `TextInput` (text) | "e.g. Introvert, creative, thoughtful, empathetic" | `personalityTraits` |
| **Travel Preferences** | `travelPreferences` | `TextInput` (text) | "e.g. Nature retreats, beach getaways, road trips" | `travelPreferences` |
| **Favourite Cuisine / Food** | `favoriteThings.food` | `TextInput` (text) | "e.g. Sri Lankan rice & curry, Italian, seafood" | `favoriteThings: { food: "..." }` |
| **Favourite Movies & Directors** | `favoriteThings.movies` | `TextInput` (text) | "e.g. Inception, Sinhala teledramas, Marvel" | `favoriteThings: { movies: "..." }` |
| **Favourite Places in Sri Lanka** | `favoriteThings.places` | `TextInput` (text) | "e.g. Ella, Mirissa, Nuwara Eliya, Sigiriya" | `favoriteThings: { places: "..." }` |

---

#### 🎯 Tab 7: Partner Preferences & Dealbreakers (`activeTab === 'preferences'`)

| Field Label | Form Key | Component / Input Type | Options / Format | Payload Mapping |
| :--- | :--- | :--- | :--- | :--- |
| **Partner Age Range** | `partnerPreferences.ageRange` | Dual `TextInput` (numeric: Min Age / Max Age) | e.g. `24` to `32` | `minAge`, `maxAge` |
| **Partner Height Range (cm)** | `partnerPreferences.heightPreference` | Dual `TextInput` (numeric: Min Height / Max Height) | e.g. `155` to `185` cm | `minHeight`, `maxHeight` |
| **Preferred Gender** | `partnerPreferences.preferredGender` | Horizontal chip scroller | `No Preference` (`""`), `Male` (`"MALE"`), `Female` (`"FEMALE"`), `Other` (`"OTHER"`) | `preferredGender` |
| **Religion Preference** | `partnerPreferences.religionPreference` | Horizontal chip scroller | `No Preference` (`""`), `Buddhist` (`"BUDDHIST"`), `Hindu` (`"HINDU"`), `Muslim` (`"MUSLIM"`), `Christian` (`"CHRISTIAN"`), `Catholic` (`"CATHOLIC"`), `No Religion` (`"NO_RELIGION"`), `Other` (`"OTHER"`) | `religionPreference` |
| **Marital Status Preference** | `partnerPreferences.maritalStatusPreference` | Horizontal chip scroller | `No Preference` (`""`), `Never Married` (`"NEVER_MARRIED"`), `Divorced` (`"DIVORCED"`), `Widowed` (`"WIDOWED"`), `Separated` (`"SEPARATED"`), `Annulled` (`"ANNULLED"`) | `maritalStatusPreference` |
| **Min. Education Preference** | `partnerPreferences.educationLevel` | Horizontal chip scroller | `No Preference` (`""`), `High School` (`"HIGH_SCHOOL"`), `Diploma` (`"DIPLOMA"`), `Bachelors` (`"BACHELORS"`), `Masters` (`"MASTERS"`), `Doctorate` (`"DOCTORATE"`), `Prof. Cert.` (`"PROFESSIONAL_CERTIFICATION"`) | `educationLevel` |
| **Location Preference** | `partnerPreferences.locationPreference` | `TextInput` (text) | "e.g. Colombo, Western Province, or open" | `locationPreference` |
| **Dealbreakers** | `dealbreakers` | `TextInput` (multiline, 3 rows) | "e.g. Smoking, dishonesty, unsupportive of career" | `dealbreakers` |

---

#### ⚡ Tab 8: Compatibility Quiz (`activeTab === 'quiz'`)

* **Category Groupings** (From `COMPATIBILITY_CATEGORIES`):
  1. 🌟 **Values & Beliefs**: Core life principles, moral values, and spiritual perspectives.
  2. 🎯 **Life Goals & Ambitions**: 5-year visions, career ambitions, and family balance.
  3. 👨‍👩‍👧‍👦 **Family Dynamics**: Extended family relationships, living arrangements, and boundary expectations.
  4. 💼 **Career & Ambition**: Work ethic, dual-career households, and career priorities.
  5. ✈️ **Location & Relocation**: Openness to living abroad, moving cities, and hometown attachments.
  6. 🧠 **Personality & Communication**: Conflict resolution style, introversion/extroversion, and emotional expression.
  7. 🏃 **Habits & Health**: Fitness importance, weekend routine preferences, and health mindset.
  8. 💰 **Lifestyle & Spending**: Financial philosophies, saving habits, and luxury vs frugality.
  9. 👶 **Children & Parenting**: Desire for children, parenting philosophy, and timeline.
  10. 🌐 **Modern Factors & Social**: Social media boundaries, modern vs traditional gender roles, and social life balance.
* **Answer Selection Mechanism**: Single-choice chip per question with dynamic checkmark indicator (`Check` icon) storing `{ [questionId]: selectedOption }` in `formData.quizAnswers`.

---

### 💾 3. Save Execution & Payload Synchronization (`handleSave`)

* **Loading State**: `CustomButton` updates label to `"Saving Changes..."` with disabled state and spinning indicator.
* **Payload Normalization**:
  * Enums normalized via `toUpperEnum` helper.
  * Relocation mapped to `"WITHIN_CURRENT_AREA"`, `"WITHIN_SRI_LANKA"`, or `"ANYWHERE_INCLUDING_ABROAD"`.
  * Numeric types sanitized with `Number()`.
  * Age and height ranges mapped into `partnerPreferences.minAge`, `maxAge`, `minHeight`, `maxHeight`.
  * Quiz answers mapped into `quizAnswers` JSON map.
* **API Dispatch**: Sends normalized payload to backend via `ProfileService.updateProfile(payload)`.
* **State Synchronization**: Calls `useAuthStore.refreshProfile()` to synchronize global user profile state.
* **Success Feedback**: Displays native confirmation modal:
  ```typescript
  Alert.alert('Profile Updated! ✦', 'Your changes have been saved successfully.', [
    { text: 'OK', onPress: () => router.back() }
  ]);
  ```





