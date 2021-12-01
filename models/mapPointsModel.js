var pool = require("./connection");



//Get all points given a bounding box from leaflet
module.exports.getPointsInBoundingBox = async function(st1, st2) {
    try {
        let stringPoint1 = `ST_POINT(${st1})`
        let stringPoint2 = `ST_POINT(${st2})`
        let sql = `Select id, ST_X(location), ST_Y(location) from waps where waps."location" && ST_SetSRID(ST_MakeBox2D(${stringPoint1},${stringPoint2}),4326)`
        let result = await pool.query(sql);
        let wap_points = result.rows;
        return { status: 200, result: wap_points };
    } catch (error) {
        console.log(error);
        return { status: 500, result: error };
    }
}

module.exports.getAllPoints = async function() {
    try {
        let sql = "Select id, ST_X(location), ST_Y(location) from waps";
        let result = await pool.query(sql);
        let wap_points = result.rows;
        return { status: 200, result: wap_points };
    } catch (error) {
        console.log(error);
        return { status: 500, result: error };
    }
}