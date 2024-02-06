alert("hello");

$(document).ready(function () {
    console.log('Document is ready!');

    // Initialize the map
    var map = new ol.Map({
        target: "map2", // Ensure this matches your actual HTML element ID
        layers: [
            new ol.layer.Tile({
                // Add a base tile layer (you can customize this)
                source: new ol.source.OSM(),
            }),
        ],
        view: new ol.View({
            // Set initial map view (center and zoom level)
            center: ol.proj.fromLonLat([70.7932194, 22.2916111]),
            maxZoom: 20, // Initial zoom level
            zoom: 9,
        }),
    });


        

    var vectorLayer = new ol.layer.Vector({
        source: new ol.source.Vector(),
    });
    map.addLayer(vectorLayer);

    
    var popup = new ol.Overlay({
        element: document.getElementById('popup'),
        positioning: 'bottom-center',
        stopEvent: false,
    });
    map.addOverlay(popup);

    function addMarkers(data) {
        // Clear existing markers before adding new ones
        vectorLayer.getSource().clear();

        // Loop through the data and add markers
        data.forEach((item) => {
            var lon = parseFloat(item.longitude);
            var lat = parseFloat(item.latitude);

            var point = new ol.geom.Point(ol.proj.fromLonLat([lon, lat]));
            var marker = new ol.Feature({
                geometry: point,
            });

            marker.setStyle(new ol.style.Style({
                image: new ol.style.Icon({
                    anchor: [0.5, 1],
                    src: 'images/svgviewer-output.svg',
                }),
            }));
           

            marker.on('click', function () {
                var content = '<div><strong>Data:</strong><br>' +
                    'Latitude: ' + item.latitude + '<br>' +
                    'Longitude: ' + item.longitude + '<br>' +
                    'Additional data: ' + item.additionalData + '<br>' +
                    '</div>';

                popup.setContent(content);
                popup.setPosition(point.getCoordinates());

                popup.setOffset([0, -30]);
                popup.set('autoPan', true);
                map.addOverlay(popup);
            });


            vectorLayer.getSource().addFeature(marker);
        });
    }

    $.ajax({
        url: "http://localhost:8080/prop",
        type: "GET",
        async: false,
        contentType: "application/json",
        success: function (data) {
            addMarkers(data);
            // Show the map after adding markers
            $("#map").css("display", "block");
            // Handle close button click
            $("#close").on("click", function () {
                $("#map").css("display", "none");
                map.removeLayer(vectorLayer);
            });
        },
        error: function (error) {
            console.log(error);
        },
    });
});
