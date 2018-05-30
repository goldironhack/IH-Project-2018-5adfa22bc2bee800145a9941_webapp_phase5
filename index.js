// General variables map
var mapStyle = [{"elementType": "geometry",  "stylers": [{    "color": "#ebe3cd"  }]}, {  "elementType": "labels.text.fill",  "stylers": [{    "color": "#523735"  }]}, {  "elementType": "labels.text.stroke",  "stylers": [{    "color": "#f5f1e6"  }]}, {  "featureType": "administrative",  "elementType": "geometry.stroke",  "stylers": [{    "color": "#c9b2a6"  }]}, {  "featureType": "administrative.land_parcel",  "elementType": "geometry.stroke",  "stylers": [{    "color": "#dcd2be"  }]}, {  "featureType": "administrative.land_parcel",  "elementType": "labels.text.fill",  "stylers": [{    "color": "#ae9e90"  }]}, {  "featureType": "landscape.natural",  "elementType": "geometry",  "stylers": [{    "color": "#dfd2ae"  }]}, {  "featureType": "poi","elementType": "geometry",  "stylers": [{    "color": "#dfd2ae"  }]}, {  "featureType": "poi",  "elementType": "labels.text.fill",  "stylers": [{"color": "#93817c"  }]}, {  "featureType": "poi.park",  "elementType": "geometry.fill",  "stylers": [{    "color": "#a5b076"  }]}, {  "featureType": "poi.park",  "elementType": "labels.text.fill",  "stylers": [{    "color": "#447530"  }]}, {  "featureType": "road",  "elementType": "geometry",  "stylers": [{    "color": "#f5f1e6"  }]}, {  "featureType": "road.arterial",  "elementType": "geometry",  "stylers": [{    "color": "#fdfcf8"  }]}, {  "featureType": "road.highway",  "elementType": "geometry",  "stylers": [{    "color": "#f8c967"  }]}, {  "featureType": "road.highway",  "elementType": "geometry.stroke",  "stylers": [{    "color": "#e9bc62"  }]}, {  "featureType": "road.highway.controlled_access",  "elementType": "geometry",  "stylers": [{    "color": "#e98d58"  }]}, {  "featureType": "road.highway.controlled_access",  "elementType": "geometry.stroke",  "stylers": [{    "color": "#db8555"  }]}, {  "featureType": "road.local",  "elementType": "labels.text.fill",  "stylers": [{    "color": "#806b63"  }]}, {  "featureType": "transit.line",  "elementType": "geometry",  "stylers": [{    "color": "#dfd2ae"  }]}, {  "featureType": "transit.line",  "elementType": "labels.text.fill",  "stylers": [{    "color": "#8f7d77"  }]}, {  "featureType": "transit.line",  "elementType": "labels.text.stroke",  "stylers": [{    "color": "#ebe3cd"  }]}, {  "featureType": "transit.station",  "elementType": "geometry",  "stylers": [{    "color": "#dfd2ae"  }]}, {  "featureType": "water",  "elementType": "geometry.fill",  "stylers": [{    "color": "#b9d3c2"  }]}, {  "featureType": "water",  "elementType": "labels.text.fill",  "stylers": [{    "color": "#92998d"  }]}];

// General variables datasets
const GEOSHAPEDISTRICT ="http://services5.arcgis.com/GfwWNkhOj9bNBqoJ/arcgis/rest/services/nycd/FeatureServer/0/query?where=1=1&outFields=*&outSR=4326&f=geojson";
const NEIGHBORHOOD_NAMES_URL = "https://data.cityofnewyork.us/api/views/xyye-rtrs/rows.json?accessType=DOWNLOAD";
const CRIMES_URL = "https://data.cityofnewyork.us/resource/9s4h-37hy.json?cmplnt_fr_dt=2015-12-31T00:00:00.000";
const HOUSING_URL = "https://data.cityofnewyork.us/api/views/hg8x-zxpr/rows.json?accessType=DOWNLOAD";
const MUSUEUMS_URL = "https://data.cityofnewyork.us/api/views/fn6f-htvy/rows.json?accessType=DOWNLOAD";
const ARTGALL_URL = "https://data.cityofnewyork.us/api/views/43hw-uvdj/rows.json?accessType=DOWNLOAD";
const FARMMAR_URL ="https://data.cityofnewyork.us/api/views/j8gx-kc43/rows.json?accessType=DOWNLOAD";

