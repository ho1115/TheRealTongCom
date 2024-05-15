import Topnav from "@/pageComps/20top"
import Hislist from "@/pageComps/20list"
import Footer from "@/pageComps/footer"
import subChapRoute from "@/pages/api/20Chaps"
import { useRouter } from "next/router";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import Link from "next/link"
import Head from 'next/head'


export async function getServerSideProps(context) {
  var chapName = context.params.chaps
  const posts = await subChapRoute(chapName)    
  return { props: { posts } }
}

export default function Home({ posts }) {
  const router = useRouter()
  var chapName = router.query.chaps
 
  function changeLBTN(BTNID) {
    if (typeof document !== 'undefined') {
        const ele = document.getElementById(BTNID).children[1].children[1];
        ele.innerText = ele.innerText == String.fromCharCode(0x25B2) ? String.fromCharCode(0x25BC) : String.fromCharCode(0x25B2);
    }
  }

  
  const listGenerator = (peopleJson, urlcn) => {
    var pCnt = peopleJson['peopleList'].length
    return (
      <div className = "inline-flex mt-1 w-[81vw]">
        <div className = "h-[89vh] w-[100vw] p-2 rounded">
          <div className = "inline-flex justify-between w-full">
            <p className = "text-2xl p-2 w-auto">{`${chapName} 選擇清單`}：</p>
            <p className = "text-sm text-red-400 self-end">(比對字數不重複計算重疊的比對部分)</p>
          </div>
          <div className = "overflow-auto mt-2 border-t-2 border-minor p-2 max-h-[82vh]">
            {Object.entries(peopleJson['people']).map(([key, value]) => (              
              <Collapsible key = {`${key}0`}>
                <div key = {`${key}1`} className = "block text-xl text-least w-full my-2 py-2 overflow-auto rounded">
                  <CollapsibleTrigger asChild key = {`${key}2`}>
                    <button key = {`${key}3`} className="flex w-full px-2 pb-1 border-b-2 border-sec justify-between outline-none hover:bg-minor/20" 
                            onClick = {() => changeLBTN(`LBTN${key}`)} id = {`LBTN${key}`}>
                      <span key = {`${key}4`} className="inline-flex">
                        <p key = {`${key}5`} className="text-start self-center w-[10vw]">{key}</p>   
                        <p key = {`${key}6`} className="text-start self-center text-base">{`( 比對到${value['matchCnt']}字 / 共${value['totalCnt']}字 )`}</p> 
                      </span>
                      <span key = {`${key}7`} className = "inline-flex">
                        <p key = {`${key}8`} className = "text-start self-center text-base">{`${value['matchCnt'] == 0 ? 0 : Object.keys(value['matchChaps']).length} 個比對結果`}</p>                                   
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
                          query :{chaps: urlcn, hisID: `${value['tongID']}##${subKey}`},
                        }} target="_blank">{`${value['matchChaps'][subKey]['chapName']} ( 比對${value['matchChaps'][subKey]['wordCnt']}字 )`}
                      </Link>
                      ))}
                  </CollapsibleContent>
                </div>
              </Collapsible>
            ))}
          </div>
        </div>
        <div className= "rounded h-[75vh] w-[35vw] ml-24 mr-12 mt-12 p-1">
          <div className = "block overflow-auto p-2 rounded h-[75vh] h-auto bg-sec text-least">
            <p className = "pt-2 pl-2 text-xl font-semibold">{'包含子章節數(' + pCnt + ') :'}</p>
            <p className = "pt-2 pl-2 my-2 overflow-auto h-[65vh] rounded p-2 border-2 border-minor bg-minor/5">{ peopleJson['peopleList'].join(' / ')}</p>
          </div>
        </div>
      </div>
    )
  }

  return  (
    
    <div className = "inline-flex flex-wrap bg-main text-least" id = "whole">
      <Head>
        <title>通志二十略比對結果</title>
      </Head>
      <div className = "w-screen sticky top-0 h-16">
        <Topnav />
      </div>
      <div className = "inline-flex w-screen min-h-[calc(100vh-5.5rem)]">
        <Hislist />
        {listGenerator(posts, router.query.chaps)}
      </div>
      <Footer />
    </div>
    
  )

}



