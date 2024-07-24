const express = require('express');
const WebSocket = require('ws');
const app = express();
const port = 3030;

// Serve static files
app.use(express.static('public')); // Directory for HTML, JS, and CSS

app.get('/officer', (req, res) => {
    res.sendFile(__dirname + '/public/officer.html');
});

const server = app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

// Create WebSocket server
const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', ws => {
    console.log('Client connected');
    
    ws.on('message', message => {
        // Convert the message from buffer to string
        const messageString = message.toString();
        
        // Parse JSON data
        try {
            const data = JSON.parse(messageString);
            console.log('Received message:', data);

            // Add timestamp to data
            data.timestamp = Date.now();

            // Broadcast the parsed message to all connected clients
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(data));
                }
            });
        } catch (error) {
            console.error('Error parsing message:', error);
        }
    });
    
    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, ws => {
        wss.emit('connection', ws, request);
    });
});
