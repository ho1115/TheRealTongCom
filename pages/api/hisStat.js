const ms = require('mysql2')
import tzPL from "@/jsonBase/tzPeoList.json"

export default async function hisStat(bn, cn, version) {

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
              
    } 
    var sql;
    var qRes;
    if (cn == 'allChaps') {
        sql = `SELECT word_count, ${cnt}, ${rela} FROM official_history WHERE book_name = ?`;
        qRes = await conn.promise().query(sql, [bn])
    }
    else {
        sql = `SELECT word_count, ${cnt}, ${rela} FROM official_history WHERE book_name = ? AND volumn = ?`;
        qRes = await conn.promise().query(sql, [bn, cn])
    }

    for (let i = 0; i < qRes[0].length; i++) {

        var matchJs = JSON.parse(qRes[0][i][rela]);

        Object.values(matchJs).forEach(info => {
            var tzChap = `${info["name"].split(' ')[0]} ${info["name"].split(' ')[1]}`
            var person = info["name"].split(' ')[3]
            var mLen = info["matchCount"]
            var tLen = info["totalCount"]
            if (!result[tzChap]) {result[tzChap] = {};}
            if (!result[tzChap][person]) {
                result[tzChap][person] = {
                    "mCnt" : 0,
                    "wCnt" : tLen
                };}
            result[tzChap][person]["mCnt"] += mLen
        })
    }
    Object.entries(result).forEach(([key, value]) => {
        if (!result[key]['noMatch']) {result[key]['noMatch'] = tzPL[key];}
        Object.keys(value).forEach(subKey => {
            const ind = result[key]['noMatch'].indexOf(subKey)
            result[key]['noMatch'] = result[key]['noMatch'].splice(ind, 1)
        })

    })
    conn.end();
    return result
}