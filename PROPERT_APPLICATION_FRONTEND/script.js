$(document).ready(function () {
  display();
  var vectorLayer

  function display() {
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

  function loadTable(dataReceived) {
    let mytable = $('#myTable').DataTable({
      data: dataReceived,
      columns: [
        { data: 'survey_id', title: 'Survey Id' },
        { data: 'ward_id', title: 'Ward Id' },
        { data: 'property_type', title: 'Property Type' },
        { data: 'propert_address', title: 'Property Address' },
        { data: 'latitude', title: 'Latitude', orderable: false },
        { data: 'longitude', title: 'Longitude', orderable: false },
        { data: 'total_floors', title: 'Total Floors', orderable: false },
        { data: 'property_status', title: 'Property Status' },
        { data: 'property_image', title: 'Images', orderable: false },
        { data: null, title: 'Map', orderable: false },
        { data: null, title: '', orderable: false },
      ],
      "columnDefs": [
        { "targets": 4, "className": "text-center", "data": "latitude" },
        { "targets": 5, "className": "text-center", "data": "longitude" },
        { "targets": 6, "className": "text-center", "data": "total_floors" },
        { "targets": 7, "className": "text-center", "data": "property_status" },
        { "targets": 8, "className": "text-center", "data": "property_image",
          "render": function (data, type, row, meta) {
            if(!row.property_image)
            { return "N/A"}
            else{
              return `<button id="imageBtn" type="button" data-bs-toggle="modal" data-bs-target="#imageModal" class="btn btn-light viewBtn">View</button>`;
            }
           
          }
        },
        { "targets": 9, "className": "text-center", "data": null,
          "render": function (data, type, row, meta) {
            return `<button type="button" data-bs-toggle="modal" data-bs-target="#myModal" class="btn btn-light viewBtn" data-lat="${row.latitude}" data-lon="${row.longitude}"><i class="fas fa-map-marked-alt"></i></button>`;
          }
        },
        { "targets": 10, "className": "text-center", "data": null,
          "render": function (data, type, row, meta) {
            return `<button class="btn btn-light dropdown-toggle dropdownBtn" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="fa fa-ellipsis-v" aria-hidden="true"></i></button>`;
          },
          "orderable": false
        }
      ],
      "pageLength": 5,
    });
  


    // let tableBody = "";
    // dataReceived.forEach((item) => {
    //   tableBody += `<tr>
    //                     <td>${item.survey_id}</td>
    //                     <td>${item.ward_id}</td>
    //                     <td>${item.property_type}</td>
    //                     <td>${item.propert_address}</td>
    //                     <td>${item.latitude}</td>
    //                     <td>${item.longitude}</td>

    //                     <td><button type="button" data-bs-toggle="modal" data-bs-target="#myModal" class="btn btn-light viewBtn" data-lat="${item.latitude}" data-lon="${item.longitude}"><i class="fas fa-map-marked-alt"></i></button></td>
    //                     <td>
    //                         <button class="btn btn-light dropdown-toggle dropdownBtn" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
    //                             <i class="fa fa-ellipsis-v" aria-hidden="true"></i>
    //                         </button>
    //                         <ul class="dropdown-menu dropdown-menu-dark dropdown3">
    //                             <!-- dynamic list -->
    // <li><button class="dropdown-item btn btn-light edit" data-bs-toggle="modal" data-bs-target="#editModal" data-id="${item.survey_id}">edit</button></li>
    //                             <li><button class="dropdown-item btn btn-light delete" data-bs-toggle="modal" data-bs-target="#deleteModal" data-id="${item.survey_id}">delete</button></li>
    //                         </ul>
    //                     </td>
    //                   </tr>`;
    // });

    // // Append the table body to the existing table
    // $("tbody").html(tableBody);
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
      zoom: 10, // Initial zoom level
    }),

  });
  var vectorLayer = new ol.layer.Vector({
    source: new ol.source.Vector(),
  });
  map.addLayer(vectorLayer);

  function addMarker(lon, lat) {
    var point = new ol.geom.Point(ol.proj.fromLonLat([lon, lat]));
    var marker = new ol.Feature({
      geometry: point,
    });

    marker.setStyle(new ol.style.Style({
      image: new ol.style.Circle({
        radius: 8,
        fill: new ol.style.Fill({
          color: 'red',
        }),
        stroke: new ol.style.Stroke({
          color: 'white',
          width: 2,
        }),
      }),
    }));
    vectorLayer.getSource().clear(); // Clear existing markers
    vectorLayer.getSource().addFeature(marker); // Add the new marker
  }

  // Example: Add a marker at coordinates (longitude, latitude)
  $(document).on('click', '.viewBtn', function () {
    $('.modal-backdrop').hide();
    let lat = $(this).data("lat");
    let lon = $(this).data("lon");

    addMarker(lon, lat);
    $("#map").css("display", "block");
    $("#close").on("click", function () {
      $("#map").css("display", "none");
      map.removeLayer(vectorLayer);
    });


  });

  // Search functionality
  // $("#myInput").on("keyup", function () {
  //   var value = $(this).val().toLowerCase();
  //   $("#myTable tr").filter(function () {
  //     $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
  //   });
  // });

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
  $(document).on('click', '#dropdown1 a', function () {
    var selectedOption = $(this).text();
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
  $(document).on('click', '#dropdown2 a', function () {
    var selected = $(this).text();
    $("#myTable tr").filter(function () {
      $(this).toggle($(this).find("td:nth-child(3)").text().includes(selected));
    });
  });

  // Handle the click event of the three-dot menu
  $(document).on('click', '.dropdownBtn', function () {
    var dropdownMenu = $(this).next(".dropdown3");
    dropdownMenu.toggleClass("show");
  });

  // Edit button using event delegation
  let surveyId = "";
  $(document).on('click', '.edit', function () {
    surveyId = $(this).data("id");
    $.ajax({
      url: "http://localhost:8080/prop/" + surveyId,
      type: "GET",
      contentType: "application/json",
      async: false,
      success: function (data) {
        $("#wardId").val(data[0].ward_id);
        $("#propType").val(data[0].property_type);
        $("#address").val(data[0].propert_address);
        $("#lat").val(data[0].latitude);
        $("#long").val(data[0].longitude);
      },
      error: function (error) {
        console.log(error);
      },
    });
  });

  // Save changes
  $("#saveBtn").click(function (event) {
    event.preventDefault();

    let newData = {
      ward_id: $("#wardId").val(),
      property_type: $("#propType").val(),
      property_address: $("#address").val(),
      latitude: $("#lat").val(),
      longitude: $("#long").val(),
    };

    $.ajax({
      url: "http://localhost:8080/propUpdate/" + surveyId,
      type: "PUT",
      async: false,
      data: JSON.stringify(newData),
      contentType: "application/json",
      success: function (data) {
        $("#wardId").val('');
        $("#propType").val('');
        $("#address").val('');
        $("#lat").val('');
        $("#long").val('');
        alert("update");
        $("#editModal").modal("hide");
        $('.modal-backdrop').hide();
        display();


        surveyId = "";

      },
      error: function (error) {
        $('.modal-backdrop').hide();
        console.log(error);
      },
    });
  });
  //add new data
  $(document).on('click', '#saveBtn_add', function () {


    let Data = {
      survey_id: $("#surveyId_add").val(),
      ward_id: $("#wardId_add").val(),
      property_type: $("#propType_add").val(),
      property_address: $("#address_add").val(),
      latitude: $("#lat_add").val(),
      longitude: $("#long_add").val(),
    }
    $.ajax({
      url: "http://localhost:8080/prop",
      type: "POST",
      contentType: "application/json",
      async: false,
      data: JSON.stringify(Data),
      success: function () {
        $("#addModal").modal("hide");
        $('.modal-backdrop').hide();
        $("#surveyId").val('');
        $("#wardId").val('');
        $("#propType").val('');
        $("#address").val('');
        $("#lat").val('');
        $("#long").val('');

        ;
        display();
        alert("added");

      },
      error: function (error) {
        console.log(error);
      },
    });


  });

  //delete button
  let delete_Id;
  $(document).on('click', '.delete', function () {
    delete_Id = $(this).data("id");
  });
  // Delete yes button
  $(document).on('click', '#deleteBtn_add', function () {

    $.ajax({
      url: "http://localhost:8080/prop/" + delete_Id,
      type: "DELETE",
      async: false,
      success: function (data) {
        $("#deleteModal").modal("hide");
        $('.modal-backdrop').hide();
        display();
        alert("deleted");
        delete_Id = '';
      },
      error: function (error) {
        console.log(error);
      },
    });
  });
});
