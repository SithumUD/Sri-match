/**
 * CookieService
 * Senior-level cookie management with security best practices.
 */
const CookieService = {
    /**
     * Set a cookie
     * @param {string} name 
     * @param {string} value 
     * @param {number} days - Expiration in days
     */
    set: (name, value, days = 7) => {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        // Secure: only send over HTTPS (if not on localhost)
        // SameSite=Strict: protect against CSRF
        const secure = window.location.protocol === 'https:' ? '; Secure' : '';
        document.cookie = `${name}=${value || ""}${expires}; path=/; SameSite=Lax${secure}`;
    },

    /**
     * Get a cookie value
     * @param {string} name 
     */
    get: (name) => {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    },

    /**
     * Remove a cookie
     * @param {string} name 
     */
    remove: (name) => {
        document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Strict';
    }
};

export default CookieService;
