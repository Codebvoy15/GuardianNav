const map = L.map('heatmap').setView([12.781856610718322, 77.41862885142075], 13); 

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

const heatmapData = []; 

const heat = L.heatLayer(heatmapData, { radius: 25 }).addTo(map);

function updateHeatmap(userId, lat, lng) {
    
    heatmapData.push([lat, lng]);

    heat.setLatLngs(heatmapData);
}
