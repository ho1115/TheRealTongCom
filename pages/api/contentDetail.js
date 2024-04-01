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
    var mCnt = version === 'all' ? 'all_lap_length' : 'cut_lap_length';
    var sql = `SELECT match_info FROM ${relationTable} WHERE tongzhi_ID = ? and official_history_ID = ?`;
    var qRes = await conn.promise().query(sql, [TID, HID])
    
    result['matchArrs'] =  JSON.parse(qRes[0][0]['match_info']);

    sql = `SELECT content, word_count, name, chapter, chapter_number, ${mCnt} FROM tongzhi WHERE DBID = ?`;
    qRes = await conn.promise().query(sql, [TID]);
    result['tmLen'] = qRes[0][0][mCnt]
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

    sql = `SELECT content, word_count, book_name, volumn, book_name, ${mCnt} FROM official_history WHERE DBID = ?`;
    qRes = await conn.promise().query(sql, [HID]);
    var Htext = qRes[0][0]['content']
    result['hmLen'] = qRes[0][0][mCnt]
    result['hisTextN'] = {};
    result['hisTextY'] = {};
    result['hisBook'] = qRes[0][0]['book_name'];

    result['matchArrs'].sort(function(a, b) {return a.tonchi_index - b.tonchi_index}).forEach(element => {
        TRptr = element['tonchi_index']
        result['tongTextN'][cnt] = Ttext.substring(TLptr, TRptr);
        TLptr = TRptr;
        TRptr += element['tonchi_length'];
        result['tongTextY'][cnt] = {'para' : Ttext.substring(TLptr, TRptr), 'spanID' : `${element['tonchi_index']}#${element['history_index']}`};
        TLptr = TRptr;
        cnt += 1;
    });
    result['tongTextTail'] = Ttext.substring(TLptr, Ttext.length);

    cnt = 0

    result['matchArrs'].sort(function(a, b) {return a.history_index - b.history_index}).forEach(element => {
        HRptr = element['history_index']
        result['hisTextN'][cnt] = Htext.substring(HLptr, HRptr);
        HLptr = HRptr;
        HRptr += element['history_length'];
        result['hisTextY'][cnt] = {'para' : Htext.substring(HLptr, HRptr), 'spanID' : `${element['tonchi_index']}#${element['history_index']}`};
        HLptr = HRptr;
        cnt += 1;
    });    
    result['hisTextTail'] = Htext.substring(HLptr, Htext.length);

    cnt = 0

    result['hisLen'] =  qRes[0][0]['word_count'];
    result['hisName'] =  `${qRes[0][0]['book_name']} - ${qRes[0][0]['volumn']}`;
    conn.end();
    return result
}
