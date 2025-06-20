// server/index.js
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*' },
});

const ACCESS_CODE = '030925';

let connectedSockets = [];

io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('join', (code) => {
    if (code === ACCESS_CODE) {
      connectedSockets.push(socket);
      socket.emit('joined');
      console.log('User joined with valid code');
    } else {
      socket.emit('error', 'Invalid code');
      socket.disconnect();
    }
  });

  socket.on('ping', () => {
    connectedSockets.forEach(s => {
      if (s !== socket) {
        s.emit('ping');
      }
    });
  });

  socket.on('disconnect', () => {
    connectedSockets = connectedSockets.filter(s => s !== socket);
    console.log('Client disconnected');
  });
});

httpServer.listen(3001, () => {
  console.log('Server running on http://localhost:3001');
});