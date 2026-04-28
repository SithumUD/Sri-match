import { create } from 'zustand';

const useProfileStore = create((set) => ({
  profileCreationStep: 1,
  profileCreationData: {},
  
  setProfileCreationStep: (step) => set({ profileCreationStep: step }),
  
  updateProfileCreationData: (data) => set((state) => ({
    profileCreationData: {
      ...state.profileCreationData,
      ...data,
    }
  })),
  
  resetProfileCreation: () => set({ profileCreationStep: 1, profileCreationData: {} }),
}));

export default useProfileStore;
