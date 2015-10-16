

//Variables for the main map and cities array.
var map;
var infoboxCity;
var infoboxGallery;
var allowedBounds = new google.maps.LatLngBounds(
                    new google.maps.LatLng(-25, -90),
                    new google.maps.LatLng(70, 90));


//------------ CITIES ----------------------------------------------

var cities = [
  ['London', 51.5072, -0.127758, 'England', 'images/England/London', 5],
  ['Rom', 41.90278, 12.49637, 'Italien', 'images/Italien/Rom', 5],
  ['New York', 40.712784, -74.005941, 'USA', 'images/USA/NewYork', 5],
  ['Barcelona', 41.387128, 2.168564999999944, 'Spanien', 'images/Spain/Barcelona', 5],
  ['Paris', 48.856614, 2.3522219000000177, 'Frankreich', 'images/France/Paris', 5] 
  ];


// ----------- ZoomControl +/- buttons for the map--------------------

function ZoomControl(controlDiv, map) {
  
  // Creating divs & styles for custom zoom control
  controlDiv.style.padding = '5px';

  // Set CSS for the control wrapper
  var controlWrapper = document.createElement('div');
  controlWrapper.style.cursor = 'pointer';
  //controlWrapper.innerHTML = '<h4 class="zoom">ZOOM</h4>';
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


//------------ init ----------------------------------------------

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

  var mapBounds = new google.maps.LatLngBounds(
                  new google.maps.LatLng(-85.05112878, -180),
                  new google.maps.LatLng(88.05112878, 180));
  
  var mapMinZoom = 1;
  var mapMaxZoom = 5;
 
 /* var overlay = new klokantech.MapTilerMapType(map, function(x,y,z) {
          return "fileadmin/worldMap/Tiles/{z}/{x}/{y}.png".replace('{z}',z).replace('{x}',x).replace('{y}',y); },
          mapBounds, mapMinZoom, mapMaxZoom);

          map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
          //var opacitycontrol = new klokantech.OpacityControl(map, overlay);

          map.fitBounds(mapBounds);*/

      map.mapTypes.set('map_style', styledMap);
      map.setMapTypeId('map_style');
      setMarkers(map, cities);


// Create the DIV to hold the control and call the ZoomControl() constructor
  
  var zoomControlDiv = document.createElement('div');
  var zoomControl = new ZoomControl(zoomControlDiv, map);

  zoomControlDiv.index = 1;
  
  map.controls[google.maps.ControlPosition.LEFT_CENTER].push(zoomControlDiv);

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


/*
function setMarkers(map, locations) {
 
  var markers = [];
var iterator = 0;

  var image = {
    url: 'fileadmin/worldMap/img/point.png',
    size: new google.maps.Size(16, 16),
    origin: new google.maps.Point(0,0),
    anchor: new google.maps.Point(8, 8)
  };

  var imageOver={
    url: 'fileadmin/worldMap/img/pointOver.png',
    size: new google.maps.Size(20, 20),
    origin: new google.maps.Point(0,0),
    anchor: new google.maps.Point(10, 10)
  };
 
  var shape = {
      coords: [1, 1, 1, 20, 18, 20, 18 , 1],
      type: 'poly'
  };


  function drop(cities) {
    for (var i = 0; i < cities.length; i++) {
      addMarker(cities[i], i*1500);
       console.log(i);
    }
  }

  function addMarker(city, timeout) {
    window.setTimeout(function() {
      var myLatLng = new google.maps.LatLng(city[1], city[2]);
      var marker = new google.maps.Marker({
      position: myLatLng,
      map: map,
      icon: image,
      name: city[0],
      country: city[3],
      imgsrc: city[4],
      zIndex: city[5],
      draggable: false,
      animation: google.maps.Animation.DROP
    }); 

  google.maps.event.addListener(marker, "mouseover", function() {
  this.setIcon(imageOver);
  });
  google.maps.event.addListener(marker, "mouseout", function() {
  this.setIcon(image);
  });

  google.maps.event.addListener(marker, "mouseover", function(){ showCity(this)});

  google.maps.event.addListener(marker, "mouseout", function (event) {
  
  infoboxCity.close(map, this);

  this.setZIndex(google.maps.Marker.MAX_ZINDEX - 1);
  });
  google.maps.event.addListener(marker, "click", function(){ showGallery(this)});
    
  }, timeout);   
  
  console.log(city);

  }
drop(locations);
}
*/


function setMarkers(map, locations) {
 
  var image = {
    url: 'img/point.png',
    size: new google.maps.Size(16, 16),
    origin: new google.maps.Point(0,0),
    anchor: new google.maps.Point(8, 8)
  };

  var imageOver={
    url: 'img/pointOver.png',
    size: new google.maps.Size(20, 20),
    origin: new google.maps.Point(0,0),
    anchor: new google.maps.Point(10, 10)
  };
 
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
        icon: image,
        draggable: false,
        name: cities[0],
        lati: cities[1],
        longi: cities[2],
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

    google.maps.event.addListener(marker, "mouseover", function(){ showCity(this, map)});

    google.maps.event.addListener(marker, "mouseout", function (event) {
    
    infoboxCity.close(map, this);

    this.setZIndex(google.maps.Marker.MAX_ZINDEX - 1);
    });
    google.maps.event.addListener(marker, "click", function(){ showGallery(this, map)});
  }


}



