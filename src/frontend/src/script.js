import { physicsTopics, getSubtopicsByTopic } from './data/courses/physics.js';

document.addEventListener("DOMContentLoaded", function() {
    // Navigation history stack
    const navigationStack = [];
    let currentOverlay = null;

    // Function to show an overlay
    function showOverlay(overlayId, addToHistory = true) {
        const overlay = document.getElementById(overlayId);
        if (!overlay) return;

        // Hide current overlay if exists
        if (currentOverlay) {
            currentOverlay.classList.remove('show');
            currentOverlay.classList.add('hidden');
        }

        // Show new overlay
        overlay.classList.remove('hidden');
        overlay.classList.add('show');

        // Update navigation
        if (addToHistory && currentOverlay) {
            navigationStack.push(currentOverlay.id);
            overlay.classList.remove('no-history');
        }
        currentOverlay = overlay;
    }

    // Handle back button clicks
    document.querySelectorAll('.back-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            if (navigationStack.length > 0) {
                const previousOverlayId = navigationStack.pop();
                showOverlay(previousOverlayId, false);
                
                // Update history status
                const overlay = document.getElementById(previousOverlayId);
                if (navigationStack.length === 0) {
                    overlay.classList.add('no-history');
                }
            }
        });
    });

    // Get overlay elements
    const chatToggle = document.getElementById('chat-toggle');
    const optionsToggle = document.getElementById('options-toggle');
    const chatOverlay = document.getElementById('chat-overlay');
    const optionsOverlay = document.getElementById('options-overlay');
    const authOverlay = document.getElementById('auth-overlay');
    
    // Settings functionality
    const settingsLink = document.getElementById('settings-link');
    const settingsOverlay = document.getElementById('settings-overlay');
    const aiModelSelect = document.getElementById('ai-model');
    const modelCapabilities = document.getElementById('model-capabilities');
    const saveSettingsBtn = document.getElementById('save-settings');
    const autoDarkMode = document.getElementById('auto-dark-mode');
    
    // Model capabilities descriptions
    const modelInfo = {
        'gpt4': [
            'Advanced physics understanding',
            'Natural conversation',
            'Context awareness',
            'Educational expertise'
        ],
        'ollama-mistral': [
            'Efficient local processing',
            'Good physics knowledge',
            'Privacy-focused',
            'Fast response time'
        ],
        'ollama-llama2': [
            'Strong reasoning ability',
            'Local execution',
            'Open source model',
            'Balanced performance'
        ],
        'ollama-neural-chat': [
            'Optimized for conversation',
            'Local processing',
            'Light resource usage',
            'Quick responses'
        ]
    };
    
    // Load saved settings
    function loadSettings() {
        const savedModel = localStorage.getItem('ai-model') || 'gpt4';
        const savedDarkMode = localStorage.getItem('auto-dark-mode') !== 'false';
        
        aiModelSelect.value = savedModel;
        autoDarkMode.checked = savedDarkMode;
        updateModelCapabilities(savedModel);
    }
    
    function updateModelCapabilities(model) {
        const capabilities = modelInfo[model];
        modelCapabilities.innerHTML = capabilities
            .map(cap => `<li>${cap}</li>`)
            .join('');
    }
    
    // Settings event listeners
    settingsLink.addEventListener('click', function(e) {
        e.preventDefault();
        showOverlay('settings-overlay');
    });
    
    aiModelSelect.addEventListener('change', function() {
        updateModelCapabilities(this.value);
    });
    
    saveSettingsBtn.addEventListener('click', function() {
        localStorage.setItem('ai-model', aiModelSelect.value);
        localStorage.setItem('auto-dark-mode', autoDarkMode.checked);
        
        // Close settings overlay
        settingsOverlay.classList.remove('show');
        settingsOverlay.classList.add('hidden');
        
        // Show confirmation
        alert('Settings saved successfully!');
    });
    
    // Declare global variables for DOM elements
    let loginForm, registerForm, showRegisterLink, showLoginLink, loginLink, accountLink, logoutLink;
    
    // Initialize elements and settings
    function initializeElements() {
        loginForm = document.getElementById('login-form');
        registerForm = document.getElementById('register-form');
        showRegisterLink = document.getElementById('show-register');
        showLoginLink = document.getElementById('show-login');
        loginLink = document.getElementById('login-link');
        accountLink = document.getElementById('account-link');
        logoutLink = document.getElementById('logout-link');
    }
    
    // Check if user is logged in
    function checkAuthStatus() {
        const token = localStorage.getItem('token');
        
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
    
    // Initialize elements and settings
    initializeElements();
    loadSettings();

    // Courses functionality
    const coursesLink = document.getElementById('courses-link');
    const coursesOverlay = document.getElementById('courses-overlay');
    const courseSelect = document.getElementById('course-select');
    const topicSelect = document.getElementById('topic-select');
    const subtopicsContainer = document.querySelector('.subtopics-container');

    // Handle course selection
    courseSelect.addEventListener('change', function() {
        if (this.value === 'physics') {
            topicSelect.disabled = false;
        } else {
            topicSelect.disabled = true;
            topicSelect.value = '';
            hideAllSubtopics();
        }
    });

    // Handle topic selection
    topicSelect.addEventListener('change', function() {
        hideAllSubtopics();
        if (this.value) {
            const topicGrid = document.querySelector(`.${this.value}-topics`);
            if (topicGrid) {
                topicGrid.classList.remove('hidden');
            } else {
                // Dynamically create topic grid if it doesn't exist
                const subtopics = getSubtopicsByTopic(this.value);
                if (Object.keys(subtopics).length > 0) {
                    createSubtopicGrid(this.value, subtopics);
                }
            }
        }
    });

    function hideAllSubtopics() {
        const grids = subtopicsContainer.querySelectorAll('.subtopics-grid');
        grids.forEach(grid => grid.classList.add('hidden'));
    }

    function createSubtopicGrid(topicKey, subtopics) {
        const grid = document.createElement('div');
        grid.className = `subtopics-grid ${topicKey}-topics`;
        
        Object.entries(subtopics).forEach(([key, subtopic]) => {
            const card = document.createElement('div');
            card.className = 'subtopic-card';
            if (subtopic.prerequisites.length > 0) {
                card.classList.add('locked');
            }
            
            card.innerHTML = `
                <div class="subtopic-icon">${subtopic.icon}</div>
                <h4>${subtopic.name}</h4>
                <p>${subtopic.description}</p>
                ${subtopic.prerequisites.length > 0 
                    ? `<div class="unlock-message">Complete prerequisites first</div>`
                    : `<div class="difficulty-indicator">
                        ${Array(3).fill(0).map((_, i) => 
                            `<span class="difficulty-dot${i < subtopic.difficulty ? ' active' : ''}"></span>`
                        ).join('')}
                       </div>`
                }
            `;
            
            // Add click handler
            if (!subtopic.prerequisites.length) {
                card.addEventListener('click', () => {
                    // Handle subtopic selection
                    console.log(`Selected subtopic: ${subtopic.name}`);
                    // TODO: Implement subtopic selection logic
                });
            }
            
            grid.appendChild(card);
        });
        
        subtopicsContainer.appendChild(grid);
    }

    // Show courses overlay
    coursesLink.addEventListener('click', function(e) {
        e.preventDefault();
        showOverlay('courses-overlay');
    });
    
    // Call checkAuthStatus on page load
    checkAuthStatus();

    // Toggle overlays
    chatToggle.addEventListener('click', function() {
        if (chatOverlay.classList.contains('show')) {
            chatOverlay.classList.remove('show');
            chatOverlay.classList.add('hidden');
            currentOverlay = null;
        } else {
            showOverlay('chat-overlay');
        }
    });

    optionsToggle.addEventListener('click', function() {
        if (optionsOverlay.classList.contains('show')) {
            optionsOverlay.classList.remove('show');
            optionsOverlay.classList.add('hidden');
            currentOverlay = null;
        } else {
            showOverlay('options-overlay');
        }
    });

    // Show account overlay
    accountLink.addEventListener('click', function(e) {
        e.preventDefault();
        showOverlay('account-overlay');
        
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
                }
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });
        }
    });

    // Show login overlay
    loginLink.addEventListener('click', function(e) {
        e.preventDefault();
        showOverlay('auth-overlay');
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
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
        if (currentOverlay) {
            currentOverlay.classList.remove('show');
            currentOverlay.classList.add('hidden');
            currentOverlay = null;
        }
    });

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
                body: JSON.stringify({
                    message,
                    model: localStorage.getItem('ai-model') || 'gpt4'
                })
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

    // Handle form submissions
    document.getElementById('loginForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        try {
            const response = await fetch('http://localhost:5504/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
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
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password })
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
            currentOverlay = null;
        });
    });
});