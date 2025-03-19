window.onload = function () {
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  // Redirect to login page if not logged in
  if (isLoggedIn !== "true") {
    window.location.href = "login.html"; // Redirect immediately
  }


  const logoutButton = document.getElementById("logout-button");
  if (logoutButton) {
    logoutButton.addEventListener("click", function () {
      // Clear login status
      localStorage.removeItem("isLoggedIn");
      console.log("clicking")
      // Redirect to login page
      window.location.href = "login.html";
    });
  }
};


// <div class="friend active">
// <img
//   src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1045&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3Dk"
//   alt="John's profile image"
// />
// <div class="friend-info">
//   <div class="friend-name">John</div>
//   <div class="last-message">Hi, how are you?</div>
// </div>
// <div class="message-time">10:00 AM</div>
// </div> 