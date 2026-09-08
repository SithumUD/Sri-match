/**
 * profileEnums.ts — Single source of truth for all profile enum option arrays in Mobile App.
 * Matches the canonical definitions in SriMatch-Unified-Profile-Schema-v2.md §1.3
 */

// ─── Display label + backend enum value pairs ────────────────────────────────

export const GENDER_OPTIONS = [
  { value: "MALE",   label: "Male" },
  { value: "FEMALE", label: "Female" },
  { value: "OTHER",  label: "Other" },
];

export const MARITAL_STATUS_OPTIONS = [
  { value: "NEVER_MARRIED", label: "Never Married" },
  { value: "DIVORCED",      label: "Divorced" },
  { value: "WIDOWED",       label: "Widowed" },
  { value: "SEPARATED",     label: "Separated" },
  { value: "ANNULLED",      label: "Annulled" },
];

export const RELIGION_OPTIONS = [
  { value: "BUDDHIST",   label: "Buddhist" },
  { value: "HINDU",      label: "Hindu" },
  { value: "ISLAM",      label: "Islam" },
  { value: "CHRISTIAN",  label: "Christian" },
  { value: "CATHOLIC",   label: "Catholic" },
  { value: "NO_RELIGION", label: "No Religion" },
  { value: "OTHER",      label: "Other" },
];

export const ETHNICITY_OPTIONS = [
  { value: "SINHALESE", label: "Sinhalese" },
  { value: "TAMIL",     label: "Tamil" },
  { value: "MOOR",      label: "Moor" },
  { value: "BURGHER",   label: "Burgher" },
  { value: "MALAY",     label: "Malay" },
  { value: "OTHER",     label: "Other" },
];

export const EDUCATION_OPTIONS = [
  { value: "HIGH_SCHOOL",               label: "High School" },
  { value: "DIPLOMA",                   label: "Diploma" },
  { value: "BACHELORS",                 label: "Bachelors" },
  { value: "MASTERS",                   label: "Masters" },
  { value: "DOCTORATE",                 label: "Doctorate" },
  { value: "PROFESSIONAL_CERTIFICATION", label: "Professional Certification" },
  { value: "OTHER",                     label: "Other" },
];

export const BODY_TYPE_OPTIONS = [
  { value: "SLIM",     label: "Slim" },
  { value: "ATHLETIC", label: "Athletic" },
  { value: "AVERAGE",  label: "Average" },
  { value: "MUSCULAR", label: "Muscular" },
  { value: "HEAVY",    label: "Heavy" },
];

export const COMPLEXION_OPTIONS = [
  { value: "FAIR",     label: "Fair" },
  { value: "WHEATISH", label: "Wheatish" },
  { value: "MEDIUM",   label: "Medium" },
  { value: "DUSKY",    label: "Dusky" },
  { value: "DARK",     label: "Dark" },
];

export const SMOKING_OPTIONS = [
  { value: "NEVER",          label: "Never" },
  { value: "OCCASIONALLY",   label: "Occasionally" },
  { value: "REGULARLY",      label: "Regularly" },
  { value: "TRYING_TO_QUIT", label: "Trying to Quit" },
];

export const DRINKING_OPTIONS = [
  { value: "NEVER",        label: "Never" },
  { value: "OCCASIONALLY", label: "Occasionally" },
  { value: "SOCIALLY",     label: "Socially" },
  { value: "REGULARLY",    label: "Regularly" },
];

export const DIETARY_OPTIONS = [
  { value: "VEGETARIAN",     label: "Vegetarian" },
  { value: "VEGAN",          label: "Vegan" },
  { value: "NON_VEGETARIAN", label: "Non-Vegetarian" },
  { value: "EGGETARIAN",     label: "Eggetarian" },
  { value: "HALAL",          label: "Halal" },
  { value: "PESCATARIAN",    label: "Pescatarian" },
  { value: "NO_PREFERENCE",  label: "No Preference" },
];

export const FAMILY_TYPE_OPTIONS = [
  { value: "NUCLEAR",  label: "Nuclear Family" },
  { value: "EXTENDED", label: "Extended Family" },
];

export const RELOCATION_OPTIONS = [
  { value: "NOT_WILLING",             label: "Not willing to relocate" },
  { value: "WITHIN_CURRENT_AREA",     label: "Within current area" },
  { value: "WITHIN_SRI_LANKA",        label: "Within Sri Lanka" },
  { value: "ANYWHERE_INCLUDING_ABROAD", label: "Anywhere (including abroad)" },
];

export const INCOME_OPTIONS = [
  "Less than 50k",
  "50k - 100k",
  "100k - 200k",
  "200k - 500k",
  "Above 500k",
];

export const LANGUAGE_OPTIONS = [
  "Sinhala", "Tamil", "English", "French", "German", "Japanese", "Arabic",
];

export const INDUSTRY_OPTIONS = [
  "Technology", "Healthcare", "Finance", "Education",
  "Engineering", "Arts", "Government", "Other",
];

export const INTEREST_OPTIONS = [
  "Music", "Travel", "Photography", "Reading", "Movies",
  "Gaming", "Cooking", "Sports", "Yoga", "Dancing",
];

// ─── Privacy Settings defaults (§6 of unified spec) ──────────────────────────

export const DEFAULT_PRIVACY_SETTINGS = {
  profileVisibility:        "EVERYONE",
  showInSearchResults:      true,
  visibleToVerifiedOnly:    false,
  incognitoMode:            false,
  photoVisibility:          "PUBLIC",
  watermarkPhotos:          false,
  showExactLocation:        true,
  showDistance:             true,
  whoCanMessage:            "MATCHED_MEMBERS_ONLY",
  whoCanConnect:            "EVERYONE",
  readReceipts:             true,
  showTypingIndicator:      true,
  showOnlineStatus:         true,
  showLastActive:           false,
  showIncomeRange:          false,
  showFamilyDetails:        true,
  showPartnerPreferences:   true,
  showQuizAnswers:          true,
  requireMatchForContactInfo: true,
};

// ─── Profile Completion Score weights (§8) ───────────────────────────────────

export const COMPLETION_WEIGHTS = {
  photos:            10,
  about:             10,
  interests:         10,
  city:              10,
  partnerPreferences: 10,
  education:          8,
  profession:         8,
  religion:           8,
  maritalStatus:      6,
  futureAspirations:  5,
  firstName:          5,
  gender:             5,
  dateOfBirth:        5,
} as const;

export const QUIZ_TOTAL_QUESTIONS = 29;
