const ms = require('mysql2') 

export default async function searchPeo(target, version) {
    const conn = ms.createConnection({
        host: process.env.HOST,
        database: process.env.DATABASE,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        port: process.env.SQLPORT
    })
    
    var relationCol = version === 'all' ? 'all_relation' : 'cut_relation';
    var mCnt = version === 'all' ? 'all_lap_length' : 'cut_lap_length';
    
    var result = {
        'peos' : [],
        'chap' : [],
        'dyn' : [],
        'wCnt' : [],
        'mCnt' : [],
        'ID': [],
        'matches' : [],
    } 
   
    var sql = `SELECT chapter, chapter_number, volume, dynasty, word_count, ${mCnt}, ${relationCol}, name, DBID FROM tongzhi WHERE name LIKE ?`;
    var qRes = await conn.promise().query(sql, [`%${target}%`]);
    if (qRes.length == 0) {return "noMatch";}
    Object.values(qRes[0]).forEach(ele => {
        result['peos'].push(ele['name'])
        result['chap'].push(`${ele['chapter']} ${ele['chapter_number']} (第${ele['volume']}卷)`)
        result['dyn'].push(ele['dynasty'])
        result['wCnt'].push(ele['word_count'])
        result['mCnt'].push(ele[mCnt])
        result['ID'].push(ele['DBID'])
        result['matches'].push(JSON.parse(ele[relationCol]))
    })
    
    conn.end();
    return result
}