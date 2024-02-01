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
        "hisChapLen" : {}
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

        if (!result[dyna]) {
            result[dyna] = {
                "matchPeo" : [],
                "noMatch" : []
            };
        }
        if (mLen == 0) {
            result[dyna]["noMatch"].push(person);
            continue;
        }
        result[dyna]["matchPeo"].push(`${person} (${mLen}/${tLen}字)`);
        Object.values(matchJs).forEach(info => {
            if (!result["hisChapLen"][info["name"]]) {result["hisChapLen"][info["name"]] = hisChLen[info["name"].replace('-', '#')]}
            var hisName = info["name"].split('-')[0]
            var chapName = info["name"].split('-')[1]
            if (!result[dyna][hisName]) {result[dyna][hisName] = {"people" : []};}
            if (!result[dyna][hisName]["people"].includes(person)) {result[dyna][hisName]["people"].push(person)}
            if (!result[dyna][hisName][chapName]) {result[dyna][hisName][chapName] = {};}
            result[dyna][hisName][chapName][person] = mLen
        })

    }
    
    conn.end();
    return result
}
