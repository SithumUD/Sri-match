import API from './base.service';

/**
 * MatchService
 * Handles viewing and managing successful matches.
 */
const MatchService = {
    /**
     * Get the current user's active matches
     */
    getMyMatches: (page = 0, size = 10) => {
        return API.get('/matches', {
            params: { page, size }
        });
    }
};

export default MatchService;
