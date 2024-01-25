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

import entoch from "@/pages/entoch"
import chapStruct from "@/pages/chapStruct.json"

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
  
  const listGenerator = (peopleJson, bn, cn, urlcn, urlbn) => {
    if (bn == '通志') {
      var pCnt = peopleJson['peopleList'].length
      return (
        <div className = "inline-flex mt-10 ml-10 w-[81vw]">
          <div className= "h-[75vh] w-[75vw] p-2 bg-orange-400/60 rounded">
            <p className= "text-2xl p-2 rounded bg-zinc-900 border-2 border-black ">傳主比對結果列表：</p>
            <div className = "overflow-auto mt-2 border-y-2 border-black pr-1 max-h-[67vh]">
              {Object.entries(peopleJson['people']).map(([key, value]) => (              
                <Collapsible>
                  <div className = "block text-xl text-black w-full my-2 py-2 overflow-auto border-2 border-black rounded bg-gray-400">
                    <div className="flex justify-between px-2">
                      <p className="self-center w-[10vw] font-semibold">{`${key} (${value['dyna']})`}</p>       
                      <p className="self-center text-base w-[15vw]">{`比對字數(${value['matchCnt']}字 / ${value['totalCnt']}字)`}</p> 
                      <p className="self-center text-base w-[10vw]">{`共 ${Object.keys(value['matchChaps']).length} 個比對結果`}</p>                                    
                      <CollapsibleTrigger asChild>
                        <button className="rounded  border-2 border-black text-sm bg-neutral-500 hover:bg-neutral-600 p-1" >
                          展開/收起
                        </button>
                      </CollapsibleTrigger>
                    </div>
                    <CollapsibleContent className="overflow-auto rounded m-2 border-2 border-gray-500 bg-gray-300">
                      {Object.entries(value['matchChaps']).map(([subKey, subValue]) =>(
                        <Link key = {subKey} className = "w-auto text-base block py-1 pl-8 text-lg text-black hover:bg-neutral-400 " 
                          href = {{
                            pathname : "./[chaps]/[hisID]",
                            query :{ books: urlbn, chaps: urlcn, hisID: `${value['tongID']}##${subKey}`},
                          }}>{`${subValue['chapName']} ( 比對${subValue['wordCnt']}字 )`}
                        </Link>
                        ))}
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              ))}
            </div>
          </div>
          <div className= "rounded h-[50vh] w-[30vw] ml-32 p-1 backdrop-blur-lg bg-amber-400/60">
            <div className = "block overflow-auto p-2 rounded h-full bg-white/40 text-black">
              <p className = "pt-2 pl-2 text-xl font-semibold">包含朝代 :</p>
              <p className = "pt-2 pl-2 my-2 rounded p-2 border-2 border-gray-700 bg-gray-400">{peopleJson['dynas'].join(' / ')}</p>
              <p className = "pt-2 pl-2 text-xl font-semibold">{'包含傳主(' + pCnt + '位) :'}</p>
              <p className = "pt-2 pl-2 my-2 rounded p-2 border-2 border-gray-700 bg-gray-400">{ peopleJson['peopleList'].join(' / ')}</p>
            </div>
          </div>
        </div>
      )
    } else {
      var pCnt = peopleJson['peopleList'].length
      return (
        <div className = "inline-flex mt-10 ml-10 w-[81vw]">
          <div className= "h-[75vh] w-[75vw] overflow-auto p-2 bg-orange-400/60 rounded">
            <p className= "text-2xl p-2 rounded bg-zinc-900 border-2 border-black ">通志各卷比對結果列表：</p>
            <div className = "overflow-auto mt-2 pr-1 border-y-2 border-black max-h-[67vh]">
              {Object.entries(peopleJson['subChaps']).map(([key, value]) => (              
                <Collapsible>
                  <div className = "block text-xl text-black w-full my-2 py-2 overflow-auto border-2 border-black rounded bg-gray-400">
                    <div className="flex justify-between px-2">
                      <p className="self-center w-[10vw] font-semibold">{key}</p>       
                      <p className="self-center text-base w-[10vw]">{`共 ${Object.keys(value).length} 個比對結果`}</p>                                    
                      <CollapsibleTrigger asChild>
                        <button className="rounded  border-2 border-black text-sm bg-neutral-500 hover:bg-neutral-600 p-1" >
                          展開/收起
                        </button>
                      </CollapsibleTrigger>
                    </div>
                    <CollapsibleContent className="overflow-auto rounded m-2 border-2 border-gray-500 bg-gray-300">
                      {Object.entries(value).map(([subKey, subValue]) =>(
                        <Link key = {subKey} className = "w-auto text-base block py-1 pl-8 text-lg text-black hover:bg-neutral-400 " 
                          href = {{
                            pathname : "./[chaps]/[hisID]",
                            query :{ books: urlbn, chaps: urlcn, hisID: `${value['tongID']}##${subKey}`},
                          }}>{`${subValue['chapName']} ( ${subValue['wordCnt']}字 / ${subValue['tWordCnt']}字 )`}
                        </Link>
                        ))}
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              ))}
            </div>
          </div>
          <div className= "rounded h-[50vh] w-[30vw] ml-32 p-1 backdrop-blur-lg bg-amber-400/60">
            <div className = "block p-2 overflow-auto rounded h-full bg-white/40 text-black">
              <p className = "pt-2 pl-2 text-xl font-semibold">包含通志卷名 :</p>
              <p className = "pt-2 pl-2 my-2 rounded p-2 border-2 border-gray-700 bg-gray-400">{peopleJson['dynas'].join(' / ')}</p>
              <p className = "pt-2 pl-2 text-xl font-semibold">{'包含傳主(' + pCnt + '位) :'}</p>
              <p className = "pt-2 pl-2 my-2 rounded p-2 border-2 border-gray-700 bg-gray-400">{ peopleJson['peopleList'].join(' / ')}</p>
            </div>
          </div>
        </div>            
      )
    }
  }

  return  (
    <div className = "inline-flex flex-wrap bg-black text-white" id = "whole">
      <div className = "w-screen sticky top-0 h-16">
        <Topnav />
      </div>
      <div className = "inline-flex w-screen h-[calc(100vh-5.5rem)]">
        <Hislist />
        <div className = "block start-96 w-screen h-full justify-center" >
          <p className = "w-full h-16 text-3xl p-2 underline decoration-2 underline-offset-8">{posts['dynas'][0] == undefined ? '查無結果，請重新選擇章節。' : title} :</p>          
          {listGenerator(posts, bookName, chapName, router.query.chaps, router.query.books)}
        </div>
      </div>
      <Footer />
    </div>
    
  )

}