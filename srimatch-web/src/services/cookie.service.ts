/**
 * CookieService
 * Senior-level cookie management with security best practices.
 */
const CookieService = {
    /**
     * Set a cookie
     * @param name 
     * @param value 
     * @param days - Expiration in days
     */
    set: (name: string, value: string, days = 7) => {
        if (typeof document === 'undefined') return;
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        const secure = (typeof window !== 'undefined' && window.location.protocol === 'https:') ? '; Secure' : '';
        document.cookie = `${name}=${value || ""}${expires}; path=/; SameSite=Lax${secure}`;
    },

    /**
     * Get a cookie value
     * @param name 
     */
    get: (name: string): string | null => {
        if (typeof document === 'undefined') return null;
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
     * @param name 
     */
    remove: (name: string) => {
        if (typeof document === 'undefined') return;
        document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Strict';
    }
};

export default CookieService;
