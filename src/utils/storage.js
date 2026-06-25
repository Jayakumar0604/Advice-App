const KEYS = {
  FAVORITES: 'advice_favorites',
  HISTORY: 'advice_history',
};

/**
 * Get the list of favorite advices from local storage
 * @returns {Array<{id: number, advice: string, timestamp: number}>}
 */
export const getFavorites = () => {
  try {
    const data = localStorage.getItem(KEYS.FAVORITES);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Error reading favorites from localStorage:', e);
    return [];
  }
};

/**
 * Save an advice to favorites
 * @param {{id: number, advice: string}} item
 * @returns {Array} Updated list of favorites
 */
export const saveFavorite = (item) => {
  try {
    const favorites = getFavorites();
    if (!favorites.some((fav) => fav.id === item.id)) {
      const updated = [{ ...item, timestamp: Date.now() }, ...favorites];
      localStorage.setItem(KEYS.FAVORITES, JSON.stringify(updated));
      return updated;
    }
    return favorites;
  } catch (e) {
    console.error('Error saving favorite to localStorage:', e);
    return [];
  }
};

/**
 * Remove an advice from favorites
 * @param {number} id
 * @returns {Array} Updated list of favorites
 */
export const removeFavorite = (id) => {
  try {
    const favorites = getFavorites();
    const updated = favorites.filter((fav) => fav.id !== id);
    localStorage.setItem(KEYS.FAVORITES, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Error removing favorite from localStorage:', e);
    return [];
  }
};

/**
 * Get advice history from local storage
 * @returns {Array<{id: number, advice: string, timestamp: number}>}
 */
export const getHistory = () => {
  try {
    const data = localStorage.getItem(KEYS.HISTORY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Error reading history from localStorage:', e);
    return [];
  }
};

/**
 * Save an advice slip to history
 * @param {{id: number, advice: string}} item
 * @returns {Array} Updated history list
 */
export const saveHistory = (item) => {
  try {
    const history = getHistory();
    // Avoid double entries for identical consecutive advice items
    if (history.length > 0 && history[0].id === item.id) {
      return history;
    }
    const filtered = history.filter((h) => h.id !== item.id);
    const updated = [{ ...item, timestamp: Date.now() }, ...filtered].slice(0, 50); // Keep last 50
    localStorage.setItem(KEYS.HISTORY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Error saving history to localStorage:', e);
    return [];
  }
};

/**
 * Clear all history from local storage
 * @returns {Array} Empty array
 */
export const clearHistory = () => {
  try {
    localStorage.removeItem(KEYS.HISTORY);
    return [];
  } catch (e) {
    console.error('Error clearing history:', e);
    return [];
  }
};
