        // Initialize the map
        var map = L.map('map').setView([0, 0], 13); // Initial center and zoom level

        places.forEach(place => {
               var placeIcon = L.icon({
                    iconUrl: place.icon,
                    iconSize:     [50, 50], // size of the icon
                    iconAnchor:   [0, 0], // point of the icon which will correspond to marker's location
                });
                var marker = L.marker([place.lat, place.lon], {icon: placeIcon}).addTo(map);
                var popupContent = `
                    <p>
                       ${place.story}
                    </p>
                    <img src=${place.image} alt="Image Alt Text" width="200">
                `;
                marker.bindPopup(popupContent)
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
                var lat = position.coords.latitude;
                var lon = position.coords.longitude;

                // Update the marker's position
                userLocationMarker.setLatLng([lat, lon]);

                // Center the map on the user's precise location
                map.setView([lat, lon]);

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