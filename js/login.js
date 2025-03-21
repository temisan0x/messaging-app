window.onload = function () {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  if (isLoggedIn === "true") {
    window.location.href = "index.html";
  }
};

document.getElementById("login-form").addEventListener("submit", function (e) {
  e.preventDefault();

  // Get input values with safeguards against null/undefined
  const emailElement = document.getElementById("email");
  const passwordElement = document.getElementById("password");

  if (!emailElement || !passwordElement) {
    console.error("Form elements not found in DOM");
    alert("Login form is broken. Contact support.");
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
  const users = JSON.parse(localStorage.getItem("users")) || [];
  if (!Array.isArray(users)) {
    console.error("Users data corrupted in localStorage");
    document.getElementById("email-error").textContent = "System error, please try again later";
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
    console.error("User object missing password field:", user);
    document.getElementById("password-error").textContent = "Account data corrupted";
    return;
  }

  try {
    console.log("Attempting password comparison:");
    console.log("Plain password:", password, "type:", typeof password);
    console.log("Stored hash:", user.password, "type:", typeof user.password);

    const passwordValid = bcrypt.compareSync(password, user.password);

    if (passwordValid) {
      const updatedUsers = users.map(u =>
        u.email === user.email ? { ...u, isLoggedIn: true } : u
      );

      localStorage.setItem("users", JSON.stringify(updatedUsers));
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("currentUser", JSON.stringify(user));
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