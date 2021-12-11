var pool = require("./connection");
const csv = require("fast-csv");
const fs = require('fs');
const path = require('path');



module.exports.uploadFile = async function(file) {
    deleteFilesFromDirectory();
    let arr = [];
    let stream = fs.createReadStream(file);
    console.log(file);
    csv.parseStream(stream, { headers: true })
        .on("data", function(data) {
            arr.push(data);;
        })
        .on("end", async function() { // Se houver tempo fazer verificação de pontos repetidos na introdução do ficheiro
            try {


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

// INSERT INTO waps(bssid, strength, "location")
// VALUES('T_601', '100', ST_GeomFromText('POINT(-71.060316 48.432044)', 4326));

//INSERT INTO waps(bssid, strength, location) VALUES($1, $2, ST_GeomFromText('POINT($3)', 4326)) RETURNING id

// const sql = "INSERT INTO assets (title, id, duration, geodata, genre) VALUES($1, $2, $3, ST_Polygon($4,4326), $5);"

// INSERT INTO waps(bssid, strength, "location")
// VALUES('T_601', '100', ST_GeomFromText('POINT(-71.060316 48.432044)', 4326));
// database_1  | 2021-11-27 21:59:52.499 EUROPE [69] ERROR:  function point(unknown) is not unique at character 76
// database_1  | 2021-11-27 21:59:52.499 EUROPE [69] HINT:  Could not choose a best candidate function. You might need to add explicit type casts.
// database_1  | 2021-11-27 21:59:52.499 EUROPE [69] STATEMENT:  INSERT INTO waps (bssid, strength, location) VALUES($1,$2, ST_GeomFromText(POINT($3),4326)) RETURNING id


insert_waps = async function(bssid, strenght, location, encryptionId) {
    try {
        location_input = location.split([","]);
        let point = `'POINT(${location_input[0]+location_input[1]})'`
        let sql = `INSERT INTO waps (bssid, strength, location) VALUES($1,$2, ST_GeomFromText(${point},4326)) RETURNING id`;
        let wapId = await pool.query(sql, [bssid, strenght]); //Lovation recebe: ('Point', 'POINT(0 0)'),
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

function deleteFilesFromDirectory() {

    const directory = "./uploads";



    fs.readdir(directory, (err, files) => {
        if (err) throw err;

        for (const file of files) {
            fs.unlink(path.join(directory, file), err => {
                if (err) throw err;
            });
        }
    });
}