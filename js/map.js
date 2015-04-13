
//Create the variable for the main map itself.
var map;
var infoboxGallery;
var cities = [
  ['London', 51.5072, 0.1275, 'England', 5],
  ['New York', 40.7127, -74.0059, 'USA', 5],
  ['Barcelona', 41.387128, 2.168564999999944, 'Spanien', 5],
  ['Paris', 48.856614, 2.3522219000000177, 'Frankreich', 5],
  //['Maroubra Beach', -33.950198, 151.259302, 1]
  ];


function initialize() {
  var mapOptions = {
    zoom: 3,
    minZoom:3,
    maxZoom:8,
    center: new google.maps.LatLng(18.1500, -15.9667),
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    mapTypeControl: true,
    mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
        position: google.maps.ControlPosition.BOTTOM_CENTER
    },
    panControl: true,
    panControlOptions: {
        position: google.maps.ControlPosition.TOP_RIGHT
    },
    zoomControl: true,
    zoomControlOptions: {
        style: google.maps.ZoomControlStyle.SMALL,
        position: google.maps.ControlPosition.LEFT_CENTER
    },
    scaleControl: true,
    scaleControlOptions: {
        position: google.maps.ControlPosition.TOP_LEFT
    },
    streetViewControl: false,
    streetViewControlOptions: {
        position: google.maps.ControlPosition.LEFT_TOP
    },
    mapTypeControl: false,
  }

    var styledMap = new google.maps.StyledMapType(styles,
      {name: "Styled Map"});

    var map = new google.maps.Map(document.getElementById('map_canvas'),
      mapOptions);


    //Associate the styled map with the MapTypeId and set it to display.
    map.mapTypes.set('map_style', styledMap);
    map.setMapTypeId('map_style');

    setMarkers(map, cities);
}



function setMarkers(map, locations) {
  // Add markers to the map

  // Marker sizes are expressed as a Size of X,Y
  // where the origin of the image (0,0) is located
  // in the top left of the image.

  // Origins, anchor positions and coordinates of the marker
  // increase in the X direction to the right and in
  // the Y direction down.
  var image = {
    url: 'img/point.png',
    // This marker is 20 pixels wide by 32 pixels tall.
    size: new google.maps.Size(20, 20),
    // The origin for this image is 0,0.
    origin: new google.maps.Point(0,0),
    // The anchor for this image is the base of the flagpole at 0,32.
    anchor: new google.maps.Point(10, 10)
  };
  // Shapes define the clickable region of the icon.
  // The type defines an HTML &lt;area&gt; element 'poly' which
  // traces out a polygon as a series of X,Y points. The final
  // coordinate closes the poly by connecting to the first
  // coordinate.
  var shape = {
      coords: [1, 1, 1, 20, 18, 20, 18 , 1],
      type: 'poly'
  };

  for (var i = 0; i < locations.length; i++) {
    var cities = locations[i];
    var myLatLng = new google.maps.LatLng(cities[1], cities[2]);
    var marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        //shadow: shadow,
        icon: image,
        
        draggable: false,
        name: cities[0],
        country: cities[3],
        zIndex: cities[4]
    });

    google.maps.event.addListener(marker, "mouseover", function(){ showCity(this)});


    google.maps.event.addListener(marker, "mouseout", function (event) {
    //Open the Glastonbury info box.
    infoboxCity.close(map, this);
    //Changes the z-index property of the marker to make the marker appear on top of other markers.
    this.setZIndex(google.maps.Marker.MAX_ZINDEX - 1);
    });

    google.maps.event.addListener(marker, "click", function(){ showGallery(this)});
}



