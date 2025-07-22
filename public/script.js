// DOM elements
const loginContainer = document.getElementById('loginContainer');
const dashboardContainer = document.getElementById('dashboardContainer');
const loginForm = document.getElementById('loginForm');
const errorMessage = document.getElementById('errorMessage');
const userDisplay = document.getElementById('userDisplay');
const tokenDisplay = document.getElementById('tokenDisplay');
const logoutBtn = document.getElementById('logoutBtn');
const copyTokenBtn = document.getElementById('copyTokenBtn');

// Check if user is already logged in
function checkAuthStatus() {
    const token = localStorage.getItem('jwt_token');
    const username = localStorage.getItem('username');
    
    if (token && username) {
        showDashboard(username, token);
    } else {
        showLogin();
    }
}

// Show login form
function showLogin() {
    loginContainer.style.display = 'block';
    dashboardContainer.style.display = 'none';
    errorMessage.textContent = '';
}

// Show dashboard
function showDashboard(username, token) {
    loginContainer.style.display = 'none';
    dashboardContainer.style.display = 'block';
    
    userDisplay.textContent = username;
    tokenDisplay.textContent = token;
}

// Handle login form submission
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(loginForm);
    const username = formData.get('username');
    const password = formData.get('password');
    
    // Show loading state
    const submitBtn = loginForm.querySelector('.login-btn');
    submitBtn.textContent = 'Signing In...';
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    try {
        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Store token and username
            localStorage.setItem('jwt_token', data.token);
            localStorage.setItem('username', username);
            
            // Show dashboard
            showDashboard(username, data.token);
        } else {
            // Show error message
            errorMessage.textContent = data.message || 'Login failed. Please try again.';
        }
    } catch (error) {
        console.error('Login error:', error);
        errorMessage.textContent = 'Network error. Please check your connection.';
    } finally {
        // Reset button state
        submitBtn.textContent = 'Sign In';
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    }
});

// Handle logout
logoutBtn.addEventListener('click', () => {
    // Clear stored data
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('username');
    
    // Show login form
    showLogin();
    
    // Clear form
    loginForm.reset();
});

// Copy token to clipboard
copyTokenBtn.addEventListener('click', async () => {
    const token = tokenDisplay.textContent;
    
    try {
        await navigator.clipboard.writeText(token);
        
        // Show feedback
        const originalText = copyTokenBtn.textContent;
        copyTokenBtn.textContent = 'Copied!';
        copyTokenBtn.style.background = '#218838';
        
        setTimeout(() => {
            copyTokenBtn.textContent = originalText;
            copyTokenBtn.style.background = '#28a745';
        }, 2000);
    } catch (error) {
        console.error('Failed to copy token:', error);
        alert('Failed to copy token. Please copy it manually.');
    }
});

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    checkAuthStatus();
}); 