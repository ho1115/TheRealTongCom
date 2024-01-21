const ms = require('mysql2') 
const conn = ms.createConnection({
    host: process.env.HOST,
    database: process.env.DATABASE,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    port: process.env.SQLPORT
})
let tool = require('util') 
tool = new tool()

class hisDataCarrier {

    async compContent(TID, HID, version) {
        var relationTable = version === 'all' ? 'old_relations' : 'tongzhi_official_history_relations';
        var sql = 'SELECT content FROM tongzhi WHERE DBID = ?'
        var qRes = await conn.promise().query(sql, [TID])
        var result = {
            'contentA': qRes[0]['content'],
        }

        sql = 'SELECT content FROM official_history WHERE DBID = ?'
        qRes = await conn.promise().query(sql, [HID])
        result['contentB'] = qRes[0]['content']

        sql = 'SELECT match_info FROM ' + relationTable + ' WHERE official_history_ID = ? AND tongzhi_ID = ?'
        qRes = await conn.promise().query(sql, [HID, TID])
        result['matchJson'] = qRes[0]['match_info']
        console.log(result)
        conn.end()
        return result;
    }

}

module.exports = hisDataCarrier;