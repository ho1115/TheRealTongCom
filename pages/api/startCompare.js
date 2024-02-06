function padRatio(strA, strB, dp) {
    const lenB = strB.length;
    const lenA = strA.length;

    dp[0].push(lenB);

    for (let i = 1; i <= lenA; i++) {
        if (strA[i - 1] === strB[lenB-1]) {dp[i].push(dp[i-1][lenB-1]);} 
        else {dp[i].push(1 + Math.min(dp[i - 1][lenB], dp[i][lenB - 1], dp[i - 1][lenB - 1]));}
    }

    return (1 - dp[lenA][lenB] / lenB);
}

function LevDistRatio(strA, strB, dp, mlen) {
    let lenA = strA.length;
    let lenB = strB.length;

    if (mlen > 4) {

        dp[0].push(lenB);

        for (let i = 1; i < lenA; i++) {
            if (strA[i - 1] === strB[lenB - 1]) {dp[i].push(dp[i - 1][lenB - 1]);} 
            else {dp[i].push(1 + Math.min(dp[i - 1][lenB], dp[i][lenB - 1], dp[i - 1][lenB - 1]));}
        }

        dp.push(new Array(lenB + 1).fill(lenA));

        for (let i = 1; i <= lenB; i++) {
            if (strB[i - 1] === strA[lenA - 1]) {dp[lenA][i] = dp[lenA - 1][i - 1];} 
            else {dp[lenA][i] = 1 + Math.min(dp[lenA - 1][i], dp[lenA][i - 1], dp[lenA - 1][i - 1]);}
        }
    }

    return (1 - dp[lenA][lenB] / lenB);
}

function expandMatch(indexA, indexB, refList, targList, matchList) {
    const minMatchLength = 10;
    const simRatio = 0.7;

    var matchLength = 4;
    var strA = refList['clearedText'].substring(indexA, indexA + matchLength);
    var strB = targList['clearedText'].substring(indexB, indexB + matchLength);
    var dp = Array.from({ length: strA.length + 1 }, () => new Array(strB.length + 1).fill(0));
    
    for (let i = 0; i <= strA.length; i++) {dp[i][0] = i;}
    for (let j = 0; j <= strB.length; j++) {dp[0][j] = j;}

    for (let i = 1; i <= strA.length; i++) {
        for (let j = 1; j <= strB.length; j++) {
            if (strA[i - 1] === strB[j - 1]) {dp[i][j] = dp[i - 1][j - 1];} 
            else {dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);}
        }
    }

    let strikes = 0;
    
    if (LevDistRatio(strA, strB, dp, 0) < simRatio) {return;}

    for (let match of matchList) {
        if ((indexA >= match.indexA && indexA < match.indexA + match.len) 
            || (indexB >= match.indexB && indexB < match.indexB + match.len)) {return;}
    }
    

    let decreaseInARow = 0;
    let curRatio = 0;
    let preRatio = 0;

    while (strikes < 3 && decreaseInARow < 6) {
        curRatio = LevDistRatio(strA, strB, dp, matchLength);

        strikes = curRatio < simRatio ? strikes + 1 : 0;
        decreaseInARow = curRatio < preRatio ? decreaseInARow + 1 : 0;
        
        matchLength += 1;
        if ((indexA + matchLength > refList['clearedText'].length) 
            || (indexB + matchLength > targList['clearedText'].length)) {break;}

        strA = refList['clearedText'].substring(indexA, indexA + matchLength);
        strB = targList['clearedText'].substring(indexB, indexB + matchLength);
        preRatio = curRatio;

    }

    matchLength = strikes === 3 ? matchLength - strikes - 1 : matchLength - decreaseInARow - 1
    
    strA = refList['clearedText'].substring(indexA, indexA + matchLength);
    strB = targList['clearedText'].substring(indexB, indexB + matchLength);

    let back = 0;

    while (strB.length > back && dp[strA.length][strB.length - 1 - back] < dp[strA.length][strB.length - back]) {back += 1;}

    let padding = 1;

    preRatio = LevDistRatio(strA, strB, dp, matchLength);
    strB = targList['clearedText'].substring(indexB, indexB + matchLength + padding);
    curRatio = padRatio(strA, strB, dp);

    while (back === 0 && indexB + matchLength + padding <= targList['clearedText'].length && curRatio >= preRatio) {
        padding += 1;
        strB = targList['clearedText'].substring(indexB, indexB + matchLength + padding);
        preRatio = curRatio;
        curRatio = padRatio(strA, strB, dp);
    }

    padding -= (1 + back);
    
    if (matchLength < minMatchLength) {return;}
   
    matchList.push({
        'len': matchLength,
        'indexA': indexA,
        'indexB': indexB,
        'padding': padding
    });
}

