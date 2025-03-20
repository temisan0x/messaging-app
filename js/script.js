window.onload = function () {
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  if (isLoggedIn !== "true") {
    window.location.href = "login.html";
  }

  let currentUser = JSON.parse(localStorage.getItem("currentUser"));

  document.getElementById('username').innerText = `${currentUser.firstName} ${currentUser.lastName}`

  let users = JSON.parse(localStorage.getItem("users"));

  let friends = users.filter((user) => user.id != currentUser.id);

  console.log(friends)

  let friendsList = document.querySelector(".friends-list");

  const myFriend = (id) => {
    let friend = users.find((user) => user.id == id);

    if (!friend) {
      alert("User does not exist")
    } else {
      document.querySelector("div.current-friend > div.friend-name").innerText = friend.firstName + " " + friend.lastName

      let sendBtn = document.querySelector("#sendBtn");
      sendBtn.onclick = function () { send(friend.id) };
      getMessages(friend.id);
      console.log(currentUser.messages);
    }
  }

  function send(userid) {
    let selectedUser = users.find((user) => user.id == userid);

    if (selectedUser) {
      let message = document.querySelector("#message").value;
      let receiverMessages = selectedUser.messages;
      if (!receiverMessages) {
        receiverMessages = [{
          "sender": currentUser.id,
          "receiver": Number(userid),
          "message": message
        }]

        let users = JSON.parse(localStorage.getItem("users"));

        let userIndex = users.findIndex((user) => user.id == userid)

        if (userIndex > -1) {
          users[userIndex].messages = receiverMessages;
          localStorage.setItem("users", JSON.stringify(users))

          let newMessage = document.createElement("div");
          newMessage.className = "message sent";
          newMessage.innerHTML =
            `<div class="message-text">${message}</div>
            <div class="message-time">10:01 AM</div>`
          let messagesContainer = document.querySelector(".chat-messages");
          messagesContainer.appendChild(newMessage);
        }
      } else {
        receiverMessages.push({
          "sender": currentUser.id,
          "receiver": Number(userid),
          "message": message
        })

        let users = JSON.parse(localStorage.getItem("users"));

        let userIndex = users.findIndex((user) => user.id == userid)
        if (userIndex > -1) {
          users[userIndex].messages = receiverMessages
          localStorage.setItem("users", JSON.stringify(users))

          let newMessage = document.createElement("div");
          newMessage.className = "message sent";
          newMessage.innerHTML =
            `<div class="message-text">${message}</div>
            <div class="message-time">10:01 AM</div>`
          let messagesContainer = document.querySelector(".chat-messages");
          messagesContainer.appendChild(newMessage);
        }
      }
    }
  }

  function getMessages(userid) {
    let messagesContainer = document.querySelector(".chat-messages");
    let selectedUser = users.find((user) => user.id == userid);
    messagesContainer.innerHTML = '';
    if (selectedUser) {
      let receiverMessages = selectedUser.messages;
      if (receiverMessages) {
        receiverMessages.forEach((message, index) => {
          let newMessage = document.createElement("div");
          newMessage.id = index;

          newMessage.className = message.sender == userid ? "message received" : "message sent";
          newMessage.innerHTML =
            `<div class="message-text">${message.message}</div>
            <div class="message-time">10:01 AM</div>`

          messagesContainer.appendChild(newMessage);
        })
      }
    }
  }

  friends.forEach(friend => {
    let friendElement = document.createElement('div');
    friendElement.id = friend.id;
    friendElement.className = "friend";
    friendElement.onclick = function () { myFriend(friend.id) };
    friendElement.innerHTML = `<img
    src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1045&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3Dk"
    alt="${friend.firstName} ${friend.lastName} profile image"
    />
    <div class="friend-info">
    <div class="friend-name">${friend.firstName}</div>
    <div class="last-message">...</div>
    </div>
    <div class="message-time">...</div>`
    friendsList.appendChild(friendElement);
  });

  const logoutButton = document.getElementById("logout-button");
  if (logoutButton) {
    logoutButton.addEventListener("click", function () {
      localStorage.removeItem("isLoggedIn");
      window.location.href = "login.html";
    });
  }
};