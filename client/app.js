const loginForm = document.getElementById('welcome-form');
const messagesSection = document.getElementById('messages-section');
const messagesList = document.getElementById('messages-list');
const addMessageForm = document.getElementById('add-messages-form');
const userNameInput = document.getElementById('username');
const messageContentInput = document.getElementById('message-content');

let userName = '';

const socket = io();
// 28.3 dodajemy nasłuchowacz, wiadolość pojawia się na naszej LOKALNEJ liście
socket.on('message', ({ author, content }) => addMessage(author, content));
// Z 28.3/2 dodajemy informacje o pojawieniu się nowego uzytkownika chatu
socket.on('joinNewUser', ({ author, content }) => addMessage(author, content));
// Z 28.3/2 dodajemy informacje o wyjściu uzytkownika z chatu
socket.on('userLeft', ({ author, content }) => addMessage(author, content));

// 28.2 Etap 4: Walidacja logowania
const login = e => {
  e.preventDefault();
  if (userNameInput.value) {
    userName = userNameInput.value;
    loginForm.classList.remove('show');
    messagesSection.classList.add('show');
    // 28.3 informacja dla servera o wybraniu loginu, dodanie do tablicy nazwy użytkownika i jego id
    socket.emit('join', userName);
  } else {
    alert('You have to type your name!')
  }
}
loginForm.addEventListener('submit', login);


// 28.2 Etap 5: Wysyłanie wiadomości
const sendMessage = e => {
  e.preventDefault();
  if (messageContentInput.value) {
    addMessage(userName, messageContentInput.value);
    // 28.3  dodajemy emitter aby wysłać ta wiadomość na serwer
    socket.emit('message', { author: userName, content: messageContentInput.value });
    messageContentInput.value = '';
  } else {
    alert('You have to type message!')
  }
}
addMessageForm.addEventListener('submit', sendMessage);

function addMessage(author, content) {
  const message = document.createElement('li');
  message.classList.add('message');
  message.classList.add('message--received');
  if(author === userName) {} message.classList.add('message--self');
  // Z 28.3/2 dodajemy powiadomienie ChatBota
  if(author === 'ChatBot') message.classList.add('message--bot');

  message.innerHTML = `
    <h3 class="message__author">${userName === author ? 'You' : author}</h3>
    <div class="message__content">${content}</div>
  `;
  messagesList.appendChild(message);
}