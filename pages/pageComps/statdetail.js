import * as React from "react"
import '@/app/globals.css'

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
  } from "@/components/ui/collapsible"

const Statdetail = (params) => {

    function changeHBTN(BTNID) {
        if (typeof document !== 'undefined') {
            const ele = document.getElementById(BTNID).children[1].children[2];
            ele.innerText = ele.innerText == String.fromCharCode(0x25B2) ? String.fromCharCode(0x25BC) : String.fromCharCode(0x25B2);
        }
      }

    function changeGBTN(BTNID) {
        if (typeof document !== 'undefined') {
            const ele = document.getElementById(BTNID)
            ele.innerText = ele.innerText == String.fromCharCode(0x25B2) ? String.fromCharCode(0x25BC) : String.fromCharCode(0x25B2);
        }
    }

    var sortFunc = (a, b) => {return 0;};
    var tzSortFunc = (a, b) => {return 0;};
    var tzBookSortFunc = (a, b) => {return 0;}
    var tzBChapSortFunc = (a, b) => {return 0;}
   

    if (params.method === "peo") {
        sortFunc = ([,a], [,b]) => {return b["pCnt"] - a["pCnt"];};
        tzSortFunc = ([,a], [,b]) => {return Object.keys(b["matchPeo"]).length - Object.keys(a["matchPeo"]).length;};
        tzBookSortFunc = ([,a], [,b]) => {return b["peoArr"].length - a["peoArr"].length;};
        tzBChapSortFunc = ([,a], [,b]) => {return Object.keys(b["peoInfo"]).length - Object.keys(a["peoInfo"]).length;};
    }
    else if (params.method === "word") {
        sortFunc = ([,a], [,b]) => {return b['mCnt'] - a['mCnt'];};
        tzSortFunc = ([,a], [,b]) => {return b["mCnt"] - a["mCnt"];};
        tzBookSortFunc = ([,a], [,b]) => {return b["mCnt"] - a["mCnt"];};
        tzBChapSortFunc = ([,a], [,b]) => {return b["mCnt"] - a["mCnt"];};
       
    }
    
    return (
        <div className = "block px-4 w-[74vw] mt-2">{
            params.tzbool ? <React.Fragment key = "????"> 
                <Collapsible key = "gene0" > 
                  <CollapsibleTrigger asChild key = "gene1">
                    <button key = "gene2"  className="flex w-full px-2 py-1 border-b-2 border-sec justify-between outline-none hover:bg-minor/20" 
                              onClick = {() => changeGBTN("genebtn")} >
                      <span key = "gene3" className="inline-flex justify-between w-full">
                          <p key = "gene4" className="text-start self-center w-[10vw] text-2xl">資訊總覽</p>          
                          <p key = "gene5" className = "text-start self-center text-lg ml-2 w-[1vw] text-minor" id = "genebtn">&#9660;</p>
                      </span>
                    </button>
                  </CollapsibleTrigger>        
                  <CollapsibleContent key = "gene0" className="rounded block m-2 w-full text-least">
                    {Object.entries(params.data).sort(sortFunc).map(([historyName, historyInfo]) => (
                        <React.Fragment key = {`${historyName}**0`}><div key = {`${historyName}**20`} className = "w-full block py-2 pl-4 text-base">                  
                            <div key = {`${historyName}**1`} className="text-xl px-2 mb-2 border-l-2 border-minor inline-flex">
                                <p key = {`${historyName}**2`}>{historyName}</p>
                                <p key = {`${historyName}**3`} className = "pl-4">{`${historyInfo["pCnt"]}位傳主 共比對${historyInfo["mCnt"]}字 :`}</p>
                            </div>
                            <div key = {`${historyName}**4`} className = "w-full block flex-wrap py-2 text-base">
                                { 
                                Object.entries(historyInfo["hisSubChaps"])
                                    .sort(tzBChapSortFunc)
                                    .map(([chapKey, chapValue]) => (
                                  <div key = {`${historyName}-${chapKey}##`} className="p-2 self-center mb-4 bg-sec/40 rounded">
                                    <div key = {`${chapKey}##1`} className = "inline-flex w-full justify-between pl-2 pb-2 border-b-2 border-minor/50 text-lg">
                                        <p key = {`${chapKey}##2`}>{chapKey}</p>
                                        <p key = {`${chapKey}##3`} className = "pl-4">{`${Object.keys(chapValue["peoInfo"]).length}位傳主 / 
                                                                ${chapValue["mCnt"]}比對字數 / 
                                                                ${params.postdata["hisChapLen"][`${historyName}-${chapKey}`]}章節總字數`}
                                        </p>
                                    </div>
                                    <div key = {`${chapKey}##4`} className = "pl-4 pt-4 inline-flex flex-wrap">
                                        {Object.entries(chapValue["peoInfo"]).sort(function ([,a], [,b]) {return b['mCnt'] - a['mCnt'];}).map(([pName, pInfo]) => (
                                        <p key = {`${pName}##5`}className="pl-4 pb-2 self-center">{` ${pName} (${pInfo['mCnt']} / ${pInfo["tCnt"]}字), `}</p>
                                        ))}
                                    </div>
                                  </div>
                                ))}                     
                            </div>
                        </div></React.Fragment>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
                {Object.entries(params.postdata["subInfo"]).sort(tzSortFunc).map(([key, value]) => (
                <Collapsible key = {`${key}0`} > 
                  <CollapsibleTrigger asChild key = {`${key}1`}>
                    <button key = {`${key}2`}  className="flex w-full px-2 py-1 border-b-2 border-sec justify-between outline-none hover:bg-minor/20" 
                              onClick = {() => changeHBTN(`HBTN${key}`)} id = {`HBTN${key}`}>
                      <span key = {`${key}3`} className="inline-flex">
                          <p key = {`${key}4`} className="text-start self-center w-[10vw] text-2xl">{`${key}`}</p>       
                      </span>
                      <span key = {`${key}5`} className = "inline-flex">
                          <p key = {`${key}6`} className = "text-start self-center text-base">
                                  {`${Object.keys(value['matchPeo']).length}位比對傳主 / ${Object.keys(value['matchPeo']).length + value['noMatch'].length}全部傳主`}
                          </p>
                          <p key = {`${key}7`} className="w-[16vw] text-end text-base">{`比對到${value['mCnt']}字 / 共${value['tCnt']}字`}</p>               
                          <p key = {`${key}8`} className = "text-start self-center text-lg ml-2 w-[1vw] text-minor">&#9660;</p>
                      </span>
                    </button>
                  </CollapsibleTrigger>        
                  <CollapsibleContent key = {`${key}9`} className="rounded block m-2 w-full text-least">
                    {Object.entries(value["hisMatches"]).sort(tzBookSortFunc).map(([historyName, historyInfo]) => (
                        <React.Fragment key = {`${historyName}#0`}><div key = {`${historyName}20`} className = "w-full block py-2 pl-4 text-base">                  
                            <div key = {`${historyName}12`} className="text-xl px-2 border-l-2 mb-2 border-minor inline-flex">
                                <p key = {`${historyName}21`}>{historyName}</p>
                                <p key = {`${historyName}22`} className = "pl-4">{`${historyInfo["peoArr"].length}位傳主 共比對${historyInfo["mCnt"]}字 :`}</p>
                            </div>
                            <div key = {`${historyName}10`} className = "w-full block flex-wrap py-2 text-base">
                                { 
                                Object.entries(historyInfo["chapInfo"])
                                    .sort(tzBChapSortFunc)
                                    .map(([chapKey, chapValue]) => (
                                  <div key = {`${key}-${chapKey}`} className="p-2 self-center mb-4 bg-sec/40 rounded">
                                    <div key = {`${chapKey}23`} className = "inline-flex w-full justify-between pl-2 pb-2 border-b-2 border-minor/50 text-lg">
                                        <p key = {`${chapKey}24`}>{chapKey}</p>
                                        <p key = {`${chapKey}25`} className = "pl-4">{`${Object.keys(chapValue["peoInfo"]).length}位傳主 / 
                                                                ${chapValue["mCnt"]}比對字數 / 
                                                                ${params.postdata["hisChapLen"][`${historyName}-${chapKey}`]}章節總字數`}
                                        </p>
                                    </div>
                                    <div key = {`${chapKey}26`} className = "pl-4 pt-4 inline-flex flex-wrap">
                                        {Object.entries(chapValue["peoInfo"]).sort(function ([,a], [,b]) {return b['mCnt'] - a['mCnt'];}).map(([pName, pInfo]) => (
                                        <p key = {`${pName}`}className="pl-4 pb-2 self-center">{` ${pName} (${pInfo['mCnt']} / ${pInfo["tCnt"]}字), `}</p>
                                        ))}
                                    </div>
                                  </div>
                                ))}                     
                            </div>
                        </div></React.Fragment>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              ))}</React.Fragment> 

            : 
            
            Object.entries(params.data).sort(sortFunc).map(([key, value]) => (
            <Collapsible key = {`${key}0`}>
                <CollapsibleTrigger asChild key = {`${key}1`}>
                    <button key = {`${key}2`}  className="flex w-full px-2 pb-1 border-b-2 border-sec justify-between outline-none hover:bg-minor/20" 
                            onClick = {() => changeHBTN(`HBTN${key}`)} id = {`HBTN${key}`}>
                        <span key = {`${key}3`} className="inline-flex">
                          <p key = {`${key}4`} className="text-start self-center w-[10vw] text-2xl">{key}</p>       
                        </span>
                        <span key = {`${key}5`} className = "inline-flex">
                          <p key = {`${key}6`} className = "text-start self-center text-base">
                            {`${value['pCnt']}位比對傳主 / ${value['pCnt'] + value['npCnt']}全部傳主`}
                          </p>
                          <p key = {`${key}7`} className="w-[14vw] text-end text-base">{`比對到${value['mCnt']}字 / 共${value['tCnt']}字`}</p>               
                          <p key = {`${key}8`} className = "text-start self-center text-lg ml-2 w-[1vw] text-minor">&#9660;</p>
                        </span>
                    </button>
                </CollapsibleTrigger>
                <CollapsibleContent key = {`${key}9`} className="rounded block m-2 w-full bg-sec text-least">
                    <div className = "w-full block py-2 pl-4 text-base">                  
                        <div key = {`${key}12`} className="text-lg px-2 border-l-2 border-minor">{`有比對結果之傳主 (${Object.keys(params.postdata[key][["pInfo"]]).length}位) :`}</div>
                        <div key = {`${key}10`} className = "w-full inline-flex flex-wrap text-base">
                            { 
                                Object.entries(params.postdata[key][["pInfo"]])
                                .sort(function ([,a], [,b]) {return b['mCnt'] - a['mCnt'];})
                                .map(([subKey, subValue]) => (
                                    <p key = {`${key}13`} className="pl-4 pt-4 self-center"> {`${subKey} (${subValue['mCnt']}/ ${subValue['wCnt']}字),`}</p>
                            ))}                     
                        </div>
                    </div>
                    <div key = {`${key}14`} className = "w-full mt-2 block py-2 pl-4 text-base">
                        <p key = {`${key}15`} className = "text-lg border-l-2 border-minor pl-2">{`無比對結果之傳主 :`}</p>
                        <p key = {`${key}16`} className = "pl-4 pt-4">{Object.values(params.postdata[key]["noMatch"]).map(per => (`${per} / `))}</p>
                    </div>
                </CollapsibleContent>     
            </Collapsible>
        ))}
        </div>
    );
}

export default Statdetail;
