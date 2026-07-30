// Load platform statistics
async function loadStats() {
  try {
    const response = await fetch('/api/skills/stats');
    const result = await response.json();
    
    if (result.success) {
      const userCount = result.data.userCount;
      const skillCount = result.data.skillCount;
      
      // Update the stat cards
      const userCountElement = document.getElementById('user-count');
      const skillCountElement = document.getElementById('skill-count');
      
      if (userCountElement) {
        userCountElement.textContent = userCount;
      }
      
      if (skillCountElement) {
        skillCountElement.textContent = skillCount;
      }
    }
  } catch (error) {
    console.error('Error loading stats:', error);
    // Keep default values if API fails
  }
}

// Initialize about page
document.addEventListener('DOMContentLoaded', function() {
  if (window.location.pathname.includes('/pages/about.html') ||
      window.location.href.includes('/pages/about.html')) {
    loadStats();
  }
});
