var express = require('express');
var router = express.Router();
const Points = require('../models/mapPointsModel');

/*Get all points */
router.get('/', async function(req, res, next) {
    let points = await Points.getAllPoints();
    res.send(points);
});

module.exports = router;