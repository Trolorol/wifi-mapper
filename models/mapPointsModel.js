var pool = require("./connection");

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