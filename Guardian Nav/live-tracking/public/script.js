const map = L.map('map').setView([0, 0], 2); // Set initial view to cover a large area

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

const userMarkers = {}; // Store markers by user ID

// Function to update or add user markers
function updateUserLocation(userId, lat, lng) {
    if (userMarkers[userId]) {
        // Update existing marker
        userMarkers[userId].setLatLng([lat, lng]);
    } else {
        // Add new marker
        userMarkers[userId] = L.marker([lat, lng]).addTo(map)
            .bindPopup(`User ${userId}`)
            .openPopup();
    }
}

// WebSocket connection to receive location updates
const socket = new WebSocket('ws://localhost:3000'); // Make sure this URL matches your WebSocket server

socket.onopen = function() {
    console.log('WebSocket connection established');
};

socket.onclose = function() {
    console.log('WebSocket connection closed');
};


socket.onmessage = function(event) {
    const data = JSON.parse(event.data);
    const { userId, lat, lng } = data;
    updateUserLocation(userId, lat, lng);
};

// Handle errors
socket.onerror = function(error) {
    console.error('WebSocket Error: ', error);
};
