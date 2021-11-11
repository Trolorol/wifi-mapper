var pg = require('pg')

const connectionString = "postgres://admin:postgres@localhost:2345/wifi-mapper"
const Pool = pg.Pool
const pool = new Pool({
    connectionString,
    max: 10,
})

module.exports = pool;