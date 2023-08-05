const apiUrl = JSON.parse(localStorage.getItem("config")).apiUrl;
const frontEndUrl = JSON.parse(localStorage.getItem("config")).frontEndUrl;

document.getElementById("username").addEventListener("input", validateUsername);
document
    .getElementById("confirm_password")
    .addEventListener("input", validateConfirmPassword);
let isValid = false;

function validateForm(e) {
    e.preventDefault();
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    validateUsername();
    validateEmail();
    validatePassword();
    validateConfirmPassword();
    if (!isValid) {
        return false;
    }

    callApi(username, email, password);
    return true;
}

function validateUsername() {
    const username = document.getElementById("username").value.trim();
    if (username === "") {
        showError("username", "Username is required");
        isValid = false;
    } else {
        hideError("username");
        isValid = true;
    }
}

function validateConfirmPassword() {
    const password = document.getElementById("password").value;
    const confirm_password = document.getElementById("confirm_password").value;

    if (confirm_password === "") {
        showError("confirm_password", "Confirm Password is required");
        isValid = false;
    } else if (password !== confirm_password) {
        showError("confirm_password", "Passwords do not match");
        isValid = false;
    } else {
        hideError("confirm_password");
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

function callApi(username, email, password) {
    const apiCall = `${apiUrl}/users`;

    const data = {
        username: username,
        email: email,
        password: password,
    };
    fetch(apiCall, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
        .then((response) => response.json())
        .then((responseData) => {
            if (responseData["error"]) {
                showToast(responseData.error);
            }
            if (responseData["user"]) {
                localStorage.setItem("user", JSON.stringify(responseData.user));
                showToast(responseData.message);
                document.getElementById("registration-form").reset();
                window.location.href =
                    `${frontEndUrl}/login/login.html`;
            }
        })
        .catch((error) => {
            showToast(error.error);
        });
}

function showToast(message) {
    const toastElement = document.getElementById("toast");

    // Set the custom message
    toastElement.textContent = message;

    // Show the toast
    toastElement.classList.add("show");

    // Hide the toast after 3 seconds (adjust the delay as needed)
    setTimeout(() => {
        toastElement.classList.remove("show");
    }, 3000);
}
