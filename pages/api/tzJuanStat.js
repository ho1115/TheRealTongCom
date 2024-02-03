const ms = require('mysql2') 
import hisChLen from "@/jsonBase/hisLenList.json"

export default async function juanStat(chap, version) {

    const conn = ms.createConnection({
        host: process.env.HOST,
        database: process.env.DATABASE,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        port: process.env.SQLPORT
    })

    var cnt = version === 'all' ? 'all_lap_length' : 'cut_lap_length';
    var rela = version === 'all' ? 'all_relation' : 'cut_relation';
    var chSplit = chap.split(' ')

    var result = {
        "peoCnt" : 0,
        "mCnt" : 0,
        "wCnt" : 0,  
        "hisChapLen" : {},
        "subInfo" : {},
    } 
    
    var sql = `SELECT dynasty, name, word_count, ${cnt}, ${rela} FROM tongzhi WHERE chapter = ? and chapter_number = ?`;
    var qRes = await conn.promise().query(sql, [chSplit[0], chSplit[1]])
    result["peoCnt"] = qRes[0].length
    for (let i = 0; i < qRes[0].length; i++) {
        var dyna = qRes[0][i]['dynasty'];
        var person = qRes[0][i]['name'];
        var tLen = qRes[0][i]['word_count'];
        var mLen = qRes[0][i][cnt];
        var matchJs = JSON.parse(qRes[0][i][rela]);

        result["mCnt"] += mLen
        result["wCnt"] += tLen

        if (!result["subInfo"][dyna]) {
            result["subInfo"][dyna] = {
                "matchPeo" : {},
                "noMatch" : [],
                "mCnt" : 0,
                "tCnt" : 0,
                "hisMatches" : {}, 
            };
        }
        if (mLen == 0) {
            result["subInfo"][dyna]["noMatch"].push(person);
            continue;
        }
        result["subInfo"][dyna]["matchPeo"][person] ={"mCnt" : mLen, "tCnt": tLen}
        result["subInfo"][dyna]["mCnt"] += mLen
        result["subInfo"][dyna]["tCnt"] += tLen
        Object.values(matchJs).forEach(info => {
            if (!result["hisChapLen"][info["name"]]) {result["hisChapLen"][info["name"]] = hisChLen[info["name"].replace('-', '#')]}
            var hisName = info["name"].split('-')[0]
            var chapName = info["name"].split('-')[1]
            if (!result["subInfo"][dyna]["hisMatches"][hisName]) {result["subInfo"][dyna]["hisMatches"][hisName] = {"peoArr" : [], "mCnt" : 0, "chapInfo" : {}};}            
            if (!result["subInfo"][dyna]["hisMatches"][hisName]["chapInfo"][chapName]) {result["subInfo"][dyna]["hisMatches"][hisName]["chapInfo"][chapName] = {"mCnt" : 0, "peoInfo" : {}};}
            result["subInfo"][dyna]["hisMatches"][hisName]["chapInfo"][chapName]["peoInfo"][person] = {"mCnt" : info["count"], "tCnt" : tLen}
            result["subInfo"][dyna]["hisMatches"][hisName]["chapInfo"][chapName]["mCnt"] += info["count"]
            result["subInfo"][dyna]["hisMatches"][hisName]["mCnt"] += info["count"]
            if (!result["subInfo"][dyna]["hisMatches"][hisName]["peoArr"].includes(person)) {result["subInfo"][dyna]["hisMatches"][hisName]["peoArr"].push(person)}
        })

    }
    
    conn.end();
    return result
}