//Global variables
var map;
var nyu = {  lat: 40.7291,  lng: -73.9965};
var markerNYU;
var imageNYU = 'https://i.imgur.com/b146GJn.png';
var markers = [];
var heatMapData = [];
var heatMap = [];
let distances = [];
var crimesCount = [];
var districtsIncome = [];
var houseIncome = [];
let crimes =[];
var icons = {
  // - icon house orange
  house: "https://i.imgur.com/2uNq1px.png",
  artgallery: "https://i.imgur.com/6bZehp5.png",
  markets:"https://i.imgur.com/Q4evFIy.png"
};

var eQuatorialEarthRadius = 6378.1370;
var radians = (Math.PI / 180.0);


//Google map
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {  lat: 40.7291,   lng: -73.9965 },
    zoom: 10.2,
    styles: mapStyle
  });

  //Mark for university
  markerNYU = new google.maps.Marker({
    position: nyu,
    map: map,
    icon: imageNYU
  });

  //Load shape Neighborhood JSON
    loadMapShapes();

  //Load switch marks
    crimesSwitch(); // Heatmap crimes
    housesSwitch(); // Houses marks
    ArtgalSwitch(); // Art gallery marks
    FarmMarkSwitch(); // farm market marks
    centroidNSwitch(); // centroids district marks
    centroidDSwitch(); // centroids Neighborhood marks


}


function loadMapShapes() {
  map.data.loadGeoJson(GEOSHAPEDISTRICT);
  map.data.setStyle(function(feature) {
    var Boro =parseInt(feature.getProperty('BoroCD'));
    if (Boro-100*parseInt(Boro/100)<20) {
      var color = 'gray';
      if (feature.getProperty('isColorful')) {
            color = '#C5D936';
          }
    return ({
      fillColor: color,
      strokeColor: color,
      strokeWeight: 3
   });

  }else {
    return ({

    fillColor: '#FFFFFF',
    fillOpacity: 0.1,
    strokeWeight: 0
    });
  }
  });

//add colors to map
  map.data.addListener('click', function(event) {
           event.feature.setProperty('isColorful', true);
         });
  //click event map
  map.data.addListener('click', function(event) {
    BoroEvent =parseInt( event.feature.getProperty('BoroCD'));
    var option =parseInt(BoroEvent/100);
    doSwitchBor (option)
  });

  map.data.addListener('mouseover', function(event) {
    map.data.revertStyle();
    map.data.overrideStyle(event.feature, {strokeWeight: 3});
  });

  map.data.addListener('mouseout', function(event) {
    map.data.revertStyle();
  });

}


// funtions boroCD names
function manhattanB() {
  document.getElementById('info-borough').textContent = "Manhattan";
  if ((BoroEvent-100*parseInt(BoroEvent/100))<20) {
    document.getElementById('info-DN').textContent= "Manhattan CB: "+(BoroEvent-100*parseInt(BoroEvent/100)).toString();
  }else {
    document.getElementById('info-DN').textContent= "Central Park: Green Area ";
  }
}

function bronxB() {
  document.getElementById('info-borough').textContent = "The Bronx";
  if ((BoroEvent-100*parseInt(BoroEvent/100))<20) {
    document.getElementById('info-DN').textContent= "Bronx CB: "+(BoroEvent-100*parseInt(BoroEvent/100)).toString();
  }else {
    if ((BoroEvent-100*parseInt(BoroEvent/100))==26) {
      document.getElementById('info-DN').textContent= " Van Cortlandt Park: Green Area ";
    }else if ((BoroEvent-100*parseInt(BoroEvent/100))==27) {
      document.getElementById('info-DN').textContent= " Bronx Park: Green Area ";
    }else if ((BoroEvent-100*parseInt(BoroEvent/100))==28) {
      document.getElementById('info-DN').textContent= " Pelham Bay Park: Green Area ";
    }
  }
}

