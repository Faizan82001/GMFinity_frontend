const config = {
    // apiUrl: "https://example-gmfinity-backend.onrender.com/api",
    apiUrl: "http://127.0.0.1:3000/api",
    frontEndUrl: "http://127.0.0.1:5500/frontend",
};

localStorage.clear();
localStorage.setItem("config", JSON.stringify(config));