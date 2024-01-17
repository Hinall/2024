$(document).ready(function () {
  
  display();
 

  function display(){
    $.ajax({
      url: "http://localhost:8080/prop",
      type: "GET",
      async: false,
      success: function (data) {
        data.sort((a, b) => a.survey_id - b.survey_id);
        loadTable(data);
        },
      error: function (error) {
        console.log(error);
      },
    });
   
  }
  function loadTable(dataReceived){
    let tableBody = "";
    dataReceived.forEach((item) => {
      tableBody += `<tr>
                        <td>${item.survey_id}</td>
                        <td>${item.ward_id}</td>
                        <td>${item.property_type}</td>
                        <td>${item.propert_address}</td>
                        <td>${item.latitude}</td>
                        <td>${item.longitude}</td>
                        <td><button type="button"  class="btn btn-light viewBtn" data-lat="${item.latitude}" data-lon="${item.longitude}"><i class="fas fa-map-marked-alt"></i></button></td>
                        <td>
                      
                            <button class="btn btn-light dropdown-toggle dropdownBtn" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i class="fa fa-ellipsis-v" aria-hidden="true"></i>
                            </button>
                            <ul class="dropdown-menu dropdown-menu-dark dropdown3">
                 <!-- dynamic list -->
                 <li><button class="dropdown-item btn btn-light edit" data-id="${item.survey_id}" >edit</button></li>
                 <li><button class="dropdown-item btn btn-light delete" data-id="${item.survey_id}" >delete</button></li>

                </ul>
                        
                    </td>

                      </tr>`;
    });

    // Append the table body to the existing table
    $("tbody").html(tableBody);
  }
  // Initialize the map
  var map = new ol.Map({
    target: "map", // The HTML element ID of the map container
    layers: [
      new ol.layer.Tile({
        // Add a base tile layer (you can customize this)
        source: new ol.source.OSM(),
      }),
    ],
    view: new ol.View({
      // Set initial map view (center and zoom level)
      center: ol.proj.fromLonLat([0, 0]), // Center of the map, in LonLat format
      zoom: 2, // Initial zoom level
    }),
  });

  // Function to add a marker to the map at a specific location
  function addMarker(lon, lat) {
    var point = new ol.geom.Point(ol.proj.fromLonLat([lon, lat]));
    var marker = new ol.Feature({
      geometry: point,
    });

    var vectorLayer = new ol.layer.Vector({
      source: new ol.source.Vector({
        features: [marker],
      }),
    });

    map.addLayer(vectorLayer);
  }

  // Example: Add a marker at coordinates (longitude, latitude)
  $(".viewBtn").on("click", function () {
    let lat = $(this).data("lat");
    let lon = $(this).data("lon");

    addMarker(lon, lat);
    $("#map").css("display", "block");
    $("#close").on("click", function () {
      $("#map").css("display", "none");
    });
  });

  // Search functionality
  $("#myInput").on("keyup", function () {
    var value = $(this).val().toLowerCase();
    $("#myTable tr").filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
    });
  });

  // Fetch data for dropdown
  $.ajax({
    url: "http://localhost:8080/wardIdOption",
    type: "GET",
    async: false,
    success: function (data) {
      var dropdownMenu = $("#dropdown1");
      data.sort((a, b) => a.ward_id - b.ward_id);

      data.forEach((item) => {
        // Use append to add each dropdown item
        dropdownMenu.append(`<li><a class="dropdown-item" href="#">${item.ward_id}</a></li>`);
      });
    },
  });
  // Handle the change event of the first dropdown (ward_id)
$('#dropdown1').on('click', 'a', function () {
  // Get the text of the selected option
  var selectedOption = $(this).text();
  
  // Filter the data based on the ward ID
  $("#myTable tr").filter(function () {
      $(this).toggle($(this).find("td:nth-child(2)").text().includes(selectedOption));
  });
});

   // Fetch property type for dropdown
   $.ajax({
    url: "http://localhost:8080/proptypeoption",
    type: "GET",
    async: false,
    success: function (data) {
      var dropdownMenu = $("#dropdown2");
      data.sort((a, b) => a.property_type - b.property_type);

      data.forEach((item) => {
        // Use append to add each dropdown item
        dropdownMenu.append(`<li><a class="dropdown-item" href="#">${item.property_type}</a></li>`);
      });
    },
  });
 // Handle the change event of the second dropdown (property_type)
$('#dropdown2').on('click', 'a', function () {
  // Get the text of the selected option
  var selected = $(this).text();
  
  // Filter the data based on the property type
  $("#myTable tr").filter(function () {
      $(this).toggle($(this).find("td:nth-child(3)").text().includes(selected));
  });
  
});
  // Handle the click event of the three-dot menu
  $(".dropdownBtn").on("click", function () {
    // Get the associated dropdown-menu
    var dropdownMenu = $(this).next(".dropdown3");
    
    // Toggle the "show" class on the dropdown-menu
    dropdownMenu.toggleClass("show");
  });
  $(".edit").on("click", function () {
    let surveyId = $(this).data("id");
    $.ajax({
      url: "http://localhost:8080/propUpdate/" + surveyId, 
      type: "PUT",
      async: false,
      success: function (data) {
        alert("update");
      }, // Add the missing closing parenthesis here
      error: function (error) {
        console.log(error);
      },
    });
  });
  $(".delete").on("click", function () {
    let surveyId = $(this).data("id");
    $.ajax({
      url: "http://localhost:8080/prop/" + surveyId, 
      type: "DELETE",
      async: false,
      success: function (data) {
        display(data);
        alert("deleted");
      },
      error: function (error) {
        console.log(error);
      },
    });
  });
});
