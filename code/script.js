// Show Login Form
function showLogin() {
    document.getElementById("signup-box").style.display = "none";
    document.getElementById("login-box").style.display = "block";
}

// Show Signup Form
function showSignup() {
    document.getElementById("login-box").style.display = "none";
    document.getElementById("signup-box").style.display = "block";
}

// Signup Function
function signup() {
    let username = document.getElementById("signup-username").value;
    let password = document.getElementById("signup-password").value;

    if (username === "" || password === "") {
        document.getElementById("message").textContent = "Please fill in all fields!";
        return;
    }

    // Check if username already exists
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let userExists = users.some(user => user.username === username);

    if (userExists) {
        document.getElementById("message").textContent = "Username already taken!";
        return;
    }

    // Save new user
    users.push({ username: username, password: password });
    localStorage.setItem("users", JSON.stringify(users));

    document.getElementById("message").textContent = "Signup successful! Please login.";
    showLogin();
}

// Login Function
function login() {
    let username = document.getElementById("login-username").value;
    let password = document.getElementById("login-password").value;

    let users = JSON.parse(localStorage.getItem("users")) || [];
    let validUser = users.find(user => user.username === username && user.password === password);

    if (validUser) {
        localStorage.setItem("loggedInUser", username); // Store logged-in user
        window.location.href = "dashboard.html"; // Redirect to dashboard
    } else {
        document.getElementById("message").textContent = "Invalid username or password!";
    }
}