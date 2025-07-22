// DOM elements
const loginContainer = document.getElementById('loginContainer');
const registerContainer = document.getElementById('registerContainer');
const dashboardContainer = document.getElementById('dashboardContainer');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const errorMessage = document.getElementById('errorMessage');
const registerErrorMessage = document.getElementById('registerErrorMessage');
const userDisplay = document.getElementById('userDisplay');
const tokenDisplay = document.getElementById('tokenDisplay');
const logoutBtn = document.getElementById('logoutBtn');
const copyTokenBtn = document.getElementById('copyTokenBtn');
const showRegisterBtn = document.getElementById('showRegisterBtn');
const showLoginBtn = document.getElementById('showLoginBtn');

// Password toggle elements
const togglePassword = document.getElementById('togglePassword');
const toggleRegPassword = document.getElementById('toggleRegPassword');
const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
const passwordInput = document.getElementById('password');
const regPasswordInput = document.getElementById('regPassword');
const confirmPasswordInput = document.getElementById('confirmPassword');

// Theme toggle elements
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('.theme-icon');

// Application states
const APP_STATES = {
    LOGIN: 'login',
    REGISTER: 'register',
    DASHBOARD: 'dashboard'
};

// Theme management
const THEMES = {
    LIGHT: 'light',
    DARK: 'dark'
};

// Initialize theme
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || THEMES.DARK;
    setTheme(savedTheme);
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Update theme icon
    if (theme === THEMES.LIGHT) {
        themeIcon.textContent = '🌙';
    } else {
        themeIcon.textContent = '☀️';
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT;
    setTheme(newTheme);
}

// Password toggle functionality
function togglePasswordVisibility(inputElement, toggleButton) {
    const type = inputElement.type === 'password' ? 'text' : 'password';
    inputElement.type = type;
    
    if (type === 'text') {
        toggleButton.classList.add('showing');
        toggleButton.querySelector('.eye-icon').textContent = '🙈';
    } else {
        toggleButton.classList.remove('showing');
        toggleButton.querySelector('.eye-icon').textContent = '👁️';
    }
}

// Check if user is already logged in
function checkAuthStatus() {
    const token = localStorage.getItem('jwt_token');
    const username = localStorage.getItem('username');
    
    if (token && username) {
        // If authenticated, always show dashboard regardless of URL
        showDashboard(username, token);
        // Update URL to reflect current state
        if (window.location.hash !== `#${APP_STATES.DASHBOARD}`) {
            window.history.replaceState({ state: APP_STATES.DASHBOARD }, '', `#${APP_STATES.DASHBOARD}`);
        }
    } else {
        // Check URL hash or default to login
        const hash = window.location.hash.slice(1) || APP_STATES.LOGIN;
        navigateToState(hash);
    }
}

// Navigate to a specific state and update URL
function navigateToState(state) {
    switch (state) {
        case APP_STATES.LOGIN:
            showLogin();
            break;
        case APP_STATES.REGISTER:
            showRegister();
            break;
        case APP_STATES.DASHBOARD:
            const token = localStorage.getItem('jwt_token');
            const username = localStorage.getItem('username');
            if (token && username) {
                showDashboard(username, token);
            } else {
                // Redirect to login if not authenticated
                navigateToState(APP_STATES.LOGIN);
                return;
            }
            break;
        default:
            navigateToState(APP_STATES.LOGIN);
            return;
    }
    
    // Update URL without triggering a page reload
    if (window.location.hash !== `#${state}`) {
        window.history.pushState({ state }, '', `#${state}`);
    }
}

// Show login form
function showLogin() {
    loginContainer.style.display = 'block';
    registerContainer.style.display = 'none';
    dashboardContainer.style.display = 'none';
    errorMessage.textContent = '';
    registerErrorMessage.textContent = '';
    // Force hide error messages
    errorMessage.style.display = 'none';
    registerErrorMessage.style.display = 'none';
}

