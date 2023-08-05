document.getElementById("email").addEventListener("input", validateEmail);
document.getElementById("password").addEventListener("input", validatePassword);

function validateEmail() {
    const email = document.getElementById("email").value.trim();

    if (email === "") {
        showError("email", "Email is required");
        isValid = false;
    } else if (!isValidEmail(email)) {
        showError("email", "Invalid email format");
        isValid = false;
    } else {
        hideError("email");
        isValid = true;
    }
}

function validatePassword() {
    const password = document.getElementById("password").value;

    if (password === "") {
        showError("password", "Password is required");
        isValid = false;
    } else if (password.length < 6) {
        showError("password", "Password must be 6 characters or more");
        isValid = false;
    } else {
        hideError("password");
        isValid = true;
    }
}

function showError(fieldId, message) {
    const errorElement = document.getElementById(`${fieldId}-error`);
    errorElement.textContent = message;
}

function hideError(fieldId) {
    const errorElement = document.getElementById(`${fieldId}-error`);
    errorElement.textContent = "";
}

function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

function showToast(message) {
    const toastElement = document.getElementById("toast");
    toastElement.textContent = message;
    toastElement.classList.add("show");
    setTimeout(() => {
        toastElement.classList.remove("show");
    }, 3000);
}
