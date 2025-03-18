// Check if the user is logged in
window.onload = function () {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
  
    // Redirect to login page if not logged in
    if (isLoggedIn !== "true") {
      window.location.href = "login.html"; // Redirect immediately
    }
  
    // Add logout functionality
    const logoutButton = document.getElementById("logout-button");
    if (logoutButton) {
      logoutButton.addEventListener("click", function () {
        // Clear login status
        localStorage.removeItem("isLoggedIn");
  
        // Redirect to login page
        window.location.href = "login.html";
      });
    }
  };