function removeSymbol(text) {
    const chars = "[]。『』「」，《》：？；,!?〈〉、！﹔（）〔〕＾＂";
    for (let i = 0; i < chars.length; i++) {
        const c = chars[i];
        text = text.split(c).join("");
    }
    text = text.replace(/\n/g, "");
    text = text.replace(/\t/g, "");
    text = text.replace(/\r/g, "");
    text = text.replace(/\v/g, "");
    text = text.replace(/\f/g, "");
    text = text.replace(/ /g, "");
    return text;
}

function checkTotalLength(matchInfo, maxLength) {
    let totalLength = 0;
    let array = new Array(maxLength + 1).fill(0);
    matchInfo.forEach(sentence => {for (let j = sentence.indexA; j < sentence.indexA + sentence.len; j++) {array[j] = 1;}});
    totalLength = array.filter(value => value === 1).length;
    return totalLength;
}

function createIndexMapping(rawText, clearText) {
    let indexMapping = [];
    let clearTextIndex = 0;
    rawText.split('').forEach((char, rawTextIndex) => {
        if (clearTextIndex < clearText.length && char === clearText[clearTextIndex]) {
            indexMapping.push(rawTextIndex);
            clearTextIndex++;
        }
    });
    return indexMapping;
}

function compare(dictA, dictB, refList, targList , matchList) {
    
    var commonKeys = []
    for (let k of Object.keys(dictB)) {
        if (dictA.hasOwnProperty(k)) {commonKeys.push(k)}
    }

    commonKeys.sort((a, b) => {return dictA[a][0] - dictA[b][0];})
    
    if (commonKeys.length == 0) {return 'fail';}
        
    for (let k = 0; k < commonKeys.length; k++) {
        var indexesA = dictA[commonKeys[k]]
        var indexesB = dictB[commonKeys[k]]
        for (let i of indexesA) {
            for (let j of indexesB) {
                expandMatch(i, j, refList, targList, matchList);
            }
        }
    }
    var temp_list = [] 
    if (matchList.length > 0) {
        matchList.sort((a, b) => {return a['indexA'] - b['indexA']})
        for (let i = 0; i < matchList.length; i++)  { 
            var matchSentenceBegin = matchList[i]['indexA']
            var matchSentenceEnd = matchList[i]['indexA'] + matchList[i]['len']
            var overlap = false
            for (let j = 0; j < i; j++) {
                var preSentenceBegin = matchList[j]['indexA']
                var preSentenceEnd = matchList[j]['indexA'] + matchList[j]['len']
                if (preSentenceBegin<=matchSentenceBegin &&
                    matchSentenceBegin<=preSentenceEnd && 
                    preSentenceBegin<=matchSentenceEnd &&
                    matchSentenceEnd<=preSentenceEnd) {
                    overlap = true
                    break
                }
            }
            if (!overlap) {temp_list.push(matchList[i])}
        }     
        
        matchList = temp_list
        var preSentence = null
        Object.entries(matchList).forEach(([index, matchSentence]) => {
            if (preSentence) {
                var preSentenceEnd = preSentence['indexA']+preSentence['len']
                var matchSentenceEnd = matchSentence['indexA']+matchSentence['len']
                if (matchSentence['indexA']< preSentenceEnd && matchSentenceEnd>preSentenceEnd) {
                    matchList[index-1]['len']  = matchSentence['indexA'] - preSentence['indexA']
                }
            }
            preSentence = matchSentence
        })
    }
    return matchList
}

