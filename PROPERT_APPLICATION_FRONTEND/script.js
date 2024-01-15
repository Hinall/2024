$(document).ready(function() {
  $('#viewBtn').click(function() {
    // Your map initialization code

    $("#map").css('display' , 'block');

    ol.proj.useGeographic();
    const place = [-110, 45];
    const point = new ol.geom.Point(place);

    const map = new ol.Map({
      target: 'map',
      view: new ol.View({
        center: place,
        zoom: 8,
      }),
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM(),
        }),
        new ol.layer.Vector({
          source: new ol.source.Vector({
            features: [new ol.Feature(point)],
          }),
          style: new ol.style.Style({
            image: new ol.style.Circle({
              radius: 9,
              fill: new ol.style.Fill({
                color: 'red',
              }),
            }),
          }),
        }),
      ],
    });
  });

  $(".dropdown").on("hide.bs.dropdown", function(){
    $(".btn").html('Dropdown <span class="caret"></span>');
  });
  $(".dropdown").on("show.bs.dropdown", function(){
    $(".btn").html('Dropdown <span class="caret caret-up"></span>');
  });
});
