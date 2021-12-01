//const { getPointsInBoundingBox } = require("../models/mapPointsModel");

let leafletMap;
var final_list = [];
var markersActiveList = [];
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
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: "mapbox/streets-v11",
        tileSize: 512,
        zoomOffset: -1,
        accessToken: "pk.eyJ1IjoiamNhbGFwZXoiLCJhIjoiY2t1aDN1cWo0MmFjazMxbW9hZG82bjEzNyJ9.9TgRcGWgbTSpCCD-dI4ooA",
    };

    L.tileLayer(tileUrl, attribuition).addTo(leafletMap);

    L.control
        .zoom({
            position: "bottomright",
        })
        .addTo(leafletMap);

    leafletMap.on('dragend', function onDragEnd() {
        getInBoundingBox();
    });
}


async function getPointsWithinBoundingBox(st_point1, st_point2) {

    let points = await $.ajax({
        url: `/api/points/bb/?p1=${st_point1}&p2=${st_point2}`,
        type: "GET",
    });
    list = points.result;

    // Loop for deleting all markers befor pulling new ones
    for (marker in markersActiveList) {
        leafletMap.removeLayer(markersActiveList[marker])
    }


    for (point in list) {
        var element = list[point];
        var lat = element.st_x;
        var lng = element.st_y;
        var id = element.id;
        var marker = L.circle([lat, lng], { markerId: id, radius: 0.5, color: '#FF0000' });
        marker.bindPopup("Id: " + id);
        marker.on("click", onMarkerClick);
        marker.addTo(leafletMap);
        markersActiveList.push(marker);
    }
}

var onMarkerClick = function(e) {
    marker = this.options;
    markerId = this.options.markerId;
    alert("You clicked on marker with customId: " + markerId);
};
//Ver bounding box e restrições com zoom level

window.onload = async function() {
    await map();
    await getInBoundingBox();
    //await getPointsWithinBoundingBox(bounfingBox.p1, bounfingBox.p2);
};


async function getInBoundingBox() {
    var b = leafletMap.getBounds(); // An instance of L.LatLngBounds
    var sw = b.getSouthWest(); // An instance of L.LatLng
    var ne = b.getNorthEast(); // An instance of L.LatLng
    st_point1 = `${sw.lat}, ${sw.lng}`
    st_point2 = `${ne.lat}, ${ne.lng}`
    await getPointsWithinBoundingBox(st_point1, st_point2);
}

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