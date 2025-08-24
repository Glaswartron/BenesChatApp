const express = require('express');
const expressWs = require('express-ws');
const cors = require('cors');

const app = express();
const wsInstance = expressWs(app);
const port = 4000;

wsConnections = [];

app.use(cors({ origin: "http://localhost:3000" }));

// WebSocket route
app.ws('/ws', function (ws, req) {
  console.log('Client connected via WS');

  connectionIndex = wsConnections.length;
  wsConnections.push(ws);

  ws.on('message', function (msg) {
    console.log('Received message:', msg);
    
    // Broadcast the message to all connected clients
    wsConnections.forEach(conn => {
      if (conn !== ws && conn.readyState === 1) { // 1 means OPEN
        conn.send(msg);
      }
    });

  });
});

// HTTP route
app.get('/api', (req, res) => {
  res.send('Ich bin der Server!');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});