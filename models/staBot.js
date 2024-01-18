const ms = require('mysql2');
const conn = ms.createConnection({
    host: process.env.HOST,
    database: process.env.DATABASE,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    port: process.env.SQLPORT
});
let tool = require('util') 
tool = new tool()

class staticRobot {

    async tzDyna() {
        var list = {};
        var sql = 'SELECT dynasty, COUNT(dynasty) AS cnt FROM tongzhi GROUP BY dynasty;';
        const qRes = await conn.promise().query(sql);
        for (let i = 0; i < qRes[0].length; i++) {list[qRes[0][i]['dynasty']] = qRes[0][i]['cnt']};
        conn.end();
        console.log(list);                   
        return list;
    }

    async tzChap() {
        var list = {};
        var sql = 'SELECT DISTINCT chapter_number AS sub, chapter FROM tongzhi';
        const qRes = await conn.promise().query(sql);
        for (let i = 0; i < qRes[0].length; i++) {
            if (list[qRes[0][i]['chapter']] == null) {list[qRes[0][i]['chapter']] = []};
            list[qRes[0][i]['chapter']].push(qRes[0][i]['sub']);
        }
        conn.end();
        console.log(list);                  
        return list;
    }

    async tzChapData(chapName, version) {
        var idToChap = await tool.idChapterList()
        var result = {
            'chapName' : chapName,
            'peopleGeneralData': {},
            'dataByChap':{}
        };
        var chap = chapName.split('@');
        var cntType = version === 'all' ? all_lap_length : cut_lap_length;
        var relationTable = version === 'all' ? 'old_relations' : 'tongzhi_official_history_relations';

        var sql = 'SELECT name, word_count, DBID, dynasty, ' + cntType + ' FROM tongzhi where chapter = ? AND chapter_number = ?';
        const qRes = await conn.promise().query(sql, [chap[0], chap[1]]);

        var csql = 'SELECT official_history_ID AS hid, match_word_count AS mcnt FROM ' + relationTable + ' where tongzhi_ID = ?'
        var cRes;
        for (let i = 0; i < qRes[0].length; i++) {
            var dyna = qRes[0][i]['dynasty'];
            var wordLen = qRes[0][i]['word_count'];
            var matchLen = qRes[0][i][cntType];
            var peopleName = qRes[0][i]['name'];
            var tid = qRes[0][i]['DBID'];
            if (result['peopleGeneralData'][dyna] == null) {result['peopleGeneralData'][dyna] = {}};
            if (result['dataByChap'][dyna] == null) {result['dataByChap'][dyna] = {}};
            result['peopleGeneralData'][dyna][peopleName] = [wordLen, matchLen];
            cRes = await conn.promise().query(csql, [tid]);
            for (let j = 0; j < cRes[0].length; j++) {
                var hisId = cRes[0][j]['hid']
                var hisName = idToChap[hisId]['bname'];
                var volumn = idToChap[hisId]['volu'];
                var hisLen = idToChap[hisId]['len'];
                if (result['dataByChap'][dyna][hisName] == null) {result['dataByChap'][dyna][hisName] = {}};
                if (result['dataByChap'][dyna][hisName][volumn] == null) {result['dataByChap'][dyna][hisName][volumn] = {
                    'peopleData' : {},
                    'hisLen' : hisLen,
                    'hisMatchLen' : idToChap[hisId][cntType],
                }};
                result['dataByChap'][dyna][hisName][volumn]['peopleData'][peopleName] = cRes[0][j]['mcnt'];
            }
        }
        
        conn.end();
        console.log(result);
        return result;
    }

    async tzDynaData(targetDyna, version) {
        var idToChap = await tool.idChapterList()
        var result = {
            'dyna' : targetDyna,
            'peopleGeneralData': {},
            'dataByDyna':{}
        };
    
        var cntType = version === 'all' ? all_lap_length : cut_lap_length;
        var relationTable = version === 'all' ? 'old_relations' : 'tongzhi_official_history_relations';

        var sql = 'SELECT name, word_count, DBID, chapter, chapter_number, ' + cntType + ' FROM tongzhi where dynasty = ?';
        const qRes = await conn.promise().query(sql, [targetDyna]);

        var csql = 'SELECT official_history_ID AS hid, match_word_count AS mcnt FROM ' + relationTable + ' where tongzhi_ID = ?'
        var cRes;
        for (let i = 0; i < qRes[0].length; i++) {
            var chapName = qRes[0][i]['chapter'] + ' ' + qRes[0][i]['chapter_number'];
            var wordLen = qRes[0][i]['word_count'];
            var matchLen = qRes[0][i][cntType];
            var peopleName = qRes[0][i]['name'];
            var tid = qRes[0][i]['DBID'];
            if (result['peopleGeneralData'][chapName] == null) {result['peopleGeneralData'][chapName] = {}};
            if (result['dataByDyna'][chapName] == null) {result['dataByDyna'][chapName] = {}};
            result['peopleGeneralData'][chapName][peopleName] = [wordLen, matchLen];
            cRes = await conn.promise().query(csql, [tid]);
            for (let j = 0; j < cRes[0].length; j++) {
                var hisId = cRes[0][j]['hid']
                var hisName = idToChap[hisId]['bname'];
                var volumn = idToChap[hisId]['volu'];
                var hisLen = idToChap[hisId]['len'];
                if (result['dataByChap'][chapName][hisName] == null) {result['dataByChap'][chapName][hisName] = {}};
                if (result['dataByChap'][chapName][hisName][volumn] == null) {result['dataByChap'][chapName][hisName][volumn] = {
                    'peopleData' : {},
                    'hisLen' : hisLen,
                    'hisMatchLen' : idToChap[hisId][cntType],
                }};
                result['dataByChap'][chapName][hisName][volumn]['peopleData'][peopleName] = cRes[0][j]['mcnt'];
            }
        }
        
        conn.end();
        console.log(result);
        return result;
    }

