let leafletMap;
var markersActiveList = [];
var maximized_clicked = true;
var activePointsHash = {};

var clicked;

var clickStyle = {
    radius: 6,
    fillColor: "#ff0000",
    color: "#ff0000",
    opacity: 1,
    weight: 2,
    fillOpacity: 1,
}
var unclickStyle = {
    radius: 6,
    fillColor: "#09f9df",
    color: "#ff0000",
    weight: 1,
    opacity: 1,
    fillOpacity: 1,
}

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

    leafletMap.on('zoomend', function() {
        getInBoundingBox();
    });
}

async function getPointsWithinBoundingBox(st_point1, st_point2) {

    let points = await $.ajax({
        url: `/api/points/bb?p1=${st_point1}&p2=${st_point2}`,
        type: "GET",
        dataType: "json"
    });
    list = points.result;

    // Loop for deleting all markers befor pulling new ones
    for (marker in markersActiveList) {
        leafletMap.removeLayer(markersActiveList[marker])
    }
    markersActiveList = [];

    for (point in list) {
        var element = list[point];
        var lat = element.st_y;
        var lng = element.st_x;
        var id = element.id;
        var marker = L.circle([lat, lng], { markerId: id, radius: 1.5, unclickStyle });
        marker.bindPopup("Id: " + id);
        marker.on("click", onMarkerClick);
        marker.addTo(leafletMap);
        markersActiveList.push(marker);

    }
}


var onMarkerClick = async function(e) {
    // if (clicked) {
    //     clicked.setStyle(unclickStyle);
    // }
    // e.target.setStyle(clickStyle);
    // clicked = e.target;
    leftBar = document.getElementById("left-bar").innerHTML = "";
    marker = this.options;
    markerId = this.options.markerId;

    pointObject = await getPointById(markerId);
    getNearbyPoints(markerId);

    if (maximized_clicked) {
        maximize_map();
    }
};

window.onload = async function() {
    await map();
    await getInBoundingBox();
    //await getPointsWithinBoundingBox(bounfingBox.p1, bounfingBox.p2);
};

async function getInBoundingBox() {
    let b = leafletMap.getBounds(); // An instance of L.LatLngBounds
    let sw = b.getSouthWest(); // An instance of L.LatLng
    let ne = b.getNorthEast(); // An instance of L.LatLng
    let st_point1 = `${sw.lng}, ${sw.lat}`
    let st_point2 = `${ne.lng}, ${ne.lat}`
    await getPointsWithinBoundingBox(st_point1, st_point2); //Recives 2 strings
}

async function getNearbyPoints(pointId) {
    element = await getPointById(pointId)
    console.log(element);
    var lng = element.st_y;
    var lat = element.st_x;


    let nearbyPoints = await $.ajax({
        url: `/api/points/nearby?lat=${lat}&lng=${lng}`,
        type: "GET",
        dataType: "json"
    });

    for (point in nearbyPoints.result) {
        let markerId = nearbyPoints.result[point].id

        pointObject = await getPointById(markerId);
        showPointInfo(pointObject)
        activePointsHash[markerId] = pointObject;
        //activePointsHash.push(pointObject);
    }
}

async function getPointById(id) {
    let point = await $.ajax({
        url: `/api/points?id=${id}`,
        type: "GET",
        dataType: "json"
    });
    let element = point.result[0];
    return element;
}

function maximize_map() {
    if (maximized_clicked) {
        document.getElementById("main").style.gridTemplateColumns = "200px 1fr";
        maximized_clicked = false;
    } else {
        document.getElementById("main").style.gridTemplateColumns = "0px 1fr";
        maximized_clicked = true;
        leftBar = document.getElementById("left-bar").innerHTML = "";
    }
}

function popUpInfo(id) {
    console.log(id)
    modal = document.getElementById("openModal");
    let pointObject = activePointsHash[id]
    html = `<div id="popUpInfoDiv">
                <a href="#close" title="Close" class="close">X</a>
                <h2>${pointObject.bssid}</h2>
                <h3>Located at: ${pointObject.st_x}, ${pointObject.st_y}</h3>
                <form id="changePointForm">
                   Change BSSID: <input type="text" id="changePointInfoName" value="Mickey">
                   Change Security: <input type="text" id="changePointInfoSecurity" value="Mickey">
                   Change Strenght: <input type="text" id="changePointInfoStrenght" value="Mickey">
                   Lat: <input type="text" id="changePointInfoLat">
                   Lng: <input type="text" id="changePointInfoLng">
                   <button onclick="changePointInfo(${pointObject.id})">Change Point Info</button>
                </form>
            </div`
        //change point info esta a dar stress 
    modal.innerHTML = html;

    // Tenho um array activePoints, que contem todos os pontos que estão no leftbar
    // Quando clico num ponto, quero enviar para o popup a informação sobre esse ponto
    // Para isso, tenho que ir buscar a informação do ponto no servidor com o
    // id do objeto que esta no array activePoints
    // E depois, mostrar a informação no popup para editar
}

async function changePointInfo(pointObjectId) {
    let sendObject = {
        pointObject: activePointsHash[pointObjectId],
        name: document.getElementById("changePointInfoName").value,
        security: document.getElementById("changePointInfoSecurity").value,
        strength: document.getElementById("changePointInfoStrenght").value,
        lat: document.getElementById("changePointInfoLat").value,
        lng: document.getElementById("changePointInfoLng").value
    }
    let changeInfo = await $.ajax({
        url: '/api/points/update',
        method: 'post',
        dataType: 'json',
        data: JSON.stringify(sendObject),
        contentType: 'application/json'
    });
}