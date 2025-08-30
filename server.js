const express = require('express');
const expressWs = require('express-ws');
const cors = require('cors');
const fs = require('fs');

const app = express();
const wsInstance = expressWs(app);
const port = 4000;

wsConnections = [];

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

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

app.post('/signin', (req, res) => {
  let user = findUser(req.body.username);

  if (!user) {
    res.json({ success: false, error: "Benutzername nicht gefunden" });
    return;
  }
  
  if (user.password !== req.body.password) {
    res.json({ success: false, error: "Falsches Passwort" });
    return;
  }

  res.json({ success: true });
});

app.post('/signup', (req, res) => {
  let user = findUser(req.body.username);

  if (user) {
    res.json({ success: false, error: "Benutzername bereits vergeben" });
    return;
  }

  fs.appendFile("users.txt", `${req.body.username},${req.body.password}\n`, (err) => {
    if (err) {
      res.json({ success: false, error: "Interner Serverfehler" });
      return;
    }
    console.log(`New user registered: ${req.body.username}`);
    res.json({ success: true });
  });
});

function findUser(username) {
  let data = fs.readFileSync("users.txt", "utf-8");
  let users = data.split("\n").map(line => {
    let userdata = line.split(",");
    return { username: userdata[0], password: userdata[1] };
  });
  return users.find(u => u.username === username);
}


// HTTP route
app.get('/api', (req, res) => {
  res.send('Ich bin der Server!');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});