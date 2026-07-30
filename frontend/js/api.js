// API Base URL - auto-detects local vs live deployment
const API_BASE = window.location.hostname === 'localhost'
  ? 'http://localhost:5000/api'
  : '/api';

// Central fetch wrapper with automatic token handling
async function apiRequest(endpoint, method = 'GET', body = null) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json'
  };
  
  // Add Authorization header if token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null
    });

    const data = await response.json();

    // Check if response is successful
    if (!response.ok || data.success === false) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
}

// Helper function to show error messages
function showError(message, elementId = 'error-message') {
  const errorElement = document.getElementById(elementId);
  if (errorElement) {
    const errorText = errorElement.querySelector('#error-text') || errorElement;
    errorText.textContent = message;
    errorElement.classList.remove('d-none');
  }
}

// Helper function to hide error messages
function hideError(elementId = 'error-message') {
  const errorElement = document.getElementById(elementId);
  if (errorElement) {
    errorElement.classList.add('d-none');
  }
}

// Helper function to show success messages
function showSuccess(message, elementId = 'success-message') {
  const successElement = document.getElementById(elementId);
  if (successElement) {
    const successText = successElement.querySelector('#success-text') || successElement;
    successText.textContent = message;
    successElement.classList.remove('d-none');
  }
}

// Helper function to hide success messages
function hideSuccess(elementId = 'success-message') {
  const successElement = document.getElementById(elementId);
  if (successElement) {
    successElement.classList.add('d-none');
  }
}
