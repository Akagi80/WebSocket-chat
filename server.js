const express = require('express');
const path = require('path');

const app = express();

const messages = [];

// Umożliwia pobranie plików zewnętrznych
app.use(express.static(path.join(__dirname, '/client')));

// Dodaje wyświetlanie klienta pod /
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/index.html'));
});

app.listen(8000, () => {
  console.log('Server is running on port: 8000');
});