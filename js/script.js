document.getElementById('close-details').addEventListener('click', function() {
    document.getElementById('parking-details').classList.add('hidden');
});

// Sample parking data
// Sample parking data for Malaysia
const parkingData = [
    { id: 1, name: "KLCC Parking", lat: 3.1578, lng: 101.7117, availability: 100, totalSpaces: 1200 }, // Kuala Lumpur City Centre
    { id: 2, name: "Mid Valley Parking", lat: 3.1179, lng: 101.6775, availability: 500, totalSpaces: 1500 }, // Mid Valley Megamall
    { id: 3, name: "Penang Times Square Parking", lat: 5.4141, lng: 100.3288, availability: 0, totalSpaces: 200 }, // Penang
    { id: 4, name: "Pavilion Kuala Lumpur Parking", lat: 3.1490, lng: 101.7118, availability: 200, totalSpaces: 2500 }, // Pavilion KL
    { id: 5, name: "Sunway Pyramid Parking", lat: 3.0726, lng: 101.6077, availability: 150, totalSpaces: 3000 }, // Sunway Pyramid
    { id: 6, name: "Suria KLCC Parking", lat: 3.1586, lng: 101.7115, availability: 50, totalSpaces: 1800 }, // Suria KLCC
    { id: 7, name: "One Utama Parking", lat: 3.1497, lng: 101.6167, availability: 300, totalSpaces: 3500 }, // One Utama
    { id: 8, name: "IOI City Mall Parking", lat: 2.9557, lng: 101.7123, availability: 400, totalSpaces: 4000 }, // IOI City Mall
    { id: 9, name: "The Gardens Mall Parking", lat: 3.1189, lng: 101.6765, availability: 100, totalSpaces: 2200 }, // The Gardens Mall
    { id: 10, name: "Berjaya Times Square Parking", lat: 3.1425, lng: 101.7112, availability: 250, totalSpaces: 2800 }, // Berjaya Times Square
    { id: 11, name: "Aeon Mall Tebrau City Parking", lat: 1.6000, lng: 103.6417, availability: 500, totalSpaces: 5000 }, // Johor Bahru
    { id: 12, name: "Gurney Plaza Parking", lat: 5.4361, lng: 100.3108, availability: 80, totalSpaces: 1500 }, // Penang
    { id: 13, name: "Queensbay Mall Parking", lat: 5.3328, lng: 100.3069, availability: 120, totalSpaces: 2000 }, // Penang
    { id: 14, name: "Ipoh Parade Parking", lat: 4.5975, lng: 101.0908, availability: 60, totalSpaces: 1800 }, // Ipoh
    { id: 15, name: "AEON Mall Kinta City Parking", lat: 4.5975, lng: 101.0908, availability: 200, totalSpaces: 2500 }, // Ipoh
    { id: 16, name: "Melaka Mall Parking", lat: 2.1896, lng: 102.2501, availability: 150, totalSpaces: 2200 }, // Melaka
    { id: 17, name: "Dataran Pahlawan Parking", lat: 2.1896, lng: 102.2501, availability: 100, totalSpaces: 2000 }, // Melaka
    { id: 18, name: "AEON Mall Shah Alam Parking", lat: 3.0738, lng: 101.5183, availability: 300, totalSpaces: 3000 }, // Shah Alam
    { id: 19, name: "Setia City Mall Parking", lat: 3.1160, lng: 101.4660, availability: 250, totalSpaces: 2500 }, // Setia Alam
    { id: 20, name: "Central i-City Parking", lat: 3.0670, lng: 101.4870, availability: 400, totalSpaces: 3500 } // i-City Shah Alam
];

// Set the map center to Kuala Lumpur, Malaysia
const map = L.map('map').setView([3.1390, 101.6869], 13); // Kuala Lumpur coordinates

// Add the tile layer for the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

const markers = [];