    async hisData(bookName, volumn, version) {
        var result = {
            'peopleCnt' : 0,
            'wordCnt': 0,
            'matchCnt': 0,
            'tzChaps': {}
        };
    
        var cntType = version === 'all' ? all_lap_length : cut_lap_length;
        var relationTable = version === 'all' ? 'old_relations' : 'tongzhi_official_history_relations';
        var sql = 'SELECT word_count, DBID, ' + cntType + ' FROM official_history where book_name = ? AND volumn = ?';
        var qRes = await conn.promise().query(sql, [bookName, volumn]);

        result['wordCnt'] = qRes[0]['word_count'];
        result['matchCnt'] = qRes[0][cntType];

        var hisId = qRes[0]['DBID'];

        sql = 'SELECT tongzhi_ID AS tid, match_word_count AS mcnt FROM ' + relationTable + ' where official_history_ID = ?'
        qRes = await conn.promise().query(sql, [hisId]);

        var tzsql = 'SELECT name, chapter, chapter_number, word_count, DBID, ' + cntType + 'FROM tongzhi where DBID = ?'
        var tzRes;
        for (let i = 0; i < qRes[0].length; i++) {
            tzRes = await conn.promise().query(tzsql, [qRes[0][i]['DBID']]);
            var chapName = tzRes[0][i]['chapter'] + ' ' + tzRes[0][i]['chapter_number'];
            var wordLen = tzRes[0][i]['word_count'];
            var matchLen = tzRes[0][i][cntType];
            var peopleName = tzRes[0][i]['name'];
            result['peopleCnt']++;
            if (result['tzChaps'][chapName] == null) {
                result['tzChaps'][chapName] = {
                    'peopleCnt' : 0,
                    'wordCnt': 0
                }
            };
            result['tzChaps'][chapName][peopleName] = [wordLen, matchLen];
            result['tzChaps'][chapName]['peopleCnt']++;
            result['tzChaps'][chapName]['wordCnt'] += wordLen;
        }
        conn.end();
        console.log(result);
        return result;
    }

    async hisGeneral(bookName, version) {
        var result = {};
    
        var cntType = version === 'all' ? all_lap_length : cut_lap_length;
        var relationTable = version === 'all' ? 'old_relations' : 'tongzhi_official_history_relations';
        var sql = 'SELECT volumn, word_count, DBID, ' + cntType + ' FROM official_history where book_name = ?';
        var qRes = await conn.promise().query(sql, [bookName]);
        sql = 'SELECT tongzhi_ID AS tid, match_word_count AS mcnt FROM ' + relationTable + ' where official_history_ID = ?';
        var vRes;
        for (let i = 0; i < qRes[0].length; i++) {    
            var hisVol = qRes[0][i]['volumn'];
            var hisId = qRes[0][i]['DBID'];
            if (result[hisVol] == null) {
                result[hisVol] = {
                    'peopleCnt' : 0,
                    'wordCnt': qRes[0][i]['word_count'],
                    'matchCnt': qRes[0][i][cntType],
                    'tzChaps': {}
                }
            } 
            vRes = await conn.promise().query(sql, [hisId]);
            var tzsql = 'SELECT name, chapter, chapter_number, word_count, DBID, ' + cntType + 'FROM tongzhi where DBID = ?'
            var tzRes;
            for (let j = 0; j < vRes[0].length; j++) {
                tzRes = await conn.promise().query(tzsql, [vRes[0][j]['DBID']]);
                var chapName = tzRes[0][j]['chapter'] + ' ' + tzRes[0][j]['chapter_number'];
                var wordLen = tzRes[0][j]['word_count'];
                var matchLen = tzRes[0][j][cntType];
                var peopleName = tzRes[0][j]['name'];
                result[hisVol]['peopleCnt']++;
                if (result[hisVol]['tzChaps'][chapName] == null) {
                    result[hisVol]['tzChaps'][chapName] = {
                        'peopleCnt' : 0,
                        'wordCnt': 0
                    }
                };
                result[hisVol]['tzChaps'][chapName][peopleName] = [wordLen, matchLen];
                result[hisVol]['tzChaps'][chapName]['peopleCnt']++;
                result[hisVol]['tzChaps'][chapName]['wordCnt'] += wordLen;
            }
        }
        conn.end();
        console.log(result);
        return result;
    }

}

module.exports = staticRobot;