function showCity(city) {

  //var pop_up_info = "background-color: #E10219; padding:10px; margin-left: 2px; text-align: center; font-color:#ffffff; width: intrinsic; width: -moz-max-content; width: -webkit-max-content; height: auto; border-radius:2px; -moz-border-radius: 2px; -webkit-border-radius: 2px;";
  
  
  var contentCity = [
          ['<div class="polygon"><img src="../worldMap/img/arrow.png"/></div>'],
          ['<div class = "cityPopUp"><h4>'+ city.name +'</h4></div>']      
        ];

  //boxTextCity.innerHTML = '<h4>'+ city.name +'</h4>''<svg height="210" width="500"><polygon points="200,10 250,190 160,210" style="fill:lime;stroke:purple;stroke-width:1" /></svg>';

  //Sets up the configuration options of the pop-up info box.
  var infoboxOptionsCity = {
   content: contentCity
   ,disableAutoPan: false
   ,maxWidth: 0
   ,pixelOffset: new google.maps.Size(0, -50)
   ,zIndex: null
   ,boxStyle: {
   opacity: 1
   }
   ,closeBoxMargin: false
   ,closeBoxURL: ""
   ,infoBoxClearance: new google.maps.Size(1, 1)
   ,isHidden: false
   ,pane: "floatPane"
   ,enableEventPropagation: false
  };

    infoboxCity = new InfoBox(infoboxOptionsCity);
    //Open the Glastonbury info box.
    infoboxCity.open(map, city);
    //Changes the z-index property of the marker to make the marker appear on top of other markers.
    city.setZIndex(google.maps.Marker.MAX_ZINDEX + 1);
}
  

  
function showGallery(city) {
    
      
  if (infoboxGallery) {
    infoboxGallery.close();
  }

console.log(city);
  var content = [
          ['<div id="carousel-example-generic" class="carousel slide" data-ride="carousel"><ol class="carousel-indicators"><li data-target="#carousel-example-generic" data-slide-to="0" class="active"></li><li data-target="#carousel-example-generic" data-slide-to="1"></li><li data-target="#carousel-example-generic" data-slide-to="2"></li></ol><div class="carousel-inner"><div class="item active"><img src="http://placehold.it/300x450/09f/fff" alt=""><div class="carousel-caption"><h3>Caption Text</h3></div></div><div class="item"><img src="http://placehold.it/300x450/09f/fff" alt=""><div class="carousel-caption"><h3>Caption Text</h3></div></div><div class="item"><img src="http://placehold.it/300x450/09f/fff" alt=""><div class="carousel-caption"><h3>Caption Text</h3></div></div></div><a class="left carousel-control" href="#carousel-example-generic" role="button" data-slide="prev"><span class="glyphicon glyphicon-chevron-left"></span></a><a class="right carousel-control" href="#carousel-example-generic" role="button" data-slide="next"><span class="glyphicon glyphicon-chevron-right"></span></a></div>'],
          ['<div id="info"><h1>'+city.name+'</h1><h2>'+city.country+'</h2><p>'+'Latitude: ' + city.position.D +
    '<br>Longitude: ' + city.position.k+'</p></div>']
        ];

  //var galleryStyle = "border: 0px solid black; background-color: #4D4D4D; padding:5px; margin-top: 8px; border-radius:3px; -moz-border-radius: 3px; -webkit-border-radius: 3px; box-shadow: 1px 1px #888;";
  
  //Creates the information to go in the pop-up info box.
  //var boxTextGallery = document.createElement("div");
  
  //boxTextGallery.style.cssText = galleryStyle;
  

  //Sets up the configuration options of the pop-up info box.
  var infoboxOptionsGallery = {
   content: content
   ,disableAutoPan: false
   ,maxWidth: 0
   ,pixelOffset: new google.maps.Size(100, -150)

   ,zIndex: null
   ,boxStyle: {
   
   opacity: 1
   }
   ,closeBoxMargin: "6px 6px 0px 0px"
   ,closeBoxURL: "img/close.png"
   ,infoBoxClearance: new google.maps.Size(1, 1)
   ,isHidden: false
   ,pane: "floatPane"
   ,enableEventPropagation: true
  };

  //Creates the pop-up infobox 
  infoboxGallery = new InfoBox(infoboxOptionsGallery);
  
  //infoboxGallery.setContent($(boxTextGallery).clone().html());

  infoboxGallery.open(map, city);
  //Zooms the map.
  //setZoomWhenMarkerClicked();
  //Sets the Glastonbury marker to be the center of the map.
  
  offsetCenter(city.getPosition(), -200, 100);
  //map.setCenter(city.getPosition());
  //map.panBy(400,-200);

  infoboxGallery.addListener('domready', function() {
      // Set up the carousel for images
      $('.carousel-inner').carousel({
          interval: false
      });

      // Specify what you want the carousel to do when the .carousel-indicator is clicked
      $('.carousel-indicators li').click(function() {
          $('.carousel-inner').carousel(parseInt($(this).attr('data-slide-to')));
      });
  });
  
}
  

function setZoomWhenMarkerClicked(){
  var currentZoom = map.getZoom();
  if (currentZoom < 6){
  map.setZoom(6);
 }
}

function offsetCenter(latlng,offsetx,offsety) {

// latlng is the apparent centre-point
// offsetx is the distance you want that point to move to the right, in pixels
// offsety is the distance you want that point to move upwards, in pixels
// offset can be negative
// offsetx and offsety are both optional

var scale = Math.pow(2, map.getZoom());
var nw = new google.maps.LatLng(
    map.getBounds().getNorthEast().lat(),
    map.getBounds().getSouthWest().lng()
);

var worldCoordinateCenter = map.getProjection().fromLatLngToPoint(latlng);
var pixelOffset = new google.maps.Point((offsetx/scale) || 0,(offsety/scale) ||0)

var worldCoordinateNewCenter = new google.maps.Point(
    worldCoordinateCenter.x - pixelOffset.x,
    worldCoordinateCenter.y + pixelOffset.y
);

var newCenter = map.getProjection().fromPointToLatLng(worldCoordinateNewCenter);

map.setCenter(newCenter);

}

}



//window.onload = loadScript;
google.maps.event.addDomListener(window, 'load', initialize);
