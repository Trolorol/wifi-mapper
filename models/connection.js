var pg = require('pg')

const connectionString = "postgres://admin:calapez14@10.9.0.2:5432/jit-demo"
const Pool = pg.Pool
const pool = new Pool({
    connectionString,
    max: 10,
})

module.exports = pool;