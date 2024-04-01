const ms = require('mysql2') 

async function officialChaps(bookName, chapName, version){

    if (bookName == "通典-邊防篇") {bookName = "通典";}
    if (bookName == "帝王世紀(不完整)") {bookName = "帝王世紀";}

    const conn = ms.createConnection({
        host: process.env.HOST,
        database: process.env.DATABASE,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        port: process.env.SQLPORT
    })
    
    var cnt = version === 'all' ? 'all_lap_length' : 'cut_lap_length';
    var relationCol = version === 'all' ? 'all_relation' : 'cut_relation';
    var result = {
        'offID' : 0,
        'dynas' : [],
        'peopleList' : [],
        'subChaps' : {},
        'matchLen' : 0,
        'totalLen' : 0,
    }   
    var sql = `SELECT DBID, word_count, ${cnt}, ${relationCol} FROM official_history WHERE book_name = ? and volumn = ?`

    var qRes = await conn.promise().query(sql, [bookName, chapName]);
    for (let i = 0; i < qRes[0].length; i++) {
        if (result['offID'] == 0) {result['offID'] = qRes[0][i]['DBID'];}
        result['totalLen']= qRes[0][i]['word_count'];
        result['matchLen'] = qRes[0][i][cnt];
        var relationList = JSON.parse(qRes[0][i][relationCol]);
        var tChap;
        var tPeo;

        Object.entries(relationList).forEach(([key, value]) => {
            tChap = value['name'].split('-')[0].slice(0, -1)
            tPeo = value['name'].split('-')[1].slice(1)
            result['peopleList'].push(tPeo)
            if (!result['dynas'].includes(tChap)) {result['dynas'].push(tChap);}
            if (!result['subChaps'][tChap]) {result['subChaps'][tChap] = {};}
            result['subChaps'][tChap][key] = {
                'chapName' :tPeo,
                'wordCnt' : value['matchCount'],
                'tWordCnt' : value['totalCount'],
            };
        })
    }
    conn.end();
    return result
}

async function tzChaps(chapName, version){

    const conn = ms.createConnection({
        host: process.env.HOST,
        database: process.env.DATABASE,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        port: process.env.SQLPORT
    })
    
    var cnt = version === 'all' ? 'all_lap_length' : 'cut_lap_length';
    var relationCol = version === 'all' ? 'all_relation' : 'cut_relation';
    var result = {
        'dynas' : [],
        'peopleList' : [],
        'people' : {}
    }   
    var sql = 'SELECT DBID, dynasty, name, word_count, ' + relationCol + ', ' + cnt + ' FROM tongzhi WHERE chapter = ? and chapter_number = ?'
    var targetChap = chapName.split(' ')
    if (targetChap.length === 3) {targetChap[1] = targetChap[1] + ' ' + targetChap[2]}
    var qRes = await conn.promise().query(sql, [targetChap[0], targetChap[1]]);
    for (let i = 0; i < qRes[0].length; i++) {
        
        var tongid = qRes[0][i]['DBID']
        var master = qRes[0][i]['name']
        var dyansty = qRes[0][i]['dynasty']
        var wordLen = qRes[0][i]['word_count']
        var matchLen = qRes[0][i][cnt]
        var matchChapJs = {}
        var relationList = JSON.parse(qRes[0][i][relationCol])
    
        if (!result['dynas'].includes(qRes[0][i]['dynasty'])) {result['dynas'].push(qRes[0][i]['dynasty'])}
        
        Object.entries(relationList).forEach(([key, value]) => {
            matchChapJs[key] = {
                'chapName' : value['name'],
                'wordCnt' : value['count'],
            }
        })
        if (Object.keys(matchChapJs).length == 0) {
            matchChapJs["zeroMatch"] = {
                'chapName' : "無比對結果",
                'wordCnt' : 0,
            }
        }
        
        
        result['peopleList'].push(master)
        result['people'][master] = {
            'tongID' : tongid,
            'dyna' : dyansty,
            'totalCnt' : wordLen,
            'matchCnt' : matchLen,
            'matchChaps' : matchChapJs,
        }
    }
    conn.end();
    
    return result
}



export default async function subChapRoute(bookName, chapName, version) {

    return  bookName == '通志' ? tzChaps(chapName, version) : officialChaps(bookName, chapName, version);

}