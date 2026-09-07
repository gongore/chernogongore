/* ==========================================================================
   CHERNOGONGORE.COM - MAIN APPLICATION SCRIPT
   ========================================================================== */

/**
 * UTILITY: SHA-256 Hashing Function
 * Encrypts raw text passcodes into 64-character SHA-256 hex strings.
 * Ensures plain-text passcodes are never exposed in browser developer tools.
 */
async function hashPasscode(text) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text.trim().toLowerCase());
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * SECRET VAULT: Hashes & Associated Personal Messages
 * Add new entries by converting desired passcodes into SHA-256 hex hashes.
 */
const secretVault = {
    // Passcode: "np1567"
    "024c7f07a09c2560bbf4a242c11ee40ebf35f29db47edc5e73ef5e6ca26507a2": {
        title: "Welcome Special Guest!",
        text: "Thank you for stopping by chernogongore.com! You have unlocked your custom personal message."
    }
};

/* ==========================================================================
   MODULE 1: Web3Forms Suggestion Form Handler
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    const suggestionForm = document.getElementById('suggestion-form');
    const formResult = document.getElementById('form-result');
    const submitBtn = document.getElementById('submit-btn');

    if (suggestionForm) {
        suggestionForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            // Provide immediate visual feedback
            submitBtn.disabled = true;
            submitBtn.innerText = 'Sending...';
            formResult.style.color = '#8b949e';
            formResult.innerText = 'Transmitting your suggestion...';

            const formData = new FormData(suggestionForm);
            const jsonPayload = JSON.stringify(Object.fromEntries(formData));

            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: jsonPayload
                });

                const resJson = await response.json();

                if (response.status === 200) {
                    formResult.style.color = '#3fb950';
                    formResult.innerText = 'Thank you! Your suggestion has been sent directly to my inbox.';
                    suggestionForm.reset();
                } else {
                    formResult.style.color = '#f85149';
                    formResult.innerText = resJson.message || 'Something went wrong. Please try again.';
                }
            } catch (error) {
                formResult.style.color = '#f85149';
                formResult.innerText = 'Unable to send message. Please check your network connection.';
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerText = 'Send Suggestion';
            }
        });
    }

/* ==========================================================================
   MODULE 2: Cryptographic Passcode Verification & Unlock
   ========================================================================== */
    const unlockBtn = document.getElementById('unlock-btn');
    const passcodeInput = document.getElementById('passcode-input');
    const messageBox = document.getElementById('secret-message-box');
    const messageTitle = document.getElementById('message-title');
    const messageText = document.getElementById('message-text');

    async function checkPasscode() {
        const rawCode = passcodeInput.value;
        if (!rawCode) return;

        // Hash input and check against stored vault keys
        const hashedInput = await hashPasscode(rawCode);

        if (secretVault[hashedInput]) {
            // Success State
            const secret = secretVault[hashedInput];
            messageTitle.innerText = secret.title;
            messageText.innerText = secret.text;

            messageBox.classList.remove('hidden');
            messageBox.style.borderColor = 'rgba(163, 113, 247, 0.5)'; // Accent purple border
        } else {
            // Failure State
            messageTitle.innerText = "Access Denied";
            messageText.innerText = "Invalid passcode. Please verify the code provided to you.";

            messageBox.classList.remove('hidden');
            messageBox.style.borderColor = 'rgba(248, 81, 73, 0.5)'; // Error red border
        }
    }

    if (unlockBtn && passcodeInput) {
        unlockBtn.addEventListener('click', checkPasscode);

        // Allow 'Enter' key press execution
        passcodeInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                checkPasscode();
            }
        });
    }
});
