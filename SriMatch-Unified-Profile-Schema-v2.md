# SriMatch — Unified Profile Schema & Cross-Platform Reconciliation Spec (v2)

**Purpose of this document:** The current system (Backend DB, Web frontend, Mobile app) has **three different, mutually-inconsistent definitions** of the profile schema — different enum values, missing fields, different field names, and different screens per platform. This document is the **single source of truth**. Every field, enum, screen, and payload described here must be implemented **identically** on Backend, Web, and Mobile. Anywhere the old system disagreed with itself, this document states the resolved, canonical version and explains what changed.

**Audience:** This file is written to be handed directly to an engineering/AI coding agent to update the backend schema, web frontend, and mobile app so all three are in sync.

---

## 0. Summary of Required Changes (Action Checklist)

Use this as the top-level punch list. Full detail for each item is in the sections that follow.

| # | Change | Type | Affects |
|---|---|---|---|
| 1 | **Remove `district` entirely.** Only `city` remains as the location field. | Removal | DB, Mobile Wizard, Mobile Edit (if present) |
| 2 | **Add `futureAspirations`** as a first-class field (DB column + all wizards + all edit screens + profile display + completion score). | Addition | DB, Web, Mobile |
| 3 | **Unify & expand Privacy & Visibility controls.** Currently Web-only and shallow; must exist identically on Web + Mobile with matrimony-specific additions. | Addition + Unification | DB, Web, Mobile |
| 4 | **Compatibility Quiz must exist in both creation wizards and both edit screens, and must be explicitly optional/skippable everywhere** (not required for profile completion). | Unification | DB, Web, Mobile |
| 5 | **Fix all enum mismatches** between DB and UI (`religion`, `maritalStatus`, `ethnicity`, `bodyType`, `complexion`, `smoking`, `dietaryPreferences`, `familyType`, `education`, `relocationWillingness`). | Correction | DB, Web, Mobile |
| 6 | **Make `religiousPractices`, `personalityTraits`, `familyType`, `familyInvolvement`, `healthHabits`, `lifestyle`, full `partnerPreferences`, and `gender`** appear identically (same fields, same options) in both creation wizards and both edit screens. | Unification | Web, Mobile |
| 7 | **Fix field-key naming inconsistencies** (`partnerPreferences.religion` vs `.religionPreference`, `education` vs `educationLevel`). | Correction | DB, Web, Mobile |
| 8 | **Fix Profile Completion Score** so weights sum to 100 (previously summed to 95) and include new fields. | Correction | DB, Web, Mobile |
| 9 | **Fix Compatibility Quiz question count/category mismatch** between Web (29 questions) and Mobile (different category names/content) — one canonical quiz definition. | Correction | Web, Mobile |
| 10 | **Standardize `locationPreference` as a structured city picker** (not free text) on both platforms. | Correction | Web, Mobile |

---

## 1. Canonical Database Schema Changes

### 1.1 Column removed
```sql
ALTER TABLE profiles DROP COLUMN IF EXISTS district;
```
`district` is **not** part of the canonical schema. Only `profiles.city` (free-text / searchable city value, e.g. "Colombo", "Kandy", "Nugegoda", or an overseas city) represents location going forward. Any existing `district` data should be migrated into `city` only if it adds information not already in `city` (e.g., concatenate as `"<city>, <district>"` once during a one-time backfill), then the column is dropped. Do not display or collect "District" anywhere after migration.

### 1.2 Columns added

| Field Name | Column | DB Type | API Type | Description |
|---|---|---|---|---|
| `futureAspirations` | `profiles.future_aspirations` | `TEXT` | `String` | Long-term goals, family plans, life vision. Shown in Partner Preferences / Future Goals area and counted in profile completion. |
| `privacySettings` | `profiles.privacy_settings` | `JSONB` | `Map<String, Object>` | Consolidated privacy & visibility settings object (see §6). Replaces the old scattered/Web-only boolean fields. |
| `quizCompletionPercent` | `profiles.quiz_completion_percent` | `INTEGER` | `Integer` (default `0`) | Derived/stored: `answeredQuizQuestions / 29 * 100`. Used to show "Quiz X% complete" without forcing completion. **Not** counted toward `completionScore`. |

