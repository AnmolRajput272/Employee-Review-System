// Handle logout
document.getElementById('logoutButton').addEventListener('click', () => {
    localStorage.removeItem('token'); // Remove token from localStorage
    window.location.href = '/employee/login'; // Redirect to the login page
});

// Handle Add Employee
document.getElementById('addEmployee').addEventListener('click', () => {
    window.location.href = '/admin/add-employee'; // Redirect to the add employee page
});

function getToken() {
    return localStorage.getItem('token');
}

// Fetch employees data with the token
async function fetchEmployees() {
    const token = getToken("token"); // Retrieve token from localStorage
    const headers = {
        'Authorization': `${token}`,
        'Content-Type': 'application/json',
        // Add other headers as needed
    };
    try {
        const response = await fetch('/admin/employees', {
            method: 'GET',
            headers
        });

        if (response.ok) {
            const employees = await response.json();
            const employeeList = document.getElementById('employeeList');
            
            // Clear any existing data
            employeeList.innerHTML = '';

            // Process and display employee data
            employees.forEach(function(employee) {
                const employeeList = document.getElementById('employeeList');
                const employeeCard = document.createElement('div');
                employeeCard.classList.add('employee-card');
                
                const employeeName = document.createElement('h3');
                employeeName.textContent = `${employee.firstName} ${employee.lastName}`;
                
                const employeeEmail = document.createElement('p');
                employeeEmail.textContent = `Email: ${employee.email}`;

                const employeeImage = document.createElement('img');
                employeeImage.src = '/public/images/employee.jpg';
                employeeImage.alt = 'Employee Photo';
                employeeImage.height = 200;
                employeeImage.width = 200;
                
                const employeeButtons = document.createElement('div');
                employeeButtons.classList.add('employee-buttons');
                employeeButtons.id = `employee ${employee.id}`;
                
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.style.backgroundColor = 'red';
                deleteButton.addEventListener('click', () => {
                    // Handle delete action (call delete API)
                    deleteEmployee(employee.id);
                });

                const editButton = document.createElement('button');
                editButton.textContent = 'Edit';
                editButton.style.backgroundColor = 'green';
                editButton.addEventListener('click', () => {
                    // Handle edit action (e.g., show edit form)
                    window.location.href = `/admin/edit-employee/${employee.id}`;
                });

                const assignReviewButton = document.createElement('button');
                // assignReviewButton.id = `employee ${employee.id} assign`;
                assignReviewButton.textContent = 'Assign Review';
                assignReviewButton.addEventListener('click', () => {
                    // Handle assign review action (e.g., show dropdown)
                    assignReview(employee);
                });

                const employeeEditDeleteDiv = document.createElement('div');
                employeeEditDeleteDiv.classList.add('employee-edit-delete');

                const employeeReviewAssignDiv = document.createElement('div');
                employeeReviewAssignDiv.id = `employee ${employee.id} assign`;

                employeeEditDeleteDiv.appendChild(deleteButton);
                employeeEditDeleteDiv.appendChild(editButton);
                employeeReviewAssignDiv.appendChild(assignReviewButton);

                employeeButtons.appendChild(employeeEditDeleteDiv);
                if(!employee.isAdmin){
                    employeeButtons.appendChild(employeeReviewAssignDiv);
                }
                
                employeeCard.appendChild(employeeImage);
                employeeCard.appendChild(employeeName);
                employeeCard.appendChild(employeeEmail);
                employeeCard.appendChild(employeeButtons);
                
                employeeList.appendChild(employeeCard);
            });
        } else {
            // Handle API error (e.g., display an error message)
            console.error('API request error:', response.statusText);
        }
    } catch (error) {
        console.error('API request error:', error);
    }
}

// Function to handle delete action
async function deleteEmployee(employeeId) {
    // Make a DELETE request to the API to delete the employee with the specified ID
    const token = getToken();
    const headers = {
        'Authorization': token,
        'Content-Type': 'application/json',
    };
    try {
        const response = await fetch(`/admin/employees/delete/${employeeId}`, {
            method: 'DELETE',
            headers,
        });
        if (response.ok) {
            // Employee deleted successfully, update the list
            fetchEmployees();
        } else {
            console.error('API request error:', response.statusText);
        }
    } catch (error) {
        console.error('API request error:', error);
    }
}

async function assignReview(employee) {

    const employee_elements = document.getElementById(`employee ${employee.id}`);
    const employee_assign = document.getElementById(`employee ${employee.id} assign`);

    const token = getToken("token"); // Retrieve token from localStorage
    const headers = {
        'Authorization': `${token}`,
        'Content-Type': 'application/json'
    };

    // Create a dropdown select element
    const reviewDropdown = document.createElement('select');
    reviewDropdown.id = "review-dropdown"

    const response = await fetch(`/admin/available-reviewee/${employee.id}`, {
        method: 'GET',
        headers
    });
    reviewOptions = await response.json();

    console.log(reviewOptions)

    reviewOptions.forEach((option) => {
        const optionElement = document.createElement('option');
        optionElement.value = option.id;
        optionElement.textContent = ` ${option.email}`;
        reviewDropdown.appendChild(optionElement);
    });

    // Create a "Assign" button
    const assignButton = document.createElement('button');
    assignButton.textContent = 'Assign';

    // Add event listener to the "Assign" button
    assignButton.addEventListener('click', async () => {
        const selectedRevieweeId = reviewDropdown.value;

        // Send a POST request to assign the selected review to the employee
        // await assignReviewToEmployee(employee.id, selectedReviewId);
        
        const response = await fetch('/admin/reviews/assign', {
            method: 'POST',
            headers,
            body: JSON.stringify({
                "reviewerId": employee.id,
                "revieweeId": parseInt(selectedRevieweeId)
            })
        });

        // Remove the review assignment interface
        reviewDropdown.remove();
        assignButton.remove();
        employee_assign.style.display = 'inline-block';

        if(response.ok){
            alert('Review Assigned Successfully.')
        }
        else{
            alert('Error While Assigning Review.')
        }
    });

    employee_assign.style.display = 'None';

    const employeeReviewAssignDiv = document.createElement('div');
    employeeReviewAssignDiv.classList.add('employee-review-assign');

    // Append the dropdown and the "Assign" button
    employeeReviewAssignDiv.appendChild(reviewDropdown);
    employeeReviewAssignDiv.appendChild(assignButton);

    employee_elements.append(employeeReviewAssignDiv);
}


// Call the fetchEmployees function when the page loads
window.addEventListener('load', fetchEmployees);