import axios from 'axios';

const API_BASE_URL = '/api';

// Assessor lookup API call
export const assessorLookup = async (address) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/assessor-lookup`, {
      address: address
    });
    return response.data;
  } catch (error) {
    throw new Error(`Assessor lookup failed: ${error.response?.data?.error || error.message}`);
  }
};

// Recorder search API call
export const recorderSearch = async (granteeName, searchType) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/recorder-search`, {
      granteeName: granteeName,
      searchType: searchType
    });
    return response.data;
  } catch (error) {
    throw new Error(`Recorder search failed: ${error.response?.data?.error || error.message}`);
  }
};

// Tax status API call
export const taxStatus = async (parcelNumber) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/tax-status`, {
      parcelNumber: parcelNumber
    });
    return response.data;
  } catch (error) {
    throw new Error(`Tax status lookup failed: ${error.response?.data?.error || error.message}`);
  }
};

// Health check API call
export const healthCheck = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/health`);
    return response.data;
  } catch (error) {
    throw new Error(`API health check failed: ${error.message}`);
  }
};


