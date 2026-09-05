import { create } from 'zustand';

export interface ProfileCreationData {
  firstName?: string;
  lastName?: string;
  gender?: string;
  dateOfBirth?: string;
  maritalStatus?: string;
  hasChildren?: boolean;
  numberOfChildren?: number;
  district?: string;
  city?: string;
  placeOfBirth?: string;
  ethnicity?: string;
  religion?: string;
  religiousPractices?: string;
  languages?: string[];
  education?: string;
  fieldOfStudy?: string;
  profession?: string;
  industry?: string;
  employer?: string;
  workLocation?: string;
  income?: string;
  height?: number | string;
  bodyType?: string;
  complexion?: string;
  smoking?: string;
  drinking?: string;
  dietaryPreferences?: string;
  healthHabits?: string;
  lifestyle?: string;
  familyBackground?: string;
  culturalValues?: string;
  familyInvolvement?: string;
  weddingPreferences?: string;
  about?: string;
  interests?: string[];
  favoriteThings?: { food?: string; movies?: string; music?: string };
  travelPreferences?: string;
  personalityTraits?: string;
  partnerPreferences?: {
    ageRange?: [number, number];
    locationPreference?: string;
    educationLevel?: string;
    religionPreference?: string;
    maritalStatusPreference?: string;
    lifestyleCompatibility?: string;
  };
  dealbreakers?: string;
  profileImages?: string[];
  primaryImageUrl?: string;
}

interface ProfileStoreState {
  step: number;
  data: Partial<ProfileCreationData>;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateData: (fields: Partial<ProfileCreationData>) => void;
  reset: () => void;
}

const initialData: Partial<ProfileCreationData> = {
  gender: 'female',
  height: 165,
  maritalStatus: 'Never Married',
  district: 'Colombo',
  city: 'Colombo',
  ethnicity: 'Sinhalese',
  religion: 'Buddhist',
  languages: ['Sinhala', 'English'],
  education: 'Bachelors',
  profession: '',
  industry: 'Technology',
  income: '100k - 200k',
  dietaryPreferences: 'Non Vegetarian',
  drinking: 'Never',
  smoking: 'Never',
  bodyType: 'Average',
  complexion: 'Fair',
  about: '',
  interests: ['Music', 'Travel', 'Reading'],
  profileImages: [],
  partnerPreferences: {
    ageRange: [22, 32],
    locationPreference: 'Colombo',
    educationLevel: 'Bachelors',
    religionPreference: 'Buddhist',
    maritalStatusPreference: 'Never Married',
  },
};

export const useProfileStore = create<ProfileStoreState>((set) => ({
  step: 1,
  data: initialData,

  setStep: (step) => set({ step }),
  nextStep: () => set((state) => ({ step: Math.min(8, state.step + 1) })),
  prevStep: () => set((state) => ({ step: Math.max(1, state.step - 1) })),

  updateData: (fields) =>
    set((state) => ({
      data: { ...state.data, ...fields },
    })),

  reset: () => set({ step: 1, data: initialData }),
}));

export default useProfileStore;
