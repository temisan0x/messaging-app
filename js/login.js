window.onload = function () {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  if (isLoggedIn === "true") {
    window.location.href = "index.html";
  }
};

document.getElementById("login-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  let isValid = true;

  if (!email) {
    document.getElementById("email-error").textContent = "please fill in your email";
    isValid = false;
  } else {
    document.getElementById("email-error").textContent = ""
  }

  if (!password) {
    document.getElementById("password-error").textContent = "please fill in your email";
    isValid = false;
  } else {
    document.getElementById("password-error").textContent = ""
  }

  if (!isValid) {
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find((user) => user.email === email);

  if (!user) {
    alert("No user found. Please sign up first.");
    return;
  }

  const passwordValid = bcrypt.compareSync(password, user.password);

  if (passwordValid) {
    // Set login status
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("currentUser", JSON.stringify(user));

    // Redirect to the chat app (index.html)
    window.location.href = "index.html";
  } else {
    alert("Invalid email or password.");
  }
});