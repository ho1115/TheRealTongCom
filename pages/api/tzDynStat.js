const ms = require('mysql2') 
import hisChLen from "@/jsonBase/hisLenList.json"

export default async function dynStat(dyn, version) {

    const conn = ms.createConnection({
        host: process.env.HOST,
        database: process.env.DATABASE,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        port: process.env.SQLPORT
    })

    var cnt = version === 'all' ? 'all_lap_length' : 'cut_lap_length';
    var rela = version === 'all' ? 'all_relation' : 'cut_relation';

    var result = {
        "peoCnt" : 0,
        "mCnt" : 0,
        "wCnt" : 0,
        "hisChapLen" : {},
        "subInfo" : {},      
    } 
    
    var sql = `SELECT chapter, chapter_number, name, word_count, ${cnt}, ${rela}, DBID FROM tongzhi WHERE dynasty = ?`;
    var qRes = await conn.promise().query(sql, [dyn])
    result["peoCnt"] = qRes[0].length
    for (let i = 0; i < qRes[0].length; i++) {
        var tzChap = `${qRes[0][i]['chapter']} ${qRes[0][i]['chapter_number']}`;
        var person = qRes[0][i]['name'];
        var tLen = qRes[0][i]['word_count'];
        var mLen = qRes[0][i][cnt];
        var matchJs = JSON.parse(qRes[0][i][rela]);
        var did = qRes[0][i]['DBID'];

        result["mCnt"] += mLen
        result["wCnt"] += tLen

        if (!result["subInfo"][tzChap]) {
            result["subInfo"][tzChap] = {
                "matchPeo" : {},
                "noMatch" : [],
                "mCnt" : 0,
                "tCnt" : 0,
                "hisMatches" : {},
            };
        }
        if (mLen == 0) {
            result["subInfo"][tzChap]["noMatch"].push(`${person}###${did}`);
            continue;
        }
        result["subInfo"][tzChap]["matchPeo"][person] ={"mCnt" : mLen, "tCnt": tLen, "peoID" : did}
        result["subInfo"][tzChap]["mCnt"] += mLen
        result["subInfo"][tzChap]["tCnt"] += tLen
        Object.entries(matchJs).forEach(([hKey, info]) => {
            if (!result["hisChapLen"][info["name"]]) {result["hisChapLen"][info["name"]] = hisChLen[info["name"].replace('-', '#')]}
            var hisName = info["name"].split('-')[0]
            var chapName = info["name"].split('-')[1] 
            if (!result["subInfo"][tzChap]["hisMatches"][hisName]) {result["subInfo"][tzChap]["hisMatches"][hisName] = {"peoArr" : [], "mCnt" : 0, "chapInfo" : {}};}
            if (!result["subInfo"][tzChap]["hisMatches"][hisName]["chapInfo"][chapName]) {result["subInfo"][tzChap]["hisMatches"][hisName]["chapInfo"][chapName] = {"mCnt" : 0, "peoInfo" : {}};}
            result["subInfo"][tzChap]["hisMatches"][hisName]["chapInfo"][chapName]["peoInfo"][person] = {"mCnt" : info["count"], "tCnt" : tLen, "peoID" : did, "hisID" : hKey}
            result["subInfo"][tzChap]["hisMatches"][hisName]["chapInfo"][chapName]["mCnt"] += info["count"]
            result["subInfo"][tzChap]["hisMatches"][hisName]["mCnt"] += info["count"]
            if (!result["subInfo"][tzChap]["hisMatches"][hisName]["peoArr"].includes(person)) {result["subInfo"][tzChap]["hisMatches"][hisName]["peoArr"].push(person)}
        })

    }
    
    conn.end();
    return result
}
