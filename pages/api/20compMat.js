const ms = require('mysql2') 

export default async function allMatches(targetID) {
    const conn = ms.createConnection({
        host: process.env.HOST,
        database: process.env.DATABASE,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        port: process.env.SQLPORT
    })
    
    var relationCol = 'all_relation';
    
    var result = {} 
    var tableName = '20tong';
   
    var sql = `SELECT ${relationCol} FROM ${tableName} WHERE DBID = ?`;
    var qRes = await conn.promise().query(sql, [targetID]);
    var resJs =  JSON.parse(qRes[0][0][relationCol]);
    
    Object.entries(resJs).forEach(([key, value]) => {
        result[key] = {}
        result[key]['name'] = value['name'];
        result[key]['mLen'] = value['count'];
    })
    
    conn.end();
    return result
}