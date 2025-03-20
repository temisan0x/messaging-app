window.onload = function () {
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  if (isLoggedIn === "true") {
    window.location.href = "login.html";
  }
};

document.getElementById("signup-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const confirmPassword = document
    .getElementById("confirm-password")
    .value.trim();

  let isValid = true;

  if (!firstName) {
    document.getElementById("firstName-error").textContent = "Please fill in your first name";
    isValid = false;
  } else {
    document.getElementById("firstName-error").textContent = "";
  }
  if (!lastName) {
    document.getElementById("lastName-error").textContent = "Please fill in your last name";
    isValid = false;
  } else {
    document.getElementById("firstName-error").textContent = "";
  }
  if (!email) {
    document.getElementById("email-error").textContent = "Please fill in your email address";
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
  if (!confirmPassword) {
    document.getElementById("confirm-password-error").textContent = "Please confirm your password";
    isValid = false;
  } else {
    document.getElementById("confirm-password-error").textContent = "";
  }
  if (password != confirmPassword) {
    document.getElementById("confirm-password-error").textContent = "Passwords do not match";
    isValid = false;
  }

  if (!isValid) {
    return;
  }

  // Retrieve existing users from local storage
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const existingUser = users.some((user) => user.email === email);

  if (existingUser) {
    alert("Email already registered. Please log in.");
    console.log("stored user data", localStorage.getItem("users"))
    return;
  }

  //create user object

  const newUser = {
    id: Date.now(),
    firstName,
    lastName,
    email,
    password,
    isLoggedIn: false,
    messages: [],
  };

  users.push(newUser);

  localStorage.setItem("users", JSON.stringify(users));

  // Set the current user as logged in
  localStorage.setItem("currentUser", JSON.stringify(newUser));
  localStorage.setItem("isLoggedIn", "true");

  // Redirect to the chat app (index.html)
  window.location.href = "login.html";
});

