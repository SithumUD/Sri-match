import API from './api';

export const ProfileService = {
  getMyProfile: () => {
    return API.get('/profile/me');
  },

  getPublicProfile: (profileId: string | number) => {
    return API.get(`/profiles/${profileId}`);
  },

  getDiscoverProfiles: (params: any = {}) => {
    return API.get('/profiles', { params });
  },

  searchProfiles: (filters: any = {}) => {
    return API.get('/profiles', { params: filters });
  },

  searchProfilesCursor: (params: any = {}) => {
    return API.get('/profiles/cursor', { params });
  },

  createProfile: (profileData: any) => {
    return API.post('/profile', profileData);
  },

  updateProfile: (profileData: any) => {
    return API.post('/profile', profileData);
  },

  uploadProfileImage: (formDataOrFile: any, isPrimary = false) => {
    let formData: FormData;
    if (formDataOrFile instanceof FormData) {
      formData = formDataOrFile;
      // If 'image' was appended instead of 'file', ensure 'file' is set
      const parts = (formData as any)._parts;
      if (Array.isArray(parts)) {
        const hasFile = parts.some(([k]: any) => k === 'file');
        if (!hasFile) {
          const imgPart = parts.find(([k]: any) => k === 'image');
          if (imgPart) {
            formData.append('file', imgPart[1]);
          }
        }
      }
    } else {
      formData = new FormData();
      formData.append('file', formDataOrFile);
      formData.append('isPrimary', String(isPrimary));
    }

    return API.post('/profile/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  deleteProfileImage: (imageUrl: string) => {
    return API.delete('/profile/image', { params: { imageUrl } });
  },

  setPrimaryImage: (imageUrl: string) => {
    return API.patch('/profile/image/primary', null, { params: { imageUrl } });
  },
};

export default ProfileService;
