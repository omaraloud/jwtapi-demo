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
    registerContainer.style.display = 'none';
    dashboardContainer.style.display = 'none';
    errorMessage.textContent = '';
    registerErrorMessage.textContent = '';
}

// Show dashboard
function showDashboard(username, token) {
    loginContainer.style.display = 'none';
    registerContainer.style.display = 'none';
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

// Show registration form
function showRegister() {
    loginContainer.style.display = 'none';
    registerContainer.style.display = 'block';
    dashboardContainer.style.display = 'none';
    errorMessage.textContent = '';
    registerErrorMessage.textContent = '';
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
            
            // Clear form
            registerForm.reset();
            
            // Switch to login after 2 seconds
            setTimeout(() => {
                showLogin();
                registerErrorMessage.textContent = '';
                registerErrorMessage.style.color = '#dc3545';
            }, 2000);
        } else {
            // Show error message
            registerErrorMessage.textContent = data.message || 'Registration failed. Please try again.';
        }
    } catch (error) {
        console.error('Registration error:', error);
        registerErrorMessage.textContent = 'Network error. Please check your connection.';
    } finally {
        // Reset button state
        submitBtn.textContent = 'Create Account';
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    }
});

// Handle show register button
showRegisterBtn.addEventListener('click', () => {
    showRegister();
    loginForm.reset();
});

// Handle show login button
showLoginBtn.addEventListener('click', () => {
    showLogin();
    registerForm.reset();
});

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    checkAuthStatus();
}); 