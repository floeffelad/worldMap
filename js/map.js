//Variable for the main map and cities array.
var map;
var infoboxGallery;

var allowedBounds = new google.maps.LatLngBounds(
                    new google.maps.LatLng(-55.05112878, -180),
                    new google.maps.LatLng(55.05112878, 180));

var cities = [
  ['London', 51.5072, 0.1275, 'England', 'images/England/London', 5],
  ['New York', 40.7127, -74.0059, 'USA', 'images/USA/NewYork', 5],
  ['Barcelona', 41.387128, 2.168564999999944, 'Spanien', 'images/Spain/Barcelona', 5],
  ['Paris', 48.856614, 2.3522219000000177, 'Frankreich', 'images/France/Paris', 5],
  //['Maroubra Beach', -33.950198, 151.259302, 1]
  ];


 
 // -- ZoomControl +/- buttons for the map
function ZoomControl(controlDiv, map) {
  
  // Creating divs & styles for custom zoom control
  controlDiv.style.padding = '5px';

  // Set CSS for the control wrapper
  var controlWrapper = document.createElement('div');
  controlWrapper.style.cursor = 'pointer';
  controlWrapper.innerHTML = '<h4 class="zoom">ZOOM</h4>';
  controlWrapper.style.textAlign = 'center';
  controlWrapper.style.width = '32px'; 
  controlWrapper.style.height = '64px';
  controlDiv.appendChild(controlWrapper);

  
  var zoomInButton = document.createElement('div');
  zoomInButton.innerHTML = '<button class="round-button">+</button>';
  controlWrapper.appendChild(zoomInButton);
  
  var zoomOutButton = document.createElement('div');
  zoomOutButton.innerHTML = '<button class="round-button">-</button>';
  controlWrapper.appendChild(zoomOutButton);

  // Setup the click event listener - zoomIn
  google.maps.event.addDomListener(zoomInButton, 'click', function() {
    map.setZoom(map.getZoom() + 1);
  });
    
  // Setup the click event listener - zoomOut
  google.maps.event.addDomListener(zoomOutButton, 'click', function() {
    map.setZoom(map.getZoom() - 1);
  });   
}



function initialize() {

  var mapOptions = {
    zoom: 3,
    minZoom:3,
    maxZoom:5,
    center: new google.maps.LatLng(18.1500, -15.9667),
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    mapTypeControl: true,
    mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
        position: google.maps.ControlPosition.BOTTOM_CENTER
    },
    panControl: false,
    panControlOptions: {
        position: google.maps.ControlPosition.TOP_RIGHT
    },
    zoomControl: false,
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
    
  var mapBounds = new google.maps.LatLngBounds(
                  new google.maps.LatLng(-85.05112878, -180),
                  new google.maps.LatLng(85.05112878, 179.9603703));
  
  var mapMinZoom = 2;
  var mapMaxZoom = 5;

  // Create the DIV to hold the control and call the ZoomControl() constructor
  // passing in this DIV.
  
  var zoomControlDiv = document.createElement('div');
  var zoomControl = new ZoomControl(zoomControlDiv, map);

  zoomControlDiv.index = 1;
  map.controls[google.maps.ControlPosition.LEFT_CENTER].push(zoomControlDiv);


  var overlay = new klokantech.MapTilerMapType(map, function(x,y,z) {
          return "/worldmap/Tiles/{z}/{x}/{y}.png".replace('{z}',z).replace('{x}',x).replace('{y}',y); },
          mapBounds, mapMinZoom, mapMaxZoom);

          map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
          //var opacitycontrol = new klokantech.OpacityControl(map, overlay);

          map.fitBounds(mapBounds);

      map.mapTypes.set('map_style', styledMap);
      map.setMapTypeId('map_style');
      setMarkers(map, cities);


  google.maps.event.addListener(map, 'bounds_changed', function() {
           console.log(map.getBounds());
        });

  google.maps.event.addListener(map,'center_changed',function() { checkBounds(); });


  function checkBounds() {    
    if(! allowedBounds.contains(map.getCenter())) {
      var C = map.getCenter();
      var X = C.lng();
      var Y = C.lat();

      var AmaxX = allowedBounds.getNorthEast().lng();
      var AmaxY = allowedBounds.getNorthEast().lat();
      var AminX = allowedBounds.getSouthWest().lng();
      var AminY = allowedBounds.getSouthWest().lat();

      if (X < AminX) {X = AminX;}
      if (X > AmaxX) {X = AmaxX;}
      if (Y < AminY) {Y = AminY;}
      if (Y > AmaxY) {Y = AmaxY;}

      map.setCenter(new google.maps.LatLng(Y,X));
    }
  }

}