function showCity(city, map) {
  
  var contentCity = [
    ['<div class="cityPolygon"><img src="img/arrow.png"/></div>'],
    ['<div class = "cityPopUp"><h4>'+ city.name +'</h4></div>']      
    ];

  //Sets up the configuration options of the pop-up info box.
  var infoboxOptionsCity = {
   content: contentCity
   ,disableAutoPan: false
   ,maxWidth: 0
   ,pixelOffset: new google.maps.Size(10, -50)
   ,zIndex: null
   ,boxStyle: {
    opacity: 1, width: "330px" }
   ,closeBoxMargin: false
   ,closeBoxURL: ""
   ,infoBoxClearance: new google.maps.Size(1, 1)
   ,isHidden: false
   ,pane: "floatPane"
   ,enableEventPropagation: false
  };

  infoboxCity = new InfoBox(infoboxOptionsCity);
  infoboxCity.open(map, city);
  city.setZIndex(google.maps.Marker.MAX_ZINDEX + 1);
}

  

function showGallery(city, map) {  
  
  if (infoboxGallery) {
    infoboxGallery.close();
  }
  //console.log(city);
  var content = [
          ['<div class ="sliderContainer"><div class="slider"></div><div class="worldMap-slider"><button class="icon-arrow-left text-hide header-slider" data-grunticon-embed style="display: inline-block; background-image: none;"><svg xmlns="http://www.w3.org/2000/svg" width="7.2" height="11.9" viewBox="-588 829.9 7.2 11.9"><path fill="#FFF" d="M-588 835.9c0-.2 0-.4.2-.5 0-.1.1-.1.1-.1l5.5-5.2c.3-.3.8-.3 1.1 0 .3.2.3.7 0 1l-5 4.7 5 4.7c.3.2.3.7 0 1-.3.3-.8.3-1.1 0l-5.6-5.2c-.2-.1-.3-.3-.2-.4z"></path></svg></button><button class="icon-arrow-right text-hide header-slider" data-grunticon-embed style="display: inline-block; background-image: none;"><svg xmlns="http://www.w3.org/2000/svg" width="7.2" height="11.9" viewBox="-588 829.9 7.2 11.9"><path fill="#FFF" d="M-581.1 836.3l-5.6 5.2c-.3.3-.8.3-1.1 0-.3-.3-.3-.8 0-1l5-4.7-5-4.7c-.3-.3-.3-.8 0-1 .3-.3.8-.3 1.1 0l5.5 5.2s.1 0 .1.1c.2.1.2.3.2.5.1.1 0 .3-.2.4z"></path></svg></button></div></div>'],
          ['<div id="info"><h2>'+city.name+'</h2><h3>'+city.country+'</h3><p>'+'Latitude: ' + city.lati +'<br>Longitude: ' + city.longi +'</p></div>']
          ];

  //Sets up the configuration options of the pop-up info box.
  var infoboxOptionsGallery = {
   content: content
   ,disableAutoPan: false
   ,maxWidth: 0
   ,pixelOffset: new google.maps.Size(0, -100)
   ,zIndex: null
   ,boxStyle:  {
    opacity: 1 }
   ,closeBoxMargin: "6px 6px 0px 0px"
   ,closeBoxURL: "img/close.png"
   ,infoBoxClearance: new google.maps.Size(1, 1)
   ,isHidden: false
   ,pane: "floatPane"
   ,enableEventPropagation: true
  };
  
  

  //Zooms the map.
  //setZoomWhenMarkerClicked();
  function offsetCenter(latlng,offsetx,offsety) {

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
  offsetCenter(city.getPosition(), -200, 100);
  //map.setCenter(city.getPosition());
  //map.panBy(400,-200);

  var hr = new XMLHttpRequest();
  hr.onreadystatechange = function() {
    if(hr.readyState == 4 && hr.status == 200) {
      var d = JSON.parse(hr.responseText);
      //thumbnailbox.innerHTML = "";
      for(var o in d){
        if(d[o].src){
          $('.infoBox').find(".slider").append('<div class="item"><img src="'+d[o].src+'"><h5>Steffi und Jan in Rom</h5></div>');
        }
      console.log(content);
      }  
    $('.slider').slick({
      autoplay: true,
      autoplaySpeed: 4000,
      infinite: true,
      prevArrow: $('.icon-arrow-left'),
      nextArrow: $('.icon-arrow-right')
    });  
    }
  }
  hr.open("POST", "json_gallery_data.php", true);
  hr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  hr.send("folder="+city.imgsrc);

  infoboxGallery = new InfoBox(infoboxOptionsGallery);
  infoboxGallery.open(map, city);
}
  


function setZoomWhenMarkerClicked(){
  var currentZoom = map.getZoom();
  if (currentZoom < 6){
  map.setZoom(6);
  }
}





document.addEventListener("DOMContentLoaded", initialize());
