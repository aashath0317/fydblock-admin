export const fetchAuthenticated = async (url, options = {}) => {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = '/login';
        return;
    }

    const headers = {
        'Authorization': `Bearer ${token}`,
        ...options.headers
    };

    try {
        const response = await fetch(url, { ...options, headers });

        if (response.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token');
            window.location.href = '/login';
            return;
        }

        return response;
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
};
