const express = require('express');
const path = require('path');
const socket = require('socket.io');

const app = express();

const messages = [];
const users = [];

// Umożliwia pobranie plików zewnętrznych
app.use(express.static(path.join(__dirname, '/client')));

// Dodaje wyświetlanie klienta pod /
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/index.html'));
});

const server = app.listen(8000, () => {
  console.log('Server is running on port: 8000');
});
const io = socket(server);

io.on('connection', (socket) => {
  // nasłuchiwacz: dołączenie nowego klienta (usera aplikacji chatu) oraz nowa wiadomość
  console.log('New client! Its id – ' + socket.id);
  // nasłuchiwacz: nowa wiadomość + wysyłanie do pozostałych userów 
  socket.on('message', (message) => {
    console.log('Oh, I\'ve got something from ' + socket.id);
    messages.push(message);
    // wysyłanie do wszystkich userów (poza nami samymi - broadcast)
    socket.broadcast.emit('message', message);
  });
  // Z 28.3/1 informacja dla servera o wybraniu loginu, dodanie do tablicy nazwy użytkownika i jego id
  socket.on('join', (userName) => {
    users.push({name: userName, id: socket.id});
    // Z 28.3/2 dodajemy informacje o pojawieniu się nowego uzytkownika chatu
    socket.broadcast.emit('joinNewUser', { author: 'ChatBot', content: `${userName} has joined the conversation!` });
    console.log('Oh, I\'ve got new user: ' + userName + ', id :' + socket.id);
    console.log('All users: ', users);
  })
  // 28.3 obsługa eventu "disconnect" (zamknięcie aplikacji przez usera) + (28.3/1) usunięcie usera z tablicy users
  socket.on('disconnect', () => {
    // Z 28.3/2 dodajemy informacje o wyjściu uzytkownika z chatu
    findeUserLeft = users.find(user => user.id == socket.id);
    if (findeUserLeft != undefined) {
      socket.broadcast.emit('userLeft', { author: 'ChatBot', content: `${findeUserLeft.name} has left the conversation!` });
    }
    // Z 28.3/1  odszukaj 1 usera 
    users.splice(users.findIndex(user => user.id == socket.id), 1);

    console.log('Oh, socket ' + socket.id + ' has left');
    console.log('All users left: ', users);
  });

  console.log('I\'ve added a listener on message and disconnect events \n');
});
