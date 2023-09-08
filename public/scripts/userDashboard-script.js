document.getElementById('logoutButton').addEventListener('click', () => {
    localStorage.removeItem('token'); // Remove token from localStorage
    window.location.href = '/employee/login'; // Redirect to the login page
});

function getToken() {
    return localStorage.getItem('token');
}

// Handle click event for "View All Reviews" link
document.getElementById('viewAllReviews').addEventListener('click', async (event) => {
    event.preventDefault(); // Prevent the default navigation behavior
    const token = getToken(); // Retrieve the authorization token from localStorage
    const headers = {
        'Authorization': `${token}`,
        'Content-Type': 'application/json'
    };
    const response = await fetch('/employee/reviews', {
        method: 'GET',
        headers
    });

    if (response.ok) {
        const htmlContent = await response.text();
        // Replace the current page content with the fetched HTML
        document.body.innerHTML = htmlContent;
    } else {
        console.error('API request error:', response.statusText);
    }
});

// Handle click event for "View Pending Reviews" link
document.getElementById('viewPendingReviews').addEventListener('click', async (event) => {
    event.preventDefault(); // Prevent the default navigation behavior
    const token = getToken(); // Retrieve the authorization token from localStorage
    const headers = {
        'Authorization': `${token}`,
        'Content-Type': 'application/json'
    };
    const response = await fetch('/employee/pending-reviews', {
        method: 'GET',
        headers
    });
    if (response.ok) {
        const htmlContent = await response.text();
        // Replace the current page content with the fetched HTML
        document.body.innerHTML = htmlContent;
    } else {
        console.error('API request error:', response.statusText);
    }
});

function getToken() {
    return localStorage.getItem('token');
}