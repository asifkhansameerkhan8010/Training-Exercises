// Define the admin credentials in local storage (only set it once)
const adminCredentials = {
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin'
};

if (!localStorage.getItem('admin@example.com')) {
    localStorage.setItem(adminCredentials.email, JSON.stringify(adminCredentials));
}

document.getElementById('login-form').addEventListener('submit', function (event) {
    event.preventDefault(); 

    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Retrieve user data from local storage
    const storedUser = localStorage.getItem(email);

    // Check if user exists
    if (!storedUser) {
        document.getElementById('login-error').textContent = 'User does not exist! Please sign up first.';
        return;
    }

    // Parse the stored user data
    const user = JSON.parse(storedUser);

    // Validate password
    if (user.password !== password) {
        document.getElementById('login-error').textContent = 'Incorrect password. Please try again.';
        return;
    }

    
    localStorage.setItem('loggedInUser', email); // Save the logged-in user's email to identify the current session

    
    document.getElementById('login-error').textContent = '';
    document.getElementById('login-form').reset();

   
    if (email === adminCredentials.email) {
        window.location.href = 'admin-dashboard.html';
    } else {
        window.location.href = 'dashboard.html';
    }
});
