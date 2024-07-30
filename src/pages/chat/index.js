import { useEffect } from 'react';
// import './index.css';

export default function Chat() {
  useEffect(() => {
    var usernamePage = document.querySelector('#username-page');
    var chatPage = document.querySelector('#chat-page');
    var usernameForm = document.querySelector('#usernameForm');
    var messageForm = document.querySelector('#messageForm');
    var messageInput = document.querySelector('#message');
    var messageArea = document.querySelector('#messageArea');
    var connectingElement = document.querySelector('.connecting');

    var stompClient = null;
    var username = null;

    var colors = [
      '#2196F3',
      '#32c787',
      '#00BCD4',
      '#ff5652',
      '#ffc107',
      '#ff85af',
      '#FF9800',
      '#39bbb0',
    ];

    function connect(event) {
      username = document.querySelector('#name').value.trim();

      if (username) {
        usernamePage.classList.add('hidden');
        chatPage.classList.remove('hidden');

        // var socket = new window.SockJS('http://localhost:8080/ws');
        var socket = new window.SockJS('/stomp-ws/ws');
        stompClient = Stomp.over(socket);

        stompClient.connect({}, onConnected, onError);
      }
      event.preventDefault();
    }

    function onConnected() {
      // Subscribe to the Public Topic
      stompClient.subscribe('/topic/public', onMessageReceived);

      // Tell your username to the server
      stompClient.send(
        '/app/chat.addUser',
        {},
        JSON.stringify({ sender: username, type: 'JOIN' }),
      );

      connectingElement.classList.add('hidden');
    }

    function onError(error) {
      connectingElement.textContent =
        'Could not connect to WebSocket server. Please refresh this page to try again!';
      connectingElement.style.color = 'red';
    }

    function sendMessage(event) {
      var messageContent = messageInput.value.trim();

      if (messageContent && stompClient) {
        var chatMessage = {
          sender: username,
          content: messageInput.value,
          type: 'CHAT',
        };

        stompClient.send(
          '/app/chat.sendMessage',
          {},
          JSON.stringify(chatMessage),
        );
        messageInput.value = '';
      }
      event.preventDefault();
    }

    function onMessageReceived(payload) {
      var message = JSON.parse(payload.body);

      var messageElement = document.createElement('li');

      if (message.type === 'JOIN') {
        messageElement.classList.add('event-message');
        message.content = message.sender + ' joined!';
      } else if (message.type === 'LEAVE') {
        messageElement.classList.add('event-message');
        message.content = message.sender + ' left!';
      } else {
        messageElement.classList.add('chat-message');

        var avatarElement = document.createElement('i');
        var avatarText = document.createTextNode(message.sender[0]);
        avatarElement.appendChild(avatarText);
        avatarElement.style['background-color'] = getAvatarColor(
          message.sender,
        );

        messageElement.appendChild(avatarElement);

        var usernameElement = document.createElement('span');
        var usernameText = document.createTextNode(message.sender);
        usernameElement.appendChild(usernameText);
        messageElement.appendChild(usernameElement);
      }

      var textElement = document.createElement('p');
      var messageText = document.createTextNode(message.content);
      textElement.appendChild(messageText);

      messageElement.appendChild(textElement);

      messageArea.appendChild(messageElement);
      messageArea.scrollTop = messageArea.scrollHeight;
    }

    function getAvatarColor(messageSender) {
      var hash = 0;
      for (var i = 0; i < messageSender.length; i++) {
        hash = 31 * hash + messageSender.charCodeAt(i);
      }

      var index = Math.abs(hash % colors.length);
      return colors[index];
    }

    usernameForm.addEventListener('submit', connect, true);
    messageForm.addEventListener('submit', sendMessage, true);
  });

  return (
    <>
      <div id="username-page">
        <div className="username-page-container">
          <h1 className="title">Type your username</h1>
          <form id="usernameForm" name="usernameForm">
            <div className="form-group">
              <input
                type="text"
                id="name"
                placeholder="Username"
                autoComplete="off"
                className="form-control"
              />
            </div>
            <div className="form-group">
              <button
                type="submit"
                className="accent username-submit"
              >
                Start Chatting
              </button>
            </div>
          </form>
        </div>
      </div>

      <div id="chat-page" className="hidden">
        <div className="chat-container">
          <div className="chat-header">
            <h2>Spring WebSocket Chat Demo</h2>
          </div>
          <div className="connecting">Connecting...</div>
          <ul id="messageArea"></ul>
          <form
            id="messageForm"
            name="messageForm"
            nameForm="messageForm"
          >
            <div className="form-group">
              <div className="input-group clearfix">
                <input
                  type="text"
                  id="message"
                  placeholder="Type a message..."
                  autoComplete="off"
                  className="form-control"
                />
                <button type="submit" className="primary">
                  Send
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
