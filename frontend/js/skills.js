// Skill class for OOP approach
class Skill {
  constructor(id, title, category, description, ownerName, ownerUniversity, ownerId) {
    this.id = id;
    this.title = title;
    this.category = category;
    this.description = description;
    this.ownerName = ownerName;
    this.ownerUniversity = ownerUniversity;
    this.ownerId = ownerId;
  }
}

// Skills cache for client-side filtering
let skillsCache = [];

// Initialize skills page
document.addEventListener('DOMContentLoaded', function() {
  // Check if we're on browse skills page
  if (window.location.pathname.includes('/pages/browse-skills.html') ||
      window.location.href.includes('/pages/browse-skills.html')) {
    loadSkills();
    setupSearchAndFilter();
  }

  // Check if we're on offer skill page
  if (window.location.pathname.includes('/pages/offer-skill.html') ||
      window.location.href.includes('/pages/offer-skill.html')) {
    setupOfferSkillForm();
  }
});

// Load all skills
async function loadSkills(search = '', category = '') {
  try {
    const loading = document.getElementById('loading');
    const skillsGrid = document.getElementById('skills-grid');
    const noResults = document.getElementById('no-results');

    // Show loading
    if (loading) loading.classList.remove('d-none');
    if (skillsGrid) skillsGrid.classList.add('d-none');
    if (noResults) noResults.classList.add('d-none');

    // Build query params
    let queryParams = '';
    if (search) queryParams += `search=${encodeURIComponent(search)}`;
    if (category) queryParams += `${queryParams ? '&' : ''}category=${encodeURIComponent(category)}`;

    const endpoint = queryParams ? `/skills?${queryParams}` : '/skills';
    const response = await apiRequest(endpoint);

    // Cache skills
    skillsCache = response.data.map(skill => new Skill(
      skill._id,
      skill.title,
      skill.category,
      skill.description,
      skill.userId?.name || 'Unknown',
      skill.userId?.university || 'Unknown',
      skill.userId?._id || null
    ));

    // Hide loading
    if (loading) loading.classList.add('d-none');

    // Display skills or show no results
    if (skillsCache.length > 0) {
      await displaySkills(skillsCache);
      if (skillsGrid) skillsGrid.classList.remove('d-none');
    } else {
      if (noResults) noResults.classList.remove('d-none');
    }
  } catch (error) {
    console.error('Error loading skills:', error);
    showError('Failed to load skills. Please try again.');
  }
}

// Display skills in grid
async function displaySkills(skills) {
  const skillsGrid = document.getElementById('skills-grid');
  if (!skillsGrid) return;

  // Get current user
  const currentUser = getCurrentUser();
  const currentUserId = currentUser ? currentUser.id : null;

  // Check request status for each skill if user is logged in
  const requestStatuses = {};
  if (currentUserId) {
    for (const skill of skills) {
      if (skill.ownerId !== currentUserId) {
        try {
          const response = await apiRequest(`/requests/check/${skill.id}`);
          requestStatuses[skill.id] = response.data;
        } catch (error) {
          console.error('Error checking request status:', error);
          requestStatuses[skill.id] = { hasRequest: false, status: null };
        }
      }
    }
  }

  skillsGrid.innerHTML = skills.map(skill => {
    // Check if current user is the owner of this skill
    const isOwnSkill = currentUserId && skill.ownerId === currentUserId;
    const requestStatus = requestStatuses[skill.id] || { hasRequest: false, status: null };

    let buttonHtml = '';
    if (isOwnSkill) {
      buttonHtml = `
        <button class="btn btn-secondary w-100" disabled>
          Your Skill
        </button>
      `;
    } else if (requestStatus.hasRequest) {
      if (requestStatus.status === 'pending') {
        buttonHtml = `
          <button class="btn btn-warning w-100" disabled>
            Request Pending
          </button>
        `;
      } else if (requestStatus.status === 'accepted') {
        buttonHtml = `
          <button class="btn btn-success w-100" disabled>
            Skill Added
          </button>
        `;
      } else if (requestStatus.status === 'rejected') {
        buttonHtml = `
          <button class="btn btn-primary w-100 request-btn"
                  data-skill-id="${skill.id}"
                  data-skill-title="${escapeHtml(skill.title)}"
                  data-skill-category="${escapeHtml(skill.category)}"
                  data-skill-description="${escapeHtml(skill.description)}"
                  data-owner-name="${escapeHtml(skill.ownerName)}"
                  data-owner-university="${escapeHtml(skill.ownerUniversity)}">
            Request Session
          </button>
        `;
      }
    } else {
      buttonHtml = `
        <button class="btn btn-primary w-100 request-btn"
                data-skill-id="${skill.id}"
                data-skill-title="${escapeHtml(skill.title)}"
                data-skill-category="${escapeHtml(skill.category)}"
                data-skill-description="${escapeHtml(skill.description)}"
                data-owner-name="${escapeHtml(skill.ownerName)}"
                data-owner-university="${escapeHtml(skill.ownerUniversity)}">
          Request Session
        </button>
      `;
    }

    return `
    <div class="col-md-6 col-lg-4">
      <div class="skill-card card h-100">
        <div class="card-body">
          <h5 class="card-title">${escapeHtml(skill.title)}</h5>
          <p class="text-muted mb-3">
            <span class="badge bg-secondary">${escapeHtml(skill.category)}</span>
          </p>
          <p class="card-text">${escapeHtml(skill.description.substring(0, 100))}${skill.description.length > 100 ? '...' : ''}</p>
          <p class="skill-owner">
            <small>Offered by ${escapeHtml(skill.ownerName)} from ${escapeHtml(skill.ownerUniversity)}</small>
          </p>
          ${buttonHtml}
        </div>
      </div>
    </div>
  `;
  }).join('');

  // Add event listeners to request buttons (only for enabled buttons)
  document.querySelectorAll('.request-btn:not([disabled])').forEach(btn => {
    btn.addEventListener('click', function() {
      const skillId = this.dataset.skillId;
      // Redirect to request session page
      window.location.href = `/pages/request-session.html?skillId=${skillId}`;
    });
  });
}

