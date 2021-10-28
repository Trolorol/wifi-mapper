var map;
var final_list = [];
var maximized_clicked = true
window.onload = async function() {
    let map = L.map("mapid", {
        zoomControl: false
    }).setView([38.70704651513132, -9.15248591105515], 18);

    const mapbox_token = "pk.eyJ1IjoiamNhbGFwZXoiLCJhIjoiY2t1aDNybW95MTRjYTMxcnQwdHRiYXllcSJ9.IF2ueM1S7ZAIQuYeKJxFhQ"
    const mapbox_url = "https://api.mapbox.com/styles/v1/jcalapez/ckv788zd94y7214nx99evpjhc/tiles/256/{z}/{x}/{y}@2x?access_token="
    const tileUrl = mapbox_url + mapbox_token
    const attribuition = {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: "mapbox/streets-v11",
        tileSize: 512,
        zoomOffset: -1,
        accessToken: "pk.eyJ1IjoiamNhbGFwZXoiLCJhIjoiY2t1aDN1cWo0MmFjazMxbW9hZG82bjEzNyJ9.9TgRcGWgbTSpCCD-dI4ooA",
    }

    L.tileLayer(tileUrl, attribuition).addTo(map);

    L.control.zoom({
        position: 'bottomright'
    }).addTo(map);

    // let points = await $.ajax({
    //   url: "/api/students",
    //   method: "get",
    //   dataType: "json"
    // });

    // for (let point in poins) {
    //   var marker = L.marker(point.lat, point.long);
    //   //lista por criar.push({student: student, marker:marker});
    //   //student.marker = marker;
    // }
    data = [{
        "name": "point1",
        "lat": 38.70704651513132,
        "long": -9.15248591105515
    }, {
        "name": "point2",
        "lat": 38.70804651513132,
        "long": -9.15248591105515
    }, {
        "name": "point3",
        "lat": 38.70904651513132,
        "long": -9.15248591105515
    }]



    //data.forEach(item => L.marker([item.lat, item.long]).addTo(map));

    for (let item of data) {
        coordinates = L.circle([item.lat, item.long]).addTo(map);
        final_list.push({ marker: coordinates });
    }






};


// TODO alterar innerHTML do botão maximizar minimazar
function maximize_map() {

    if (maximized_clicked) {
        document.getElementById("main").style.gridTemplateColumns = "100px 1fr";
        maximized_clicked = false;
        document.getElementById("nav-right-col").getElementsByTagName("a").innerHTML = "Maximize"
    } else {
        document.getElementById("main").style.gridTemplateColumns = "0px 1fr";
        maximized_clicked = true;
        document.getElementById("nav-right-col").getElementsByTagName("a").innerHTML = "Minimize"
    }


}




// $('.maximize_button').click(function() {
//     $('main').css('grid-template-columns', '0px 1fr 100px');
// })


//
// var marker = L.marker([38.70704651513132, -9.15248591105515]).addTo(map);


// var marker_list = [{"point1":{
//   lat:38.70704651513132,
//   long:-9.15248591105515
// }}]
// //var marker = L.marker([38.70704651513132, -9.15248591105515]).addTo(map);

// marker_list.forEach(item => console.log(item.lat));
//L.marker(item[0], item[1]).addTo(map)

// for (let marker in marker_list){
//   console.log(marker[0])
//   L.marker(marker[0], marker[1]).addTo(map);
//   final_list.push({marker: point});
// }
// // monumentos.push({ name: "IADE", marker: marker });
// console.log(final_list)