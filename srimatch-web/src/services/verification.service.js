import API from './base.service';

const VerificationService = {
    submitDocuments: (type, frontFile, backFile) => {
        const formData = new FormData();
        formData.append('type', type);
        formData.append('front', frontFile);
        if (backFile) formData.append('back', backFile);
        
        return API.post('/verifications/submit-docs', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },

    submitSelfie: (token, selfieFile) => {
        const formData = new FormData();
        formData.append('token', token);
        formData.append('selfie', selfieFile);
        
        return API.post('/verifications/submit-selfie', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },

    getStatus: () => {
        return API.get('/verifications/status');
    }
};

export default VerificationService;