// Setup search and filter
function setupSearchAndFilter() {
  const searchBtn = document.getElementById('search-btn');
  const searchInput = document.getElementById('search-input');
  const categoryFilter = document.getElementById('category-filter');

  if (searchBtn) {
    searchBtn.addEventListener('click', async function() {
      const search = searchInput ? searchInput.value : '';
      const category = categoryFilter ? categoryFilter.value : '';
      await loadSkills(search, category);
    });
  }

  // Instant search on typing
  if (searchInput) {
    searchInput.addEventListener('input', async function() {
      const search = this.value.toLowerCase();
      const category = categoryFilter ? categoryFilter.value : '';
      await filterSkills(search, category);
    });
  }

  // Instant filter on category change
  if (categoryFilter) {
    categoryFilter.addEventListener('change', async function() {
      const search = searchInput ? searchInput.value.toLowerCase() : '';
      const category = this.value;
      await filterSkills(search, category);
    });
  }

  // Allow search on Enter key (still works for backward compatibility)
  if (searchInput) {
    searchInput.addEventListener('keypress', async function(e) {
      if (e.key === 'Enter') {
        const search = this.value;
        const category = categoryFilter ? categoryFilter.value : '';
        await loadSkills(search, category);
      }
    });
  }
}

// Filter skills client-side for instant search
async function filterSkills(search, category) {
  const skillsGrid = document.getElementById('skills-grid');
  const noResults = document.getElementById('no-results');

  if (!skillsGrid) return;

  // Filter cached skills
  const filteredSkills = skillsCache.filter(skill => {
    const matchesSearch = !search || 
      skill.title.toLowerCase().includes(search) ||
      skill.description.toLowerCase().includes(search) ||
      skill.category.toLowerCase().includes(search) ||
      skill.ownerName.toLowerCase().includes(search) ||
      skill.ownerUniversity.toLowerCase().includes(search);

    const matchesCategory = !category || skill.category === category;

    return matchesSearch && matchesCategory;
  });

  // Display filtered results
  if (filteredSkills.length > 0) {
    await displaySkills(filteredSkills);
    skillsGrid.classList.remove('d-none');
    if (noResults) noResults.classList.add('d-none');
  } else {
    skillsGrid.classList.add('d-none');
    if (noResults) noResults.classList.remove('d-none');
  }
}

// Setup offer skill form
function setupOfferSkillForm() {
  const form = document.getElementById('offer-skill-form');
  const titleInput = document.getElementById('title');
  const titleFeedback = document.getElementById('title-feedback');
  const authRequired = document.getElementById('auth-required');

  // Check authentication
  if (!isLoggedIn()) {
    if (form) form.classList.add('d-none');
    if (authRequired) authRequired.classList.remove('d-none');
    return;
  }

  // AJAX skill title check on blur
  if (titleInput && titleFeedback) {
    titleInput.addEventListener('blur', async function() {
      const title = this.value.trim();
      
      if (!title) {
        titleFeedback.textContent = '';
        titleFeedback.className = 'form-text mt-1';
        return;
      }

      try {
        titleFeedback.textContent = 'Checking...';
        titleFeedback.className = 'form-text mt-1 text-muted';

        const response = await apiRequest(`/skills/check?title=${encodeURIComponent(title)}`);

        if (response.data.available) {
          titleFeedback.textContent = '✓ Skill available';
          titleFeedback.className = 'form-text mt-1 text-success';
        } else {
          titleFeedback.textContent = '✗ You already added this skill';
          titleFeedback.className = 'form-text mt-1 text-danger';
        }
      } catch (error) {
        titleFeedback.textContent = 'Error checking skill availability';
        titleFeedback.className = 'form-text mt-1 text-danger';
      }
    });
  }

  // Handle form submission
  if (form) {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();

      const title = document.getElementById('title').value.trim();
      const category = document.getElementById('category').value;
      const description = document.getElementById('description').value.trim();

      try {
        const response = await apiRequest('/skills', 'POST', {
          title,
          category,
          description
        });

        // Show success modal
        const successModal = document.getElementById('successModal');
        if (successModal) {
          const bootstrapModal = new bootstrap.Modal(successModal);
          bootstrapModal.show();
        }

        // Reset form
        form.reset();
        if (titleFeedback) {
          titleFeedback.textContent = '';
          titleFeedback.className = 'form-text mt-1';
        }
      } catch (error) {
        showError(error.message);
      }
    });
  }
}

// Helper function to escape HTML
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
