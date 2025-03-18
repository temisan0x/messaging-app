// Check if the user is already logged in
window.onload = function () {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
  
    // Redirect to chat app if already logged in
    if (isLoggedIn === "true") {
      window.location.href = "index.html"; // Redirect immediately
    }
  };
  
  // Login form submission
  document.getElementById("login-form").addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent form submission
  
    // Get input values
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
  
    // Retrieve user data from local storage
    const user = JSON.parse(localStorage.getItem("user"));
  
    // Check if user exists
    if (!user) {
      alert("No user found. Please sign up first.");
      return;
    }
  
    // Validate credentials
    if (email === user.email && password === user.password) {
      // Store login status in local storage
      localStorage.setItem("isLoggedIn", "true");
  
      // Redirect to the chat app (index.html)
      window.location.href = "index.html";
    } else {
      alert("Invalid email or password.");
    }
  });