function make4gram (text) {
    var grams = {}
    for (let i = 0; i < text.length-3; i++) {
        var fgram = text.substring(i, i+4)
        if (!grams.hasOwnProperty(fgram)) {grams[fgram] = []}
        grams[fgram].push(i)
    }
    return grams
}

export default function textCompare(tonchiContent, historyContent) {

    // if (tonchiContent.length > 30000 || historyContent.length > 30000) {return "error:tooLong"}
    if (tonchiContent.length < 10 || historyContent.length < 10) {return "error:tooShort"}

    const clearT = removeSymbol(tonchiContent)
    const clearH = removeSymbol(historyContent)
    const dictB = make4gram(clearH)
    const dictA = make4gram(clearT)

    var matchList = []
    var matchListRawText = []
    var refList = {}
    var targList = {}

    refList = {
        'clearedText' : clearT,
        'rawText':tonchiContent,
        'index_mapping':createIndexMapping(tonchiContent, clearT)
    }

    targList = {
        'clearedText' : clearH,
        'rawText':historyContent,
        'index_mapping':createIndexMapping(historyContent, clearH)
    }

    matchList = compare(dictA, dictB, refList, targList , matchList)
    if (matchList === "fail") {return "noRes"}
    
    for (let rValue of matchList) {         
        var indexA = refList['index_mapping'][rValue['indexA']]
        var indexAend =  refList['index_mapping'][rValue['indexA']+rValue['len']-1]
        var lenA = indexAend - indexA + 1
        var indexB = targList['index_mapping'][rValue['indexB']]
        var indexBend = targList['index_mapping'][rValue['indexB']+rValue['len']-1]
        var lenB = indexBend - indexB + 1 + rValue['padding']
        matchListRawText.push({
            'tonchi_index':indexA,
            'tonchi_length':lenA,
            'history_index':indexB,
            'history_length':lenB
        })
        
    }

    var textLen = refList['clearedText'].length
    var length = matchList.length > 0 ? checkTotalLength(matchList, textLen) : 0
    var newTextLen = targList['clearedText'].length

    var returnJs = {
        'match_info':{},
        'match_word_count':0,
        'word_count':newTextLen
    }
    
    if (matchListRawText.length > 0) {
        returnJs = {
            'match_info':matchListRawText,
            'match_word_count':length,
            'word_count':newTextLen
        }
    } else {return "noRes"}

    var result = {}
    result['matchArrs'] =  returnJs['match_info'];

    var TLptr = 0
    var TRptr = 0
    var cnt = 0
    var HLptr = 0
    var HRptr = 0
    
    
    result['tongTextN'] = {};
    result['tongTextY'] = {};
    result['tongLen'] =  tonchiContent.length
    result['tongName'] =  "比對文字(一)";

    result['hisTextN'] = {};
    result['hisTextY'] = {};

    result['matchArrs'].sort(function(a, b) {return a.tonchi_index - b.tonchi_index}).forEach(element => {
        TRptr = element['tonchi_index']
        result['tongTextN'][cnt] = tonchiContent.substring(TLptr, TRptr);
        TLptr = TRptr;
        TRptr += element['tonchi_length'];
        result['tongTextY'][cnt] = {'para' : tonchiContent.substring(TLptr, TRptr), 'spanID' : `${element['tonchi_index']}#${element['history_index']}`};
        TLptr = TRptr;
        cnt += 1;
    });
    result['tongTextTail'] = tonchiContent.substring(TLptr, tonchiContent.length);

    cnt = 0

    result['matchArrs'].sort(function(a, b) {return a.history_index - b.history_index}).forEach(element => {
        HRptr = element['history_index']
        result['hisTextN'][cnt] = historyContent.substring(HLptr, HRptr);
        HLptr = HRptr;
        HRptr += element['history_length'];
        result['hisTextY'][cnt] = {'para' : historyContent.substring(HLptr, HRptr), 'spanID' : `${element['tonchi_index']}#${element['history_index']}`};
        HLptr = HRptr;
        cnt += 1;
    });    
    result['hisTextTail'] = historyContent.substring(HLptr, historyContent.length);

    cnt = 0

    result['hisLen'] =  historyContent.length;
    result['hisName'] =  "比對文字(二)";

    return result
}