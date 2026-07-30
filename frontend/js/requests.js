// Request class for OOP approach
class Request {
  constructor(id, skillTitle, skillCategory, skillDescription, fromUser, toUser, status) {
    this.id = id;
    this.skillTitle = skillTitle;
    this.skillCategory = skillCategory;
    this.skillDescription = skillDescription;
    this.fromUser = fromUser;
    this.toUser = toUser;
    this.status = status;
  }
}

// Get current user
function getCurrentUser() {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
}

// Check if user is logged in
function isLoggedIn() {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  return !!(token && user);
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

// Initialize request session page
document.addEventListener('DOMContentLoaded', function() {
  // Check if we're on request session page
  if (window.location.pathname.includes('request-session.html') ||
      window.location.href.includes('request-session.html')) {
    loadSkillForRequest();
  }
});

// Load skill details for request page
async function loadSkillForRequest() {
  const urlParams = new URLSearchParams(window.location.search);
  const skillId = urlParams.get('skillId');

  if (!skillId) {
    showError('No skill specified');
    return;
  }

  try {
    const loading = document.getElementById('loading');
    const skillDetails = document.getElementById('skill-details');
    const authRequired = document.getElementById('auth-required');
    const requestForm = document.getElementById('request-form-container');
    const errorMessage = document.getElementById('error-message');

    // Show loading
    if (loading) loading.classList.remove('d-none');
    if (skillDetails) skillDetails.classList.add('d-none');
    if (authRequired) authRequired.classList.add('d-none');
    if (requestForm) requestForm.classList.add('d-none');
    if (errorMessage) errorMessage.classList.add('d-none');

    // Check authentication
    if (!isLoggedIn()) {
      if (loading) loading.classList.add('d-none');
      if (authRequired) authRequired.classList.remove('d-none');
      return;
    }

    // Load skill details
    const response = await apiRequest(`/skills/${skillId}`);
    const skill = response.data;

    // Check if user is trying to request their own skill
    const currentUser = getCurrentUser();
    if (currentUser && skill.userId?._id === currentUser.id) {
      if (loading) loading.classList.add('d-none');
      if (errorMessage) {
        document.getElementById('error-text').textContent = 'You cannot request your own skill.';
        errorMessage.classList.remove('d-none');
      }
      return;
    }

    // Hide loading
    if (loading) loading.classList.add('d-none');

    // Display skill details
    if (skillDetails) {
      document.getElementById('skill-title').textContent = skill.title;
      document.getElementById('skill-category').textContent = skill.category;
      document.getElementById('skill-description').textContent = skill.description;
      document.getElementById('skill-owner').textContent = skill.userId?.name || 'Unknown';
      document.getElementById('skill-university').textContent = skill.userId?.university || 'Unknown';
      skillDetails.classList.remove('d-none');
    }

    // Show request form
    if (requestForm) requestForm.classList.remove('d-none');

    // Setup send request button
    const sendBtn = document.getElementById('send-request-btn');
    if (sendBtn) {
      sendBtn.onclick = async function() {
        try {
          await apiRequest('/requests', 'POST', { skillId });

          // Show success modal
          const successModal = document.getElementById('successModal');
          if (successModal) {
            const bootstrapModal = new bootstrap.Modal(successModal);
            bootstrapModal.show();
          }
        } catch (error) {
          if (errorMessage) {
            document.getElementById('error-text').textContent = error.message;
            errorMessage.classList.remove('d-none');
          }
        }
      };
    }
  } catch (error) {
    console.error('Error loading skill:', error);
    const loading = document.getElementById('loading');
    const errorMessage = document.getElementById('error-message');
    
    if (loading) loading.classList.add('d-none');
    if (errorMessage) {
      document.getElementById('error-text').textContent = error.message;
      errorMessage.classList.remove('d-none');
    }
  }
}
