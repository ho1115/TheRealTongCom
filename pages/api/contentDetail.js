const ms = require('mysql2') 

export default async function contentMatches(TID, HID, version) {

    const conn = ms.createConnection({
        host: process.env.HOST,
        database: process.env.DATABASE,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        port: process.env.SQLPORT
    })
    
    var relationTable = version === 'all' ? 'old_relations' : 'tongzhi_official_history_relations';
    var result = {} 
   
    var sql = `SELECT match_info FROM ${relationTable} WHERE tongzhi_ID = ? and official_history_ID = ?`;
    var qRes = await conn.promise().query(sql, [TID, HID])
    result['matchArrs'] =  JSON.parse(qRes[0][0]['match_info']);

    sql = `SELECT content, word_count, name, chapter, chapter_number FROM tongzhi WHERE DBID = ?`;
    qRes = await conn.promise().query(sql, [TID]);
    var TLptr = 0
    var TRptr = 0
    var cnt = 0
    var HLptr = 0
    var HRptr = 0
    var Ttext = qRes[0][0]['content']
    result['tongTextN'] = {};
    result['tongTextY'] = {};
    result['tongLen'] =  qRes[0][0]['word_count'];
    result['tongName'] =  `通志 / ${qRes[0][0]['chapter']} ${qRes[0][0]['chapter_number']} - ${qRes[0][0]['name']}`;

    sql = `SELECT content, word_count, book_name, volumn FROM official_history WHERE DBID = ?`;
    qRes = await conn.promise().query(sql, [HID]);
    var Htext = qRes[0][0]['content']
    result['hisTextN'] = {};
    result['hisTextY'] = {};
   
    result['matchArrs'].forEach(element => {
        TRptr = element['tonchi_index']
        result['tongTextN'][cnt] = Ttext.substring(TLptr, TRptr);
        TLptr = TRptr;
        TRptr += element['tonchi_length'];
        result['tongTextY'][cnt] = Ttext.substring(TLptr, TRptr);
        TLptr = TRptr;
        HRptr = element['history_index']
        result['hisTextN'][cnt] = Htext.substring(HLptr, HRptr);
        HLptr = HRptr;
        HRptr += element['history_length'];
        result['hisTextY'][cnt] = Htext.substring(HLptr, HRptr);
        HLptr = HRptr;
        cnt += 1;
    });
    result['tongTextTail'] = Ttext.substring(TLptr, Ttext.length);
    result['hisTextTail'] = Htext.substring(HLptr, Htext.length);
    result['hisLen'] =  qRes[0][0]['word_count'];
    result['hisName'] =  `${qRes[0][0]['book_name']} - ${qRes[0][0]['volumn']}`;
    conn.end();
    return result
}
