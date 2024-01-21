const ms = require('mysql2') 
const conn = ms.createConnection({
    host: process.env.HOST,
    database: process.env.DATABASE,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    port: process.env.SQLPORT
})

export default async function subChaps(bookName, chapName, version) {
    
    var cnt = version === 'all' ? 'all_lap_length' : 'cut_lap_length';
    var relationTable = version === 'all' ? 'old_relations' : 'tongzhi_official_history_relations';
    var result = {}
    const tzList = ['本紀', '后妃', '世家', '列傳', '外戚傳', '忠義傳', '孝友傳', '獨行傳', '循吏傳', '酷吏傳', '儒林傳', '文苑傳',
                    '隠逸傳', '宦者傳', '游俠傳', '藝術傳', '佞幸傳', '列女傳', '載記','四夷']

    if (tzList.includes(chapName)) {
        var idToChap = await tool.idChapterList()
        var sql = 'SELECT chapter_number, DBID, dynasty, name, word_count, ' + cnt + ' FROM tongzhi WHERE chapter = ?'
        var qRes = await conn.promise().query(sql, [chapName])
        for (let i = 0; i < qRes[0].length; i++) {
            if (result[qRes[0][i]['chapter_number']] == null) {result[qRes[0][i]['chapter_number']] = {}}
            var tongid = qRes[0][i]['DBID']
            var matchsql = 'SELECT official_history_ID, match_word_count FROM ' + relationTable + ' WHERE tongzhi_ID = ?'
            var mRes = await conn.promise().query(matchsql, [tongid])
            var matchChapJs = {}
            for (let j = 0; j < mRes[0].length; j++) {
                var concatName = idToChap[str(mRes[0][j]['official_history_ID'])]['bname'] + ' ' + idToChap[str(mRes[0][j]['official_history_ID'])]['volu']
                matchChapJs[concatName] = [mRes[0][j]['match_word_count'], mRes[0][j]['official_history_ID']]
            }
            result[qRes[0][i]['chapter_number']][qRes[0][i]['name']] = {
                'tongID' : tongid,
                'dyna' : qRes[0][i]['dynasty'],
                'totalCnt' : qRes[0][i]['word_count'],
                'matchCnt' : qRes[0][i][cnt],
                'matchChaps' : matchChapJs,
            }
        }
    } else {
        var sql = 'SELECT DBID, word_count, ' + cnt + ' FROM official_history WHERE volumn = ? AND book_name = ?'
        var qRes = await conn.promise().query(sql, [chapName, bookName])
        var id = qRes[0]['DBID']

        var matchsql = 'SELECT tongzhi_ID, match_word_count FROM ' + relationTable + ' WHERE official_history_ID = ?'
        var mRes = await conn.promise().query(matchsql, [id])
        
        var matchChapJs = {}
        result[chapName] = {}

        var tzsql = 'SELECT chapter, chapter_number, dynasty, name, word_count FROM tongzhi WHERE DBID = ?'
        for (let i = 0; i < mRes[0].length; i++) {
            var tzid = mRes[0][i]['tongzhi_ID']
            var tRes = await conn.promise().query(tzsql, [tzid])
            var tzChap = tRes[0]['chapter'] + ' ' + tRes[0]['chapter_number']
            result[chapName][tRes[0]['name']] = {
                'tongID' : id,
                'dyna' : tRes[0]['dynasty'],
                'totalCnt' : tRes[0]['word_count'],
                'matchCnt' : qRes[0][cnt],
                'matchChaps' : {tzChap : [qRes[0][cnt], tzid]}
            }
        }
        
    }
    console.log(result)
    conn.end()
    return result
}