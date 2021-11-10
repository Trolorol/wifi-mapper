var pool = require("./connection");
module.exports.getAllPoints = async function() {
    try {
        let sql = "Select * from courses";
        let result = await pool.query(sql);
        let courses = result.rows;
        return { status: 200, result: courses };
    } catch (err) {
        console.log(err);
        return { status: 500, result: err };
    }
}