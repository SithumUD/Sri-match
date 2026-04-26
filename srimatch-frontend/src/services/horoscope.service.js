import API from './base.service';

/**
 * HoroscopeService
 * Handles astrological calculations and matching scores.
 */
const HoroscopeService = {
    /**
     * Get horoscope details for a user
     * @param {number} userId 
     */
    getHoroscopeDetails: (userId) => {
        return API.get(`/horoscope/${userId}`);
    },

    /**
     * Get detailed horoscope match analysis (Porutham)
     * @param {number} targetProfileId 
     */
    getMatchAnalysis: (targetProfileId) => {
        return API.get(`/horoscope/match/${targetProfileId}`);
    }
};

export default HoroscopeService;
