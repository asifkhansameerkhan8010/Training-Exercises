// Signup form submission event handler
document.getElementById('signup-form').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent default form submission

    // Get user input values
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // Check if passwords match
    if (password !== confirmPassword) {
        document.getElementById('signup-error').textContent = 'Passwords do not match!';
        return;
    }

    // Check if email already exists in local storage
    if (localStorage.getItem(email)) {
        document.getElementById('signup-error').textContent = 'An account with this email already exists!';
        return;
    }

    // Store user data in local storage
    const user = { username, email, password };
    localStorage.setItem(email, JSON.stringify(user)); // Use email as a unique key for storing user data

    // Clear the error message and form fields
    document.getElementById('signup-error').textContent = '';
    document.getElementById('signup-form').reset();

    alert('Sign up successful! You can now log in.');
    window.location.href = 'login.html'; // Redirect to login page after successful signup
});