function brooklynB() {
  document.getElementById('info-borough').textContent = "Brooklyn";
  if ((BoroEvent-100*parseInt(BoroEvent/100))<20) {
    document.getElementById('info-DN').textContent= "Brooklyn CB: "+(BoroEvent-100*parseInt(BoroEvent/100)).toString();
  }else {
    if ((BoroEvent-100*parseInt(BoroEvent/100))==55) {
      document.getElementById('info-DN').textContent= "  Prospect Park: Green Area ";
    }else if ((BoroEvent-100*parseInt(BoroEvent/100))==56) {

      document.getElementById('info-DN').textContent= " Gateway National Recreation Area: Green Area ";
    }
  }

}

function queensB() {
  document.getElementById('info-borough').textContent = "Queens";
  if ((BoroEvent-100*parseInt(BoroEvent/100))<20) {
    document.getElementById('info-DN').textContent= "Queens CB: "+(BoroEvent-100*parseInt(BoroEvent/100)).toString();
  }else {
    if ((BoroEvent-100*parseInt(BoroEvent/100))==80) {
      document.getElementById('info-DN').textContent= "   LaGuardia Airport: Airport ";
    }else if ((BoroEvent-100*parseInt(BoroEvent/100))==81) {
      document.getElementById('info-DN').textContent= "  Flushing Meadows-Corona Park: Green Area ";
    }else if ((BoroEvent-100*parseInt(BoroEvent/100))==82) {
        document.getElementById('info-DN').textContent= " Forest Park: Green Area ";
    }else if ((BoroEvent-100*parseInt(BoroEvent/100))==83) {
        document.getElementById('info-DN').textContent= "  JFK International Airport: Airport ";
    }else if ((BoroEvent-100*parseInt(BoroEvent/100))==84) {
        document.getElementById('info-DN').textContent= " Gateway National Recreation Area: Green Area ";
    }
  }
}

function staten_IslandB() {
  document.getElementById('info-borough').textContent = "Staten Island";
  if ((BoroEvent-100*parseInt(BoroEvent/100))<20) {
    document.getElementById('info-DN').textContent= "Staten Island CB: "+(BoroEvent-100*parseInt(BoroEvent/100)).toString();
  }else {
    document.getElementById('info-DN').textContent= " Gateway National Recreation Area: Green Area ";
  }
}

function somethingHappen() {

}


function doSwitchBor (option) {

switch (option) {
  case 1:
  return manhattanB();
  case 2:
  return bronxB();
  case 3:
  return brooklynB();
  case 4:
  return queensB();
  case 5:
  return staten_IslandB();
  default:
  return somethingHappen();

}

}




// Centroid for district


function centroidDistrict(url){



     $.getJSON(url, function(dataLayer, textstatus) {

      let centroids =[];


      for (let fea of dataLayer.features){
          let xArr=[];
          let yArr=[];
          let centroid={};

      if (fea.geometry.type == "Polygon")
      {
          for(let coord of fea.geometry.coordinates[0]){
              xArr.push(coord[0]);
              yArr.push(coord[1]);
            }
      }      else if (fea.geometry.type == "MultiPolygon") {
        for(let pol of fea.geometry.coordinates)  {
                  for(let coord of pol[0]) {
                      xArr.push(coord[0]);
                      yArr.push(coord[1]);
                  }
        }
      }

            xMin=Math.min.apply(null, xArr);
            xMax=Math.max.apply(null, xArr);
            yMin=Math.min.apply(null, yArr);
            yMax=Math.max.apply(null, yArr);

            centroid.x =  xMin + ((xMax-xMin)/2);
            centroid.y =  yMin + ((yMax-yMin)/2);
            centroid.BoroCD  = fea.properties.BoroCD;
            centroids.push(centroid);
      }



      addCentroidsDistrict(centroids);
      distanceFinalDTable (centroids)


     });
}


function addCentroidsDistrict(centroids) {

  for(let centr of centroids){
    var marker = new google.maps.Marker({
    position: new google.maps.LatLng(centr.y, centr.x),
    map: map,
  });
   markers.push(marker)
}
}


