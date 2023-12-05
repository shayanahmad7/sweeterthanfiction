function validateName() {
    const name = document.getElementById('name').value;
    const errorElement = document.getElementById('name-error');
    if (!/^[a-zA-Z\s]+$/.test(name)) {
        errorElement.textContent = 'Name must contain only letters and spaces.';
        return false;
    } else {
        errorElement.textContent = '';
        return true;
    }
}

function validateUsername() {
    const username = document.getElementById('username').value;
    const errorElement = document.getElementById('username-error');
    if (username.length < 3 || !/^[a-zA-Z0-9]+$/.test(username)) {
        errorElement.textContent = 'Username must be at least 3 characters and alphanumeric.';
        return false;
    } else {
        errorElement.textContent = '';
        return true;
    }
}

function validatePassword() {
    const password = document.getElementById('password').value;
    const errorElement = document.getElementById('password-error');
    if (password.length < 8 || !/[a-zA-Z]/.test(password) || !/\d/.test(password)) {
        errorElement.textContent = 'Password must be at least 8 characters and include letters and numbers.';
        return false;
    } else {
        errorElement.textContent = '';
        return true;
    }
}

function validateRegisterForm() {
    const isNameValid = validateName();
    const isUsernameValid = validateUsername();
    const isPasswordValid = validatePassword();

    if (!isNameValid || !isUsernameValid || !isPasswordValid) {
        // Display a general error message for the entire form
        const formErrorElement = document.getElementById('form-error');
        formErrorElement.textContent = 'Please correct the highlighted errors before submitting.';
        return false;
    } else {
        // Clear any existing form-level error messages
        const formErrorElement = document.getElementById('form-error');
        formErrorElement.textContent = '';
        return true;
    }
}

