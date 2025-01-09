document.getElementById('close-details').addEventListener('click', function() {
    document.getElementById('parking-details').classList.add('hidden');
});

// Sample parking data
// Sample parking data for Malaysia
const parkingData = [
    { id: 1, name: "KLCC Parking", lat: 3.1578, lng: 101.7117, availability: 10 }, // Kuala Lumpur City Centre
    { id: 2, name: "Mid Valley Parking", lat: 3.1179, lng: 101.6775, availability: 5 }, // Mid Valley Megamall
    { id: 3, name: "Penang Times Square Parking", lat: 5.4141, lng: 100.3288, availability: 0 }, // Penang
    // Add more parking lots as needed
];

// Set the map center to Kuala Lumpur, Malaysia
const map = L.map('map').setView([3.1390, 101.6869], 13); // Kuala Lumpur coordinates

// Add the tile layer for the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

// Add markers for each parking lot
parkingData.forEach(parking => {
    const marker = L.marker([parking.lat, parking.lng]).addTo(map);
    marker.on('click', () => {
        parkingInfo.innerText = `${parking.name} - Available: ${parking.availability}`;
        parkingDetails.classList.remove('hidden');
        parkingDetails.dataset.parkingId = parking.id;
    });
});


let lotMapInstance = null; // Store the map instance globally

// Function to show parking lot map in full screen
function showParkingLotMap(parking) {
    const parkingLotMap = document.getElementById('parking-lot-map');
    const lotMap = document.getElementById('lot-map');

    // Add full-screen class
    parkingLotMap.classList.add('fullscreen');
    parkingLotMap.classList.remove('hidden');

    // Clear previous map if it exists
    if (lotMapInstance) {
        lotMapInstance.remove(); // Remove the existing map instance
        lotMapInstance = null; // Reset the map instance
    }

    // Initialize the parking lot map
    lotMapInstance = L.map(lotMap, {
        zoomControl: false, // Disable default zoom controls
        doubleClickZoom: false, // Disable double-click zoom
        boxZoom: false, // Disable box zoom
        dragging: true, // Disable dragging
    }).setView([parking.lat, parking.lng], 18); // Zoom in closer for parking lot view

    // Add a tile layer for the parking lot map
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
    }).addTo(lotMapInstance);

    // Simulate parking spaces (for example, a 5x5 grid)
    const totalSpaces = 25; // Total spaces in the lot
    const occupiedSpaces = totalSpaces - parking.availability; // Calculate occupied spaces

    // Precompute parking space coordinates
    const parkingSpaces = [];
    for (let i = 0; i < totalSpaces; i++) {
        const row = Math.floor(i / 5);
        const col = i % 5;
        const spaceLat = parking.lat + (row * 0.0001); // Adjust latitude for each row
        const spaceLng = parking.lng + (col * 0.0001); // Adjust longitude for each column
        parkingSpaces.push({ lat: spaceLat, lng: spaceLng });
    }

    // Add parking spaces to the map
    parkingSpaces.forEach((space, index) => {
        const color = index < occupiedSpaces ? 'red' : 'green'; // Red for occupied, green for available
        L.rectangle([[space.lat, space.lng], [space.lat + 0.00005, space.lng + 0.00005]], {
            color: color,
            weight: 1,
            fillOpacity: 0.5
        }).addTo(lotMapInstance);
    });
}

// Close parking lot map and exit full screen
document.getElementById('close-lot-map').addEventListener('click', function () {
    const parkingLotMap = document.getElementById('parking-lot-map');
    parkingLotMap.classList.remove('fullscreen');
    parkingLotMap.classList.add('hidden');

    // Remove the map instance when closing
    if (lotMapInstance) {
        lotMapInstance.remove(); // Remove the existing map instance
        lotMapInstance = null; // Reset the map instance
    }
});

const parkingDetails = document.getElementById('parking-details');
const parkingInfo = document.getElementById('parking-info');
const viewSpacesButton = document.getElementById('view-spaces');
const parkingLotMap = document.getElementById('parking-lot-map');
const lotMap = document.getElementById('lot-map');

parkingData.forEach(parking => {
    const marker = L.marker([parking.lat, parking.lng]).addTo(map);
    marker.on('click', () => {
        parkingInfo.innerText = `${parking.name} - Available: ${parking.availability}`;
        parkingDetails.classList.remove('hidden');
        parkingDetails.dataset.parkingId = parking.id;
    });
});

viewSpacesButton.addEventListener('click', () => {
    const parkingId = parkingDetails.dataset.parkingId;
    const selectedParking = parkingData.find(p => p.id == parkingId);
    showParkingLotMap(selectedParking);
});
