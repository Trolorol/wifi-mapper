let leafletMap;
var final_list = [];
var markers = {};
var maximized_clicked = true;
var points;

async function map() {
  leafletMap = L.map("mapid", {
    zoomControl: false,
  }).setView([38.70704651513132, -9.15248591105515], 18);

  const mapbox_token =
    "pk.eyJ1IjoiamNhbGFwZXoiLCJhIjoiY2t1aDNybW95MTRjYTMxcnQwdHRiYXllcSJ9.IF2ueM1S7ZAIQuYeKJxFhQ";
  const mapbox_url =
    "https://api.mapbox.com/styles/v1/jcalapez/ckv788zd94y7214nx99evpjhc/tiles/256/{z}/{x}/{y}@2x?access_token=";
  const tileUrl = mapbox_url + mapbox_token;
  const attribuition = {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: "mapbox/streets-v11",
    tileSize: 512,
    zoomOffset: -1,
    accessToken:
      "pk.eyJ1IjoiamNhbGFwZXoiLCJhIjoiY2t1aDN1cWo0MmFjazMxbW9hZG82bjEzNyJ9.9TgRcGWgbTSpCCD-dI4ooA",
  };

  L.tileLayer(tileUrl, attribuition).addTo(leafletMap);

  L.control
    .zoom({
      position: "bottomright",
    })
    .addTo(leafletMap);

    leafletMap.on('dragend', function onDragEnd(){
        var width = leafletMap.getBounds().getEast() - leafletMap.getBounds().getWest();
        var height = leafletMap.getBounds().getNorth() - leafletMap.getBounds().getSouth();

        alert (
            'center:' + leafletMap.getCenter() +'\n'+
            'width:' + width +'\n'+
            'height:' + height +'\n'+
            'size in pixels:' + leafletMap.getSize()
        )});
}

async function getAllPoints() {
  points = await $.ajax({
    url: "/api/points",
    type: "GET",
  });

  list = points.result;

  for (point in list) {
    var element = list[point];
    var lat = element.location.x;
    var lng = element.location.y;
    var id = element.id;

    var marker = L.marker([lat, lng], { markerId: id });
    marker.bindPopup("Id: " + id);
    marker.on("click", onMarkerClick);
    marker.addTo(leafletMap);
  }
}

var onMarkerClick = function (e) {
  marker = this.options;
  markerId = this.options.markerId;
  alert("You clicked on marker with customId: " + markerId);
};
//Ver bounding box e restrições com zoom level

window.onload = async function () {
  await map();
  await getAllPoints();
};

// TODO alterar innerHTML do botão maximizar minimazar
function maximize_map() {
  if (maximized_clicked) {
    document.getElementById("main").style.gridTemplateColumns = "100px 1fr";
    maximized_clicked = false;
    document
      .getElementById("nav-right-col")
      .getElementsByTagName("a").innerHTML = "Maximize";
  } else {
    document.getElementById("main").style.gridTemplateColumns = "0px 1fr";
    maximized_clicked = true;
    document
      .getElementById("nav-right-col")
      .getElementsByTagName("a").innerHTML = "Minimize";
  }
}


