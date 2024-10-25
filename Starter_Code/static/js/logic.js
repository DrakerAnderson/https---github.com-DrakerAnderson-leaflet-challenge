


// Fetch earthquake data from USGS API
fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson')
    .then(response => response.json())
    .then(data => {
        const features = data.features;

        // Create a map
        const map = L.map('map').setView([20, 0], 2);

        // Add a tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
        }).addTo(map);

        // Function to determine marker size based on magnitude
        function getMarkerSize(magnitude) {
            return magnitude * 3; // Adjust the multiplier for size scaling
        }

        // Function to determine marker color based on depth
        function getMarkerColor(depth) {
            if (depth < 10) return '#00FF00'; // Green
            if (depth < 20) return '#FFFF00'; // Yellow
            if (depth < 30) return '#FFA500'; // Orange
            return '#FF0000'; // Red
        }

        // Loop through earthquake data and create markers
        features.forEach(feature => {
            const { geometry, properties } = feature;
            const latitude = geometry.coordinates[1];
            const longitude = geometry.coordinates[0];
            const magnitude = properties.mag;
            const depth = geometry.coordinates[2];
            const place = properties.place; // Location of the earthquake
            const time = new Date(properties.time).toLocaleString(); // Time of the earthquake

            const marker = L.circleMarker([latitude, longitude], {
                radius: getMarkerSize(magnitude),
                fillColor: getMarkerColor(depth),
                color: '#000', // Border color
                weight: 1,
                opacity: 1,
                fillOpacity: 0.7
            }).addTo(map);

            // Bind a popup to each marker with additional information
            marker.bindPopup(`
                <strong>Location:</strong> ${place}<br>
                <strong>Magnitude:</strong> ${magnitude}<br>
                <strong>Depth:</strong> ${depth} km<br>
                <strong>Time:</strong> ${time}
            `);
        });

        // Create a legend
        const legend = L.control({ position: 'bottomright' });

        legend.onAdd = function () {
            const div = L.DomUtil.create('div', 'info legend');
            const depths = [0, 10, 20, 30];
            const colors = ['#00FF00', '#FFFF00', '#FFA500', '#FF0000'];

            div.innerHTML += '<strong>Depth (km)</strong><br>';
            depths.forEach((depth, index) => {
                div.innerHTML +=
                    `<i style="background:${colors[index]}"></i> ${depth} ${depths[index + 1] ? '&ndash; ' + depths[index + 1] : '+'}<br>`;
            });

            return div;
        };

        legend.addTo(map);
    })
    .catch(error => console.error('Error fetching earthquake data:', error));