### 1.3 Enum corrections

The table below is now **the only valid set of values** for each enum, on every platform. `Old DB Value` / `Old UI Value` columns show what existed before (for migration mapping only — do not keep both).

#### `Gender`
| Canonical | Notes |
|---|---|
| `MALE`, `FEMALE`, `OTHER` | No change — but `OTHER` was **missing from the Mobile Edit Basic tab** (2-chip toggle). Must be a 3-chip selector everywhere (creation + edit, web + mobile). |

#### `MaritalStatus`
| Canonical | Migration note |
|---|---|
| `NEVER_MARRIED`, `DIVORCED`, `WIDOWED`, `SEPARATED`, `ANNULLED` | DB previously lacked `ANNULLED` even though every UI surface offered it. Add it to the DB enum. |

#### `Religion`
| Canonical | Migration note |
|---|---|
| `BUDDHIST`, `HINDU`, `ISLAM`, `ROMAN_CATHOLIC`, `CHRISTIAN`, `NO_RELIGION`, `OTHER` | DB had `NON_ROMAN_CATHOLIC` → rename to `CHRISTIAN` (clearer, matches UI language). UI had `MUSLIM` → rename to `ISLAM` (this field is the religion; the ethnicity field below correctly uses `MOOR`). UI had no `NO_RELIGION` in DB — add it. |

#### `Ethnicity`
| Canonical | Migration note |
|---|---|
| `SINHALESE`, `TAMIL`, `MOOR`, `BURGHER`, `MALAY`, `OTHER` | DB previously had `MUSLIM` here, which is a religion, not an ethnicity, and collided semantically with the Religion field. Replace with `MOOR` (the correct Sri Lankan census ethnic term), matching what the UI already used. |

#### `BodyType`
| Canonical | Migration note |
|---|---|
| `SLIM`, `ATHLETIC`, `AVERAGE`, `MUSCULAR`, `HEAVY` | UI had additionally offered `OVERWEIGHT` and `PLUS_SIZE` as separate options from `HEAVY` — these are redundant/sensitive duplicates. Consolidate to a single `HEAVY` option platform-wide. Add `MUSCULAR` to the DB enum since it was UI-only before. |

#### `Complexion`
| Canonical | Migration note |
|---|---|
| `FAIR`, `WHEATISH`, `MEDIUM`, `DUSKY`, `DARK` | DB's `TAN` is replaced with the South-Asian-matrimony-standard terms `WHEATISH` and `DUSKY` (already used by the UI). |

