import * as React from "react"
import '@/app/globals.css'

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

 
const Statgeneral = (params) => {

  function changeHBTN(BTNID) {
    if (typeof document !== 'undefined') {
        const ele = document.getElementById(BTNID).children[1].children[2];
        ele.innerText = ele.innerText == String.fromCharCode(0x25B2) ? String.fromCharCode(0x25BC) : String.fromCharCode(0x25B2);
    }
  }
  
  var sortFunc = (a, b) => {return 0;};
  var tzSortFunc = (a, b) => {return 0;};

  if (params.method === "peo") {
    sortFunc = (a, b) => {return b[`peoCnt${params.version}`] - a[`peoCnt${params.version}`];};
    tzSortFunc = ([,a], [,b]) => {return Object.keys(b["matchPeo"]).length - Object.keys(a["matchPeo"]).length;};

  } else if (params.method === "word") {
    sortFunc = (a, b) => {return b[`mCnt${params.version}`] - a[`mCnt${params.version}`];};
    tzSortFunc = ([,a], [,b]) => {return b["mCnt"] - a["mCnt"];};
  }

  return (
      <div className = "block px-4 w-[74vw] mt-2">{
        params.tzbool ? 
        Object.entries(params.data["subInfo"]).sort(tzSortFunc).map(([key, value]) => (
          <Collapsible key = {`${key}0`} > 
            <CollapsibleTrigger asChild key = {`${key}1`}>
              <button key = {`${key}2`}  className="flex w-full px-2 py-1 border-b-2 border-sec justify-between outline-none hover:bg-minor/20" 
                        onClick = {() => changeHBTN(`HBTN${key}`)} id = {`HBTN${key}`}>
                <span key = {`${key}3`} className="inline-flex">
                    <p key = {`${key}4`} className="text-start self-center w-[10vw] text-xl">{`${key}`}</p>       
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
            <CollapsibleContent key = {`${key}9`} className="rounded block m-2 w-full bg-sec text-least">
              <div className = "w-full block py-2 pl-4 text-base">                  
                  <div key = {`${key}12`} className="text-lg px-2 border-l-2 border-minor">{`有比對結果之傳主 (${Object.keys(value["matchPeo"]).length}位) :`}</div>
                  <div key = {`${key}10`} className = "w-full inline-flex flex-wrap text-base">
                       { 
                        Object.entries(value["matchPeo"])
                          .sort(function ([,a], [,b]) {return b['mCnt'] - a['mCnt'];})
                          .map(([subKey, subValue]) => (
                            <p key = {`${key}13`} className="pl-4 pt-4 self-center"> {`${subKey} (${subValue['mCnt']} / ${subValue['tCnt']}字), `}</p>
                        ))}                     
                  </div>
              </div>
              <div key = {`${key}14`} className = "w-full mt-2 block py-2 pl-4 text-base">
                <p key = {`${key}15`} className = "text-lg border-l-2 border-minor pl-2">{`無比對結果之傳主 :`}</p>
                <p key = {`${key}16`} className = "pl-4 pt-4">{value["noMatch"].map(per => (`${per} / `))}</p>
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))   
          :
          
          Object.values(params.data).sort(sortFunc).map(val => (
            <div key = {val['name'] +'0'} className="justify-between inline-flex w-full pt-4 p-2 border-b-2 border-sec hover:bg-minor/20">
              <p key = {val['name']} className="w-[50vw] text-xl">{val['name']}</p>
              <div key = {val['name']+'1'} className="w-[18vw] justify-between inline-flex">
                <p key = {val['name'] +'2'} className="w-[4vw] text-start text-base">{`${val[`peoCnt${params.version}`]}位傳主`}</p>
                <p key = {val['name'] +'3'} className="w-[14vw] text-end text-base">{`比對到${val[`mCnt${params.version}`]}字 / 共${val['wCnt']}字`}</p>
              </div>
            </div>                
            ))}
        </div>
    );
}

export default Statgeneral;
