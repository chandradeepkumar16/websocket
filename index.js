const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 8080 });

let clients = [];

server.on('connection', (socket) => {
  socket.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      socket.frequency = data.frequency;

      if (data.type === 'audio') {
        clients.forEach(client => {
          if (client !== socket && client.frequency === socket.frequency && client.readyState === WebSocket.OPEN) {
            client.send(data.audio);
          }
        });
      }
    } catch (err) {
      console.error('Invalid message', err);
    }
  });

  socket.on('close', () => {
    clients = clients.filter(c => c !== socket);
  });

  clients.push(socket);
});

console.log('WebSocket server running at ws://localhost:8080');
