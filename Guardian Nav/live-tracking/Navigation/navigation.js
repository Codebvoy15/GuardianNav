const map = L.map('map').setView([12.781856610718322, 77.41862885142075], 15);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

const userMarkers = {};
const geofenceCenter = [12.781856610718322, 77.41862885142075];
const geofenceRadius = 1000;
let geofenceCircle = L.circle(geofenceCenter, {
    color: 'green',
    fillColor: '#00FF00',
    fillOpacity: 0.2,
    radius: geofenceRadius
}).addTo(map);
let userMarker;

function updateUserLocation(userId, lat, lng) {
    if (userMarkers[userId]) {
        userMarkers[userId].setLatLng([lat, lng]);
    } else {
        userMarkers[userId] = L.marker([lat, lng]).addTo(map)
            .bindPopup(`User ${userId}`)
            .openPopup();
    }

    updateUserTable(userId, lat, lng);
}

function updateUserTable(userId, lat, lng) {
    const tableBody = document.getElementById('user-table').querySelector('tbody');
    const timestamp = new Date().toLocaleString();
    let row = document.getElementById(`user-${userId}`);

    const userData = {
        userId,
        lat,
        lng,
        timestamp
    };

    const existingData = JSON.parse(localStorage.getItem('userData')) || {};
    existingData[userId] = userData;
    localStorage.setItem('userData', JSON.stringify(existingData));

    if (row) {
        row.cells[1].innerText = lat;
        row.cells[2].innerText = lng;
        row.cells[3].innerText = timestamp;
    } else {
        row = tableBody.insertRow();
        row.id = `user-${userId}`;
        row.insertCell(0).innerText = userId;
        row.insertCell(1).innerText = lat;
        row.insertCell(2).innerText = lng;
        row.insertCell(3).innerText = timestamp;
    }
}

window.onload = function() {
    const storedData = JSON.parse(localStorage.getItem('userData')) || {};
    const tableBody = document.getElementById('user-table').querySelector('tbody');

    Object.values(storedData).forEach(data => {
        const { userId, lat, lng, timestamp } = data;
        const row = tableBody.insertRow();
        row.id = `user-${userId}`;
        row.insertCell(0).innerText = userId;
        row.insertCell(1).innerText = lat;
        row.insertCell(2).innerText = lng;
        row.insertCell(3).innerText = timestamp;
    });
};

const ws = new WebSocket('ws://localhost:3030');

ws.onopen = function() {
    console.log('WebSocket connection established');
};

ws.onclose = function() {
    console.log('WebSocket connection closed');
};

ws.onmessage = function(event) {
    const data = JSON.parse(event.data);
    const { userId, lat, lng } = data;
    updateUserLocation(userId, lat, lng);
    checkGeofence(lat, lng);
};

ws.onerror = function(error) {
    console.error('WebSocket Error: ', error);
};

function showCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            const output = document.getElementById('location-output');
            const key = `${lat.toFixed(4)},${lng.toFixed(4)}`;
            output.textContent = locations[key] || `Your coordinates are (${lat}, ${lng})`;

            if (userMarker) {
                userMarker.setLatLng([lat, lng]).update();
            } else {
                userMarker = L.marker([lat, lng]).addTo(map)
                    .bindPopup('Your Current Location')
                    .openPopup();
            }

            map.setView([lat, lng], 15);
            checkGeofence(lat, lng);
        }, error => {
            alert('Unable to retrieve your location.');
        });
    } else {
        alert('Geolocation is not supported by this browser.');
    }
}

function checkGeofence(lat, lng) {
    const distance = getDistanceFromLatLonInMeters(lat, lng, geofenceCenter[0], geofenceCenter[1]);
    const statusElement = document.getElementById('geofence-status');

    if (distance > geofenceRadius) {
        statusElement.textContent = 'Geofence Status: Outside';
        statusElement.style.color = 'red';
        geofenceCircle.setStyle({ color: 'red', fillColor: 'red' });

        notifyViolation('You have crossed the geofence boundary!');
    } else {
        statusElement.textContent = 'Geofence Status: Inside';
        statusElement.style.color = 'green';
        geofenceCircle.setStyle({ color: 'green', fillColor: '#00FF00' });
    }
}

function navigate() {
    const select = document.getElementById('places-dropdown');
    const selectedValue = select.value;

    if (selectedValue) {
        const [lat, lng] = selectedValue.split(',').map(Number);

        if (!isNaN(lat) && !isNaN(lng)) {
            console.log(`Navigating to: ${lat}, ${lng}`);
            window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=walking`, '_blank');

            const car = document.querySelector('.car');
            if (car) {
                car.style.animation = 'drive 2s linear forwards';
            } else {
                console.error('Car element not found.');
            }

            setTimeout(() => {
                alert('The navigation link has been deactivated.');
                window.location.href = 'about:blank';
            }, 7 * 60 * 60 * 1000); // 7 hours
        } else {
            alert('Invalid location selected.');
        }
    } else {
        alert('Please select a place to navigate to.');
    }
}

function requestNotificationPermission() {
    if (Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
            if (permission !== 'granted') {
                console.log('Notification permission denied');
            }
        });
    }
}

function notifyViolation(message) {
    if (Notification.permission === 'granted') {
        new Notification('Geofence Violation', {
            body: message,
            icon: 'path/to/icon.png'
        });
    } else {
        console.log('Notification permission not granted');
    }
}

function getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) {
    const R = 6371000;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function sendLocationUpdate(userId, lat, lng) {
    if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ userId, lat, lng }));
    }
}

function getOrCreateUserId() {
    let userId = getCookie('userId');
    if (!userId) {
        userId = generateUUID();
        setCookie('userId', userId, 365);
    }
    return userId;
}

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0,
            v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = `expires=${d.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/`;
}

const userId = getOrCreateUserId();

navigator.geolocation.watchPosition(position => {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;

    sendLocationUpdate(userId, lat, lng);
    checkGeofence(lat, lng);
}, error => {
    console.error('Error getting location:', error);
}, {
    enableHighAccuracy: true,
    maximumAge: 10000,
    timeout: 5000
});
