document.addEventListener("DOMContentLoaded", function() {
    console.log("DOM Content Loaded");
    
    // Get overlay elements
    const chatToggle = document.getElementById('chat-toggle');
    const optionsToggle = document.getElementById('options-toggle');
    const chatOverlay = document.getElementById('chat-overlay');
    const optionsOverlay = document.getElementById('options-overlay');
    const authOverlay = document.getElementById('auth-overlay');
    
    // Debug: Log if elements were found
    console.log("Elements found:", {
        chatToggle: !!chatToggle,
        optionsToggle: !!optionsToggle,
        chatOverlay: !!chatOverlay,
        optionsOverlay: !!optionsOverlay,
        authOverlay: !!authOverlay
    });

    // Get auth form elements
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const showRegisterLink = document.getElementById('show-register');
    const showLoginLink = document.getElementById('show-login');
    const loginLink = document.getElementById('login-link');
    const accountLink = document.getElementById('account-link');
    const logoutLink = document.getElementById('logout-link');

    // Check if user is logged in
    function checkAuthStatus() {
        const token = localStorage.getItem('token');
        if (token) {
            loginLink.classList.add('hidden');
            accountLink.classList.remove('hidden');
            logoutLink.classList.remove('hidden');
        } else {
            loginLink.classList.remove('hidden');
            accountLink.classList.add('hidden');
            logoutLink.classList.add('hidden');
        }
    }

    // Call on page load
    checkAuthStatus();

    // Toggle overlays
    chatToggle.addEventListener('click', function() {
        if (chatOverlay.classList.contains('show')) {
            chatOverlay.classList.remove('show');
            chatOverlay.classList.add('hidden');
        } else {
            chatOverlay.classList.remove('hidden');
            chatOverlay.classList.add('show');
            optionsOverlay.classList.remove('show');
            optionsOverlay.classList.add('hidden');
            authOverlay.classList.remove('show');
            authOverlay.classList.add('hidden');
        }
    });

    optionsToggle.addEventListener('click', function() {
        console.log("Options toggle clicked");
        if (optionsOverlay.classList.contains('show')) {
            console.log("Hiding options overlay");
            optionsOverlay.classList.remove('show');
            optionsOverlay.classList.add('hidden');
        } else {
            console.log("Showing options overlay");
            optionsOverlay.classList.remove('hidden');
            optionsOverlay.classList.add('show');
            chatOverlay.classList.remove('show');
            chatOverlay.classList.add('hidden');
            authOverlay.classList.remove('show');
            authOverlay.classList.add('hidden');
        }
        // Debug: Log current classes
        console.log("Options overlay classes:", optionsOverlay.className);
    });

    // Show login overlay
    loginLink.addEventListener('click', function(e) {
        console.log("Login link clicked");
        e.preventDefault();
        console.log("Showing auth overlay");
        authOverlay.classList.remove('hidden');
        authOverlay.classList.add('show');
        optionsOverlay.classList.remove('show');
        optionsOverlay.classList.add('hidden');
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
        // Debug: Log current classes
        console.log("Auth overlay classes:", authOverlay.className);
        console.log("Login form classes:", loginForm.className);
    });

    // Switch between login and register forms
    showRegisterLink.addEventListener('click', function(e) {
        e.preventDefault();
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
    });

    showLoginLink.addEventListener('click', function(e) {
        e.preventDefault();
        registerForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
    });

    // Handle logout
    logoutLink.addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('token');
        checkAuthStatus();
        optionsOverlay.classList.remove('show');
    });

    // Handle form submissions
    document.getElementById('loginForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        try {
            const response = await fetch('http://localhost:5504/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);
                authOverlay.classList.remove('show');
                checkAuthStatus();
                this.reset();
            } else {
                alert('Login failed. Please check your credentials.');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('An error occurred during login.');
        }
    });

    document.getElementById('registerForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        try {
            const response = await fetch('http://localhost:5504/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);
                authOverlay.classList.remove('show');
                checkAuthStatus();
                this.reset();
            } else {
                alert('Registration failed. Please try again.');
            }
        } catch (error) {
            console.error('Registration error:', error);
            alert('An error occurred during registration.');
        }
    });

    // Close buttons
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const target = this.getAttribute('data-close');
            const overlay = document.getElementById(target);
            overlay.classList.remove('show');
            overlay.classList.add('hidden');
        });
    });
});
