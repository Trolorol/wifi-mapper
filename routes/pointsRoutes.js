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
    console.log(point);
    res.send(point);
});



module.exports = router;