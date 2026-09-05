import API from './base.service';

/**
 * LocationService
 * Utility service for fetching geographic data.
 */
const LocationService = {
    /**
     * Get list of all available cities (for birth place or current location)
     */
    getCities: () => {
        return API.get('/locations/cities');
    }
};

export default LocationService;