function setMarkers(map, locations) {
 
  var image = {
    url: 'img/point.png',
    // This marker is 20 pixels wide by 32 pixels tall.
    size: new google.maps.Size(16, 16),
    // The origin for this image is 0,0.
    origin: new google.maps.Point(0,0),
    // The anchor for this image is the base of the flagpole at 0,32.
    anchor: new google.maps.Point(8, 8)
  };

  var imageOver={
    url: 'img/pointOver.png',
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
        imgsrc: cities[4],
        zIndex: cities[5]
    });

    google.maps.event.addListener(marker, "mouseover", function() {
    this.setIcon(imageOver);
    });
    google.maps.event.addListener(marker, "mouseout", function() {
    this.setIcon(image);
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
  
  var contentCity = [
          ['<div class="cityPolygon"><img src="../worldMap/img/arrow.png"/></div>'],
          ['<div class = "cityPopUp"><h4>'+ city.name +'</h4></div>']      
        ];

  //Sets up the configuration options of the pop-up info box.
  var infoboxOptionsCity = {
   content: contentCity
   ,disableAutoPan: false
   ,maxWidth: 0
   ,pixelOffset: new google.maps.Size(0, -50)
   ,zIndex: null
   ,boxStyle: {
    opacity: 1
    ,width: "280px"
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
          ['<div id="carousel-example-generic" class="carousel slide" data-ride="carousel"><ol class="carousel-indicators"><li data-target="#carousel-example-generic" data-slide-to="0" class="active"></li><li data-target="#carousel-example-generic" data-slide-to="1"></li><li data-target="#carousel-example-generic" data-slide-to="2"></li></ol><div class="carousel-inner"></div><a class="left carousel-control" href="#carousel-example-generic" role="button" data-slide="prev"><span class="glyphicon glyphicon-chevron-left"></span></a><a class="right carousel-control" href="#carousel-example-generic" role="button" data-slide="next"><span class="glyphicon glyphicon-chevron-right"></span></a></div>'],
          ['<div id="info"><h2>'+city.name+'</h2><h3>'+city.country+'</h3><p>'+'Latitude: ' + city.position.A +
    '<br>Longitude: ' + city.position.F +'</p></div>']
        ];

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
  
  infoboxGallery.open(map, city);
  
  //Zooms the map.
  //setZoomWhenMarkerClicked();
  
  offsetCenter(city.getPosition(), -200, 100);
  //map.setCenter(city.getPosition());
  //map.panBy(400,-200);

  infoboxGallery.addListener('domready', function() {
      // Set up the carousel for images
      $('.carousel-inner').carousel({
          interval: false
      });

      // Specify the carousel what to do when the .carousel-indicator is clicked
      $('.carousel-indicators li').click(function() {
          $('.carousel-inner').carousel(parseInt($(this).attr('data-slide-to')));
      });

      ajax_json_gallery(city.imgsrc, content);
  });
  
}
  
function ajax_json_gallery(folder, content){
  //var thumbnailbox = document.getElementById("pics");
  var hr = new XMLHttpRequest();
  hr.open("POST", "json_gallery_data.php", true);
  hr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  hr.onreadystatechange = function() {
    if(hr.readyState == 4 && hr.status == 200) {
      var d = JSON.parse(hr.responseText);
    //thumbnailbox.innerHTML = "";
    for(var o in d){
      if(d[o].src){

          $(".carousel-inner").append('<div class="item"><img src="'+d[o].src+'"><div class="carousel-caption"><h3>Caption Text</h3></div></div>');
          $(".item:first").attr("class","item active");
      }
    }
    }
  }
  hr.send("folder="+folder);
  //thumbnailbox.innerHTML = "requesting...";
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

  map.panTo(newCenter);

}

}

//window.onload = loadScript;
google.maps.event.addDomListener(window, 'load', initialize);
