import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

console.log('🔧 API Base URL:', API_BASE_URL);

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000, // ✅ Increased to 30 seconds
    withCredentials: false,
});

api.interceptors.request.use(
    (config) => {
        console.log('🌍 Full URL:', config.baseURL + config.url); // ✅ ADD THIS
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        console.log('✅ Response:', response.status, response.config.url);
        console.log('📦 Data:', response.data);
        return response;
    },
    (error) => {
        console.error('❌ Response Error:', {
            message: error.message,
            code: error.code,
            status: error.response?.status,
            data: error.response?.data,
            url: error.config?.url
        });

        if (error.code === 'ECONNABORTED') {
            console.error('⏱️ Request timeout - backend is taking too long');
        }

        if (error.code === 'ERR_NETWORK') {
            console.error('🌐 Network error - cannot reach backend');
        }

        if (error.response?.status === 403 || error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('userEmail');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth APIs
export const authAPI = {
    register: (data) => {
        console.log('🔑 Calling register API with:', data);
        return api.post('/api/auth/register', data);
    },
    login: (data) => {
        console.log('🔑 Calling login API with:', { email: data.email });
        return api.post('/api/auth/login', data);
    },
};

// Mail APIs
export const mailAPI = {
    send: (data) => api.post('/api/mail/send', data),
    getInbox: (limit = 50) => api.get(`/api/mail/inbox?limit=${limit}`), // ✅ Fixed
    getEmail: (uid) => api.get(`/api/mail/email/${uid}`), // ✅ Fixed
    markRead: (uid) => api.post(`/api/mail/${uid}/read`) // ✅ Fixed
};

// Email Management APIs
export const emailAPI = {
    createEmail: (data, token) => api.post('/api/emails/create', data, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
    }),
    listEmails: () => api.get('/api/emails/list'),
    setPrimary: (emailId) => api.post(`/api/emails/${emailId}/set-primary`), // ✅ Fixed
};

// Business/Domain APIs
export const businessAPI = {
    register: (data) => api.post('/api/business/register', data),
    getDomains: () => api.get('/api/business/domains'),
    getVerification: (domainId) => api.get(`/api/business/domain/${domainId}/verification`), // ✅ Fixed
    verifyDomain: (domainId) => api.post(`/api/business/domain/${domainId}/verify`), // ✅ Fixed
};