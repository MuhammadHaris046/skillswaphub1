// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
  // Check if we're on dashboard page
  if (window.location.pathname.includes('/pages/dashboard.html') ||
      window.location.href.includes('/pages/dashboard.html')) {
    loadDashboard();
  }
});

// Load dashboard data
async function loadDashboard() {
  const authRequired = document.getElementById('auth-required');
  const dashboardContent = document.getElementById('dashboard-content');

  // Check authentication
  if (!isLoggedIn()) {
    if (authRequired) authRequired.classList.remove('d-none');
    if (dashboardContent) dashboardContent.classList.add('d-none');
    return;
  }

  // Show dashboard content
  if (authRequired) authRequired.classList.add('d-none');
  if (dashboardContent) dashboardContent.classList.remove('d-none');

  // Load all dashboard data
  loadMySkills();
  loadSentRequests();
  loadReceivedRequests();

  // Setup tab switching to refresh data
  const tabs = document.querySelectorAll('#dashboardTabs button[data-bs-toggle="tab"]');
  tabs.forEach(tab => {
    tab.addEventListener('shown.bs.tab', function(e) {
      const targetId = e.target.getAttribute('data-bs-target');
      
      if (targetId === '#skills-content') {
        loadMySkills();
      } else if (targetId === '#sent-content') {
        loadSentRequests();
      } else if (targetId === '#received-content') {
        loadReceivedRequests();
      }
    });
  });
}

// Load skills I offer
async function loadMySkills() {
  try {
    const loading = document.getElementById('skills-loading');
    const skillsList = document.getElementById('my-skills-list');
    const noSkills = document.getElementById('no-skills');

    // Show loading
    if (loading) loading.classList.remove('d-none');
    if (skillsList) skillsList.classList.add('d-none');
    if (noSkills) noSkills.classList.add('d-none');

    const response = await apiRequest('/skills/mine');
    const skills = response.data;

    // Hide loading
    if (loading) loading.classList.add('d-none');

    if (skills.length > 0) {
      displayMySkills(skills);
      if (skillsList) skillsList.classList.remove('d-none');
    } else {
      if (noSkills) noSkills.classList.remove('d-none');
    }
  } catch (error) {
    console.error('Error loading my skills:', error);
    showError('Failed to load your skills. Please try again.');
  }
}

// Display my skills
function displayMySkills(skills) {
  const skillsList = document.getElementById('my-skills-list');
  if (!skillsList) return;

  skillsList.innerHTML = skills.map(skill => `
    <div class="skill-card card mb-3">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-start">
          <div>
            <h5 class="card-title">${escapeHtml(skill.title)}</h5>
            <p class="text-muted mb-2">
              <span class="badge bg-secondary">${escapeHtml(skill.category)}</span>
            </p>
            <p class="card-text">${escapeHtml(skill.description)}</p>
          </div>
          <button class="btn btn-outline-danger btn-sm delete-skill-btn" data-skill-id="${skill._id}">
            Delete
          </button>
        </div>
      </div>
    </div>
  `).join('');

  // Add event listeners to delete buttons
  document.querySelectorAll('.delete-skill-btn').forEach(btn => {
    btn.addEventListener('click', async function() {
      const skillId = this.dataset.skillId;
      
      if (confirm('Are you sure you want to delete this skill?')) {
        try {
          await apiRequest(`/skills/${skillId}`, 'DELETE');
          // Refresh the list
          loadMySkills();
        } catch (error) {
          alert('Failed to delete skill: ' + error.message);
        }
      }
    });
  });
}

// Load sent requests
async function loadSentRequests() {
  try {
    const loading = document.getElementById('sent-loading');
    const requestsList = document.getElementById('sent-requests-list');
    const noSent = document.getElementById('no-sent');

    // Show loading
    if (loading) loading.classList.remove('d-none');
    if (requestsList) requestsList.classList.add('d-none');
    if (noSent) noSent.classList.add('d-none');

    const response = await apiRequest('/requests/sent');
    const requests = response.data;

    // Hide loading
    if (loading) loading.classList.add('d-none');

    if (requests.length > 0) {
      displaySentRequests(requests);
      if (requestsList) requestsList.classList.remove('d-none');
    } else {
      if (noSent) noSent.classList.remove('d-none');
    }
  } catch (error) {
    console.error('Error loading sent requests:', error);
    showError('Failed to load your requests. Please try again.');
  }
}

