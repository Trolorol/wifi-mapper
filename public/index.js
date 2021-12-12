let leafletMap;
var markersActiveList = {};
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

window.onload = async function() {
    await map();
    await getInBoundingBox();
    await getTotalPoints();
};

async function map() {
    leafletMap = L.map("mapid", {
        zoomControl: false,
    }).setView([38.70704651513132, -9.15248591105515], 14);

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

    leafletMap.on('moveend', function() {
        getInBoundingBox();
        getTotalPoints();
    });


    leafletMap.on('click', function() {
        if (!maximized_clicked) {
            maximize_map();
        }
    });

    leafletMap.on('contextmenu', function(e) {
        var coord = e.latlng;
        var lat = coord.lat;
        var lng = coord.lng;
        var marker = L.marker([lat, lng])
        marker.bindPopup(`
        <a href="#openModal" class='modalAnchor'>
        <button type="button" onclick="createPoint(${lat}, ${lng})">Click for Add</button>
        </a>`)
        marker.addTo(leafletMap);
        marker.openPopup();
        markersActiveList[coord] = marker;
    });
}
// '<button type="button">Click for more</button>'


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
    markersActiveList = {};

    for (point in list) {
        var element = list[point];
        var lat = element.st_y;
        var lng = element.st_x;
        var id = element.id;
        var marker = L.circle([lat, lng], { markerId: id, radius: 1.5, unclickStyle });
        marker.bindPopup("BSSID: " + element.bssid);
        marker.on("click", onMarkerClick);
        marker.addTo(leafletMap);
        markersActiveList[id] = marker;

    }
}

var onMarkerClick = async function(e) {
    leftBar = document.getElementById("left-bar").innerHTML = "";
    //marker = this.options;//Is this needed?
    markerId = this.options.markerId;
    //pointObject = await getPointById(markerId); //Is this needed?
    getNearbyPoints(markerId);
    if (maximized_clicked) {
        maximize_map();
    }
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
    var lng = element.st_y;
    var lat = element.st_x;

    let nearbyPoints = await $.ajax({
        url: `/api/points/nearby?lat=${lat}&lng=${lng}`,
        type: "GET",
        dataType: "json"
    });

    //send nearby points change this to a function TODO
    for (point in nearbyPoints.result) {
        let markerId = nearbyPoints.result[point].id

        pointObject = await getPointById(markerId);
        showPointInfo(pointObject)
        activePointsHash[markerId] = pointObject;
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
    modal = document.getElementById("openModal");
    let pointObject = activePointsHash[id]
    html = `<div id="popUpInfoDiv">
                <a href="#close" title="Close" class="close">X</a>
                <h2>${pointObject.bssid}</h2>
                <h3>Located at: ${pointObject.st_x}, ${pointObject.st_y}</h3>
                <form id="changePointForm">
                <label for="changePointInfoName">Change BSSID:</label>
                    <input type="text" id="changePointInfoName" value=${pointObject.bssid}>
                    <label for="changePointInfoEncryption">Change Security:</label>
                    <input type="text" id="changePointInfoEncryption" value=${pointObject.encryption}>
                    <label for="changePointInfoStrenght">Change Strenght:</label>
                    <input type="text" id="changePointInfoStrenght" value=${pointObject.strength}>
                    <label for="changePointInfoLat">Lat: </label>
                   <input type="text" id="changePointInfoLat" value=${pointObject.st_y}>
                   <label for="changePointInfoLng">Lng: </label>
                   <input type="text" id="changePointInfoLng" value=${pointObject.st_x}>
                   <button id="editButton" onclick="changePointInfo(${pointObject.id})">Change Point Info</button>
                   <button id="deleteButton" onclick="deletePoint(${pointObject.id})">Delete Point Info</button>
                </form>
            </div`
    modal.innerHTML = html;
}

async function changePointInfo(pointObjectId) {
    let sendObject = {
        pointObject: activePointsHash[pointObjectId],
        name: document.getElementById("changePointInfoName").value,
        encryption: document.getElementById("changePointInfoEncryption").value,
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

async function filterBssid() {
    try {
        let bssidText = document.getElementById("bssidSearch").value;
        points = await $.ajax({
            url: `/api/points/filter?name=${bssidText}`,
            method: 'get',
            dataType: 'json'
        });
        if (points.result.length > 0) {
            if (maximized_clicked) {
                maximize_map();
            }
            leftBar = document.getElementById("left-bar").innerHTML = "";
            for (point in points.result) {
                let pointObject = points.result[point];
                showPointInfo(pointObject)
                activePointsHash[pointObject.id] = pointObject;
            }
        }
    } catch (error) {
        console.log(error);
    }


}

function goToPoint(lat, long) {
    // Not working properly yet
    leafletMap.panTo(new L.LatLng(lat, long));
    leafletMap.setZoom(18);

    // This doesn't work TODO
    //dMarker = markersActiveList[pointObjectId]
    //markersActiveList[pointObjectId].openPopup(); 
}

async function deletePoint(pointObjectId) {
    let deletePoint = await $.ajax({
        url: `/api/points/delete?id=${pointObjectId}`,
        method: 'DELETE',
        dataType: 'json',
        success: function(result) {
            getInBoundingBox()
        }
    });
}

function createPoint(lat, long) {
    popUpInfoCreate(lat, long)
}

function insertPoint() {
    let sendObject = {
        name: document.getElementById("createPointInfoName").value,
        encryption: document.getElementById("createPointInfoEncryption").value,
        strength: document.getElementById("createPointInfoStrenght").value,
        lat: document.getElementById("createPointInfoLat").value,
        lng: document.getElementById("createPointInfoLng").value,
    }
    $.ajax({
        url: '/api/points/insert',
        method: 'post',
        dataType: 'json',
        data: JSON.stringify(sendObject),
        contentType: 'application/json'
    });

}

function popUpInfoCreate(lat, long) {
    modal = document.getElementById("openModal");
    html = `<div id="popUpInfoDiv">
                <a href="#close" title="Close" class="close">X</a>
                <h2>New Wifi Point</h2>
                <h3>Located at: ${lat}, ${long}</h3>
                <form id="changePointForm">
                <label for="createPointInfoName">Insert BSSID:</label>
                    <input type="text" id="createPointInfoName">
                    <label for="createPointInfoEncryption">Insert Security:</label>
                    <input type="text" id="createPointInfoEncryption">
                    <label for="createPointInfoStrenght">Insert Strenght:</label>
                    <input type="text" id="createPointInfoStrenght">
                    <label for="createPointInfoLat">Lat: </label>
                   <input type="text" id="createPointInfoLat" value=${lat}>
                   <label for="createPointInfoLng">Lng: </label>
                   <input type="text" id="createPointInfoLng" value=${long}>
                   <button id="createButton" onclick="insertPoint()">Create Wifi Point</button>
                </form>
            </div`
    modal.innerHTML = html;
}

async function getTotalPoints() {
    $.ajax({
        url: '/api/points/total',
        method: 'get',
        dataType: 'json',
        success: function(result) {
            document.getElementById("totalPoints").innerHTML = `Total Points: ${result.result.count}`;
        }
    });
    document.getElementById("screenPoints").innerHTML = `Points In Screen: ${Object.keys(markersActiveList).length}`;


}