var pool = require("./connection");


//Get all points given a bounding box from leaflet
module.exports.getPointsInBoundingBox = async function(boundingBox) {
    try {
        let sql = "Select id, location from waps where ST_Contains(ST_GeomFromText('" + boundingBox + "'), location)";
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
        let sql = "Select id, location from waps";
        let result = await pool.query(sql);
        let wap_points = result.rows;
        return { status: 200, result: wap_points };
    } catch (error) {
        console.log(error);
        return { status: 500, result: error };
    }
}