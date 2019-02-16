var coords = [];
var LatLng = {lat: 32.75, lng: -97.13};
var magnify = 16;
var mapper;
var array = [];

function initialize ()
 {
  mapper = new google.maps.Map(document.getElementById('map'), {zoom: magnify, center: LatLng});
  

 }
function sendRequest () {

 clearMarkers();
 var bounds = mapper.getBounds();
 var sw = bounds.getSouthWest().lat();
 var ne = bounds.getNorthEast().lng();
 var query = encodeURI(document.getElementById("search").value).trim();
 var newSearch = query.split(' ').join('+');
 var xhr = new XMLHttpRequest();
 xhr.open("GET", "proxy.php?term="+newSearch+"&latitude="+sw+"&longitude="+ne+"&radius=3000&limit=10");
 xhr.setRequestHeader("Accept","application/json");
 xhr.onreadystatechange = function () {
       if (this.readyState == 4) {
          var json = JSON.parse(this.responseText);
          var str = JSON.stringify(json,undefined,2);
          var obj = eval("("+str+")");
          var temp;
          displayresult(json);
          for (i=0;i<json.businesses.length;i++)
          {
            console.log(json.businesses[i]["coordinates"]);
            lat1 = json.businesses[i]["coordinates"]["latitude"];
            long = json.businesses[i]["coordinates"]["longitude"];
            name = i;
            setMarkers(lat1,long,name);
          }
       }
   };
   xhr.send(null);
}

function setMarkers(lat1,long,name)
{
var coordinates = {lat:lat1,lng:long};
var marker = new google.maps.Marker({position:coordinates, map: mapper, label: name});
array.push(marker);
}

function setMapOnAll(map) {
        for (var i = 0; i < array.length; i++) {
          array[i].setMap(map);
        }
      }

 function clearMarkers() {
	  document.getElementById("pmd").innerHTML = null;
        setMapOnAll(null);
        array = [];
      }

function displayresult(json)
{
 
 for (i = 0; i< json.businesses.length; i++)
 {

  var name = '<a href="' + json.businesses[i].url
          + '" style="text-decoration:none;">'
          + json.businesses[i].name + '</a>';
  var image = '<img alt="No Image" style="width:30%; height:30%;" src="'
          + json.businesses[i].image_url + '">';
  var rating = json.businesses[i]["rating"];
  document.getElementById("pmd").innerHTML += "<pre>"+name+"<br>"+image+"<br> Rating = "+rating+"</pre>";
 }
}