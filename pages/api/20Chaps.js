const ms = require('mysql2') 

async function tzChaps(chapName){

    const conn = ms.createConnection({
        host: process.env.HOST,
        database: process.env.DATABASE,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        port: process.env.SQLPORT
    })
    
    var cnt = 'all_lap_length';
    var relationCol = 'all_relation';
    var result = {
        'peopleList' : [],
        'people' : {}
    }   
    var sql = 'SELECT DBID, name, word_count, ' + relationCol + ', ' + cnt + ' FROM 20tong WHERE chapter = ?'
    var qRes = await conn.promise().query(sql, [chapName]);
    for (let i = 0; i < qRes[0].length; i++) {
    
        var tongid = qRes[0][i]['DBID']
        var master = qRes[0][i]['name']
        var wordLen = qRes[0][i]['word_count']
        var matchLen = qRes[0][i][cnt]
        var matchChapJs = {}
        var relationList = JSON.parse(qRes[0][i][relationCol])
        
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
            'totalCnt' : wordLen,
            'matchCnt' : matchLen,
            'matchChaps' : matchChapJs,
        }
    }
    conn.end();
    
    return result
}



export default async function subChapRoute(chapName) {

    return tzChaps(chapName);

}