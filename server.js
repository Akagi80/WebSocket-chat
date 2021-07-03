const express = require('express');
const path = require('path');
const socket = require('socket.io');

const app = express();

const messages = [];

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
  // obsługa eventu "disconnect" (zamknięcie aplikacji przez usera)
  socket.on('disconnect', () => { console.log('Oh, socket ' + socket.id + ' has left') });
  console.log('I\'ve added a listener on message and disconnect events \n');
});

