document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    console.log(formData.get("email"));
    const response = await fetch('/employee/login', {
        method: 'POST',
        headers:{
            'Content-Type' : 'application/json; charset=utf-8'
        },
        body: JSON.stringify({
            "email": formData.get("email"),
            "password": formData.get("password")
        })
    });
    if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token); // Save token in localStorage
        if(data.isAdmin){
            window.location.href = '/admin/dashboard'; // Redirect to the dashboard
        }
        else{
            window.location.href = '/employee/dashboard'; // Redirect to the dashboard
        }
    } else {
        // Handle login error (e.g., display an error message)
        alert('Login failed. Please check your credentials.');
    }
});