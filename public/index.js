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
        var width = leafletMap.getBounds().getEast() - leafletMap.getBounds().getWest();
        var height = leafletMap.getBounds().getNorth() - leafletMap.getBounds().getSouth();

        bounds = leafletMap.getBounds();
        var boundingBox = bounds.toBBoxString();
        console.log(
            'bounds' + boundingBox + '\n' +
            'center:' + leafletMap.getCenter() + '\n' +
            'width:' + width + '\n' +
            'height:' + height + '\n' +
            'size in pixels:' + leafletMap.getSize()
        )

        var b = leafletMap.getBounds(); // An instance of L.LatLngBounds
        var nw = b.getNorthWest(); // An instance of L.LatLng
        var sw = b.getSouthWest(); // An instance of L.LatLng
        var ne = b.getNorthEast(); // An instance of L.LatLng
        var se = b.getSouthEast(); // An instance of L.LatLng
        boundingBox = `${nw.lng} ${nw.lat}, ${sw.lng} ${sw.lat}, ${ne.lng} ${ne.lat}, ${se.lng} ${se.lat}, ${nw.lng} ${nw.lat}`
        console.log(`POLYGON((${boundingBox}))`);



        // var s = 'POLYGON((';
        // // Build up a POLYGON WKT string
        // [b.getNorthWest(), b.getNorthEast(), b.getSouthEast(), b.getSouthWest(), b.getNorthWest()].map(function(ll) { s += ll.lng + ' ' + ll.lat + ','; });
        // // Strip last comma and space
        // s = s.substring(0, s.length - 2)
        //     // Don't forget the final '))'
        // s += '))';
        // console.log(b.getNorthWest().lat);
    });
}

async function getAllPoints() {
    points = await $.ajax({
        url: "/api/points",
        type: "GET",
    });

    list = points.result;


    for (point in list) {
        var element = list[point];
        var lat = element.st_x;
        var lng = element.st_y;
        var id = element.id;

        var marker = L.marker([lat, lng], { markerId: id });
        marker.bindPopup("Id: " + id);
        marker.on("click", onMarkerClick);
        marker.addTo(leafletMap);
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