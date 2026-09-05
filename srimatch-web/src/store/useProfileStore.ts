import { create } from 'zustand';

interface ProfileState {
  profileCreationStep: number;
  profileCreationData: Record<string, any>;
  setProfileCreationStep: (step: number | ((prev: number) => number)) => void;
  updateProfileCreationData: (data: Record<string, any>) => void;
  resetProfileCreation: () => void;
}

const useProfileStore = create<ProfileState>((set) => ({
  profileCreationStep: 1,
  profileCreationData: {},
  
  setProfileCreationStep: (step) => set((state) => {
    const rawNext = typeof step === 'function' ? step(Number(state.profileCreationStep) || 1) : step;
    const nextStep = Math.max(1, Math.min(8, Number(rawNext) || 1));
    return { profileCreationStep: nextStep };
  }),
  
  updateProfileCreationData: (data) => set((state) => ({
    profileCreationData: {
      ...state.profileCreationData,
      ...data,
    }
  })),
  
  resetProfileCreation: () => set({ profileCreationStep: 1, profileCreationData: {} }),
}));

export default useProfileStore;
