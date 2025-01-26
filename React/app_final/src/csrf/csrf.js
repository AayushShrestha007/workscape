// csrf.js or api.js

import axios from 'axios';

export const fetchCsrfToken = async () => {
    try {
        const response = await axios.get('http://localhost:5500/api/csrf-token', {
            withCredentials: true,
        });
        // Cookie is now set automatically
    } catch (error) {
        console.error('Error fetching CSRF token:', error);
    }
};
