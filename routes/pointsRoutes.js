var express = require('express');
var router = express.Router();
const Points = require('../models/mapPointsModel');

/*Get all points */
router.get('/bb', async function(req, res, next) {
    let st_point1 = req.query.p1;
    let st_point2 = req.query.p2;
    let points = await Points.getPointsInBoundingBox(st_point1, st_point2);
    res.send(points);
});

router.get('/nearby', async function(req, res, next) {
    let lat = req.query.lat;
    let lng = req.query.lng;
    let points = await Points.getPointsByBuffer(lat, lng);
    res.send(points);
});

//Get point by id
router.get('/', async function(req, res, next) {
    let id = req.query.id;
    let point = await Points.getPointById(id);
    res.send(point);
});

router.post('/update', async function(req, res, next) {
    let currentId = req.body.pointObject.id;
    let currentBssid = req.body.pointObject.bssid;
    let currentStrength = req.body.pointObject.strength;
    let currentEncryption = req.body.pointObject.encryption;
    let currentLat = String(req.body.pointObject.st_x); //-9.15
    let currentLng = String(req.body.pointObject.st_y); //38.70

    let newBssid = req.body.name
    let newSecurity = req.body.security
    let newStrength = req.body.strength
    let newLat = req.body.lat //
    let newLng = req.body.lng //80.12

    console.log(newLat + " " + newLng);
    console.log(newLat != currentLat)

    console.log(currentLat + " " + currentLng);
    console.log("######")

    let newPointObject = { id: currentId }

    //Compare the current values with the new values and update if they are different
    if (currentBssid != newBssid) {
        newPointObject.bssid = newBssid
    }
    if (currentStrength != newStrength) {
        newPointObject.strength = newStrength
    }
    if (currentEncryption != newSecurity) {
        newPointObject.encryption = newSecurity
    }

    if (newLat != currentLat || newLng != currentLng) {
        if (newLat == currentLat) {
            newPointObject.st_x = currentLat
        } else {
            newPointObject.st_x = newLat
        }
        if (newLng == currentLng) {
            newPointObject.st_y = currentLng
        } else {
            newPointObject.st_y = newLng
        }
    }

    console.log(newPointObject)


    // let point = await Points.updatePoint(id, req.body);
    // res.send(point);
});



module.exports = router;