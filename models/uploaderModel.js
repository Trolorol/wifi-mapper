var pool = require("./connection");
const csv = require("fast-csv");
const fs = require('fs');

module.exports.uploadFile = async function(file) {

    var arr = [];
    var stream = fs.createReadStream(file);

    csv.parseStream(stream, { headers: true })
        .on("data", function(data) {
            arr.push(data);
        })
        .on("end", async function() { // Se houver tempo fazer verificação de pontos repetidos na introdução do ficheiro
            try {
                let encryptions = await getEncryptions();
                for (element in arr) {
                    let element_encryption = arr[element].Security;
                    let get_encryption = await get_encrtpyion_by_name(element_encryption);
                    let encryption_name = get_encryption.result.name
                    let encryption_id = get_encryption.result.id
                    if (encryption_name === element_encryption) {
                        await insert_waps(arr[element].BSSID, arr[element].Strength, arr[element].Location, encryption_id)
                    } else {
                        let insert_encryption = await insert_encryptions(element_encryption);
                        await insert_waps(arr[element].BSSID, arr[element].Strength, arr[element].Location, insert_encryption.result);
                    }
                }
                return { status: 200 };
            } catch (error) {
                console.log(error);
                return { status: 500, result: error };
            }
        });
}


get_encrtpyion_by_name = async function(encryptionName) {
    try {
        let sql = "Select * from encryptions where encryption = $1"; // meter ilike
        let result = await pool.query(sql, [encryptionName]);
        let encryptions = result.rows[0];
        if (typeof encryptions !== "undefined") {
            return { status: 200, result: { id: encryptions.id, name: encryptions.encryption } };
        } else {
            return { status: 200, result: { id: null, name: null } };
        }
    } catch (error) {
        console.log(error);
        return { status: 500, result: error };
    }
}

insert_encryptions = async function(encryptionName) {
    try {
        let sql = "Insert into encryptions(encryption) values($1) RETURNING id";
        let encryption_id = await pool.query(sql, [encryptionName]);
        return { status: 200, result: encryption_id.rows[0].id };
    } catch (error) {
        console.log(error);
        return { status: 500, result: error };
    }

}

CREATE TABLE geometries (name varchar, geom geometry);

INSERT INTO geometries VALUES
  ('Point', 'POINT(0 0)'),
  ('Linestring', 'LINESTRING(0 0, 1 1, 2 1, 2 2)'),
  ('Polygon', 'POLYGON((0 0, 1 0, 1 1, 0 1, 0 0))'),
  ('PolygonWithHole', 'POLYGON((0 0, 10 0, 10 10, 0 10, 0 0),(1 1, 1 2, 2 2, 2 1, 1 1))'),
  ('Collection', 'GEOMETRYCOLLECTION(POINT(2 0),POLYGON((0 0, 1 0, 1 1, 0 1, 0 0)))');

SELECT name, ST_AsText(geom) FROM geometries;

insert_waps = async function(bssid, strenght, location, encryptionId) {
    try {
        let sql = "Insert into waps(bssid, strength, location) values($1,$2,$3) RETURNING id";
        let wapId = await pool.query(sql, [bssid, strenght, location]); //Lovation recebe: ('Point', 'POINT(0 0)'),
        encryptions = await insert_waps_encryptions(wapId.rows[0].id, encryptionId) //Falta return?
        return { status: 200 };
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

getEncryptions = async function() {
    try {
        let sql = "Select * from encryptions";
        let result = await pool.query(sql);
        let encryptions = result.rows;
        return { status: 200, result: encryptions };
    } catch (error) {
        console.log(error);
        return { status: 500, result: error };
    }
}