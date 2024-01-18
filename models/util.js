const ms = require('mysql2') 
const conn = ms.createConnection({
    host: process.env.HOST,
    database: process.env.DATABASE,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    port: process.env.SQLPORT
})

class tools {
    async idChapterList() {
        var list = {}
        var sql = 'SELECT DBID, book_name, volumn, word_count, all_lap_length, cut_lap_length FROM official_history';
        const qRes = await conn.promise().query(sql)
        for (let i = 0; i < qRes[0].length; i++) {
            list[qRes[0][i]['DBID']] = {
                'bname' : qRes[0][i]['book_name'],
                'volu' : qRes[0][i]['volumn'],
                'len' : qRes[0][i]['word_count'],
                'all_lap_length' : qRes[0][i]['all_lap_length'],
                'cut_lap_length' : qRes[0][i]['cut_lap_length'],
            }
        }                       
        return list
    }
}

module.exports = tools;