import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://localhost:5000/'

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor
api.interceptors.request.use(
  async (config) => {
    // You can add token here if you implement token-based auth in the future
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle global error cases here
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Auth API calls
export const registerUser = async (name, email, password) => {
  try {
    const response = await api.post('/register', { name, email, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await api.post('/login', { email, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// User profile API calls
export const getUserProfile = async (userId) => {
  try {
    const response = await api.get(`/user/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateUserName = async (userId, name) => {
  try {
    const response = await api.put(`/insertName/${userId}`, { name });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const uploadUserImage = async (userId, imageFile) => {
  try {
    const formData = new FormData();
    formData.append('file', {
      uri: imageFile.uri,
      name: imageFile.name || 'photo.jpg',
      type: imageFile.type || 'image/jpeg',
    });

    const response = await api.put(`/uploadImage/${userId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Articles API calls
export const getArticles = async () => {
  try {
    const response = await api.get('/listArticle');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getArticleById = async (articleId) => {
  try {
    const response = await api.get(`/articleById/${articleId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const searchArticle = async (title) => {
  try {
    const response = await api.get(`/articleSearch/${title}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Pronunciation lessons API calls
export const getPronunciationLessons = async (level) => {
  try {
    const response = await api.get(`/pronunciationListByLevel/${level}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPronunciationById = async (id) => {
  try {
    const response = await api.get(`/pronunciationListById/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const submitPronunciation = async (id, audioFile) => {
  try {
    const formData = new FormData();
    formData.append('file', {
      uri: audioFile,
      name: 'recording.wav',
      type: 'audio/wav',
    });

    const response = await api.post(`/checkPronunciation/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Spelling lessons API calls
export const getSpellingLessons = async (level) => {
  try {
    const response = await api.get(`/spellingListByLevel/${level}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getSpellingById = async (id) => {
  try {
    const response = await api.get(`/spellingListById/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const submitSpelling = async (id, text) => {
  try {
    const formData = new FormData();
    formData.append('text', text);
    
    const response = await api.post(`/checkSpelling/${id}`, formData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default api;