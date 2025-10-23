// All your backend URLs
export const BACKEND_URLS = {
    local8000: 'http://127.0.0.1:8000/api',
    local8001: 'http://127.0.0.1:8001/api',
    localhost8000: 'http://localhost:8000/api',
    localhost8001: 'http://localhost:8001/api',
    staging: 'https://backend-staging.onrender.com/api',
    production: 'https://group-bse25-1-1-prod.onrender.com/api',
};

let API_URL;

if (import.meta.env.VITE_API_URL) {
    API_URL = import.meta.env.VITE_API_URL;
}
else if (import.meta.env.PROD) {
    const isStaging = window.location.hostname.includes('deploy-preview') ||
        window.location.hostname.includes('staging');

    API_URL = isStaging ? BACKEND_URLS.staging : BACKEND_URLS.production;
}
else {
    API_URL = BACKEND_URLS.local8001;
}

console.log(' Using API URL:', API_URL);

export default API_URL;