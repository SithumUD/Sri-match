import API from './base.service';

/**
 * ConnectionService
 * Handles connections, matches, and overview statistics.
 */
const ConnectionService = {
  /**
   * Get complete connections overview (profile views, matches, received likes, star likes)
   * in a single unified payload.
   * @param {number} limit
   */
  getOverview: (limit = 50) => {
    return API.get('/connections/overview', {
      params: { limit }
    });
  }
};

export default ConnectionService;
