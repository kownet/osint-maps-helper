/*
Get coordinates from Rectangle
and binds these values to table cells
*/
function getCoordinatesValues(rectangle){
  var bounds = rectangle.getBounds();
    
    var sw = bounds.getSouthWest();
    var ne = bounds.getNorthEast();

    document.getElementById("sw_direction").innerText = (sw.lat()).toFixed(4) + ", " + (sw.lng()).toFixed(4);
    document.getElementById("ne_direction").innerText = (ne.lat()).toFixed(4) + ", " + (ne.lng()).toFixed(4);
    document.getElementById("min_lat_direction").innerText = (sw.lat()).toFixed(4);
    document.getElementById("max_lat_direction").innerText = (ne.lat()).toFixed(4);
    document.getElementById("min_long_direction").innerText = (sw.lng()).toFixed(4);
    document.getElementById("max_long_direction").innerText = (ne.lng()).toFixed(4);
}

function initMap() {
  
  // Map Initialization
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 52.2333, 
      lng: 21.0167
    },
    zoom: 10,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });

  // Drawing canvas
  var drawingManager = new google.maps.drawing.DrawingManager({
    drawingMode: google.maps.drawing.OverlayType.RECTANGLE,
    drawingControl: true,
    drawingControlOptions: {
      position: google.maps.ControlPosition.TOP_CENTER,
      drawingModes: [
        google.maps.drawing.OverlayType.RECTANGLE
      ]
    },
    rectangleOptions: {
      strokeColor : '#6c6c6c',
      strokeWeight : 3.5,
      fillColor : '#926239',
      fillOpacity : 0.6,
      editable: true,
      draggable: true
    }
  });
  drawingManager.setMap(map);

  google.maps.event.addListener(drawingManager, 'rectanglecomplete', function(rectangle) {

    getCoordinatesValues(rectangle);

    google.maps.event.addListener(rectangle, 'bounds_changed', function(event) {

      getCoordinatesValues(rectangle);
      
      });
  });

  var info = document.getElementById('info');
  map.controls[google.maps.ControlPosition.TOP_RIGHT].push(info);

  // Create the search box and link it to the UI element.
  var input = document.getElementById('pac-input');
  var searchBox = new google.maps.places.SearchBox(input);

  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });

  var markers = [];
  // [START region_getplaces]
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }

    // Clear out the old markers.
    markers.forEach(function(marker) {
      marker.setMap(null);
    });
    markers = [];

    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function(place) {
      var icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      // Create a marker for each place.
      markers.push(new google.maps.Marker({
        map: map,
        icon: icon,
        title: place.name,
        position: place.geometry.location
      }));

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });
  // [END region_getplaces]
}