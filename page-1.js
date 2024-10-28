const wrapper = document.querySelector('.wrapper');
const registerLink = document.querySelector('.register-link');
const loginLink = document.querySelector('.login-link');

registerLink.onclick = () => {
    wrapper.classList.add('active');
};

loginLink.onclick = () => {
    wrapper.classList.remove('active');
};

async function loginuser(event) {
    if (event) {
        event.preventDefault();  // Prevent default form submission
    }

    const uname = document.getElementById('lname').value;
    const pass = document.getElementById('lpassword').value;

    try {
        const result = await eel.loginuser(uname, pass)();
        if (result) {
            window.location.href = "main.html";  // Use href for navigation
        } else {
            alert('Login failed');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('An error occurred during login');
    }
}

// Function to handle registration
async function registeruser(event) {
    if (event) {
        event.preventDefault();  // Prevent default form submission
    }

    const mail = document.getElementById('email').value;
    const uname = document.getElementById('rname').value;
    const pass = document.getElementById('rpassword').value;

    try {
        const result = await eel.registeruser(mail, uname, pass)();
        if (result) {
            alert('Registration successful');
            // Clear form fields
            document.getElementById('email').value = '';
            document.getElementById('rname').value = '';
            document.getElementById('rpassword').value = '';
            // Switch to login form
            document.querySelector('.login-link').click();
        } else {
            alert('Registration failed');
        }
    } catch (error) {
        console.error('Registration error:', error);
        alert('An error occurred during registration');
    }
}