function distanceFinalDTable (centroids){

distances =[];

  for (var i = 0; i < centroids.length; i++) {
    let calculateD = calculateDistance(centroids[i],nyu);
    let boroCDistrict = centroids[i].BoroCD;
   distances.push({
     dist: calculateD,
     boroCDist: boroCDistrict

   });

  }

  function compare(a,b) {
    if (a.dist < b.dist)
      return -1;
    if (a.dist > b.dist)
      return 1;
    return 0;
  }

  distances.sort(compare);

      var tr;

      //clean table
           while($("#distancesTable tr").length>1)
           {
               $("#distancesTable tr:last").remove();
           }

      for (var i = 0; i < distances.length; i++) {
          tr = $('<tr/>');
          tr.append("<td>" + distances[i].boroCDist + "</td>");
          tr.append("<td>" + distances[i].dist + "</td>");
          $('#distancesTable').append(tr);
      }

}




function countCrimesData(){

if (crimes.length==0){

  map.data.forEach(function(feature) {

    var geometry = feature.getGeometry();
    var boroCD = feature.getProperty("BoroCD");
    var type = geometry.getType();


    if (geometry.getType() == "Polygon") {

      var poly = new google.maps.Polygon({paths: geometry.getAt(0).getArray()});
      let crimesCount=0;

    for (var i=0; i<heatMapData.length; i++) {
      if (google.maps.geometry.poly.containsLocation(heatMapData[i], poly)) {
                crimesCount++;
      }

     }
      let crime = {"boroCD":boroCD,"crimesCount":crimesCount};

      crimes.push(crime);

      }

      else if (geometry.getType() == "MultiPolygon") {
          let crimesCount=0;
          for (var i=0; i<geometry.getLength(); i++){
            var poly = new google.maps.Polygon({paths: geometry.getAt(i).getAt(0).getArray()});
            for (var i=0; i<heatMapData.length; i++) {
            if (google.maps.geometry.poly.containsLocation(heatMapData[i], poly)) {
                      crimesCount++;

            }
            }
          }
          let crime = {"boroCD":boroCD,"crimesCount":crimesCount};
          crimes.push(crime);
         }
    });

   }


     crimesCount = crimes;
     countsCrimeTable(crimesCount);
  }



function countsCrimeTable(crimesC) {

  function compare(a,b) {
    if (a.crimesCount < b.crimesCount)
      return -1;
    if (a.crimesCount > b.crimesCount)
      return 1;
    return 0;
  }

 crimesC.sort(compare);


      var tr;


      //clean table
           while($("#crimesTable tr").length>1)
           {
               $("#crimesTable tr:last").remove();
           }

      for (var i = 0; i < crimesC.length; i++) {
          tr = $('<tr/>');
          tr.append("<td>" + crimesC[i].boroCD + "</td>");
          tr.append("<td>" + crimesC[i].crimesCount + "</td>");
          $('#crimesTable').append(tr);
      }



}

function calculateDistance(coordA,coordB) {

var coordStart = coordA;

var latStart = coordStart.y;
var lonStart =coordStart.x;



var coordEnd = coordB;


var latEnd =  coordEnd.lat;
var lonEnd =coordEnd.lng;


var dlong = (lonEnd - lonStart) * radians;
var dlat = (latEnd - latStart) * radians;

var a = Math.pow(Math.sin(dlat / 2.0), 2.0) + Math.cos(latStart * radians) * Math.cos(latEnd * radians) * Math.pow(Math.sin(dlong / 2.0), 2.0);
    var c = 2.0 * Math.atan2(Math.sqrt(a), Math.sqrt(1.0 - a));
    var d = eQuatorialEarthRadius * c;

    return d;


}



function addMarkersCrime(url) {

  $.getJSON(url, function(data, textstatus) {
    $.each(data, function(i, entry) {
      if (entry.hasOwnProperty('lat_lon')) {
        heatMapData.push(
                  new google.maps.LatLng(
                    parseFloat(entry.lat_lon.coordinates["1"]),
                    parseFloat(entry.lat_lon.coordinates["0"])
                  )
                );
      } else {


        i = i + 1;

      }

    });

    var heatmap = new google.maps.visualization.HeatmapLayer({
         data: heatMapData,
         map: map
       });

 heatMap.push(heatmap);


  });

}