// Show dashboard
function showDashboard(username, token) {
    loginContainer.style.display = 'none';
    registerContainer.style.display = 'none';
    dashboardContainer.style.display = 'block';
    
    userDisplay.textContent = username;
    tokenDisplay.textContent = token;
    
    // Initialize dashboard data
    initializeDashboard(username, token);
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
            navigateToState(APP_STATES.DASHBOARD);
        } else {
            // Show error message
            errorMessage.textContent = data.message || 'Login failed. Please try again.';
            errorMessage.style.display = 'block';
            // Trigger reflow for smooth animation
            errorMessage.offsetHeight;
            errorMessage.style.opacity = '1';
            errorMessage.style.transform = 'translateY(0)';
        }
    } catch (error) {
        console.error('Login error:', error);
        errorMessage.textContent = 'Network error. Please check your connection.';
        errorMessage.style.display = 'block';
        // Trigger reflow for smooth animation
        errorMessage.offsetHeight;
        errorMessage.style.opacity = '1';
        errorMessage.style.transform = 'translateY(0)';
    } finally {
        // Reset button state
        submitBtn.textContent = 'Sign In';
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    }
});

// Handle logout
logoutBtn.addEventListener('click', () => {
    if (sessionTimer) {
        clearInterval(sessionTimer);
    }
    // Clear stored data
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('username');
    
    // Navigate to login
    navigateToState(APP_STATES.LOGIN);
    
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
        
        addActivityLog('Token copied to clipboard');
    } catch (error) {
        console.error('Failed to copy token:', error);
        alert('Failed to copy token. Please copy it manually.');
    }
});

// Handle refresh button
document.getElementById('refreshBtn').addEventListener('click', () => {
    const token = localStorage.getItem('jwt_token');
    const username = localStorage.getItem('username');
    if (token && username) {
        addActivityLog('Dashboard data refreshed');
        // Add rotation animation
        const refreshBtn = document.getElementById('refreshBtn');
        refreshBtn.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            refreshBtn.style.transform = 'rotate(0deg)';
        }, 500);
    }
});

// Handle validate token button
document.getElementById('validateTokenBtn').addEventListener('click', async () => {
    const token = localStorage.getItem('jwt_token');
    if (!token) return;
    
    try {
        const response = await fetch('/protected/validate', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            addActivityLog('Token validation successful');
            showNotification('Token is valid!', 'success');
        } else {
            addActivityLog('Token validation failed');
            showNotification('Token is invalid or expired', 'error');
        }
    } catch (error) {
        addActivityLog('Token validation error');
        showNotification('Network error during validation', 'error');
    }
});

// Handle quick action buttons
document.getElementById('testAuthBtn').addEventListener('click', async () => {
    const token = localStorage.getItem('jwt_token');
    if (!token) return;
    
    try {
        const response = await fetch('/protected', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            addActivityLog('Authentication test successful');
            showNotification('Authentication working!', 'success');
        } else {
            addActivityLog('Authentication test failed');
            showNotification('Authentication failed', 'error');
        }
    } catch (error) {
        addActivityLog('Authentication test error');
        showNotification('Network error', 'error');
    }
});

document.getElementById('viewProfileBtn').addEventListener('click', async () => {
    const token = localStorage.getItem('jwt_token');
    if (!token) return;
    
    try {
        const response = await fetch('/protected/profile', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            addActivityLog('Profile data retrieved');
            showNotification(`Profile loaded for ${data.user.username}`, 'success');
        } else {
            addActivityLog('Profile retrieval failed');
            showNotification('Failed to load profile', 'error');
        }
    } catch (error) {
        addActivityLog('Profile retrieval error');
        showNotification('Network error', 'error');
    }
});

document.getElementById('apiDocsBtn').addEventListener('click', () => {
    addActivityLog('Opening API documentation');
    window.open('/api-docs', '_blank');
});

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Show registration form
function showRegister() {
    loginContainer.style.display = 'none';
    registerContainer.style.display = 'block';
    dashboardContainer.style.display = 'none';
    errorMessage.textContent = '';
    registerErrorMessage.textContent = '';
    // Force hide error messages
    errorMessage.style.display = 'none';
    registerErrorMessage.style.display = 'none';
}

