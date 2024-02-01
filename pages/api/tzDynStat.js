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
        "hisChapLen" : {}         
    } 
    
    var sql = `SELECT chapter, chapter_number, name, word_count, ${cnt}, ${rela} FROM tongzhi WHERE dynasty = ?`;
    var qRes = await conn.promise().query(sql, [dyn])
    result["peoCnt"] = qRes[0].length
    for (let i = 0; i < qRes[0].length; i++) {
        var tzChap = `${qRes[0][i]['chapter']} ${qRes[0][i]['chapter_number']}`;
        var person = qRes[0][i]['name'];
        var tLen = qRes[0][i]['word_count'];
        var mLen = qRes[0][i][cnt];
        var matchJs = JSON.parse(qRes[0][i][rela]);

        result["mCnt"] += mLen
        result["wCnt"] += tLen

        if (!result[tzChap]) {
            result[tzChap] = {
                "matchPeo" : [],
                "noMatch" : []
            };
        }
        if (mLen == 0) {
            result[tzChap]["noMatch"].push(person);
            continue;
        }
        result[tzChap]["matchPeo"].push(`${person} (${mLen}/${tLen}字)`);
        Object.values(matchJs).forEach(info => {
            if (!result["hisChapLen"][info["name"]]) {result["hisChapLen"][info["name"]] = hisChLen[info["name"].replace('-', '#')]}
            var hisName = info["name"].split('-')[0]
            var chapName = info["name"].split('-')[1]
            if (!result[tzChap][hisName]) {result[tzChap][hisName] = {"people" : []};}
            if (!result[tzChap][hisName]["people"].includes(person)) {result[tzChap][hisName]["people"].push(person);}
            if (!result[tzChap][hisName][chapName]) {result[tzChap][hisName][chapName] = {};}
            result[tzChap][hisName][chapName][person] = mLen
        })

    }
    
    conn.end();
    return result
}
