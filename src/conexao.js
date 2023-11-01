const { Pool} = require('pg');

const pool = new Pool({
    host:'viaduct.proxy.rlwy.net',
    port: 5072,//porta errada de proposito
    user: 'postgres',
    password: 'aGD-aCfa2G335DfF4ABfff1BDEcg-D6F',
    database: 'dimdim'
});

module.exports = pool;