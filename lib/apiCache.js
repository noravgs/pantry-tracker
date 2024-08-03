const CACHE_PREFIX = 'recipe_cache_';
const DAILY_LIMIT_KEY = 'recipe_api_daily_limit';
const DAILY_LIMIT = 150; // Set this to your desired daily limit

export const getCache = (key) => {
  const cacheKey = CACHE_PREFIX + key;
  const cachedData = localStorage.getItem(cacheKey);
  if (cachedData) {
    const { data, timestamp } = JSON.parse(cachedData);
    // Cache for 1 hour
    if (Date.now() - timestamp < 3600000) {
      return data;
    }
  }
  return null;
};

export const setCache = (key, data) => {
  const cacheKey = CACHE_PREFIX + key;
  const cacheData = JSON.stringify({
    data,
    timestamp: Date.now(),
  });
  localStorage.setItem(cacheKey, cacheData);
};

export const incrementApiCall = () => {
  const today = new Date().toDateString();
  const dailyLimit = JSON.parse(localStorage.getItem(DAILY_LIMIT_KEY) || '{}');
  
  if (dailyLimit.date !== today) {
    dailyLimit.date = today;
    dailyLimit.count = 0;
  }
  
  dailyLimit.count += 1;
  localStorage.setItem(DAILY_LIMIT_KEY, JSON.stringify(dailyLimit));
  
  return dailyLimit.count <= DAILY_LIMIT;
};