#### `SmokingHabit`
| Canonical | Migration note |
|---|---|
| `NEVER`, `OCCASIONALLY`, `REGULARLY`, `TRYING_TO_QUIT` | Add `TRYING_TO_QUIT` to the DB enum (UI already offered it, DB didn't support it). |

#### `DrinkingHabit`
| Canonical | Migration note |
|---|---|
| `NEVER`, `OCCASIONALLY`, `SOCIALLY`, `REGULARLY` | No change — already consistent, just make sure both platforms render the same 4 options in the same order. |

#### `DietaryPreference`
| Canonical | Migration note |
|---|---|
| `VEGETARIAN`, `NON_VEGETARIAN`, `VEGAN`, `EGGETARIAN`, `HALAL`, `PESCATARIAN`, `NO_PREFERENCE` | Merge of both sets — do not drop `HALAL`/`EGGETARIAN` (important for this market) or `PESCATARIAN`/`NO_PREFERENCE` (already used in UI). |

#### `FamilyType`
| Canonical | Migration note |
|---|---|
| `NUCLEAR`, `EXTENDED` | DB's `JOINT` renamed to `EXTENDED` to match the UI value used everywhere. |

#### `EducationLevel`
| Canonical | Migration note |
|---|---|
| `HIGH_SCHOOL`, `DIPLOMA`, `BACHELORS`, `MASTERS`, `DOCTORATE`, `PROFESSIONAL_CERTIFICATION`, `OTHER` | DB's `PROFESSIONAL` renamed to `PROFESSIONAL_CERTIFICATION` to match what the UI actually sends (this was previously a silent data-loss bug). |

#### `RelocationWillingness`
| Canonical | Migration note |
|---|---|
| `NOT_WILLING`, `WITHIN_CURRENT_AREA`, `WITHIN_SRI_LANKA`, `ANYWHERE_INCLUDING_ABROAD` | This was already the correct DB enum. Web Creation Wizard and Web My Profile must be fixed — they currently send `WITHIN_DISTRICT` and bare `ANYWHERE`, which do not exist in this enum. (`WITHIN_DISTRICT` is also obsolete now that `district` is removed — use `WITHIN_CURRENT_AREA` everywhere.) |

---

## 2. Canonical Complete JSON Profile Payload

This replaces the example in the old spec. All three platforms must produce/consume exactly this shape.

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
  "familyInvolvement": "Values family guidance, balanced approach",
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
  "lifestyle": "Early riser, calm weekends, family oriented",

  "about": "Passionate about software architecture, photography, and hiking in Sri Lanka.",
  "interests": ["Traveling", "Photography", "Badminton", "Tech"],
  "personalityTraits": "Ambitious, Calm, Friendly",
  "travelPreferences": "Nature trails, beach stays, cultural heritage trips",
  "favoriteThings": {
    "food": "Kottu Roti",
    "movies": "Interstellar",
    "places": "Ella, Nuwara Eliya",
    "books": "Sapiens"
  },

  "futureAspirations": "Hoping to settle down, build a family-first home, and grow into a leadership role at work over the next five years.",

  "partnerPreferences": {
    "minAge": 23,
    "maxAge": 28,
    "minHeight": 155,
    "maxHeight": 175,
    "preferredGender": "FEMALE",
    "religionPreference": "BUDDHIST",
    "educationLevel": "BACHELORS",
    "maritalStatusPreference": "NEVER_MARRIED",
    "locationPreference": "Colombo",
    "lifestyleCompatibility": "Health-conscious, non-smoker, active lifestyle"
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
  },
  "quizCompletionPercent": 21,

  "privacySettings": {
    "profileVisibility": "MATCHED_MEMBERS_ONLY",
    "photoVisibility": "BLURRED_UNTIL_MATCHED",
    "showOnlineStatus": true,
    "showLastActive": false,
    "showExactLocation": false,
    "whoCanMessage": "MATCHED_MEMBERS_ONLY",
    "readReceipts": true,
    "showTypingIndicator": true,
    "showIncomeRange": false,
    "showFamilyDetails": true,
    "showInSearchResults": true,
    "visibleToVerifiedOnly": false,
    "incognitoMode": false
  }
}
```

### 2.1 Naming fixes applied above (do not deviate)
- `partnerPreferences` keys are always `preferredGender`, `religionPreference`, `educationLevel`, `maritalStatusPreference`, `locationPreference`, `lifestyleCompatibility`, `minAge`, `maxAge`, `minHeight`, `maxHeight` — **exactly these keys**, on both platforms and in the API payload. (Old docs inconsistently referenced `partnerPreferences.religion` in the JSON example vs `.religionPreference` in the UI tables — `.religionPreference` is canonical.)
- Top-level education field is always `education` (not `educationLevel`) on the root profile object. `educationLevel` is reserved only for nested use inside `partnerPreferences`.
- `district` must not appear in any payload, form, or DB row after migration.

---

## 3. Location: `city`-only (District Removed)

- **Remove** the District chip selector from the Mobile Creation Wizard Step 2 entirely.
- Mobile Wizard Step 2 becomes: **City / Town** (upgrade from plain text input to the same `CitySearchDropdown` component Web uses — supports Sri Lankan cities + overseas locations), **Religion**, **Ethnicity**, **Languages Spoken**. (Religious Practices also added here — see §7.)
- Any backend matching/search logic that filtered by `district` must be re-pointed to `city` (or a derived region lookup from `city`, if district-level filtering is still needed for matching — but it must be a derived value, never a separate user-facing field).
- Profile Details / My Profile / Edit screens: remove every reference to "District" (there were none outside the mobile wizard, so this is a single-surface fix).

---

## 4. Future Aspirations (New Field)

| Field | Location in UI | Notes |
|---|---|---|
| `futureAspirations` | Web: Section "Partner Preferences & Future Goals" (Step 7 of Web Wizard, Section 9 of My Profile) | Was already referenced once in old Web My Profile spec but never implemented anywhere else — now made real. |
| `futureAspirations` | Mobile: Wizard Step 7 (Partner Preferences & Dealbreakers) + Mobile Edit Tab 7 (Preferences) | New — add as a multiline text input alongside `dealbreakers`. |
| `futureAspirations` | Profile Details / Mobile Profile Details Tab 5 (Partner Preferences & Dealbreakers) | Displayed as a "Looking Ahead" or "Future Goals" text block near Dealbreakers. |
| `futureAspirations` | Completion Score | +5 points (see §8). |

Suggested field copy: **"Future Aspirations"** — *"Where do you see yourself in the next few years? (career, family, life goals)"* — multiline text area, optional but scored.

---

## 5. Compatibility Quiz — Unified, Optional Everywhere

### 5.1 Canonical quiz definition
The quiz has **29 questions across 10 categories** (the real count from the fullest existing spec — the old "25 Questions" label was wrong and must be corrected everywhere it appears in code, UI copy, and comments). Category names are standardized to the Web naming (Mobile's differing category names — "Life Goals & Ambitions," "Family Dynamics," "Career & Ambition," "Habits & Health," "Lifestyle & Spending," "Children & Parenting" — are retired in favor of the list below, since the Web set has fully specified questions/options and Mobile's did not):

1. 🌍 **Values & Beliefs** (4 questions: `religion_importance`, `religion_partner`, `cultural_values`, `political_views`)
2. 💍 **Relationship Goals** (3: `relationship_goal`, `marriage_timeline`, `long_distance`)
3. 🏡 **Family & Lifestyle** (3: `family_size`, `living_arrangement`, `family_involvement`)
4. 💼 **Career & Money** (3: `career_priority`, `partner_work`, `financial_management`)
5. 📍 **Location & Future** (2: `relocation`, `abroad_plans`)
6. ❤️ **Personality & Lifestyle** (3: `social_type`, `free_time`, `travel_interest`)
7. 🚬 **Habits** (4: `smoking`, `partner_smoking`, `drinking`, `partner_drinking`)
8. 💞 **Relationship Style** (3: `love_language`, `conflict_resolution`, `jealousy`)
9. 🧒 **Children & Responsibility** (2: `children_importance`, `parenting_style`)
10. 📱 **Modern Factors** (2: `social_media`, `privacy_level`)

(Full question text and answer options per question are unchanged from the old Web spec §6/§11 — carry them forward verbatim into the shared quiz module both platforms import from.)

### 5.2 Must appear in ALL of the following (previously it only appeared in some):
- ✅ Web Creation Wizard (already had it — Step 6)
- ✅ **Mobile Creation Wizard — currently MISSING. Add as a new explicit step** (recommend inserting as **Step 8: "Compatibility Quiz (Optional)"**, before Review & Publish, renumbering old Step 8 "Review & Publish" to Step 9 — or fold it into the existing Review step as a collapsible optional section if a 9-step wizard is undesirable).
- ✅ Web Edit / My Profile (already had it — Section 9)
- ✅ Mobile Edit Profile (already had it — Tab 8)
- ✅ Web Profile Details (already had it — Tab 7, with mutual-match indicator)
- ✅ Mobile Profile Details (already had it — Tab 6, with mutual-match indicator)

### 5.3 Optionality — must be enforced everywhere
- Every quiz screen/step must display a clearly visible **"Skip for now"** action and must never block wizard progression or profile save.
- No quiz question is `required` at the form-validation level, on either platform.
- `quizCompletionPercent` is shown as a soft progress indicator ("You've completed 6 of 29 compatibility questions") but is **excluded from `completionScore`** (see §8) so users are never penalized for skipping it.
- Mutual-match badges (`✓ Mutual Match`) on Profile Details screens only render for questions **both** users answered; unanswered questions are simply omitted from the comparison, never shown as a mismatch.

---

## 6. Privacy & Visibility Controls — Unified & Expanded (Matrimony-Specific)

The old spec only defined this for Web (old §14.11), with generic dating-app-style toggles. For a **matrimony platform**, this needs to be both **identical on Web + Mobile** and **broader**, since users share far more sensitive personal/family data than a typical dating app. All settings below live in the single `profiles.privacy_settings` JSONB column (see §1.2) and must be editable from:
- **Web**: My Profile → Settings/Privacy tab (currently existed) — kept, but now backed by the shared JSONB shape.
- **Mobile**: My Profile → Account Settings (`/settings`) **must gain a "Privacy & Visibility" section** — currently missing entirely on mobile. Add it as its own settings screen, linked from the My Profile action menu (Section 2 of old §17).

### 6.1 Profile Visibility
| Setting | Key | Options | Default |
|---|---|---|---|
| Who can see my full profile | `profileVisibility` | `EVERYONE`, `LIKED_MEMBERS_ONLY`, `MATCHED_MEMBERS_ONLY`, `PREMIUM_MEMBERS_ONLY` | `EVERYONE` |
| Show profile in search & discovery | `showInSearchResults` | boolean | `true` |
| Only visible to ID-verified members | `visibleToVerifiedOnly` | boolean | `false` |
| Incognito / Browse anonymously (view others without appearing in their "who viewed me" list) | `incognitoMode` | boolean (Premium-gated feature flag, but the setting itself lives here) | `false` |
| Hide profile from specific members (block list) | *(separate `blocked_users` table, not part of this JSONB — referenced here for completeness)* | — | — |

### 6.2 Photo Privacy *(new — matrimony-specific)*
| Setting | Key | Options | Default |
|---|---|---|---|
| Photo visibility | `photoVisibility` | `PUBLIC` (visible to all who can see profile), `BLURRED_UNTIL_MATCHED` (blurred thumbnails until mutual match/connect), `VISIBLE_TO_MATCHED_ONLY` (fully hidden, not even blurred, until matched) | `PUBLIC` |
| Watermark my photos | `watermarkPhotos` | boolean (discourages screenshotting/misuse) | `false` |

### 6.3 Location Privacy
| Setting | Key | Options | Default |
|---|---|---|---|
| Show my city on profile | `showExactLocation` | boolean — if `false`, show only broad region/"Sri Lanka" instead of exact `city` | `true` |
| Show distance from me | `showDistance` | boolean | `true` |

### 6.4 Communication Privacy
| Setting | Key | Options | Default |
|---|---|---|---|
| Who can message me | `whoCanMessage` | `EVERYONE`, `LIKED_MEMBERS_ONLY`, `MATCHED_MEMBERS_ONLY` | `MATCHED_MEMBERS_ONLY` |
| Who can send match/connect requests | `whoCanConnect` | `EVERYONE`, `PREMIUM_MEMBERS_ONLY`, `VERIFIED_MEMBERS_ONLY` | `EVERYONE` |
| Read receipts | `readReceipts` | boolean | `true` |
| Show when I'm typing | `showTypingIndicator` | boolean | `true` |
| Show online status | `showOnlineStatus` | boolean | `true` |
| Show last active time | `showLastActive` | boolean | `false` |

### 6.5 Sensitive Information Privacy *(matrimony-specific — expanded)*
| Setting | Key | Options | Default |
|---|---|---|---|
| Show my income range | `showIncomeRange` | boolean | `false` |
| Show family background details | `showFamilyDetails` | boolean | `true` |
| Show partner preferences to non-matches | `showPartnerPreferences` | boolean | `true` |
| Show compatibility quiz answers to non-matches | `showQuizAnswers` | boolean | `true` |
| Require mutual like before contact details (if ever added later, e.g. phone/WhatsApp) can be shared | `requireMatchForContactInfo` | boolean | `true` |

### 6.6 Notification-adjacent privacy *(kept separate from push-notification settings, but listed for completeness — implement under the existing Settings screen, not this JSONB)*
- New match, new message, profile view alerts — unchanged from existing Settings behavior; not part of this reconciliation.

### 6.7 Implementation notes for the agent
- Build **one shared privacy-settings form component/schema** (or shared validation schema if platforms can't share UI code) so Web and Mobile always render the exact same list of toggles, in the exact same grouping (6.1–6.5), with the exact same keys and defaults.
- On profile creation, `privacySettings` is initialized with all defaults above — do not require the user to configure it during onboarding; surface it in Settings/Edit Profile afterward.
- `verificationStatus` (existing field, old §10) is unrelated to `visibleToVerifiedOnly` — don't conflate a user's own verification with their visibility preference toward other verified users.

---

## 7. Field-by-Field Cross-Platform Parity Requirements

For each field below, the **same field, same options/format, in the same conceptual location**, must exist in: DB schema · Web Creation Wizard · Mobile Creation Wizard · Web Edit/My Profile · Mobile Edit Profile · Web Profile Details · Mobile Profile Details (where applicable — display-only fields still need to render on both Details screens).

| Field | Current Gap | Required Fix |
|---|---|---|
| `religiousPractices` | Missing from Mobile Creation Wizard Step 2 | Add as a text input in Mobile Wizard Step 2, alongside Religion/Ethnicity/City/Languages. |
| `personalityTraits` | Missing from Mobile Creation Wizard Step 6 | Add as a text input in Mobile Wizard Step 6, alongside About/Interests/Favorites. |
| `familyType` | Missing from Mobile Creation Wizard Step 5 | Add as a 2-chip selector (`Nuclear` / `Extended`) to Mobile Wizard Step 5. |
| `familyInvolvement` | Missing from Mobile Creation Wizard Step 5 | Add as a text area to Mobile Wizard Step 5. |
| `healthHabits` | Missing from Mobile Creation Wizard Step 4 | Add as a text input to Mobile Wizard Step 4. |
| `lifestyle` | Missing from Mobile Creation Wizard Step 4 | Add as a text area to Mobile Wizard Step 4. |
| `partnerPreferences` (full set: age range, height range, gender, marital status preference, lifestyle compatibility — not just location/education/religion/dealbreakers) | Mobile Creation Wizard Step 7 only collects 4 of 9 sub-fields | Expand Mobile Wizard Step 7 to collect all sub-fields listed in §2 (`minAge`/`maxAge`, `minHeight`/`maxHeight`, `preferredGender`, `religionPreference`, `educationLevel`, `maritalStatusPreference`, `locationPreference`, `lifestyleCompatibility`), matching Web Wizard Step 7 exactly, plus the new `futureAspirations` field (§4) and `dealbreakers`. |
| `gender` (incl. `OTHER`) | Mobile Edit Tab 1 only offers `MALE`/`FEMALE` (2-chip) | Change to a 3-chip selector (`Male` / `Female` / `Other`) to match creation wizards and DB enum on both platforms. |

After these fixes, both wizards (Web 8-step, Mobile 8- or 9-step per §5.2) collect **the same total field set**, just adapted to native vs. web input controls.

---

## 8. Profile Completion Score — Corrected

Old weights summed to 95/100 (a bug). Corrected, and now includes `futureAspirations`:

| Component | Points |
|---|---|
| Photos (≥1 uploaded) | 10 |
| About bio (>50 chars) | 10 |
| Interests (≥3 selected) | 10 |
| Education | 8 |
| Profession | 8 |
| Religion | 8 |
| Partner Preferences (any field set) | 10 |
| First Name | 5 |
| Gender | 5 |
| Date of Birth | 5 |
| City | 10 |
| Marital Status | 6 |
| **Future Aspirations** *(new)* | **5** |
| **Total** | **100** |

- Compatibility Quiz answers are **intentionally excluded** from this score (per §5.3 — quiz stays optional and unpressured). Show quiz progress as a **separate**, clearly-labeled secondary indicator (`quizCompletionPercent`), never merged into the main 0–100% completion bar.
- This exact weighting table must be implemented identically in the backend completion-score calculator and in any client-side estimate shown during the wizard (both platforms currently compute this client-side during Step 8/Review — replace with a call to the backend-calculated `completionScore`, or keep both in sync via a single shared constants file).

---

## 9. Screen-by-Screen Implementation Notes

### 9.1 Web Creation Wizard (8 steps) — changes
- Step 2: no change needed (already city-only).
- Step 3: Education dropdown value for "Professional Certification" must submit `PROFESSIONAL_CERTIFICATION` (not `PROFESSIONAL`).
- Step 3: Relocation Willingness dropdown options corrected to `NOT_WILLING`, `WITHIN_CURRENT_AREA`, `WITHIN_SRI_LANKA`, `ANYWHERE_INCLUDING_ABROAD` (remove `WITHIN_DISTRICT`, `ANYWHERE`).
- Step 4: Body Type / Complexion / Smoking / Dietary Preferences dropdown options updated to the canonical enums in §1.3.
- Step 5: Family Type dropdown value `EXTENDED` (not a new value needed — Web already used this label, just confirm it maps to the corrected DB enum).
- Step 6: Quiz label corrected from "25 Questions" to "29 Questions"; add a visible "Skip for now" control if not already present.
- Step 7: Add `futureAspirations` text area; correct `partnerPreferences.religionPreference` key naming in the submitted payload.
- Step 8: Update completion-score calculation to match §8.

### 9.2 Mobile Creation Wizard — changes
- Step 1: no structural change (gender chip group already has 3 options here — confirm it stays 3 through to Edit, per §7).
- Step 2: **Remove District chip selector.** Upgrade City to `CitySearchDropdown`. Add `religiousPractices` text input.
- Step 3: Update Education/Relocation option values to canonical enums (relocation currently isn't listed as collected in Mobile Wizard step 3 income section — confirm relocation willingness is actually present here; if not, add it, since it's in the DB schema and both edit screens).
- Step 4: Add `healthHabits`, `lifestyle`. Update Body Type/Complexion/Smoking/Dietary option values to canonical enums.
- Step 5: Add `familyType`, `familyInvolvement`.
- Step 6: Add `personalityTraits`.
- Step 7: Expand to full `partnerPreferences` set (age/height ranges, preferredGender, maritalStatusPreference, lifestyleCompatibility) + `futureAspirations`. Change `locationPreference` from free text to the shared city picker component (§10).
- **New Step 8 (or folded into Review):** Compatibility Quiz, optional, "Skip for now" always visible. Renumber old Step 8 (Review & Publish) accordingly.
- Final Review step: Update summary card + completion logic to §8; remove any "District" line from the summary card.

### 9.3 Web / Mobile Profile Details
- Both: rename any "District" references (none currently shown, confirm none get added).
- Both: add a "Future Goals" / Future Aspirations display block near Dealbreakers in the Partner Preferences tab.
- Both: quiz question count label corrected to 29; both platforms must use the identical 10-category list from §5.1 (Mobile's tab must be relabeled to match Web's category names).
- Both: Privacy settings (`showFamilyDetails`, `showIncomeRange`, `showExactLocation`, `showQuizAnswers`, `showPartnerPreferences`) must actually gate what's rendered on the *viewer's* side — i.e., Profile Details must read the viewed user's `privacySettings` and conditionally hide the Income row, blur the City, hide the Quiz tab, etc.

### 9.4 Web My Profile / Mobile My Profile Screen
- Mobile My Profile action menu (old §17, Section 2) gains a new entry:
  - 🔒 **Privacy & Visibility** (`Shield`/`Lock` icon) — *"Control who sees your profile, photos & details"* — routes to a new `/privacy-settings` screen (mirrors Web's Section 10 of My Profile).
- Web My Profile Section 10 (existing) is expanded per §6 (photo privacy, incognito, verified-only visibility, quiz/partner-preference visibility, etc.) and its JSON now writes to `profiles.privacy_settings` instead of loose booleans.

### 9.5 Web Edit Profile / Mobile Edit Profile (8-tab editors)
- Add `futureAspirations` to the Partner Preferences & Dealbreakers tab on both.
- Mobile Edit Tab 1 (Basic): gender selector becomes 3-chip (`Male`/`Female`/`Other`).
- Mobile Edit Tab 2 (Location): confirm District is not present (it currently isn't in Mobile Edit — good, just make sure it stays that way and City becomes the shared searchable component).
- Both platforms' Tab/Section for "Compatibility Quiz" gets the corrected 29-question/10-category content and an explicit skip/optional affordance (already effectively optional since it's just an editor, but add a visible "X of 29 answered" progress indicator instead of implying completion is expected).
- Both: `partnerPreferences.religionPreference` (not `.religion`) used consistently in payload mapping tables and actual network calls.
- Both: add the new **Privacy & Visibility tab/section** (§6) to the editor, or link out to the dedicated Privacy screen from §9.4 — pick one pattern and apply it identically on both platforms (recommend: dedicated screen linked from My Profile, not a 9th editor tab, to avoid bloating the wizard/editor further).

---

## 10. Shared Component / Config Requirements (for engineering hygiene)

To prevent this drift from happening again, the agent should, where the codebase structure allows:
1. Create a **single shared constants/enum file** (e.g. `shared/enums/profileEnums.ts` or backend-generated OpenAPI types consumed by both frontends) containing every enum from §1.3, and have both Web and Mobile import their dropdown/chip options from it rather than hardcoding local copies.
2. Create a **single shared quiz definition file** (29 questions, 10 categories, per §5.1) imported by Web Wizard, Mobile Wizard, Web Edit, Mobile Edit, Web Details, Mobile Details.
3. Create a **single shared `partnerPreferences` field-key contract** and a **single shared `privacySettings` field-key contract**, each with the exact keys defined in §2 and §6, so front-end payload construction can't drift from the backend contract again.
4. Add a **backend-authoritative `completionScore` endpoint** (per §8) and have both clients call it rather than re-implementing the weight table locally (this is what caused the 95-vs-100 bug in the first place — two independent client-side re-implementations).
5. Add a **shared `CitySearchDropdown`/city-picker component contract** (props/behavior) so `city` and `partnerPreferences.locationPreference` use the same underlying data source and UX on both platforms (§9.2 Step 7 fix).

---

## 11. Migration Checklist for the Agent

- [ ] DB migration: drop `district` column (after one-time backfill into `city` if needed).
- [ ] DB migration: add `future_aspirations`, `privacy_settings`, `quiz_completion_percent` columns.
- [ ] DB migration/data-fix: rewrite existing enum values per §1.3 mapping table (e.g. `NON_ROMAN_CATHOLIC`→`CHRISTIAN`, ethnicity `MUSLIM`→`MOOR`, `TAN`→ nearest of `WHEATISH`/`DUSKY`, `JOINT`→`EXTENDED`, `PROFESSIONAL`→`PROFESSIONAL_CERTIFICATION`, Web's stray `WITHIN_DISTRICT`/`ANYWHERE` relocation values → `WITHIN_CURRENT_AREA`/`ANYWHERE_INCLUDING_ABROAD`).
- [ ] Backend: update all enum validators/DTOs to canonical §1.3 lists.
- [ ] Backend: implement `completionScore` calculation per §8 as an authoritative endpoint.
- [ ] Backend: implement `quizCompletionPercent` calculation (answered / 29).
- [ ] Web: remove any leftover district UI (none currently, verify).
- [ ] Web: fix relocation dropdown values, education value, quiz count label, add `futureAspirations` field, add expanded Privacy section, fix `partnerPreferences` key naming.
- [ ] Mobile: remove District step/field from Creation Wizard; upgrade City to shared picker.
- [ ] Mobile: add `religiousPractices`, `personalityTraits`, `familyType`, `familyInvolvement`, `healthHabits`, `lifestyle` to Creation Wizard.
- [ ] Mobile: expand `partnerPreferences` collection to full field set in Creation Wizard + add `futureAspirations`.
- [ ] Mobile: add Compatibility Quiz step to Creation Wizard (optional, skippable).
- [ ] Mobile: fix Gender selector in Edit Tab 1 to include `OTHER`.
- [ ] Mobile: add Privacy & Visibility screen, linked from My Profile.
- [ ] Both: update enum dropdown/chip option lists everywhere to canonical §1.3 values.
- [ ] Both: relabel quiz category names/question count consistently (29 questions, 10 categories, Web's category names).
- [ ] Both: verify Profile Details screens respect `privacySettings` when rendering another user's profile.
- [ ] QA pass: create one test profile on Web, one on Mobile, with every field populated — confirm both produce byte-identical JSON payload shape (aside from actual values) matching §2.

---

*End of unified spec. This document supersedes all field/enum/screen definitions in the previous "SriMatch - Complete Profile Fields & Data Schema" document.*
