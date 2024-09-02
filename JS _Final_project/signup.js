document.getElementById('signup-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    // Basic validation
    if (username && email && password) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        if (users.find(user => user.email === email)) {
            document.getElementById('signup-error').textContent = 'Email already in use.';
            return;
        }

        users.push({ username, email, password });
        localStorage.setItem('users', JSON.stringify(users));
        window.location.href = 'login.html'; // Redirect to login page
    } else {
        document.getElementById('signup-error').textContent = 'Please fill in all fields.';
    }
});


