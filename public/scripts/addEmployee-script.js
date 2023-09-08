function getToken() {
    return localStorage.getItem('token');
};

// Handle logout
document.getElementById('logoutButton').addEventListener('click', () => {
    localStorage.removeItem('token'); // Remove token from localStorage
    window.location.href = '/employee/login'; // Redirect to the login page
});

document.getElementById('addEmployeeForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const token = getToken();
    const formData = new FormData(e.target);
    const response = await fetch('/admin/employees/add', {
        method: 'POST',
        headers: {
            'Authorization': `${token}`,
            'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify({
            "firstName" : formData.get("firstName"),
            "lastName" : formData.get("lastName"),
            "email" : formData.get("email"),
            "password" : formData.get("password"),
            "isAdmin" : formData.get("isAdmin") === "on" ? true : false
        })
    });

    if (!response.ok) {
        // Display an alert if the response is not OK
        alert('Failed to add employee. Please try again.');
    } else {
        // Redirect or perform other actions upon successful submission
        window.location.href = '/admin/dashboard'; // Redirect to employee list
    }
});