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
        .on("end", async function() {
            try {
                let sql_waps = "Insert into waps(bssid, strength, location) values($1,$2,$3)";
                encryptions = await getEncryptions() //Lista de encryptions existentes
                console.log(encryptions.result)
                for (var i = 0; i < arr.length; i++) {
                    // Pega na coluna ecnryption e faz lop
                    // Se já existir pega no id e completa tabela intermedia
                    // Se não existir cria um novo registo e volta ao passo anterior
                    //await pool.query(sql, [row]); //não apagar
                }
                return { status: 200 };
            } catch (err) {
                console.log(err);
                return { status: 500, result: err };
            }
        });
}

getEncryptions = async function() {
    try {
        let sql = "Select * from encryptions";
        let result = await pool.query(sql);
        let encryptions = result.rows;
        return { status: 200, result: encryptions };
    } catch (err) {
        console.log(err);
        return { status: 500, result: err };
    }
}