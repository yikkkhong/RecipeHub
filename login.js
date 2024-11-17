// Convert file to base64
function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

// Simulate registration by storing user data in localStorage
async function validateRegister() {
    const username = document.getElementById('regUsername').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const profileInput = document.getElementById('profilePicture');

    // Basic validation
    if (username === '' || email === '' || password === '' || confirmPassword === '') {
        alert('Please fill in all fields');
        return false;
    }

    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return false;
    }

    // Handle profile picture
    let profileBase64 = '';
    if (profileInput.files && profileInput.files[0]) {
        try {
            profileBase64 = await getBase64(profileInput.files[0]);
        } catch (error) {
            console.error('Error converting image:', error);
            alert('Error processing profile picture');
            return false;
        }
    }

    // Store the user details in localStorage
    const userData = {
        username: username,
        email: email,
        password: password,  // Note: In a real application, never store passwords in plain text
        profilePicture: profileBase64
    };

    try {
        localStorage.setItem('userData', JSON.stringify(userData));
        alert('Registration successful');
        window.location.href = 'login.html';
    } catch (error) {
        console.error('Error storing data:', error);
        alert('Error saving user data. Profile picture might be too large.');
        return false;
    }

    return false;
}

// Login validation with redirect to homepage
function validateLogin() {
    const enteredUsername = document.getElementById('username').value;
    const enteredPassword = document.getElementById('password').value;

    // Retrieve the registered details from localStorage
    try {
        const userData = JSON.parse(localStorage.getItem('userData'));
        
        if (!userData) {
            alert('No registered user found. Please register first.');
            return false;
        }

        // Check if entered details match registered details
        if (enteredUsername === userData.username && enteredPassword === userData.password) {
            alert('Login successful');
            window.location.href = 'homepage.html';
            return false;
        } else {
            alert('Invalid username or password. Please try again or register.');
            return false;
        }
    } catch (error) {
        console.error('Error retrieving user data:', error);
        alert('Error accessing user data');
        return false;
    }
}