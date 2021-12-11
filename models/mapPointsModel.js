var pool = require("./connection");



//Get all points given a bounding box from leaflet
module.exports.getPointsInBoundingBox = async function(st1, st2) {
    try {
        let stringPoint1 = `ST_POINT(${st1})`
        let stringPoint2 = `ST_POINT(${st2})`
        let sql = `Select id, ST_X(location), ST_Y(location) from waps
        where waps."location" &&
        ST_SetSRID(ST_MakeBox2D(${stringPoint1},${stringPoint2}),4326) limit 4000;`

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

module.exports.getPointById = async function(id) {
    try {
        let sql = `select w.id, w.bssid, w.strength, e.encryption, ST_X(w.location), ST_Y(w.location) from waps w
            inner join waps_encryptions we on w.id = we.wap_id
            inner join encryptions e on we.encryption_id = e.id
            where w.id = ${id}`;
        let result = await pool.query(sql);
        let wap_points = result.rows;
        return { status: 200, result: wap_points };
    } catch (error) {
        console.log(error);
        return { status: 500, result: error };
    }
}


module.exports.getPointsByBuffer = async function(lat, lng) {
    try {
        let stringPoint = `ST_POINT(${lat}, ${lng})`
        let sql = `Select id, ST_X(location), ST_Y(location) from waps
            where waps."location" && ST_SetSRID(ST_Buffer(${stringPoint},0.01),4326);`
        console.log(sql);
        let result = await pool.query(sql);
        let wap_points = result.rows;
        return { status: 200, result: wap_points };
    } catch (error) {
        console.log(error);
        return { status: 500, result: error };
    }
}

module.exports.updatePoint = async function(id, bssid, strength, encryption) {
    try {
        let sql = `update waps set bssid = '${bssid}', strength = ${strength}
        where id = ${id}`;
        let result = await pool.query(sql);
        let wap_points = result.rows;
        return { status: 200, result: wap_points };
    } catch (error) {
        console.log(error);
        return { status: 500, result: error };
    }
}