// Add markers for each parking lot
parkingData.forEach(parking => {
    const marker = L.marker([parking.lat, parking.lng]).addTo(map);
    marker.bindPopup(`<b>${parking.name}</b><br>Available: ${parking.availability}<br>Total Spaces: ${parking.totalSpaces}`);
    markers.push(marker);

    marker.on('click', () => {
        parkingInfo.innerText = `${parking.name} - Available: ${parking.availability} / Total: ${parking.totalSpaces}`;
        parkingDetails.classList.remove('hidden');
        parkingDetails.dataset.parkingId = parking.id;
    });
});

// Search functionality
// Search functionality with prediction
const searchBar = document.getElementById('search-bar');
const searchResults = document.createElement('div'); // Container for search predictions
searchResults.id = 'search-results';
searchResults.style.position = 'absolute';
searchResults.style.backgroundColor = 'white';
searchResults.style.border = '1px solid #ccc';
searchResults.style.zIndex = '1000';
searchResults.style.maxHeight = '200px';
searchResults.style.overflowY = 'auto';
searchResults.style.display = 'none'; // Initially hidden
document.getElementById('search-container').appendChild(searchResults);

searchBar.addEventListener('input', function () {
    const query = searchBar.value.toLowerCase();
    searchResults.innerHTML = ''; // Clear previous results

    if (query === '') {
        searchResults.style.display = 'none'; // Hide if query is empty
        return;
    }

    // Filter parking data based on the query
    const filteredParking = parkingData.filter(parking => 
        parking.name.toLowerCase().includes(query)
    );

    if (filteredParking.length > 0) {
        // Display matching results
        filteredParking.forEach(parking => {
            const resultItem = document.createElement('div');
            resultItem.textContent = parking.name;
            resultItem.style.padding = '10px';
            resultItem.style.cursor = 'pointer';
            resultItem.style.borderBottom = '1px solid #eee';

            // Highlight the matching part of the text
            const matchIndex = parking.name.toLowerCase().indexOf(query);
            if (matchIndex !== -1) {
                const beforeMatch = parking.name.substring(0, matchIndex);
                const matchText = parking.name.substring(matchIndex, matchIndex + query.length);
                const afterMatch = parking.name.substring(matchIndex + query.length);
                resultItem.innerHTML = `${beforeMatch}<strong>${matchText}</strong>${afterMatch}`;
            }

            // Add click event to select the result
            resultItem.addEventListener('click', () => {
                searchBar.value = parking.name; // Fill the search bar with the selected result
                searchResults.style.display = 'none'; // Hide the results

                // Highlight the corresponding marker on the map
                const marker = markers.find(m => m.getPopup().getContent().includes(parking.name));
                if (marker) {
                    marker.openPopup();
                    map.setView(marker.getLatLng(), 15); // Zoom in on the selected location
                }
            });

            searchResults.appendChild(resultItem);
        });

        searchResults.style.display = 'block'; // Show the results
    } else {
        searchResults.style.display = 'none'; // Hide if no results
    }
});

// Hide search results when clicking outside the search bar
document.addEventListener('click', function (event) {
    if (!searchBar.contains(event.target) && !searchResults.contains(event.target)) {
        searchResults.style.display = 'none';
    }
});

let lotMapInstance = null; // Store the map instance globally

function generateParkingSpaceDetails(parking) {
    const levels = ["Level 1", "Level 2", "Level 3", "Level 4"];
    const blocks = ["Block A", "Block B", "Block C", "Block D"];
    const spacesPerLevel = Math.ceil(parking.totalSpaces / levels.length);

    const parkingSpaces = [];
    for (let i = 0; i < parking.totalSpaces; i++) {
        const level = levels[Math.floor(i / spacesPerLevel)];
        const block = blocks[Math.floor((i % spacesPerLevel) / (spacesPerLevel / blocks.length))];
        const spaceNumber = i + 1;
        const isOccupied = i < (parking.totalSpaces - parking.availability); // Fix: Correct logic

        parkingSpaces.push({
            level,
            block,
            spaceNumber,
            isOccupied,
        });
    }

    return parkingSpaces;
}

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
        const spaceLng = parking.lng + (col * 0.0001); // Adjust longitude for each column
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


