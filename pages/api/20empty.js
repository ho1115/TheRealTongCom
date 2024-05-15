const ms = require('mysql2') 

export default async function emptyMatches(ID, version) {

    const conn = ms.createConnection({
        host: process.env.HOST,
        database: process.env.DATABASE,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        port: process.env.SQLPORT
    })
    
    var mess = type === "zeroMatch" ? "無比對結果" : "請從左側清單選擇比對結果"
    var sql = version === "tz" ? `SELECT content, word_count, name, chapter, chapter_number FROM 20tong WHERE DBID = ?` 
                                : `SELECT content, word_count, book_name, volumn FROM 20his WHERE DBID = ?` ;
    var result = {}    
    
    var qRes = await conn.promise().query(sql, [ID])
    var Ttext = version === "tz" ? qRes[0][0]['content'] : mess
    result['tongTextN'] = {0 : Ttext};
    result['tongTextY'] = {0 : ''};
    result['tongLen'] =  version === "tz" ? qRes[0][0]['word_count'] : 0;
    result['tongName'] =  version === "tz" ? `${qRes[0][0]['chapter']} - ${qRes[0][0]['name']}` : mess;

    
    var Htext = version === "tz" ? mess : qRes[0][0]['content']
    result['hisTextN'] = {0 : Htext};
    result['hisTextY'] = {0 : ''};

    
    result['tongTextTail'] = '';
    result['hisTextTail'] = '';


    result['hisLen'] =  version === "tz" ? 0 : qRes[0][0]['word_count'];
    result['hisName'] = version === "tz" ? mess : `${qRes[0][0]['volumn']}`;
    conn.end();
    return result
}
