document.addEventListener("DOMContentLoaded", function() {
    const chatToggle = document.getElementById('chat-toggle');
    const optionsToggle = document.getElementById('options-toggle');
    const chatOverlay = document.getElementById('chat-overlay');
    const optionsOverlay = document.getElementById('options-overlay');

    chatToggle.addEventListener('click', function() {
        // Toggle Chat Overlay
        if (chatOverlay.classList.contains('show')) {
            chatOverlay.classList.remove('show');
        } else {
            chatOverlay.classList.add('show');
            optionsOverlay.classList.remove('show');
        }
    });

    optionsToggle.addEventListener('click', function() {
        // Toggle Options Overlay
        if (optionsOverlay.classList.contains('show')) {
            optionsOverlay.classList.remove('show');
        } else {
            optionsOverlay.classList.add('show');
            chatOverlay.classList.remove('show');
        }
    });

    // Close buttons
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const target = this.getAttribute('data-close');
            if (target === 'options-overlay') {
                optionsOverlay.classList.remove('show');
            } else if (target === 'chat-overlay') {
                chatOverlay.classList.remove('show');
            }
        });
    });
});
