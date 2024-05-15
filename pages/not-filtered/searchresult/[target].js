import Topnav from "@/pageComps/topnav"
import Footer from "@/pageComps/footer"
import searchEngine from "@/pages/api/searchEngine";
import { useRouter } from "next/router";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import Link from "next/link"
import Head from 'next/head'

export async function getServerSideProps(context) {  
  var targetName = context.params.target
  const posts = await searchEngine(targetName, 'all')
  return { props: { posts } }
}

export default function Home({ posts }) {
  const router = useRouter()

  function changeLBTN(BTNID) {
    if (typeof document !== 'undefined') {
        const ele = document.getElementById(BTNID).children[1].children[1];
        ele.innerText = ele.innerText == String.fromCharCode(0x25B2) ? String.fromCharCode(0x25BC) : String.fromCharCode(0x25B2);
    }
  }

  
  const searchGenerator = (peopleJson) => {    
    var pCnt = peopleJson['peos'].length
    return (
        <div className = "inline-flex mt-1 w-[81vw]">
          <div className = "h-[89vh] w-[100vw] p-2 rounded">
            <div className = "inline-flex justify-between w-full">
              <p className = "text-2xl p-2 w-auto">{`所有 "${router.query.target}" 搜尋結果 共${pCnt}位`}：</p>
              <p className = "text-sm text-red-400 self-end">(傳主比對字數不重複計算重疊的比對部分)</p>
            </div>
            <div className = "overflow-auto mt-2 border-t-2 border-minor p-2 max-h-[82vh]">
              {Object.entries(peopleJson['peos']).map(([key, value]) => (              
                <Collapsible key = {`${key}0`}>
                  <div key = {`${key}1`} className = "block text-xl text-least w-full my-2 py-2 overflow-auto rounded">
                    <CollapsibleTrigger asChild key = {`${key}2`}>
                      <button key = {`${key}3`} className="flex w-full px-2 pb-1 border-b-2 border-sec justify-between outline-none hover:bg-minor/20" 
                              onClick = {() => changeLBTN(`LBTN${key}`)} id = {`LBTN${key}`}>
                        <span key = {`${key}4`} className="inline-flex">
                          <p key = {`${key}5`} className="text-start self-center">{`${peopleJson['chap'][key]} - ${value} (${peopleJson['dyn'][key]})`}</p>       
                          <p key = {`${key}6`} className="text-start self-center ml-[5vw] text-base">{`( 比對到${peopleJson['mCnt'][key]}字 / 共${peopleJson['wCnt'][key]}字 )`}</p> 
                        </span>
                        <span key = {`${key}7`} className = "inline-flex">
                          <p key = {`${key}8`} className = "text-start self-center text-base">{`${Object.keys(peopleJson['matches'][key]).length}個比對結果`}</p>                                   
                          <p key = {`${key}9`} className = "text-start self-center text-lg ml-2 w-[1vw] text-minor">&#9660;</p>
                        </span>
                      </button>
                    </CollapsibleTrigger>
                    <CollapsibleContent key = {`${key}10`} className="overflow-auto rounded m-2 bg-sec text-least">
                      {Object.entries(peopleJson['matches'][key])
                              .sort(function ([a,], [b,]) {return peopleJson['matches'][key][b]['count'] - peopleJson['matches'][key][a]['count'];})
                              .map(([subKey, subVal]) => (
                        <Link key = {subKey} className = "w-auto text-base block py-2 pl-4 text-base hover:bg-minor/20" 
                          href = {{
                            pathname : "../compRes/[books]/[chaps]/[hisID]",
                            query :{ books: 'tongchi', chaps: peopleJson['chap'][key].split(' (')[0], hisID: `${peopleJson['ID'][key]}##${subKey}`},
                          }} target="_blank">{`${subVal['name']} ( 比對${subVal['count']}字 )`}
                        </Link>
                        ))}
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              ))}
            </div>
          </div>
        </div>
      )
    
  }

  return  (
    
    <div className = "inline-flex flex-wrap bg-main text-least" id = "whole">
      <Head>
        <title>通志史料比對系統</title>
      </Head>
      <div className = "w-screen sticky top-0 h-16">
        <Topnav />
      </div>
      <div className = "inline-flex w-screen min-h-[calc(100vh-5.5rem)] justify-center">
        {posts === 'noMatches' ? '查無結果' : searchGenerator(posts)}
      </div>
      <Footer />
    </div>
    
  )

}
