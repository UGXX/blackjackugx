const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files from the 'blackjackugx' directory
app.use(express.static(path.join(__dirname, 'blackjackugx')));

// Serve index.html explicitly for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Fallback to index.html for any unmatched routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'blackjackugx', 'index.html'));
});

// Handle player connections
io.on('connection', (socket) => {
    console.log('A player connected:', socket.id);

    // Handle player disconnection
    socket.on('disconnect', () => {
        console.log('A player disconnected:', socket.id);
    });

    // Handle custom game events (e.g., player actions)
    socket.on('playerAction', (data) => {
        console.log('Player action received:', data);
        // Broadcast the action to all players
        io.emit('updateGameState', data);
    });
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});