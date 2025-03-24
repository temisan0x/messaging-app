window.onload = function () {
  function validateSession() {
    try {
      const isLoggedIn = sessionStorage.getItem("isLoggedIn");
      const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
      
      if (isLoggedIn !== "true" || !currentUser?.id) {
        sessionStorage.clear();
        window.location.href = "login.html";
        return false;
      }
      return true;
    } catch (e) {
      sessionStorage.clear();
      window.location.href = "login.html";
      return false;
    }
  }

  if (!validateSession()) return;

  window.addEventListener('storage', (event) => {
    if (event.key === 'isLoggedIn' || event.key === 'currentUser') {
      if (!validateSession()) {
        window.location.href = "login.html";
      }
    }
  });

  const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
  const friendsSidebar = document.querySelector(".friends-sidebar");
  const closeSidebarButton = document.querySelector(".close-sidebar");
  const searchInput = document.getElementById("search-friends");
  const friendsList = document.querySelector(".friends-list");
  const usernameElement = document.getElementById("username");
  const textarea = document.querySelector(".chat-input textarea");
  const typingIndicator = document.querySelector(".typing-indicator");

  // Mobile menu toggle
  if (mobileMenuToggle && friendsSidebar) {
    mobileMenuToggle.addEventListener("click", (e) => {
      if (!validateSession()) return;
      e.stopPropagation();
      friendsSidebar.classList.toggle("visible");
    });

    document.addEventListener("click", (e) => {
      if (!validateSession()) return;
      if (friendsSidebar.classList.contains("visible") &&
          !friendsSidebar.contains(e.target) &&
          e.target !== mobileMenuToggle) {
        friendsSidebar.classList.remove("visible");
      }
    });
  }

  // Close sidebar
  if (closeSidebarButton) {
    closeSidebarButton.addEventListener("click", () => {
      if (!validateSession()) return;
      friendsSidebar.classList.remove("visible");
    });
  }

  // Search functionality
  function filterFriends() {
    if (!validateSession()) return;
    const searchTerm = searchInput.value.toLowerCase();
    const friendElements = friendsList.querySelectorAll(".friend");

    friendElements.forEach((friendElement) => {
      const friendName = friendElement.querySelector(".friend-name").textContent.toLowerCase();
      friendElement.style.display = friendName.includes(searchTerm) ? "flex" : "none";
    });

    const visibleFriends = Array.from(friendElements).filter(el => el.style.display !== "none");
    if (visibleFriends.length === 0) {
      if (!friendsList.querySelector(".no-friends")) {
        const noFriendsMessage = document.createElement("div");
        noFriendsMessage.className = "no-friends";
        noFriendsMessage.textContent = "No friends found";
        noFriendsMessage.style.padding = "15px";
        noFriendsMessage.style.color = "#a0a0a0";
        noFriendsMessage.style.textAlign = "center";
        friendsList.appendChild(noFriendsMessage);
      }
    } else {
      const noFriendsMessage = friendsList.querySelector(".no-friends");
      if (noFriendsMessage) noFriendsMessage.remove();
    }
  }

  if (searchInput) {
    searchInput.addEventListener("input", filterFriends);
  }

  // User data handling
  let currentUser;
  try {
    currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    if (!currentUser) {
      sessionStorage.clear();
      window.location.href = "login.html";
      return;
    }
  } catch (error) {
    sessionStorage.clear();
    window.location.href = "login.html";
    return;
  }

  if (usernameElement) {
    usernameElement.textContent = `Gm ${currentUser.firstName}`;
  }

  // Friends list management
  let users = [];
  try {
    const usersData = localStorage.getItem("users");
    users = usersData ? JSON.parse(usersData) : [currentUser];
    if (!Array.isArray(users)) users = [users];
    localStorage.setItem("users", JSON.stringify(users));
  } catch (error) {
    users = [currentUser];
    localStorage.setItem("users", JSON.stringify(users));
  }

  let friends = users.filter((user) => user.id != currentUser.id);

  // Avatar generation
  function generateAvatar(name) {
    const initials = name.split(" ").map(n => n[0]).join("").toUpperCase();
    const canvas = document.createElement("canvas");
    canvas.width = 40;
    canvas.height = 40;
    const ctx = canvas.getContext("2d");
    const colors = ["#ff6b6b", "#90c4f9", "#00ff00", "#f1c40f", "#9b59b6"];
    ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
    ctx.fillRect(0, 0, 40, 40);
    ctx.fillStyle = "white";
    ctx.font = "16px Arial";
    ctx.textAlign = "center";
    ctx.fillText(initials, 20, 28);
    return canvas.toDataURL();
  }

  // Typing indicator
  let typingTimeout;
  textarea.addEventListener("input", () => {
    if (!validateSession()) return;
    typingIndicator.classList.add("visible");
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
      typingIndicator.classList.remove("visible");
    }, 2000);
  });

  // Chat functionality
  let selectedFriendId = null;

  const myFriend = (id) => {
    if (!validateSession()) return;
    
    document.querySelector(".friend.active")?.classList.remove("active");
    const selectedElement = document.getElementById(`friend-${id}`);
    if (selectedElement) {
      selectedElement.classList.add("active");
      selectedElement.querySelector(".unread-badge")?.remove();
      selectedElement.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    let friend = users.find((user) => user.id == id);
    if (!friend) return;

    const friendNameElement = document.querySelector(".current-friend-name");
    if (friendNameElement) {
      friendNameElement.textContent = `${friend.firstName} ${friend.lastName}`;
    }

    selectedFriendId = id;
    document.querySelector("#sendBtn").onclick = function () {
      send(friend.id);
    };

    getMessages(friend.id);

    if (window.innerWidth <= 768) {
      friendsSidebar.classList.remove("visible");
    }
  };

  function getCurrentTime() {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  function send(userid) {
    if (!validateSession()) return;
    
    const messageInput = document.getElementById("message");
    let message = messageInput.value.trim();
    if (!message) return;

    const newMessageObj = {
      sender: currentUser.id,
      receiver: Number(userid),
      message: message,
      timestamp: Date.now(),
    };

    let conversations = JSON.parse(localStorage.getItem("conversations")) || {};
    const conversationId = currentUser.id < userid 
      ? `${currentUser.id}_${userid}`
      : `${userid}_${currentUser.id}`;

    if (!conversations[conversationId]) {
      conversations[conversationId] = [];
    }

    conversations[conversationId].push(newMessageObj);
    localStorage.setItem("conversations", JSON.stringify(conversations));

    const timeString = getCurrentTime();
    let newMessageElement = document.createElement("div");
    newMessageElement.className = "message sent";
    newMessageElement.innerHTML = `
      <div class="message-text">${message}</div>
      <div class="message-time">${timeString}</div>
    `;

    let messagesContainer = document.querySelector(".chat-messages");
    if (messagesContainer) {
      messagesContainer.appendChild(newMessageElement);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    updateFriendListItem(userid, message, timeString);
    messageInput.value = "";
  }

  function updateFriendListItem(friendId, message, time) {
    if (!validateSession()) return;
    
    const friendElement = document.getElementById(`friend-${friendId}`);
    if (friendElement) {
      const lastMessageElement = friendElement.querySelector(".last-message");
      const timeElement = friendElement.querySelector(".message-time");

      if (lastMessageElement) {
        lastMessageElement.textContent =
          message.length > 20 ? message.substring(0, 20) + "..." : message;
      }

      if (timeElement) {
        timeElement.textContent = time;
      }
    }
  }

  function checkForNewMessages() {
    if (!validateSession()) return;
    
    let conversations = JSON.parse(localStorage.getItem("conversations")) || {};

    friends.forEach((friend) => {
      const conversationId = currentUser.id < friend.id
        ? `${currentUser.id}_${friend.id}`
        : `${friend.id}_${currentUser.id}`;

      const convoMessages = conversations[conversationId] || [];
      const hasUnreadMessages = convoMessages.some(
        (msg) => msg.sender == friend.id && msg.timestamp > (friend.lastSeen || 0)
      );

      if (hasUnreadMessages && selectedFriendId != friend.id) {
        const friendElement = document.getElementById(`friend-${friend.id}`);
        if (friendElement && !friendElement.querySelector(".unread-badge")) {
          const badge = document.createElement("div");
          badge.className = "unread-badge";
          friendElement.appendChild(badge);
        }
      }
    });

    if (selectedFriendId) {
      getMessages(selectedFriendId);
    }
  }

  function getMessages(userid) {
    if (!validateSession()) return;
    
    let messagesContainer = document.querySelector(".chat-messages");
    if (!messagesContainer) return;

    messagesContainer.innerHTML = "";
    const conversationId = currentUser.id < userid
      ? `${currentUser.id}_${userid}`
      : `${userid}_${currentUser.id}`;

    let conversations = JSON.parse(localStorage.getItem("conversations")) || {};
    let conversationMessages = conversations[conversationId] || [];
    conversationMessages.sort((a, b) => a.timestamp - b.timestamp);

    conversationMessages.forEach((message) => {
      let timeString = message.timestamp ? new Date(message.timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }) : "";

      let newMessage = document.createElement("div");
      newMessage.className = message.sender == currentUser.id ? "message sent" : "message received";
      newMessage.innerHTML = `
        <div class="message-text">${message.message}</div>
        <div class="message-time">${timeString}</div>
      `;
      messagesContainer.appendChild(newMessage);
    });

    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // Initialize friends list
  if (friends.length === 0) {
    friendsList.innerHTML = "<div class='no-friends'>No friends found</div>";
  } else {
    friends.forEach((friend) => {
      let friendElement = document.createElement("div");
      friendElement.id = `friend-${friend.id}`;
      friendElement.className = "friend";
      friendElement.onclick = function () {
        myFriend(friend.id);
      };

      const conversationId = currentUser.id < friend.id
        ? `${currentUser.id}_${friend.id}`
        : `${friend.id}_${currentUser.id}`;

      const conversations = JSON.parse(localStorage.getItem("conversations")) || {};
      const convoMessages = conversations[conversationId] || [];

      let lastMessageText = "";
      let lastMessageTime = "";

      if (convoMessages.length > 0) {
        const lastMsg = convoMessages[convoMessages.length - 1];
        lastMessageText = lastMsg.message.length > 20
          ? lastMsg.message.substring(0, 20) + "..."
          : lastMsg.message;

        if (lastMsg.timestamp) {
          lastMessageTime = new Date(lastMsg.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });
        }
      }

      const avatarSrc = generateAvatar(`${friend.firstName} ${friend.lastName}`);
      friendElement.innerHTML = `
        <img src="${avatarSrc}" alt="${friend.firstName} ${friend.lastName} profile image" />
        <div class="friend-info">
          <div class="friend-name">${friend.firstName} ${friend.lastName}</div>
          <div class="last-message">${lastMessageText}</div>
        </div>
        <div class="message-time">${lastMessageTime}</div>
      `;
      friendsList.appendChild(friendElement);
    });

    if (friends.length > 0) {
      myFriend(friends[0].id);
    }
  }

  // Logout button
  document.getElementById("logout-button").addEventListener("click", function () {
    sessionStorage.clear();
    window.location.href = "login.html";
  });

  // Periodic message check
  setInterval(checkForNewMessages, 3000);
};