function addMarkersHousing(url){

     $.getJSON(url, function(data, textstatus) {

    $.each(data.data, function(i, entry){

let extIncome= parseInt(entry[31]);

if (extIncome>0) {
  var marker = new google.maps.Marker({
    position: new google.maps.LatLng(entry[23], entry[24]),
    map: map,
    //  icon: { url: icons.house }
  });
  markers.push(marker);

}









        //    var markerCluster = new MarkerClusterer(map, markers,
         //{imagePath: 'https://cdn.rawgit.com/googlemaps/js-marker-clusterer/gh-pages/images/m',});
    });

     });


}

function addCentroidsNeig(url) {

$.getJSON(url,function (data,textstatus) {
  console.log(data);


       $.each(data.data, function(i, entry){



          var myString = entry[9];
          var splits = myString.split(['(']);


           var myString1 = splits[1];
          var splits1 = myString1.split([' ']);


           var myString2 = splits1[1];
          var splits2 = myString2.split([')']);



          console.log(splits2);






         var marker = new google.maps.Marker({
           position: new google.maps.LatLng(splits2[0],splits1[0]),
            map: map,
          });

             markers.push(marker);



       })

})

}


function addMarkersMuseums(url){

    $.getJSON(url, function(data, textstatus) {
    console.log(data.data);

     $.each(data.data, function(i, entry){



        var myString = entry[8];
        var splits = myString.split(['(']);


         var myString1 = splits[1];
        var splits1 = myString1.split([' ']);


         var myString2 = splits1[1];
        var splits2 = myString2.split([')']);



        console.log(splits2);






       var marker = new google.maps.Marker({
         position: new google.maps.LatLng(splits2[0],splits1[0]),
          map: map,
        });

           markers.push(marker);



     })




    })

}


function addMarkersArtGal(url){

     $.getJSON(url, function(data, textstatus) {
    console.log(data.data);


          $.each(data.data, function(i, entry){



        var myString = entry[9];
        var splits = myString.split(['(']);


         var myString1 = splits[1];
        var splits1 = myString1.split([' ']);


         var myString2 = splits1[1];
        var splits2 = myString2.split([')']);



        console.log(splits2);






       var marker = new google.maps.Marker({
         position: new google.maps.LatLng(splits2[0],splits1[0]),
          map: map,
            icon: { url: icons.artgallery}
        });

           markers.push(marker);



     })






     })

}



function addMarkersFarmMark(url){
    $.getJSON(url, function(data, textstatus) {
    console.log(data);



          $.each(data.data, function(i, entry){


              var geocoder = new google.maps.Geocoder();
                      //  geocodeAddress(geocoder, map);



        var address =entry[8];
        geocoder.geocode({'address': address}, function(results, status) {
          if (status === google.maps.GeocoderStatus.OK) {
            //resultsMap.setCenter(results[0].geometry.location);
            var marker = new google.maps.Marker({

              position: results[0].geometry.location,
              map: map,
                icon: { url: icons.markets}
            });
             markers.push(marker);
          }
        });



          })





    })
}



