// Close parking space details overlay
document.getElementById('close-space-details').addEventListener('click', function () {
    document.getElementById('parking-space-details-overlay').classList.add('hidden');
});

// Function to show parking space details in the overlay
function showParkingSpaceDetailsOverlay(space) {
    document.getElementById('space-level').innerText = `Level: ${space.level}`;
    document.getElementById('space-block').innerText = `Block: ${space.block}`;
    document.getElementById('space-number').innerText = `Space: ${space.spaceNumber}`;
    document.getElementById('space-status').innerText = `Status: ${space.isOccupied ? 'Occupied' : 'Available'}`;
    document.getElementById('parking-space-details-overlay').classList.remove('hidden');
}

// Function to show parking space details on hover or click
function showParkingSpaceDetails(parking) {
    const parkingSpaces = generateParkingSpaceDetails(parking);

    // Simulate parking spaces on the map
    const parkingLotMap = document.getElementById('parking-lot-map');
    const lotMap = document.getElementById('lot-map');

    // Add full-screen class
    parkingLotMap.classList.add('fullscreen');
    parkingLotMap.classList.remove('hidden');

    // Clear previous map if it exists
    if (lotMapInstance) {
        lotMapInstance.remove();
        lotMapInstance = null;
    }

    // Initialize the parking lot map
    lotMapInstance = L.map(lotMap, {
        zoomControl: false,
        doubleClickZoom: false,
        boxZoom: false,
        dragging: true,
    }).setView([parking.lat, parking.lng], 18);

    // Add a tile layer for the parking lot map
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
    }).addTo(lotMapInstance);

    // Calculate the grid size (rows and columns) for a square layout
    const totalSpaces = parking.totalSpaces;
    const gridSize = Math.ceil(Math.sqrt(totalSpaces)); // Ensure the grid is square
    const spaceSize = 0.00005; // Size of each parking space (latitude and longitude)

    // Add parking spaces to the map
    parkingSpaces.forEach((space, index) => {
        const row = Math.floor(index / gridSize); // Row in the grid
        const col = index % gridSize; // Column in the grid
        const spaceLat = parking.lat + (row * spaceSize); // Adjust latitude for each row
        const spaceLng = parking.lng + (col * spaceSize); // Adjust longitude for each column

        const color = space.isOccupied ? 'red' : 'green'; // Red for occupied, green for available
        const square = L.rectangle(
            [
                [spaceLat, spaceLng], // Bottom-left corner
                [spaceLat + spaceSize, spaceLng + spaceSize], // Top-right corner
            ],
            {
                color: color,
                weight: 1,
                fillOpacity: 0.5,
            }
        ).addTo(lotMapInstance);

        // Add hover and click events for each parking space
        square.on('mouseover', () => {
            square.setStyle({ fillOpacity: 0.8 });
            const tooltipContent = `
                <b>${parking.name}</b><br>
                Level: ${space.level}<br>
                Block: ${space.block}<br>
                Space: ${space.spaceNumber}<br>
                Status: ${space.isOccupied ? 'Occupied' : 'Available'}
            `;
            square.bindTooltip(tooltipContent).openTooltip();
        });

        square.on('mouseout', () => {
            square.setStyle({ fillOpacity: 0.5 });
            square.unbindTooltip();
        });

        square.on('click', () => {
            showParkingSpaceDetailsOverlay(space); // Show details in overlay instead of alert
        });
    });
}

// Update the viewSpacesButton event listener
viewSpacesButton.addEventListener('click', () => {
    const parkingId = parkingDetails.dataset.parkingId;
    const selectedParking = parkingData.find(p => p.id == parkingId);
    showParkingSpaceDetails(selectedParking);
});

