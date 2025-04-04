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
    let userType = document.getElementById("signup-type").value;
  
    if (username === "" || password === "") {
      document.getElementById("message").textContent = "Please fill in all fields!";
      return;
    }
  
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let userExists = users.some(user => user.username === username);
  
    if (userExists) {
      document.getElementById("message").textContent = "Username already taken!";
      return;
    }
  
    users.push({ username, password, userType });
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
      localStorage.setItem("loggedInUser", username);
      localStorage.setItem("userType", validUser.userType); // Save type too
      window.location.href = "dashboard.html";
    } else {
      document.getElementById("message").textContent = "Invalid username or password!";
    }
  }
  