function setMapOnAll(map) {
  // markers.push(marker);
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

function removeHeatMap() {
  for (var heatMapC of heatMap) {
    heatMapC.setMap(null);
  }
 heatMap = [];

}




//Load Neighborhood datasets
function crimesSwitch() {
  // Get the checkbox
  var checkbox = document.getElementById("crimesPoint");

  if (checkbox.checked == true) {
  //  heatMap.push(heatmap);
   addMarkersCrime(CRIMES_URL);


  } else {
    removeHeatMap(null);
//  removeHeatMap();
  }
}







function housesSwitch(){
  // Get the checkbox
  var checkbox = document.getElementById("housesPoint");

  if (checkbox.checked == true) {

      addMarkersHousing(HOUSING_URL);


  } else {
    setMapOnAll(null);
  }
}




function museumSwitch(){
  // Get the checkbox
  var checkbox = document.getElementById("museumsPoint");

  if (checkbox.checked == true) {
      addMarkersMuseums(MUSUEUMS_URL);


  } else {
    setMapOnAll(null);
  }
}






function ArtgalSwitch(){
  // Get the checkbox
  var checkbox = document.getElementById("ArtgalPoint");

  if (checkbox.checked == true) {
      addMarkersArtGal(ARTGALL_URL);


  } else {
    setMapOnAll(null);
  }
}





function FarmMarkSwitch(){
  // Get the checkbox
  var checkbox = document.getElementById("FarmMarkPoint");

  if (checkbox.checked == true) {

    addMarkersFarmMark(FARMMAR_URL);


  } else {
    setMapOnAll(null);
  }
}



function centroidDSwitch() {
  // Get the checkbox
  var checkbox = document.getElementById("centroidDPoint");

  if (checkbox.checked == true) {
  centroidDistrict(GEOSHAPEDISTRICT);


  } else {
    setMapOnAll(null);
  }
}







function centroidNSwitch() {
  // Get the checkbox
  var checkbox = document.getElementById("centroidNPoint");

  if (checkbox.checked == true) {
     addCentroidsNeig(NEIGHBORHOOD_NAMES_URL);


  } else {
    setMapOnAll(null);
  }
}






//Load datasets

var infoRows = [];

function getDataNames() {
  var data = $.ajax({
    url: NEIGHBORHOOD_NAMES_URL,
    type: "GET",
  }).done(function(data) {
    alert("Retrieved " + data.length + " records from the dataset!");
    console.log(data);
  });

}




//Load crime datasets
function getDataCrimes() {

// Activate crime data
if(!$('#crimesPoint').is(':checked')){

      alert("Please turn on the crime from the custom control panel");
  }
else {
    countCrimesData();
    }



}






//Load housing buildng datasets
function getdataHousing() {

if(districtsIncome.length==0){
  $.getJSON(HOUSING_URL,function (dataLayer, textstatus) {

      //let district ={};
      let mapDistricts =  new Map();

      for (let income of dataLayer.data) {

              let BoroCD=income[19];
              let extremeLowI = parseInt(income[31]);

             if (mapDistricts.has(BoroCD))
             {
                  mapDistricts.set(BoroCD, mapDistricts.get(BoroCD) + extremeLowI);

             }
            else {
                  mapDistricts.set(BoroCD, extremeLowI);
            }



     }




     for (var [key, value] of mapDistricts) {
       let districtIncome =  {"BoroCD":formatterBoroCD(key),"extremeLowI":value};
       districtsIncome.push(districtIncome);
     }

     function compare(a,b) {
       if ( a.extremeLowI < b.extremeLowI)
         return 1;
       if (a.extremeLowI > b.extremeLowI)
         return -1;
       return 0;
     }

    districtsIncome.sort(compare);

  })
}

  var tr;

  //clean table
       while($("#homeAffordabilityTable tr").length>1)
       {
           $("#homeAffordabilityTable tr:last").remove();
       }


  for (var i = 0; i < districtsIncome.length; i++) {
      tr = $('<tr/>');
      tr.append("<td>" + districtsIncome[i].BoroCD + "</td>");
      tr.append("<td>" + districtsIncome[i].extremeLowI + "</td>");
      $('#homeAffordabilityTable').append(tr);
  }

}



function formatterBoroCD(borocd){

    let community = borocd.substring(0,2) ;
    let number = parseInt(borocd.substring(3,5)) ;
    let communityNumber;

    switch(community) {
   case "MN":
     communityNumber = 100;
     break;
   case "BX":
     communityNumber = 200;
     break;
   case "BK":
     communityNumber = 300;
     break;
    case "QN":
       communityNumber = 400;
       break;
    case "SI":
      communityNumber = 500;
       break;
  }

   return communityNumber+number;

}


//  Consolidating data
function loadConsolidate(){

     let districtsConsolidate =[];




       for (var i = 0; i < distances.length; i++){
        let extremeLowI=0;
        let BoroCD = distances[i].boroCDist;
        let distance = distances[i].dist;
        let crimeCount  = crimesCount.filter(item => item.boroCD == BoroCD )[0].crimesCount;
        let districtIncome = districtsIncome.filter(item => item.BoroCD == BoroCD );//[0].extremeLowI;
        if (districtIncome.length>0)
         {
                extremeLowI =  districtIncome[0].extremeLowI;
         }


        let districtConsolidate ={"BoroCD":BoroCD,"crimeCount":crimeCount,"distance":distance,"extremeLowI":extremeLowI}  ;
        districtsConsolidate.push(districtConsolidate);

      }




//clean table
     while($("#consolidateTable tr").length>1)
     {
         $("#consolidateTable tr:last").remove();
     }

for (var i = 0; i < districtsConsolidate.length; i++) {
    tr = $('<tr/>');
    tr.append("<td>" + districtsConsolidate[i].BoroCD + "</td>");
    tr.append("<td>" + districtsConsolidate[i].extremeLowI + "</td>");
    tr.append("<td>" + districtsConsolidate[i].distance + "</td>");
    tr.append("<td>" + districtsConsolidate[i].crimeCount + "</td>");
    $('#consolidateTable').append(tr);
}




}











var createGradient=function(svg,id,color1,color2){

    var defs = svg.append("svg:defs")

    var red_gradient = defs.append("svg:linearGradient")
            .attr("id", id)
            .attr("x1", "0%")
            .attr("y1", "0%")
            .attr("x2", "50%")
            .attr("y2", "100%")
            .attr("spreadMethod", "pad");

    red_gradient.append("svg:stop")
            .attr("offset", "50%")
            .attr("stop-color", color1)
            .attr("stop-opacity", 1);

    red_gradient.append("svg:stop")
            .attr("offset", "100%")
            .attr("stop-color", color2)
            .attr("stop-opacity", 1);
};

function createChart(id,percent){


  var ratio=percent/100;

  var pie=d3.layout.pie()
          .value(function(d){return d})
          .sort(null);

  var w=300,h=300;

  var outerRadius=(w/2)-10;
  var innerRadius=110;

  var color = ['#f2503f','#ea0859','#404F70'];

  var svg=d3.select(id)
          .append("svg")
          .attr({
              width:w,
              height:h,
              class:'shadow'
          }).append('g')
          .attr({
              transform:'translate('+w/2+','+h/2+')'
          });

  createGradient(svg,'gradient',color[0],color[1]);

  var arc=d3.svg.arc()
          .innerRadius(innerRadius)
          .outerRadius(outerRadius)
          .startAngle(0)
          .endAngle(2*Math.PI);

  var arcLine=d3.svg.arc()
          .innerRadius(innerRadius)
          .outerRadius(outerRadius)
          .startAngle(0);


  var pathBackground=svg.append('path')

          .attr({
              d:arc
          })
          .style({
              fill:color[2]
          });


  var pathChart=svg.append('path')
          .datum({endAngle:0})
          .attr({
              d:arcLine
          })
          .style({
              fill:'url(#gradient)'
          });

  var middleCount=svg.append('text')
          .text(function(d){
              return d;
          })

          .attr({
              class:'middleText',
              'text-anchor':'middle',
              dy:30,
              dx:-15
          })
          .style({
              fill:color[1],
              'font-size':'90px'

          });
      svg.append('text')
          .text('%')
          .attr({
              class:'percent',
              'text-anchor':'middle',
              dx:50,
              dy:-5

          })
          .style({
              fill:color[1],
              'font-size':'40px'

          });

  var arcTween=function(transition, newAngle) {
      transition.attrTween("d", function (d) {
          var interpolate = d3.interpolate(d.endAngle, newAngle);
          var interpolateCount = d3.interpolate(0, percent);
          return function (t) {
              d.endAngle = interpolate(t);
              middleCount.text(Math.floor(interpolateCount(t)));
              return arcLine(d);
          };
      });
  };


  var animate=function(){
      pathChart.transition()
              .duration(750)
              .ease('cubic')
              .call(arcTween,((2*Math.PI))*ratio);


  };




  setTimeout(animate,0);
}

createChart('#chart',55);
createChart('#chart1',85);
createChart('#chart2',85);







function toCSV(){
    alert("Please load all the data and generate consolidate table ");
    var table = $('#consolidateTable').clone();
    table.find('[style*="display: none"]').remove();
    table.tableToCSV();
}







//Bottons

$("document").ready(function() {
  $("#crimesNY").on("click", getDataCrimes)
  $("#housingBuildng").on("click", getdataHousing)
  $("#consolidateBtn").on("click", loadConsolidate)
    $('#cvsbtn').on("click", toCSV);


});
