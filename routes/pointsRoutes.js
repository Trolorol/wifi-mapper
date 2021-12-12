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

router.get('/filter', async function(req, res, next) {
    let filter = req.query.name
    let points = await Points.getPointByName(filter);
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
    // fObject is short for final object to be inserted into the database
    let fObject = { id: req.body.pointObject.id }

    //Compare if there are changes in bssid
    let currentBssid = req.body.pointObject.bssid;
    let newBssid = req.body.name
    if (currentBssid != newBssid) {
        fObject.bssid = newBssid
    } else {
        fObject.bssid = currentBssid
    }
    //Compare if there are changes with Strength value
    let currentStrength = req.body.pointObject.strength;
    let newStrength = req.body.strength
    if (currentStrength != newStrength) {
        fObject.strength = newStrength
    } else {
        fObject.strength = currentStrength
    }
    //Compare if there are changes with Encryption value
    let currentEncryption = req.body.pointObject.encryption;
    let newEncryption = req.body.encryption
    if (currentEncryption != newEncryption) {
        fObject.encryption = newEncryption
    } else {
        fObject.encryption = currentEncryption
    }

    //Compare if there are changes with coordinates values
    //This logic exists because the coordinates are a pair of values
    let lat;
    let lng;
    let currentLat = String(req.body.pointObject.st_x); //-9.15
    let currentLng = String(req.body.pointObject.st_y); //38.70
    let newLat = req.body.lat //
    let newLng = req.body.lng //80.12
    if (newLat != currentLat || newLng != currentLng) {
        if (newLat == currentLat || newLat == "") {
            lat = currentLat
        } else {
            lat = newLat
        }
        if (newLng == currentLng || newLng == "") {
            lng = currentLng
        } else {
            lng = newLng
        }
    } else {
        lat = currentLat
        lng = currentLng
    }

    fObject.point = [lat, lng]
        //Doing this process the object is allways complete

    let point = await Points.updatePoint(fObject);
    res.send(point);
});

router.delete('/delete', async function(req, res, next) {
    let id = req.query.id;
    let point = await Points.deletePoint(id);
    res.send(point);
});

router.post('/insert', async function(req, res, next) {

    let point = await Points.insertPoint(req.body);
    res.send(point);
});


module.exports = router;