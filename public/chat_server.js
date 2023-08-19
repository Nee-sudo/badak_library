const express = require('express');
const app = express();
const socket = require("socket.io");
const http = require('http');
const server = http.createServer(app);
const io =  socket(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/chat.html');
});


io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
  });
});

io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
});

server.listen(8000, () => {
  console.log('listening on *:8000');
});