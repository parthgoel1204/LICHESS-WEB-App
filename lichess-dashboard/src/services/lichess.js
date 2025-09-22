import axios from 'axios';

// Base URL for Lichess API
const API_BASE_URL = 'https://lichess.org/api';

// Create axios instance with base URL and common headers
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Accept': 'application/json',
    'User-Agent': 'Lichess-Dashboard/1.0 (https://github.com/yourusername/lichess-dashboard)'
  }
});

/**
 * Fetch user profile data from Lichess API
 * @param {string} username - Lichess username
 * @returns {Promise<Object>} User profile data
 */
export const getUserProfile = async (username) => {
  try {
    const response = await apiClient.get(`/user/${username}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw new Error('User not found');
    }
    throw error;
  }
};

/**
 * Fetch leaderboard data for a specific time control
 * @param {string} timeControl - Time control (e.g., 'bullet', 'blitz', 'rapid', 'classical')
 * @param {number} [nb=10] - Number of players to fetch
 * @returns {Promise<Object>} Leaderboard data
 */
export const getLeaderboards = async (timeControl = 'blitz', nb = 10) => {
  try {
    const response = await apiClient.get(`/player/top/${nb}/${timeControl}`);
    return {
      timeControl,
      users: response.data
    };
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    throw error;
  }
};

/**
 * Fetch tournament data from Lichess API
 * @returns {Promise<Object>} Tournament data grouped by status
 */
export const getTournaments = async () => {
  try {
    const response = await apiClient.get('/tournament');
    const now = new Date().getTime();
    
    // Categorize tournaments
    const result = {
      created: [],
      started: [],
      finished: []
    };
    
    response.data.map(tournament => {
      const start = new Date(tournament.startsAt).getTime();
      const end = new Date(tournament.finishesAt).getTime();
      
      if (now < start) {
        result.created.push(tournament);
      } else if (now >= start && now <= end) {
        result.started.push(tournament);
      } else {
        result.finished.push(tournament);
      }
      return null;
    });
    
    // Sort tournaments by start time
    result.created.sort((a, b) => new Date(a.startsAt) - new Date(b.startsAt));
    result.started.sort((a, b) => new Date(a.startsAt) - new Date(b.startsAt));
    result.finished.sort((a, b) => new Date(b.startsAt) - new Date(a.startsAt));
    
    // Limit finished tournaments to most recent 10
    result.finished = result.finished.slice(0, 10);
    
    return result;
  } catch (error) {
    console.error('Error fetching tournaments:', error);
    throw error;
  }
};

/**
 * Get the current status of Lichess API
 * @returns {Promise<Object>} API status
 */
export const getApiStatus = async () => {
  try {
    const response = await apiClient.get('/status');
    return response.data;
  } catch (error) {
    console.error('Error fetching API status:', error);
    throw error;
  }
};
