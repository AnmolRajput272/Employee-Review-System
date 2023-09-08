function getToken() {
    return localStorage.getItem('token');
}

// Handle logout
document.getElementById('logoutButton').addEventListener('click', () => {
    localStorage.removeItem('token'); // Remove token from localStorage
    window.location.href = '/employee/login'; // Redirect to the login page
});

// Handle Add Employee
document.getElementById('addEmployee').addEventListener('click', () => {
    window.location.href = '/admin/add-employee'; // Redirect to the add employee page
});

// JavaScript code to handle form submission
document.querySelector('form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    // Get the form data
    const formData = new FormData(event.target);

    // Prepare the headers, including the authorization token
    const token = getToken(); // Retrieve the authorization token
    const headers = {
        'Authorization': `${token}`,
        'Content-Type': 'application/json',
        // Add other headers as needed
    };

    // Create the POST request
    const request = new Request(event.target.action, {
        method: 'POST',
        headers,
        body: JSON.stringify({
            "firstName": formData.get("firstName"),
            "lastName": formData.get("lastName"),
            "email": formData.get("email"),
            "isAdmin": formData.get("isAdmin") === "on" ? true : false
        })
    });

    try {
        const response = await fetch(request);

        if (response.ok) {
            // Handle success, e.g., display a success message
            const successMessage = document.createElement('div');
            successMessage.className = 'alert alert-success';
            successMessage.textContent = 'Employee details saved successfully.';
            event.target.appendChild(successMessage);
        } else {
            // Handle errors, e.g., display an error message
            console.error('API request error:', response.statusText);
        }
    } catch (error) {
        console.error('Error:', error);
    }
});