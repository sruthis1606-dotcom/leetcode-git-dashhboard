async function fetchStats() {

    const email = document.getElementById('email').value;
    const username = document.getElementById('username').value;
    const github = document.getElementById('github').value;

    if (!username.trim()) {
        alert('Please enter a LeetCode username');
        return;
    }

    // Show loading state
    const resultDiv = document.getElementById('result');

    if (resultDiv) {
        resultDiv.innerHTML = '<p>Loading...</p>';
    }

    try {

        // Frontend sends request to Flask backend
        const response = await fetch('http://127.0.0.1:5000/get_stats', {

            method: 'POST',

            headers: {
                'Content-Type': 'application/json'
            },

            // Sending data to backend
            body: JSON.stringify({

                email: email,

                username: username.trim(),

                github: github.trim()

            })

        });

        // Convert backend JSON response into JS object
        const data = await response.json();

        if (data.error) {

            alert(data.error);

            if (resultDiv) {
                resultDiv.innerHTML = '';
            }

            return;
        }

        // Update webpage dynamically
        document.getElementById('name').innerText =
        `Username: ${data.username}`;

        document.getElementById('total').innerText =
        `Total Solved: ${data.totalSolved}`;

        document.getElementById('easy').innerText =
        `Easy: ${data.easySolved}`;

        document.getElementById('medium').innerText =
        `Medium: ${data.mediumSolved}`;

        document.getElementById('hard').innerText =
        `Hard: ${data.hardSolved}`;

        document.getElementById('ranking').innerText =
        `Ranking: ${data.ranking}`;

        // GitHub projects
        document.getElementById('repos').innerText =
        `GitHub Projects: ${data.githubRepos}`;

        // Save email locally
        if (data.email && data.email !== "Not provided") {

            localStorage.setItem('lastEmail', data.email);

        }

    } catch (error) {

        console.error('Error:', error);

        alert('Failed to connect to server. Make sure Flask is running on port 5000.');

    }

}

// Enter key support
document.addEventListener('DOMContentLoaded', () => {

    const usernameInput = document.getElementById('username');

    if (usernameInput) {

        usernameInput.addEventListener('keypress', (e) => {

            if (e.key === 'Enter') {

                fetchStats();

            }

        });

    }

});