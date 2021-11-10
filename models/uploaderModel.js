var pool = require("./connection");


module.exports.uploadFile = async function(file) {
    try {
        let sql = "Insert into waps(enr_stud_id, enr_plan_id,enr_dt_enrollment) values($1,$2,$3)";


        let result = await pool.query(sql, [stuId, planId, new Date()]);



        return { status: 200, result: result.rows[0] };
    } catch (err) {
        console.log(err);
        return { status: 500, result: err };
    }
}

id serial primary key,
location point NOT NULL,
strength varchar,
user_id int NOT NULL,
foreign key(user_id) references users(id),
    created_on timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP new Date();