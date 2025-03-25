document.getElementById("login-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const emailElement = document.getElementById("email");
  const passwordElement = document.getElementById("password");
  
  if (!emailElement || !passwordElement) {
    console.error("Form elements not found in DOM");
    alert("Login form is broken.");
    return;
  }
  
  const email = emailElement.value ? emailElement.value.trim() : '';
  const password = passwordElement.value ? passwordElement.value.trim() : '';
  
  let isValid = true;
  
  if (!email) {
    document.getElementById("email-error").textContent = "Please fill in your email";
    isValid = false;
  } else {
    document.getElementById("email-error").textContent = "";
  }
  
  if (!password) {
    document.getElementById("password-error").textContent = "Please fill in your password";
    isValid = false;
  } else {
    document.getElementById("password-error").textContent = "";
  }
  
  if (!isValid) {
    return;
  }
  
  // Get users from localStorage
  const usersRaw = localStorage.getItem("users");
  console.log("Raw user data:", usersRaw);
  
  let users = [];
  try {
    const parsed = JSON.parse(usersRaw);
    console.log("Parsed users data:", parsed);
        
    // Check if parsed data is an array
    if (Array.isArray(parsed)) {
      users = parsed;
    } else {
      console.error("Users data is not an array:", parsed);
      // If it's a single user object, convert to array
      if (parsed && typeof parsed === 'object') {
        users = [parsed];
      }
    }
  } catch (error) {
    console.error("Error parsing users data:", error);
    // Reset users to empty array
    users = [];
  }
    
  if (users.length === 0) {
    document.getElementById("email-error").textContent = "No users registered. Please sign up";
    return;
  }
  
  // Find user
  const user = users.find((user) => user && user.email === email);
  
  if (!user) {
    document.getElementById("email-error").textContent = "User not found";
    console.log("No user found for email:", email);
    return;
  }
  
  // Check if password hash exists
  if (!user.password) {
    console.error("User missing password field:", user);
    document.getElementById("password-error").textContent = "Your Password is incorrect";
    return;
  }
  
  try {
    const passwordValid = bcrypt.compareSync(password, user.password);
    if (passwordValid) {
      sessionStorage.setItem("currentUser", JSON.stringify(user));
      sessionStorage.setItem("isLoggedIn", "true");
      window.location.href = "index.html";
    } else {
      document.getElementById("password-error").textContent = "Invalid password";
    }
  } catch (error) {
    console.error("Password verification error:", error);
    document.getElementById("password-error").textContent = 
      `Error verifying password: ${error.message}`;
  }
});