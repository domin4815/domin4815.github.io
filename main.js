// Globals
var mapAutoCenter = true;
var player = {
       lat: 0.0,
       lon: 0.0
    };

// Utils
function isPlayerClose(place) {
    latDiff = Math.abs(place.lat - player.lat);
    lonDiff = Math.abs(place.lon - player.lon);
    return latDiff + lonDiff < 0.0005;

}

// Modal
// Function to open the modal
function openModal() {
  const modal = document.getElementById("myModal");
  modal.style.display = "block";
}

// Function to close the modal
function closeModal() {
  const modal = document.getElementById("myModal");
  modal.style.display = "none";
}

// Close the modal if the user clicks anywhere outside of it
window.onclick = function(event) {
  const modal = document.getElementById("myModal");
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

// Game controls
const mapCenterButton = document.getElementById("auto-center");
mapCenterButton.onclick = function () {
    if (mapAutoCenter) {
        mapAutoCenter = false;
        mapCenterButton.style.color = "#FFFFFF";
    } else {
        mapAutoCenter = true;
        mapCenterButton.style.color = "#000000";
        updateUserLocation();
    }
};

// Initialize the map
const map = L.map('map').setView([0, 0], 13); // Initial center and zoom level
let mapMoved = 0;
map.on('movestart', () => {
    mapMoved = mapMoved + 1;
    if (mapMoved > 2) {
        mapAutoCenter = false;
        mapCenterButton.style.color = "#FFFFFF";
        mapMoved = 0;
    }

});

// Add places
places.forEach(place => {
       const placeIcon = L.icon({
            iconUrl: place.icon,
            iconSize:     [50, 50], // size of the icon
            iconAnchor:   [0, 0], // point of the icon which will correspond to marker's location
       });
       const marker = L.marker([place.lat, place.lon], {icon: placeIcon}).addTo(map);

       // Event handler for when the popup is opened
       marker.on('click', function (e) {
        const modalContent = document.getElementById("modalContent");
        if (isPlayerClose(place)) {
             modalContent.textContent = place.story;
             document.getElementById("modalImg").src = place.image;
             document.getElementById("modalHeader").textContent = place.name;
             document.getElementById("directions").href = "";

        } else {
             modalContent.textContent = "You are too far!"
             document.getElementById("modalImg").src = "";
             document.getElementById("modalHeader").textContent = "";
             document.getElementById("directions").href = place.directions;

        }
        openModal();

       });

});


// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Initialize a marker for the user's location
var userLocationMarker = L.marker([0, 0]).addTo(map);

// Create a hidden popup for the marker
var popup = L.popup({ autoClose: false, closeOnClick: false, autoPan: false });

// Function to update the user's location with high accuracy
function updateUserLocation() {
    navigator.geolocation.getCurrentPosition(function (position) {

        player.lat = position.coords.latitude;
        player.lon = position.coords.longitude
        // Update the marker's position
        userLocationMarker.setLatLng([player.lat, player.lon]);

        // Center the map on the user's precise location
        if (mapAutoCenter){
            mapMoved = 0;
            map.setView([player.lat, player.lon]);
        }

        // Read message from local storage or set current time
        var message = localStorage.getItem("message");
        if (!message) {
            message = new Date().toLocaleString();
            localStorage.setItem("message", message);
        }

        // Set the message as the popup content
        popup.setContent(message);

        // Bind the popup to the marker
        userLocationMarker.bindPopup(popup);

        // Open the popup
        // userLocationMarker.openPopup();

        // Call this function again after 3 seconds
        setTimeout(updateUserLocation, 3000);
    }, function (error) {
        console.error("Error getting user's location: " + error.message);
    }, { enableHighAccuracy: true }); // Request high-accuracy location
}

// Call the function to start updating the user's location
updateUserLocation();