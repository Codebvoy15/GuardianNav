const map = L.map('heatmap').setView([12.781856610718322, 77.41862885142075], 13); // Center on Toyota Kirloskar Motors

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

const heatmapData = []; // Array to hold heatmap data points

const heat = L.heatLayer(heatmapData, { radius: 25 }).addTo(map);

function updateHeatmap(userId, lat, lng) {
    // Add the new location to the heatmap data array
    heatmapData.push([lat, lng]);

    // Update the heatmap layer with the new data
    heat.setLatLngs(heatmapData);
}
