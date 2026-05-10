import axios from 'axios';
import initialPackages from '../data/packages.json';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Mock Logic for Demo Mode
const handleMockRequest = (config) => {
  const { url, method, data } = config;
  
  // Helper to get/set local storage
  const getLocalTrips = () => JSON.parse(localStorage.getItem('demo_trips') || '[]');
  const setLocalTrips = (trips) => localStorage.setItem('demo_trips', JSON.stringify(trips));

  if (url.includes('/packages') && method === 'get') {
    return Promise.resolve({ data: initialPackages });
  }

  if (url.includes('/trips') && method === 'get') {
    return Promise.resolve({ data: getLocalTrips() });
  }

  if (url.includes('/trips') && method === 'post') {
    const trips = getLocalTrips();
    const newTrip = { ...JSON.parse(data), _id: 'demo-' + Date.now(), stops: [] };
    trips.push(newTrip);
    setLocalTrips(trips);
    return Promise.resolve({ data: newTrip });
  }

  if (url.includes('/trips/clone-package') && method === 'post') {
    const { packageData } = JSON.parse(data);
    const trips = getLocalTrips();
    const newTrip = { ...packageData, _id: 'demo-' + Date.now(), startDate: new Date(), endDate: new Date() };
    trips.push(newTrip);
    setLocalTrips(trips);
    return Promise.resolve({ data: newTrip });
  }

  if (url.includes('/trips/') && method === 'get') {
    const id = url.split('/').pop();
    const trip = getLocalTrips().find(t => t._id === id);
    return Promise.resolve({ data: trip });
  }

  if (url.includes('/trips/') && method === 'put') {
    const id = url.split('/').pop();
    const updatedData = JSON.parse(data);
    const trips = getLocalTrips().map(t => t._id === id ? { ...t, ...updatedData } : t);
    setLocalTrips(trips);
    return Promise.resolve({ data: updatedData });
  }

  if (url.includes('/trips/') && method === 'delete') {
    const id = url.split('/').pop();
    const trips = getLocalTrips().filter(t => t._id !== id);
    setLocalTrips(trips);
    return Promise.resolve({ data: { message: 'Trip deleted' } });
  }

  return null;
};

// Add a request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle Demo Mode on failure
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // If it's a network error or 404/500, try Mock
    if (!error.response || error.response.status >= 400) {
      const mockResponse = handleMockRequest(error.config);
      if (mockResponse) {
        console.warn("Backend error or unavailable. Serving from Demo Mode Storage.");
        return mockResponse;
      }
    }
    return Promise.reject(error);
  }
);

export default api;
