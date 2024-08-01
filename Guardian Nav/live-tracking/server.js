const express = require('express');
const WebSocket = require('ws');
const app = express();
const port = 3030;


app.use(express.static('public')); 

app.get('/officer', (req, res) => {
    res.sendFile(__dirname + '/public/officer.html');
});

const server = app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});


const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', ws => {
    console.log('Client connected');
    
    ws.on('message', message => {
        // THIS IS JUST TO MAKE SURE WE CONVERT THE MESSAGE FROM BUFFER TO STRING 
        const messageString = message.toString();
        try {
            const data = JSON.parse(messageString);
            console.log('Received message:', data);

            data.timestamp = Date.now();

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
