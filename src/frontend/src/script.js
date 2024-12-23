document.addEventListener("DOMContentLoaded", function() {
    console.log("DOM Content Loaded");
    
    // Get overlay elements
    const chatToggle = document.getElementById('chat-toggle');
    const optionsToggle = document.getElementById('options-toggle');
    const chatOverlay = document.getElementById('chat-overlay');
    const optionsOverlay = document.getElementById('options-overlay');
    const authOverlay = document.getElementById('auth-overlay');
    
    // Initialize variables for auth elements
    let loginForm, registerForm, showRegisterLink, showLoginLink, loginLink, accountLink, logoutLink;
    
    function initializeElements() {
        loginForm = document.getElementById('login-form');
        registerForm = document.getElementById('register-form');
        showRegisterLink = document.getElementById('show-register');
        showLoginLink = document.getElementById('show-login');
        loginLink = document.getElementById('login-link');
        accountLink = document.getElementById('account-link');
        logoutLink = document.getElementById('logout-link');
        
        console.log("Initializing elements, accountLink found:", !!accountLink);
        
        // Attach event listeners after getting elements
        if (accountLink) {
            console.log("Attaching account link click handler");
            accountLink.addEventListener('click', function(e) {
                console.log("Account link clicked");
                e.preventDefault();
                optionsOverlay.classList.remove('show');
                optionsOverlay.classList.add('hidden');
                
                const accountOverlay = document.getElementById('account-overlay');
                console.log("Account overlay found:", !!accountOverlay);
                accountOverlay.classList.remove('hidden');
                accountOverlay.classList.add('show');
                
                // Get user data from localStorage
                const token = localStorage.getItem('token');
                if (token) {
                    fetch('http://localhost:5504/api/auth/verify', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.user) {
                            document.getElementById('profile-name').textContent = data.user.name;
                            document.getElementById('profile-email').textContent = data.user.email;
                            
                            // TODO: Fetch and update course progress
                            // For now, we'll simulate some progress
                            const progress = 35; // This would come from the backend
                            document.querySelector('.progress').style.width = `${progress}%`;
                            document.querySelector('.progress-text').textContent = `${progress}% Complete`;
                            document.querySelector('.current-topic').textContent = 'Forces and Motion';
                            document.querySelector('.difficulty-level').textContent = '2';
                        }
                    })
                    .catch(error => {
                        console.error('Error fetching user data:', error);
                    });
                }
            });
        }
    }

    function checkAuthStatus() {
        const token = localStorage.getItem('token');
        console.log("Checking auth status, token:", token ? "exists" : "not found");
        
        // Re-initialize elements to get fresh references
        initializeElements();
        
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

    // Initialize elements first time
    initializeElements();
    
    // Call checkAuthStatus on page load
    checkAuthStatus();

    // Chat functionality
    const chatMessages = document.getElementById('chat-messages');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatStatus = document.querySelector('.chat-status');
    
    async function loadChatHistory() {
        const token = localStorage.getItem('token');
        if (!token) return;
        
        try {
            const response = await fetch('http://localhost:5504/api/chat/history', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                chatMessages.innerHTML = ''; // Clear existing messages
                data.history.forEach(msg => {
                    addMessageToChat(msg.content, msg.role);
                });
                scrollToBottom();
            }
        } catch (error) {
            console.error('Error loading chat history:', error);
        }
    }
    
    function addMessageToChat(message, role) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', role);
        messageDiv.textContent = message;
        chatMessages.appendChild(messageDiv);
        scrollToBottom();
    }
    
    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    function showTypingIndicator() {
        chatStatus.classList.remove('hidden');
    }
    
    function hideTypingIndicator() {
        chatStatus.classList.add('hidden');
    }
    
    // Toggle chat overlay and load history
    chatToggle.addEventListener('click', function() {
        if (chatOverlay.classList.contains('show')) {
            chatOverlay.classList.remove('show');
            chatOverlay.classList.add('hidden');
        } else {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Please log in to use the chat.');
                return;
            }
            
            chatOverlay.classList.remove('hidden');
            chatOverlay.classList.add('show');
            optionsOverlay.classList.remove('show');
            optionsOverlay.classList.add('hidden');
            authOverlay.classList.remove('show');
            authOverlay.classList.add('hidden');
            
            // Load chat history when opening chat
            loadChatHistory();
        }
    });
    
    // Handle chat form submission
    chatForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const message = chatInput.value.trim();
        if (!message) return;
        
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please log in to use the chat.');
            return;
        }
        
        // Add user message to chat
        addMessageToChat(message, 'user');
        chatInput.value = '';
        
        // Show typing indicator
        showTypingIndicator();
        
        try {
            const response = await fetch('http://localhost:5504/api/chat/message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ message })
            });
            
            hideTypingIndicator();
            
            if (response.ok) {
                const data = await response.json();
                addMessageToChat(data.response, 'assistant');
            } else {
                addMessageToChat('Sorry, I encountered an error. Please try again.', 'assistant');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            hideTypingIndicator();
            addMessageToChat('Sorry, I encountered an error. Please try again.', 'assistant');
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