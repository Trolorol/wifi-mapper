var pool = require("./connection");

//Get all points given a bounding box from leaflet
module.exports.getPointsInBoundingBox = async function(st1, st2) {
    try {
        let stringPoint1 = `ST_POINT(${st1})`
        let stringPoint2 = `ST_POINT(${st2})`
        let sql = `Select id, ST_X(location), ST_Y(location), bssid from waps
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

module.exports.getPointByName = async function(filter) {
    try {
        let sql = `select w.id, w.bssid, w.strength, e.encryption, ST_X(w.location), ST_Y(w.location) from waps w
        inner join waps_encryptions we on w.id = we.wap_id
        inner join encryptions e on we.encryption_id = e.id
            where w.bssid ilike '${filter}%' limit 20;`
        console.log(sql)
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
        let sql = `SELECT buffer.id, buffer.bssid, distances.dist
        FROM
          (
          SELECT id, bssid,
                  ST_X(LOCATION),
                  ST_Y(LOCATION)
           FROM waps
           WHERE waps."location" && ST_SetSRID(ST_Buffer(${stringPoint}, 0.01), 4326)
           ) buffer
        INNER JOIN
          (
          SELECT id, ST_Distance("location", 'POINT(${lat} ${lng})'::GEOGRAPHY) AS dist
           FROM waps w
           ) distances ON buffer.id = distances.id
           order by dist asc;`
        let result = await pool.query(sql);
        let wap_points = result.rows;
        return { status: 200, result: wap_points };
    } catch (error) {
        console.log(error);
        return { status: 500, result: error };
    }
}

module.exports.updatePoint = async function(fObject) {
    let pointId = fObject.id;
    let bssid = fObject.bssid;
    let strength = fObject.strength;
    let encryption = fObject.encryption;
    let point = fObject.point
    let encryption_id = await getEncryptionsByName(encryption); //encryption_id.result[0].id

    if (encryption_id.result.length == 0) {
        newEncryption = await createEncryption(encryption)
        encryption_id = newEncryption.result[0].id;
    } else {
        encryption_id = encryption_id.result[0].id
    }

    try {
        point_sql = `'POINT(${point[0]+" "+point[1]})'`
        let sql = `update waps
            set bssid = '${bssid}', strength = '${strength}',location = ST_GeomFromText(${point_sql},4326)
            where id = ${pointId} RETURNING bssid, strength, ST_X(location), ST_Y(location)`;
        let result = await pool.query(sql);
        let wap_points = result.rows;
        await updateWapWapsEncryptions(pointId, encryption_id);
        return { status: 200, result: wap_points };
    } catch (error) {
        console.log(error);
        return { status: 500, result: error };
    }
}

getEncryptionsByName = async function(encryptionName) {
    try {
        let sql = `select id, encryption from encryptions where encryption like '${encryptionName}'`;
        let result = await pool.query(sql);
        let encryption = result.rows;
        return { status: 200, result: encryption };
    } catch (error) {
        console.log(error);
        return { status: 500, result: error };
    }
}

createEncryption = async function(encryptionName) {
    try {
        let sql = `insert into encryptions (encryption) values ('${encryptionName}') RETURNING id`;
        let result = await pool.query(sql);
        let wap_points = result.rows;
        return { status: 200, result: wap_points };
    } catch (error) {
        console.log(error);
        return { status: 500, result: error };
    }
}

updateWapWapsEncryptions = async function(wapId, encryptionId) {
    try {
        let sql = `update waps_encryptions set encryption_id = ${encryptionId} where wap_id = ${wapId}`;
        let result = await pool.query(sql);
        let wap_points = result.rows;
        return { status: 200, result: wap_points };
    } catch (error) {
        console.log(error);
        return { status: 500, result: error };
    }
}

module.exports.deletePoint = async function(wapId) {
    try {
        association = await deleteWapsEncryptions(wapId);
        if (association.status == 500) {
            return { status: 500, result: association.result };
        } else {
            let sql = `delete from waps where id = ${wapId}`;
            let result = await pool.query(sql);
            let wap_points = result.rows;
            return { status: 200, result: wap_points };
        }
    } catch (error) {
        console.log(error);
        return { status: 500, result: error };
    }
}

module.exports.insertPoint = async function(fObject) {
    let bssid = fObject.name;
    let strength = fObject.strength;
    let lat = fObject.lat
    let lng = fObject.lng
    let encryption_id = await getEncryptionsByName(fObject.encryption); //encryption_id.result[0].id

    if (encryption_id.result.length == 0) {
        newEncryption = await createEncryption(fObject.encryption)
        encryption_id = newEncryption.result[0].id;
    } else {
        encryption_id = encryption_id.result[0].id
    }

    try {
        point_sql = `'POINT(${lng+" "+lat})'`
        let sql = `insert into waps (bssid, strength, location) values ('${bssid}', '${strength}', ST_GeomFromText(${point_sql},4326)) RETURNING id`;
        let result = await pool.query(sql);
        let wap_points = result.rows;
        await insert_waps_encryptions(wap_points[0].id, encryption_id);
        return { status: 200, result: wap_points };
    } catch (error) {
        console.log(error);
        return { status: 500, result: error };
    }
}

module.exports.getTotalPoints = async function() {
    try {
        let sql = `select count(*) from waps`;
        let result = await pool.query(sql);
        let wap_points = result.rows;
        return { status: 200, result: wap_points[0] };
    } catch (error) {
        console.log(error);
        return { status: 500, result: error };
    }
}

deleteWapsEncryptions = async function(wapId) {
    try {
        let sql = `delete from waps_encryptions where wap_id = ${wapId}`;
        let result = await pool.query(sql);
        let wap_points = result.rows;
        return { status: 200, result: wap_points };
    } catch (error) {
        console.log(error);
        return { status: 500, result: error };
    }
}

insert_waps_encryptions = async function(wapId, encryptionId) {
    try {
        let sql = "Insert into waps_encryptions(wap_id, encryption_id) values($1,$2)";
        let result = await pool.query(sql, [wapId, encryptionId]); //Falta return?
        return { status: 200, result: result };
    } catch (error) {
        console.log(error);
        return { status: 500, result: error };
    }
}