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
