let mytable;
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
    mytable = $('#myTable').DataTable({

      data: dataReceived,
      dom: 'Bfrtp',
      buttons: ['copy', 'csv', 'excel', 'pdf', 'print'],
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
        { "targets": 7, "className": "text-center", "data": "property_status",
          "render":function(data, type, row, meta){
            if(!row.property_status){return "N/A";}else{return row.property_status}
          }
          
      },
        {
          "targets": 8, "className": "text-center", "data": "property_image",
          "render": function (data, type, row, meta) {
            if (!row.property_image) { return "N/A" }
            else {
              return `<button data-img=${row.property_image} type="button" data-bs-toggle="modal" data-bs-target="#imageModal" class="btn btn-light imageBtn">View</button>`;
            }

          }
        },
        {
          "targets": 9, "className": "text-center", "data": null,
          "render": function (data, type, row, meta) {
            return `<button type="button" data-bs-toggle="modal" data-bs-target="#myModal" class="btn btn-light viewBtn" data-lat="${row.latitude}" data-lon="${row.longitude}"><i class="fas fa-map-marked-alt"></i></button>`;
          }
        },
        {
          "targets": 10, "className": "text-center", "data": null,
          "render": function (data, type, row, meta) {
            return `<div class="btn-group">
                  <button type="button" id="actionBtn" class="btn btn-light dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Actions
                  </button>
                  <div class="dropdown-menu">
                    <a type="button" class="dropdown-item editBtn btn btn-light" data-bs-toggle="modal" data-bs-target="#editModal" href="#" data-id="${row.survey_id}">Edit</a>
                    <a type="button" class="dropdown-item deleteBtn btn btn-light" data-bs-toggle="modal" data-bs-target="#deleteModal" href="#" data-id="${row.survey_id}">Delete</a>
                  </div>
                </div>`;
          },
          "orderable": false
        }
      ],
      "pageLength": 5,
    });
  }
  // chart
  // Function to draw an ECharts pie chart based on property_type
  function drawEChartsPieChart(mytable) {
    var counts = {};
  
    // Count the number of entries for each property_type
    mytable
      .column(2, { search: 'applied' }) // Assuming property_type is the third column (index 2)
      .data()
      .each(function (val) {
        if (counts[val]) {
          counts[val] += 1;
        } else {
          counts[val] = 1;
        }
      });
  
    // And map it to the format ECharts uses
    var chartData = Object.keys(counts).map(function (key) {
      return {
        name: key,
        value: counts[key]
      };
    });
  
    // Create the ECharts pie chart
    var chart = echarts.init(document.getElementById('demo-output'));
    var option = {
      title: {
        text: 'Distribution of Property Types',
        left: 'center'
      },
      series: [{
        name: 'Property Types',
        type: 'pie',
        radius: '50%',
        data: chartData,
      }]
    };
    chart.setOption(option);
  }
  
  // On each draw, update the data in the chart
  
    drawEChartsPieChart(mytable);
  

 

  //bar chart
  // Function to draw an ECharts bar chart based on ward id
  function drawEChartsBarChart(table) {
    var counts = {};

    // Count the number of entries for each ward_id
    table
      .column(1, { search: 'applied' }) // Assuming ward_id is the second column (index 1)
      .data()
      .each(function (val) {
        if (counts[val]) {
          counts[val] += 1;
        } else {
          counts[val] = 1;
        }
      });

    // And map it to the format ECharts uses
    var chartData = Object.keys(counts).map(function (key) {
      return {
        ward_id: key,
        value: counts[key]
      };
    });

    // Create the ECharts bar chart
    var chart = echarts.init(document.getElementById('bar-chart-output'));
    var option = {
      title: {
        text: 'Property Count by Ward ID',
        left: 'center'
      },
      xAxis: {
        type: 'category',
        data: chartData.map(item => item.ward_id)
      },
      yAxis: {
        type: 'value',
        name: 'Number of Properties'
      },
      series: [{
        name: 'Properties',
        type: 'bar',
        data: chartData.map(item => item.value)
      }]
    };
    chart.setOption(option);
  }

  // Call the function after initializing the DataTable or after an update event

  drawEChartsBarChart(mytable);

  // Function to draw an ECharts pie chart based on property_status
  function drawEChartsPieChart(mytable) {
    var counts = {};

    // Count the number of entries for each property_type
    mytable
      .column(7, { search: 'applied' }) //  property_status is the 8column (index 7)
      .data()
      .each(function (val) {
        if (counts[val]) {
          counts[val] += 1;
        } else {
          counts[val] = 1;
        }
      });

    // And map it to the format ECharts uses
    var chartData = Object.keys(counts).map(function (key) {
      return {
        name: key,
        value: counts[key]
      };
    });

    // Create the ECharts pie chart
    var chart = echarts.init(document.getElementById('pie-chart-property-type'));
    var option = {
      title: {
        text: 'Distribution of Property status',
        left: 'center'
      },
      series: [{
        name: 'Property status',
        type: 'pie',
        radius: '50%',
        data: chartData,
      }]
    };
    chart.setOption(option);
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
      maxZoom: 15, // Initial zoom level
      zoom:12
    }),

  });

  var vectorLayer = new ol.layer.Vector({
    source: new ol.source.Vector()
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
    map.getView().fit(vectorLayer.getSource().getExtent());
    
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
 // Handle the click event of the action button
$(document).on('click', '#actionBtn', function () {
  // Find the dropdown menu within the current row
  var dropdownMenu = $(this).closest('.btn-group').find('.dropdown-menu');
  
  // Toggle the dropdown menu visibility
  dropdownMenu.toggleClass('show');
  
  // Close other dropdowns
  $('.btn-group').not($(this).closest('.btn-group')).find('.dropdown-menu').removeClass('show');
});

// Close dropdown when clicking outside
$(document).on('click', function (e) {
  if (!$(e.target).closest('.btn-group').length) {
    $('.btn-group .dropdown-menu').removeClass('show');
  }
});



  // Edit button using event delegation
  let surveyId = "";
  $(document).on('click', '.editBtn', function () {
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
  $(document).on('click', '.deleteBtn', function () {
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
      
        delete_Id = '';
      },
      error: function (error) {
        console.log(error);
      },
    });
  });
  //view image

  $(document).on('click', '.imageBtn', function () {
    // Get image filenames from data attribute (assuming it's a comma-separated list)
    let filenames = $(this).data('img').split(',');
    // Clear existing carousel items
    $('#imageCarousel .carousel-inner').empty();

    // Populate the carousel with images
    filenames.forEach(function (filename, index) {
      let imageElement = $('<div>').addClass('carousel-item' + (index === 0 ? ' active' : ''));
      imageElement.append($('<img>').attr({
        'src': 'images/' + filename.trim(),
        'alt': 'Image ' + (index + 1),
        'class': 'd-block w-100'
      }));
      $('#imageCarousel .carousel-inner').append(imageElement);
    });

    // Show the modal
    $('#imageModal').modal('show');
  })

});
