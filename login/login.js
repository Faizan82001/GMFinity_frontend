let isValid = false;

function validateForm(e) {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    validateEmail();
    validatePassword();
    if (!isValid) {
        return false;
    }

    callApi(email, password);
    return true;
}

function callApi(email, password) {
    const apiUrl = "http://localhost:3000/api/login";

    const data = {
        email: email,
        password: password,
    };
    fetch(apiUrl, {
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
            if (responseData["token"]) {
                localStorage.setItem(
                    "token",
                    JSON.stringify(responseData.token)
                );
                localStorage.setItem("user", JSON.stringify(responseData.user));
                document.getElementById("login-form").reset();
                window.location.href =
                    "http://127.0.0.1:5500/frontend/Home/home.html";
            }
        })
        .catch((error) => {
            showToast(error.error);
        });
}
