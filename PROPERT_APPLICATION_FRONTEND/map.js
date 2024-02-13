alert("hello");
let map;
$(document).ready(function () {
    console.log('Document is ready!');

    // Initialize the map
     map = new ol.Map({
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

    const element = document.getElementById('popup');

    const popup = new ol.Overlay({
        element: element,
        positioning: 'bottom-center',
        stopEvent: false,
    });
    map.addOverlay(popup);

    let popover;
    function disposePopover() {
        if (popover) {
            popover.dispose();
            popover = undefined;
        }
    }
    // display popup on click
    map.on('click', function (evt) {
        const feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
            return feature;
        });
        disposePopover();
        if (!feature) {
            return;
        }
        popup.setPosition(evt.coordinate);
        popover = new bootstrap.Popover(element, {
            placement: 'top',
            html: true,
            content: `Survey ID: ${feature.get('surveyId')}<br>Ward ID: ${feature.get('wardId')}<br>Property Type: ${feature.get('propertyType')}<br>Property Address: ${feature.get('propertyAddress')}<br>Property Status: ${feature.get('propertyStatus')}<br>Latitude: ${feature.get('latitude')}<br>Longitude: ${feature.get('longitude')}
            <br>image:<a href="images/${feature.get('image')}" target="_blank">click to see image</a>`,
        });
        popover.show();
    });
    // change mouse cursor when over marker
    // map.on('pointermove', function (e) {
    //     const pixel = map.getEventPixel(e.originalEvent);
    //     const hit = map.hasFeatureAtPixel(pixel);
    //     map.getTarget().style.cursor = hit ? 'pointer' : '';
    // });
    // Close the popup when the map is moved
    // map.on('movestart', disposePopover);

    function addMarkers(data) {
        // Clear existing markers before adding new ones
        vectorLayer.getSource().clear();
        // Loop through the data and add markers
        data.forEach((item) => {
            var lon = parseFloat(item.longitude);
            var lat = parseFloat(item.latitude);

            // Create icon feature
            const iconFeature = new ol.Feature({
                geometry: new ol.geom.Point(ol.proj.fromLonLat([lon, lat])),
                surveyId: item.survey_id,
                wardId: item.ward_id,
                propertyType: item.property_type,
                propertyAddress: item.propert_address,
                propertyStatus: item.property_status,
                latitude: lat,
                longitude: lon,
                image: item.property_image
            });

            // Icon style
            const iconStyle = new ol.style.Style({
                image: new ol.style.Icon({
                    anchor: [0.5, 1],
                    anchorXUnits: 'fraction',
                    anchorYUnits: 'pixels',
                    src: 'images/svgviewer-output.svg',
                }),
            });

            iconFeature.setStyle(iconStyle); // Set style of icon feature
            vectorLayer.getSource().addFeature(iconFeature); // Add the feature to the vector layer
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

    // Fetch property status for dropdown
    $.ajax({
        url: "http://localhost:8080/propstatusoption",
        type: "GET",
        async: false,
        contentType: "application/json",
        success: function (data) {
            console.log("Dropdown data:", data); // Log the data to see what is being returned
            var dropdownMenu = $("#property_status_dropdown");
            dropdownMenu.empty(); // Clear existing items before appending new ones

            data.forEach((item) => {
                // Use append to add each dropdown item
                dropdownMenu.append(`<li><a class="dropdown-item" href="#">${item.property_type}</a></li>`);
            });
        },
        error: function (error) {
            console.log("Error fetching dropdown data:", error);
        }
    });

    // Handle the click event of the property_status dropdown
    $(document).on('click', '#property_status_dropdown .dropdown-item', function () {
        var selected = $(this).text();
        console.log("Selected property status:", selected);
        // Implement your logic here
        $.ajax({
            url: "http://localhost:8080/prop_by_property_status/" + selected,
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

    // Delegate click event to dynamically added dropdown items
    $(document).on('click', '.dropdown-item', function () {
        // Handle click event here
        console.log($(this).text());
    });
    // Handle the click event of the search surveyid


    $(document).on('keypress', '#myInput', function () {
        var value = $(this).val();
        $.ajax({
            url: "http://localhost:8080/searchSurveyId/" + value,
            type: "GET",
            async: false,
            contentType: "application/json",
            success: function (data) {
                addMarkers(data);
                // Set the center of the map to the marker's coordinates
// Set the center of the map to the marker's coordinates
// map.getView().setCenter([parseFloat(data.longitude), parseFloat(data.latitude)]);

map.getView().animate({
    zoom: map.getView().getZoom() + 6,
    duration: 400
});
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
});