const ms = require('mysql2') 

export default async function contentMatches(TID, HID) {
    const conn = ms.createConnection({
        host: process.env.HOST,
        database: process.env.DATABASE,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        port: process.env.SQLPORT
    })
    
    var relationTable ='20rela';
    var result = {} 
    var mCnt ='all_lap_length';
    var sql = `SELECT match_info FROM ${relationTable} WHERE tongzhi_ID = ? and official_history_ID = ?`;
    var qRes = await conn.promise().query(sql, [TID, HID])
    
    result['matchArrs'] =  JSON.parse(qRes[0][0]['match_info']);

    sql = `SELECT content, word_count, name, chapter, ${mCnt} FROM 20tong WHERE DBID = ?`;
    
    qRes = await conn.promise().query(sql, [TID]);
    result['tmLen'] = qRes[0][0][mCnt]
    var TLptr = 0
    var TRptr = 0
    var cnt = 0
    var HLptr = 0
    var HRptr = 0
    var Ttext = qRes[0][0]['content']
    var trueTtext = [...Ttext]
    result['tongTextN'] = {};
    result['tongTextY'] = {};
    result['tongLen'] =  qRes[0][0]['word_count'];
    result['tongName'] =  `${qRes[0][0]['chapter']} - ${qRes[0][0]['name']}`;

    sql = `SELECT content, word_count, book_name, volumn, book_name FROM 20his WHERE DBID = ?`;
    qRes = await conn.promise().query(sql, [HID]);
    var Htext = qRes[0][0]['content']
    var trueHtext = [...Htext]
    result['hisTextN'] = {};
    result['hisTextY'] = {};
    result['hisBook'] = qRes[0][0]['book_name'];
    var tmpConcate;
    result['matchArrs'].sort(function(a, b) {return a.tonchi_index - b.tonchi_index}).forEach(element => {
        TRptr = element['tonchi_index']
        result['tongTextN'][cnt] = '';
        for (let u = TLptr; u < TRptr ; u++) {result['tongTextN'][cnt] += trueTtext[u];}
        TLptr = TRptr;
        TRptr += element['tonchi_length'];
        tmpConcate = '';
        for (let u = TLptr; u < TRptr ; u++) {tmpConcate += trueTtext[u]}
        result['tongTextY'][cnt] = {'para' : tmpConcate, 'spanID' : `${element['tonchi_index']}#${element['history_index']}`};
        TLptr = TRptr;
        cnt += 1;
    });
    tmpConcate = '';
    for (let u = TLptr; u < trueTtext.length ; u++) {tmpConcate += trueTtext[u];}
    result['tongTextTail'] = tmpConcate;

    cnt = 0

    result['matchArrs'].sort(function(a, b) {return a.history_index - b.history_index}).forEach(element => {
        HRptr = element['history_index']
        result['hisTextN'][cnt] = ''
        for (let u = HLptr; u < HRptr ; u++) {result['hisTextN'][cnt] += trueHtext[u];}
        HLptr = HRptr;
        HRptr += element['history_length'];
        tmpConcate = '';
        for (let u = HLptr; u < HRptr ; u++) {tmpConcate += trueHtext[u]}
        result['hisTextY'][cnt] = {'para' : tmpConcate, 'spanID' : `${element['tonchi_index']}#${element['history_index']}`};
        HLptr = HRptr;
        cnt += 1;
    });    
    tmpConcate = '';
    for (let u = HLptr; u < trueHtext.length ; u++) {tmpConcate += trueHtext[u];}
    result['hisTextTail'] = tmpConcate;

    cnt = 0

    result['hisLen'] =  qRes[0][0]['word_count'];
    result['hisName'] =  `${qRes[0][0]['book_name']} - ${qRes[0][0]['volumn']}`;
    conn.end();
    return result
}