// Handle registration form submission
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(registerForm);
    const username = formData.get('username');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    
    // Validate password confirmation
    if (password !== confirmPassword) {
        registerErrorMessage.textContent = 'Passwords do not match';
        registerErrorMessage.style.display = 'block';
        return;
    }
    
    // Show loading state
    const submitBtn = registerForm.querySelector('.register-btn');
    submitBtn.textContent = 'Creating Account...';
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    try {
        const response = await fetch('/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Show success message and switch to login
            registerErrorMessage.textContent = '';
            registerErrorMessage.style.color = '#28a745';
            registerErrorMessage.textContent = 'Account created successfully! Please sign in.';
            registerErrorMessage.style.display = 'block';
            
            // Clear form
            registerForm.reset();
            
            // Switch to login after 2 seconds
            setTimeout(() => {
                navigateToState(APP_STATES.LOGIN);
                registerErrorMessage.textContent = '';
                registerErrorMessage.style.color = '#dc3545';
                registerErrorMessage.style.display = 'none';
            }, 2000);
        } else {
            // Show error message
            registerErrorMessage.textContent = data.message || 'Registration failed. Please try again.';
            registerErrorMessage.style.display = 'block';
        }
    } catch (error) {
        console.error('Registration error:', error);
        registerErrorMessage.textContent = 'Network error. Please check your connection.';
        registerErrorMessage.style.display = 'block';
    } finally {
        // Reset button state
        submitBtn.textContent = 'Create Account';
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    }
});

// Handle show register button
showRegisterBtn.addEventListener('click', () => {
    navigateToState(APP_STATES.REGISTER);
    loginForm.reset();
});

// Handle show login button
showLoginBtn.addEventListener('click', () => {
    navigateToState(APP_STATES.LOGIN);
    registerForm.reset();
});

// Handle browser back/forward buttons
window.addEventListener('popstate', (event) => {
    const state = event.state?.state || window.location.hash.slice(1) || APP_STATES.LOGIN;
    navigateToState(state);
});

// Handle direct URL access with hash
window.addEventListener('hashchange', (event) => {
    const state = window.location.hash.slice(1) || APP_STATES.LOGIN;
    navigateToState(state);
});

// Password toggle event listeners
togglePassword.addEventListener('click', () => {
    togglePasswordVisibility(passwordInput, togglePassword);
});

toggleRegPassword.addEventListener('click', () => {
    togglePasswordVisibility(regPasswordInput, toggleRegPassword);
});

toggleConfirmPassword.addEventListener('click', () => {
    togglePasswordVisibility(confirmPasswordInput, toggleConfirmPassword);
});

// Theme toggle event listener
themeToggle.addEventListener('click', toggleTheme);

// Add keyboard support for password toggles
togglePassword.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        togglePasswordVisibility(passwordInput, togglePassword);
    }
});

toggleRegPassword.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        togglePasswordVisibility(regPasswordInput, toggleRegPassword);
    }
});

toggleConfirmPassword.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        togglePasswordVisibility(confirmPasswordInput, toggleConfirmPassword);
    }
});

// Dashboard functionality
let loginStartTime = null;
let sessionTimer = null;

function initializeDashboard(username, token) {
    loginStartTime = new Date();
    updateSessionDuration();
    
    // Start session timer
    sessionTimer = setInterval(updateSessionDuration, 1000);
    
    // Update login time
    document.getElementById('loginTime').textContent = loginStartTime.toLocaleTimeString();
    
    // Add initial activity log entry
    addActivityLog('Successfully logged in', 'Just now');
}

function updateSessionDuration() {
    if (loginStartTime) {
        const now = new Date();
        const duration = Math.floor((now - loginStartTime) / 1000);
        const minutes = Math.floor(duration / 60);
        const seconds = duration % 60;
        document.getElementById('sessionDuration').textContent = 
            `${minutes}m ${seconds}s`;
    }
}

function addActivityLog(message, time = null) {
    const activityLog = document.getElementById('activityLog');
    const logEntry = document.createElement('div');
    logEntry.className = 'log-entry';
    
    const logTime = document.createElement('span');
    logTime.className = 'log-time';
    logTime.textContent = time || new Date().toLocaleTimeString();
    
    const logMessage = document.createElement('span');
    logMessage.className = 'log-message';
    logMessage.textContent = message;
    
    logEntry.appendChild(logTime);
    logEntry.appendChild(logMessage);
    
    activityLog.insertBefore(logEntry, activityLog.firstChild);
    
    // Keep only last 10 entries
    while (activityLog.children.length > 10) {
        activityLog.removeChild(activityLog.lastChild);
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    checkAuthStatus();
}); 