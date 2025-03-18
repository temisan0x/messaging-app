document.getElementById("signup-form").addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent form submission
  
    // Get input values
    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirm-password").value.trim();
  
    // Validate passwords match
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
  
    // Create user object
    const newUser = {
      id: Date.now(), // Unique ID for each user
      firstName,
      lastName,
      email,
      password, 
      isLoggedIn: false, // Default login status
    };
  
    // Retrieve existing users from local storage
    const users = JSON.parse(localStorage.getItem("users")) || [];
  
    // Check if the email is already registered
    const existingUser = users.find((user) => user.email === email);
    if (existingUser) {
      alert("Email already registered. Please log in.");
      return;
    }
  
    // Add new user to the array
    users.push(newUser);
  
    // Save updated users array to local storage
    localStorage.setItem("users", JSON.stringify(users));
  
    // Set the current user as logged in
    localStorage.setItem("currentUser", JSON.stringify(newUser));
    localStorage.setItem("isLoggedIn", "true");
  
    // Redirect to the chat app (index.html)
    window.location.href = "index.html";
  });