// Web3Forms AJAX Form Handler
const form = document.getElementById('suggestion-form');
const result = document.getElementById('form-result');
const submitBtn = document.getElementById('submit-btn');

if (form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        submitBtn.disabled = true;
        submitBtn.innerText = 'Sending...';
        result.style.color = '#8b949e';
        result.innerText = 'Transmitting your suggestion...';

        const formData = new FormData(form);
        const object = Object.fromEntries(formData);
        const json = JSON.stringify(object);

        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: json
        })
        .then(async (response) => {
            let resJson = await response.json();
            if (response.status == 200) {
                result.style.color = '#3fb950';
                result.innerText = 'Thank you! Your suggestion has been sent directly to my inbox.';
                form.reset();
            } else {
                result.style.color = '#f85149';
                result.innerText = resJson.message || 'Something went wrong. Please try again.';
            }
        })
        .catch(error => {
            result.style.color = '#f85149';
            result.innerText = 'Unable to send message. Please check your internet connection.';
        })
        .then(function() {
            submitBtn.disabled = false;
            submitBtn.innerText = 'Send Suggestion';
        });
    });
}

// Passcode Verification Logic
const passcodeContainer = {
    // Passcodes are stored in lowercase for easy matching
    "welcome123": {
        title: "Welcome, Special Guest!",
        text: "Thanks for visiting chernogongore.com! You have unlocked the secret preview message."
    },
    "teresa": {
        title: "Hello Teresa!",
        text: "Thank you for checking out the early site build. Hope you like the glassmorphism theme!"
    },
    "marcus": {
        title: "Hey Marcus!",
        text: "The financial dashboard & portfolio tracker components are currently in active development."
    }
};

const unlockBtn = document.getElementById('unlock-btn');
const passcodeInput = document.getElementById('passcode-input');
const messageBox = document.getElementById('secret-message-box');
const messageTitle = document.getElementById('message-title');
const messageText = document.getElementById('message-text');

if (unlockBtn) {
    unlockBtn.addEventListener('click', function() {
        const enteredCode = passcodeInput.value.trim().toLowerCase();

        if (passcodeContainer[enteredCode]) {
            // Valid Code
            const secret = passcodeContainer[enteredCode];
            messageTitle.innerText = secret.title;
            messageText.innerText = secret.text;
            
            // Show box
            messageBox.classList.remove('hidden');
            messageBox.style.borderColor = 'rgba(163, 113, 247, 0.5)';
        } else {
            // Invalid Code
            messageTitle.innerText = "Access Denied";
            messageText.innerText = "Incorrect passcode. Please try again.";
            
            messageBox.classList.remove('hidden');
            messageBox.style.borderColor = 'rgba(248, 81, 73, 0.5)'; // Red border for error
        }
    });

    // Optional: Allow pressing 'Enter' key to unlock
    passcodeInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            unlockBtn.click();
        }
    });
}
