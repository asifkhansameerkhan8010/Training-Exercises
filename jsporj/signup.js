document.getElementById('signup-form').addEventListener('submit', function (event) {
    event.preventDefault(); 

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (password !== confirmPassword) {
        document.getElementById('signup-error').textContent = 'Passwords do not match!';
        return;
    }

    // Check if email already exists in local storage
    if (localStorage.getItem(email)) {
        document.getElementById('signup-error').textContent = 'An account with this email already exists!';
        return;
    }

    
    const user = { username, email, password };
    localStorage.setItem(email, JSON.stringify(user)); // email as a unique key 

    
    document.getElementById('signup-error').textContent = '';
    document.getElementById('signup-form').reset();

    alert('Sign up successful! You can now log in.');
    window.location.href = 'login.html'; 
});