// Display sent requests
function displaySentRequests(requests) {
  const requestsList = document.getElementById('sent-requests-list');
  if (!requestsList) return;

  requestsList.innerHTML = requests.map(request => `
    <div class="request-card ${request.status}">
      <div class="d-flex justify-content-between align-items-start">
        <div>
          <h5 class="card-title">${escapeHtml(request.skillId?.title || 'Unknown Skill')}</h5>
          <p class="text-muted mb-2">
            <span class="badge bg-${getStatusBadgeClass(request.status)}">${request.status.toUpperCase()}</span>
          </p>
          <p class="card-text mb-1">
            <strong>Sent to:</strong> ${escapeHtml(request.toUser?.name || 'Unknown')}
          </p>
          <p class="card-text mb-1">
            <strong>University:</strong> ${escapeHtml(request.toUser?.university || 'Unknown')}
          </p>
          <p class="card-text">
            <small class="text-muted">Requested on: ${new Date(request.createdAt).toLocaleDateString()}</small>
          </p>
        </div>
      </div>
    </div>
  `).join('');
}

// Load received requests
async function loadReceivedRequests() {
  try {
    const loading = document.getElementById('received-loading');
    const requestsList = document.getElementById('received-requests-list');
    const noReceived = document.getElementById('no-received');

    // Show loading
    if (loading) loading.classList.remove('d-none');
    if (requestsList) requestsList.classList.add('d-none');
    if (noReceived) noReceived.classList.add('d-none');

    const response = await apiRequest('/requests/received');
    const requests = response.data;

    // Hide loading
    if (loading) loading.classList.add('d-none');

    if (requests.length > 0) {
      displayReceivedRequests(requests);
      if (requestsList) requestsList.classList.remove('d-none');
    } else {
      if (noReceived) noReceived.classList.remove('d-none');
    }
  } catch (error) {
    console.error('Error loading received requests:', error);
    showError('Failed to load received requests. Please try again.');
  }
}

// Display received requests
function displayReceivedRequests(requests) {
  const requestsList = document.getElementById('received-requests-list');
  if (!requestsList) return;

  requestsList.innerHTML = requests.map(request => `
    <div class="request-card ${request.status}">
      <div class="d-flex justify-content-between align-items-start">
        <div>
          <h5 class="card-title">${escapeHtml(request.skillId?.title || 'Unknown Skill')}</h5>
          <p class="text-muted mb-2">
            <span class="badge bg-${getStatusBadgeClass(request.status)}">${request.status.toUpperCase()}</span>
          </p>
          <p class="card-text mb-1">
            <strong>Requested by:</strong> ${escapeHtml(request.fromUser?.name || 'Unknown')}
          </p>
          <p class="card-text mb-1">
            <strong>University:</strong> ${escapeHtml(request.fromUser?.university || 'Unknown')}
          </p>
          <p class="card-text">
            <small class="text-muted">Received on: ${new Date(request.createdAt).toLocaleDateString()}</small>
          </p>
        </div>
        ${request.status === 'pending' ? `
          <div class="action-buttons">
            <button class="btn btn-success btn-sm me-2 accept-btn" data-request-id="${request._id}">
              Accept
            </button>
            <button class="btn btn-danger btn-sm reject-btn" data-request-id="${request._id}">
              Reject
            </button>
          </div>
        ` : ''}
      </div>
    </div>
  `).join('');

  // Add event listeners to accept/reject buttons
  document.querySelectorAll('.accept-btn').forEach(btn => {
    btn.addEventListener('click', async function() {
      const requestId = this.dataset.requestId;
      await updateRequestStatus(requestId, 'accepted');
    });
  });

  document.querySelectorAll('.reject-btn').forEach(btn => {
    btn.addEventListener('click', async function() {
      const requestId = this.dataset.requestId;
      await updateRequestStatus(requestId, 'rejected');
    });
  });
}

// Update request status
async function updateRequestStatus(requestId, status) {
  try {
    await apiRequest(`/requests/${requestId}`, 'PATCH', { status });
    // Refresh the list
    loadReceivedRequests();
  } catch (error) {
    alert(`Failed to ${status} request: ` + error.message);
  }
}

// Get status badge class
function getStatusBadgeClass(status) {
  switch (status) {
    case 'pending':
      return 'warning';
    case 'accepted':
      return 'success';
    case 'rejected':
      return 'danger';
    default:
      return 'secondary';
  }
}

// Helper function to escape HTML
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
