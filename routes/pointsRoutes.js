var express = require('express');
var router = express.Router();
const Points = require('../models/mapPointsModel');

/*Get all points */
router.get('/bb/', async function(req, res, next) {
    let st_point1 = req.query.p1;
    let st_point2 = req.query.p2;
    let points = await Points.getPointsInBoundingBox(st_point1, st_point2);
    res.send(points);
});

//Get point by id
router.get('/:id', async function(req, res, next) {
    let id = req.params.id;
    let point = await Points.getPointById(id);
    res.send(point);
});

module.exports = router;