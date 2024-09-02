document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    console.log('Email:', email);
    console.log('Password:', password);

    const users = JSON.parse(localStorage.getItem('users')) || [];
    console.log('Users:', users);
    
    const user = users.find(user => user.email === email && user.password === password);

    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        window.location.href = 'event_dash.html'; // Redirect to your desired page
    } else {
        document.getElementById('login-error').textContent = 'Invalid email or password.';
    }
});

