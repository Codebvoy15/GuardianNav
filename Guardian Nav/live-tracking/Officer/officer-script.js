const userTable = document.getElementById('user-table').getElementsByTagName('tbody')[0];
const locationList = document.getElementById('location-list');

const locations = {
    'Fortuner Canteen': [12.786225, 77.419876],
    'IS Office': [12.78672, 77.42115],
    'Parking': [12.784083, 77.416237],
    'Gate 2': [12.7828, 77.4138],
    'Gate 3': [12.781890053934504, 77.4150550214473],
    'Bus stop': [12.78298978870643, 77.41555230010954],
    'Qualis Canteen': [12.78216, 77.41786],
    'Gate 1': [12.78319, 77.41324],
    'P1 Main Office': [12.781856610718322, 77.41862885142075],
    'Shuttle Bus Yard': [12.783185088933166, 77.41664789825671],
    'P2 Reception': [12.784806742235183, 77.41969710710161]
};

let locationCounts = Object.keys(locations).reduce((acc, location) => {
    acc[location] = 0;
    return acc;
}, {});

function updateLocationList(userId, lat, lng) {
    let locationName = getLocationName(lat, lng);
    if (locationName) {
        locationCounts[locationName]++;
        renderLocationList();
    }
}

function getLocationName(lat, lng) {
    for (const [name, [locLat, locLng]] of Object.entries(locations)) {
        const distance = getDistanceFromLatLonInMeters(lat, lng, locLat, locLng);
        if (distance < 100) { 
            return name;
        }
    }
    return null;
}

function renderLocationList() {
    locationList.innerHTML = '';
    for (const [name, count] of Object.entries(locationCounts)) {
        const item = document.createElement('li');
        item.textContent = `${name}: ${count} user(s)`;
        locationList.appendChild(item);
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

const socket = new WebSocket('ws://localhost:3030'); 

socket.onopen = function() {
    console.log('WebSocket connection established');
};

socket.onclose = function() {
    console.log('WebSocket connection closed');
};

socket.onmessage = function(event) {
    const data = JSON.parse(event.data);
    const { userId, lat, lng, timestamp } = data;

    
    let row = document.getElementById(`user-${userId}`);
    if (!row) {
        row = userTable.insertRow();
        row.id = `user-${userId}`;

        const userIdCell = row.insertCell(0);
        const latCell = row.insertCell(1);
        const lngCell = row.insertCell(2);
        const timestampCell = row.insertCell(3);
        const viewMapCell = row.insertCell(4);

        userIdCell.textContent = userId;
        latCell.textContent = lat;
        lngCell.textContent = lng;
        timestampCell.textContent = new Date(timestamp).toLocaleString();

        const viewMapButton = document.createElement('button');
        viewMapButton.textContent = 'View on Map';
        viewMapButton.className = 'view-map-button';
        viewMapButton.onclick = function() {
            window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
        };

        viewMapCell.appendChild(viewMapButton);
    } else {
        row.cells[1].textContent = lat;
        row.cells[2].textContent = lng;
        row.cells[3].textContent = new Date(timestamp).toLocaleString();
    }

    updateLocationList(userId, lat, lng); 
};


socket.onerror = function(error) {
    console.error('WebSocket Error: ', error);
};
