import axios from "axios";

// Use environment-driven API URL for production and development
const host = typeof window !== 'undefined' ? window.location.hostname : '';
const isProdHost = /(?:^|\.)nairalancers\.com$/.test(host);
const envApiUrl = import.meta?.env?.VITE_API_URL;
const runtimeApiUrl = typeof window !== 'undefined' && window.__API_URL__;
const resolvedApi = (() => {
  if (isProdHost) {
    if (envApiUrl && !/^https?:\/\/localhost(?::\d+)?/i.test(envApiUrl)) return envApiUrl;
    if (runtimeApiUrl && !/^https?:\/\/localhost(?::\d+)?/i.test(runtimeApiUrl)) return runtimeApiUrl;
    return 'https://api.nairalancers.com';
  }
  return envApiUrl || runtimeApiUrl || 'http://localhost:8800';
})();
const base = String(resolvedApi).replace(/\/$/, "");

const newRequest = axios.create({
  baseURL: `${base}/api/`,
  withCredentials: true,
});

export default newRequest;
//     withCredentials: true,
// });

// export default newRequest;