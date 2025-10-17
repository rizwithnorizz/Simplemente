const BASE_URL = import.meta.env.MODE === 'development' ? 'http://localhost:5001' : '';

export const config = {
  apiUrl: BASE_URL,
  imageUrl: `${BASE_URL}/Images`
};

export default config;