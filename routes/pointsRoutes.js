var express = require('express');
var router = express.Router();


/*Get all points */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});