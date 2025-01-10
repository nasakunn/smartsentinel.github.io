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

    // Simulate parking spaces based on totalSpaces
    const totalSpaces = parking.totalSpaces; // Use the totalSpaces property
    const availableSpaces = parking.availability; // Use the availability property
    const occupiedSpaces = totalSpaces - availableSpaces; // Calculate occupied spaces

    console.log("Total Spaces:", totalSpaces);
    console.log("Available Spaces:", availableSpaces);
    console.log("Occupied Spaces:", occupiedSpaces);

    // Precompute parking space coordinates
    const parkingSpaces = [];
    const gridSize = Math.ceil(Math.sqrt(totalSpaces)); // Calculate grid size for a square layout
    for (let i = 0; i < totalSpaces; i++) {
        const row = Math.floor(i / gridSize);
        const col = i % gridSize;
        const spaceLat = parking.lat + (row * 0.0001); // Adjust latitude for each row
        const spaceLng = parking ```javascript
.lng + (col * 0.0001); // Adjust longitude for each column
        parkingSpaces.push({ lat: spaceLat, lng: spaceLng });
    }

    // Add parking spaces to the map
    parkingSpaces.forEach((space, index) => {
        let color; // Declare the color variable

        // Determine if the space is occupied or available
        if (index < occupiedSpaces) {
            color = 'red'; // Red for occupied
        } else {
            color = 'green'; // Green for available
        }

        // Add the parking space to the map
        L.rectangle([[space.lat, space.lng], [space.lat + 0.00005, space.lng + 0.00005]], {
            color: color,
            weight: 1,
            fillOpacity: 0.5
        }).addTo(lotMapInstance);
    });
}
