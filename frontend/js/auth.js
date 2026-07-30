// Authentication utilities and UI updates

// Check if user is logged in
function isLoggedIn() {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  return !!(token && user);
}

// Get current user
function getCurrentUser() {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
}

// Update navigation based on authentication status
function updateNavigation() {
  const authLinks = document.querySelectorAll('.auth-links');
  const userLinks = document.querySelectorAll('.user-links');
  const usernameLinks = document.querySelectorAll('.username-link');
  const getStartedBtn = document.getElementById('get-started-btn');

  if (isLoggedIn()) {
    // Show user links, hide auth links
    authLinks.forEach(link => link.classList.add('d-none'));
    userLinks.forEach(link => link.classList.remove('d-none'));

    // Update username
    const user = getCurrentUser();
    usernameLinks.forEach(link => {
      link.textContent = user.name;
    });

    // Hide "Get Started" button
    if (getStartedBtn) {
      getStartedBtn.classList.add('d-none');
    }
  } else {
    // Show auth links, hide user links
    authLinks.forEach(link => link.classList.remove('d-none'));
    userLinks.forEach(link => link.classList.add('d-none'));

    // Show "Get Started" button
    if (getStartedBtn) {
      getStartedBtn.classList.remove('d-none');
    }
  }
}

// Handle logout
function handleLogout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/pages/index.html';
}

// Redirect if not logged in
function requireAuth() {
  if (!isLoggedIn()) {
    window.location.href = '/pages/login.html';
    return false;
  }
  return true;
}

// Redirect if already logged in
function requireGuest() {
  if (isLoggedIn()) {
    window.location.href = '/pages/dashboard.html';
    return false;
  }
  return true;
}

// Initialize authentication UI
document.addEventListener('DOMContentLoaded', function() {
  // Update navigation
  updateNavigation();

  // Setup logout button
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function(e) {
      e.preventDefault();
      handleLogout();
    });
  }

  // Handle login form
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      try {
        const response = await apiRequest('/auth/login', 'POST', {
          email,
          password
        });

        // Store token and user
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        // Update navigation
        updateNavigation();

        // Redirect to dashboard
        window.location.href = '/pages/dashboard.html';
      } catch (error) {
        showError(error.message);
      }
    });
  }

  // Handle register form
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const university = document.getElementById('university').value;

      try {
        const response = await apiRequest('/auth/register', 'POST', {
          name,
          email,
          password,
          university
        });

        // Store token and user
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        // Update navigation
        updateNavigation();

        // Redirect to dashboard
        window.location.href = '/pages/dashboard.html';
      } catch (error) {
        showError(error.message);
      }
    });
  }
});
