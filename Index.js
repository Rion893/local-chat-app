
const signupContainer = document.getElementById('signup-container');
const loginContainer = document.getElementById('login-container');
const chatContainer = document.getElementById('chat-container');
const chatBox = document.getElementById('chat-box');
const messageInput = document.getElementById('message-input');
const userList = document.getElementById('user-list');
const chatHeader = document.getElementById('chat-with');
const searchUsersInput = document.getElementById('search-users');

let currentUser = '';
let activeChatUser = '';

document.getElementById('goto-login').onclick = function() {
    signupContainer.classList.add('hidden');
    loginContainer.classList.remove('hidden');
};

document.getElementById('goto-signup').onclick = function() {
    loginContainer.classList.add('hidden');
    signupContainer.classList.remove('hidden');
};

document.getElementById('signup-button').onclick = function() {
    const username = document.getElementById('signup-username').value.trim();
    const password = document.getElementById('signup-password').value.trim();
    const signupError = document.getElementById('signup-error');

    if (username === '' || password === '') {
        signupError.textContent = 'Username and password cannot be empty.';
        return;
    }

    let users = JSON.parse(localStorage.getItem('users')) || {};

    if (users[username]) {
        signupError.textContent = 'Username is already taken. Please choose another.';
        return;
    }

    users[username] = password;
    localStorage.setItem('users', JSON.stringify(users));
    alert('Signup successful! Please log in.');
    signupContainer.classList.add('hidden');
    loginContainer.classList.remove('hidden');
};

document.getElementById('login-button').onclick = function() {
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value.trim();
    const loginError = document.getElementById('login-error');

    let users = JSON.parse(localStorage.getItem('users')) || {};

    if (users[username] && users[username] === password) {
        currentUser = username;

        loginContainer.classList.add('hidden');
        chatContainer.classList.remove('hidden');

        loadUserList();
        loadMessages();
    } else {
        loginError.textContent = 'Invalid username or password.';
    }
};
function loadUserList() {
    const users = JSON.parse(localStorage.getItem('users')) || {};
    userList.innerHTML = '';

    Object.keys(users).forEach(user => {
        if (user !== currentUser) {
            const userElement = document.createElement('div');
            userElement.classList.add('user');
            userElement.textContent = user;
            userElement.onclick = function() {
                activeChatUser = user;
                chatHeader.textContent = `Chat with ${user}`;
                loadMessages();
            };
            userList.appendChild(userElement);
        }
    });
}

function loadMessages() {
    chatBox.innerHTML = '';
    const messages = JSON.parse(localStorage.getItem('chatMessages')) || [];
    messages.forEach(message => {
        if ((message.from === currentUser && message.to === activeChatUser) || (message.from === activeChatUser && message.to === currentUser)) {
            displayMessage(message.from, message.text, message.timestamp);
        }
    });
}

function sendMessage() {
    const messageText = messageInput.value.trim();
    if (messageText === '' || !activeChatUser) return;

    const timestamp = new Date().toLocaleTimeString();
    const message = {
        from: currentUser,
        to: activeChatUser,
        text: messageText,
        timestamp: timestamp
    };
    let messages = JSON.parse(localStorage.getItem('chatMessages')) || [];
    messages.push(message);
    localStorage.setItem('chatMessages', JSON.stringify(messages));
    displayMessage(currentUser, messageText, timestamp);
    messageInput.value = '';
}

function displayMessage(username, text, timestamp) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    if (username === currentUser) {
        messageElement.classList.add('me');
    }

    const usernameElement = document.createElement('div');
    usernameElement.classList.add('username');
    usernameElement.textContent = username;

    const timestampElement = document.createElement('div');
    timestampElement.classList.add('timestamp');
    timestampElement.textContent = timestamp;

    const textElement = document.createElement('div');
    textElement.classList.add('text');
    textElement.textContent = text;

    messageElement.appendChild(usernameElement);
    messageElement.appendChild(timestampElement);
    messageElement.appendChild(textElement);
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}


searchUsersInput.oninput = function() {
    const searchQuery = searchUsersInput.value.toLowerCase();
    const users = userList.getElementsByClassName('user');

    Array.from(users).forEach(user => {
        if (user.textContent.toLowerCase().includes(searchQuery)) {
            user.style.display = '';
        } else {
            user.style.display = 'none';
        }
    });
};
