import Topnav from "@/pages/pageComps/topnav"
import Hislist from "@/pages/pageComps/hislist"
import Footer from "@/pages/pageComps/footer"
import subChapRoute from "@/pages/api/subChaps"
import { useRouter } from "next/router";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import Link from "next/link"

import entoch from "@/jsonBase/entoch"
import chapStruct from "@/jsonBase/chapStruct.json"

export async function getServerSideProps(context) {
  const BList = ["通志", "春秋公羊傳", "春秋左傳", "春秋穀梁傳", "通典-邊防篇", "戰國策"]
  const bookName = entoch[context.params.books]
  var chapName = context.params.chaps
  if (!BList.includes(bookName) && Object.keys(chapStruct).includes(bookName)) {chapName = chapStruct[bookName][chapName - 1]}
  
  const posts = await subChapRoute(bookName, chapName, 'cut')
    
  return { props: { posts } }
}

export default function Home({ posts }) {
  const BList = ["通志", "春秋公羊傳", "春秋左傳", "春秋穀梁傳", "通典-邊防篇", "戰國策"]
  const router = useRouter()
  const bookName = entoch[router.query.books]
  var chapName = router.query.chaps
  if (!BList.includes(bookName) && Object.keys(chapStruct).includes(bookName)) {chapName = chapStruct[bookName][chapName - 1]}
  const title = bookName + ' - ' + chapName
  

  function changeLBTN(BTNID) {
    if (typeof document !== 'undefined') {
        const ele = document.getElementById(BTNID).children[1].children[1];
        ele.innerText = ele.innerText == String.fromCharCode(0x25B2) ? String.fromCharCode(0x25BC) : String.fromCharCode(0x25B2);
    }
  }

  
  const listGenerator = (peopleJson, bn, jsonKeys, urlcn, urlbn) => {
    if (bn == '通志') {
      var pCnt = peopleJson['peopleList'].length
      return (
        <div className = "inline-flex mt-1 w-[81vw]">
          <div className= "h-[89vh] w-[100vw] p-2 rounded">
            <p className= "text-2xl p-2 w-auto">{posts['dynas'][0] == undefined ? '查無結果，請選擇其他章節。' : `${title} 傳主列表`}：</p>
            <div className = "overflow-auto mt-2 border-t-2 border-minor p-2 max-h-[82vh]">
              {Object.entries(peopleJson['people']).map(([key, value]) => (              
                <Collapsible key = {`${key}0`}>
                  <div key = {`${key}1`} className = "block text-xl text-least w-full my-2 py-2 overflow-auto rounded">
                    <CollapsibleTrigger asChild key = {`${key}2`}>
                      <button key = {`${key}3`} className="flex w-full px-2 pb-1 border-b-2 border-sec justify-between outline-none hover:bg-minor/20" 
                              onClick = {() => changeLBTN(`LBTN${key}`)} id = {`LBTN${key}`}>
                        <span key = {`${key}4`} className="inline-flex">
                          <p key = {`${key}5`} className="text-start self-center w-[10vw]">{`${key} (${value['dyna']})`}</p>       
                          <p key = {`${key}6`} className="text-start self-center text-base">{`( ${value['matchCnt']}字已比對 / 共${value['totalCnt']}字 )`}</p> 
                        </span>
                        <span key = {`${key}7`} className = "inline-flex">
                          <p key = {`${key}8`} className = "text-start self-center text-base">{`${Object.keys(value['matchChaps']).length} 個比對結果`}</p>                                   
                          <p key = {`${key}9`} className = "text-start self-center text-lg ml-2 w-[1vw] text-minor">&#9660;</p>
                        </span>
                      </button>
                    </CollapsibleTrigger>
                    <CollapsibleContent key = {`${key}10`} className="overflow-auto rounded m-2 bg-sec text-least">
                      {Object.keys(value['matchChaps'])
                              .sort(function (a, b) {return value['matchChaps'][b]['wordCnt'] - value['matchChaps'][a]['wordCnt'];})
                              .map(subKey =>(
                        <Link key = {subKey} className = "w-auto text-base block py-2 pl-4 text-base hover:bg-minor/20" 
                          href = {{
                            pathname : "./[chaps]/[hisID]",
                            query :{ books: urlbn, chaps: urlcn, hisID: `${value['tongID']}##${subKey}`},
                          }}>{`${value['matchChaps'][subKey]['chapName']} ( 比對${value['matchChaps'][subKey]['wordCnt']}字 )`}
                        </Link>
                        ))}
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              ))}
            </div>
          </div>
          <div className= "rounded max-h-[75vh] w-[35vw] ml-24 mr-12 mt-12 p-1">
            <div className = "block overflow-auto p-2 rounded max-h-[75vh] h-auto bg-sec text-least">
              <p className = "pt-2 pl-2 text-xl font-semibold">包含朝代 :</p>
              <p className = "pt-2 pl-2 my-2 overflow-auto max-h-[30vh] rounded p-2 border-2 border-minor bg-minor/5">{peopleJson['dynas'].join(' / ')}</p>
              <p className = "pt-2 pl-2 text-xl font-semibold">{'包含傳主(' + pCnt + '位) :'}</p>
              <p className = "pt-2 pl-2 my-2 overflow-auto max-h-[30vh] rounded p-2 border-2 border-minor bg-minor/5">{ peopleJson['peopleList'].join(' / ')}</p>
            </div>
          </div>
        </div>
      )
    } else {
      
      var pCnt = peopleJson['peopleList'].length
      return (
        <div className = "inline-flex mt-1 w-[81vw]">
          <div className= "h-[89vh] w-[100vw] p-2 rounded">
            <p className= "text-2xl p-2 w-auto">{posts['dynas'][0] == undefined ? '查無結果，請選擇其他章節。' : `${title} 通志各卷列表`}：</p>
            <div className = "overflow-auto mt-2 border-t-2 border-minor p-2 max-h-[82vh]">
              {Object.entries(peopleJson['subChaps']).map(([key, value]) => (              
                <Collapsible key = {`${key}0`}>
                  <div key = {`${key}1`} className = "block text-xl text-least w-full my-2 py-2 overflow-auto rounded">
                    <CollapsibleTrigger asChild key = {`${key}2`}>
                      <button key = {`${key}3`} className="flex w-full px-2 pb-1 border-b-2 border-sec justify-between outline-none hover:bg-minor/20" 
                              onClick = {() => changeLBTN(`LBTN${key}`)} id = {`LBTN${key}`}>
                          <p key = {`${key}4`} className="text-start self-center w-[10vw]">{`${key}`}</p>       
                        <span key = {`${key}5`} className = "inline-flex">
                          <p key = {`${key}6`} className = "text-start self-center text-base">{`${Object.keys(value).length} 個比對結果`}</p>                                   
                          <p key = {`${key}7`} className = "text-start self-center text-lg ml-2 w-[1vw] text-minor">&#9660;</p>
                        </span>
                      </button>
                    </CollapsibleTrigger>
                    <CollapsibleContent key = {`${key}8`} className="overflow-auto rounded m-2 bg-sec text-least">
                      {Object.keys(value)
                        .sort(function (a, b) {return value[b]['wordCnt'] - value[a]['wordCnt'];})
                        .map(subKey =>(
                        <Link key = {subKey} className = "w-auto text-base block py-2 pl-4 text-base hover:bg-minor/20" 
                          href = {{
                            pathname : "./[chaps]/[hisID]",
                            query :{ books: urlbn, chaps: urlcn, hisID: `${peopleJson['offID']}##${subKey}`},
                          }}>{`${value[subKey]['chapName']} ( ${value[subKey]['wordCnt']}字已比對 / 共${value[subKey]['tWordCnt']}字 )`}
                        </Link>
                        ))}
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              ))}
            </div>
          </div>
          <div className= "rounded max-h-[75vh] w-[35vw] ml-24 mr-12 mt-12 p-1">
            <div className = "block overflow-auto p-2 rounded max-h-[75vh] h-auto bg-sec text-least">
              <p className = "pt-2 pl-2 text-xl font-semibold">包含通志卷名 :</p>
              <p className = "pt-2 pl-2 my-2 overflow-auto max-h-[30vh] rounded p-2 border-2 border-minor bg-minor/5">{peopleJson['dynas'].join(' / ')}</p>
              <p className = "pt-2 pl-2 text-xl font-semibold">{'包含傳主(' + pCnt + '位) :'}</p>
              <p className = "pt-2 pl-2 my-2 overflow-auto max-h-[30vh] rounded p-2 border-2 border-minor bg-minor/5">{ peopleJson['peopleList'].join(' / ')}</p>
            </div>
          </div>
        </div> 
      )
    }
  }

  return  (
    <div className = "inline-flex flex-wrap bg-main text-least" id = "whole">
      <div className = "w-screen sticky top-0 h-16">
        <Topnav />
      </div>
      <div className = "inline-flex w-screen h-[calc(100vh-5.5rem)]">
        <Hislist />
        {listGenerator(posts, bookName, chapName, router.query.chaps, router.query.books)}
      </div>
      <Footer />
    </div>
    
  )

}



