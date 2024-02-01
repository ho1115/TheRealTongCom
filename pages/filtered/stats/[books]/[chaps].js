'use client';
import * as React from "react"
import Topnav from "@/pages/pageComps/topnav"
import Footer from "@/pages/pageComps/footer"
import Statlist from "@/pages/pageComps/statlist"

import { useRouter } from "next/router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import entoch from "@/jsonBase/entoch.json"
import chapStruct from "@/jsonBase/chapStruct.json"

export default function Home({ posts }) {
  const router = useRouter()
  const BList = ["通志", "春秋公羊傳", "春秋左傳", "春秋穀梁傳", "通典-邊防篇", "戰國策"]
  const bookName = entoch[router.query.books]
  const isTz = bookName == "通志"  ? true : false;
  var chapName = router.query.chaps
  const hisGene = (isTz || router.query.books == undefined) ? 'tz' : require(`@/jsonBase/${router.query.books}.json`)
  
  
  if (chapName != undefined && chapName.startsWith('dyn')) {chapName = chapName.split('-')[1]}
  else if (!BList.includes(bookName) && Object.keys(chapStruct).includes(bookName) && chapName != 'allChaps') {chapName = chapStruct[bookName][chapName - 1]}

  const getHisname = (chName, hisJs) => {
    var res ; 
    Object.values(hisJs).forEach(v => {
      if (v['name'] == chName) {res = [v['peoCntCut'], v['mCntCut'], v['wCnt']];}
    })
    return res
  }
  var hisP = (isTz || router.query.books == undefined) ? [0, 0, 0] : getHisname(chapName, hisGene);
  
  return  (
    <div className = "inline-flex flex-wrap bg-main text-least" id = "whole">
      <div className = "w-screen sticky top-0 h-16">
        <Topnav />
      </div>
      <div className = "inline-flex w-screen h-[calc(100vh-5.5rem)]">
        <Statlist />
        <div className="w-full block">
          {
            chapName == 'allChaps' ? <p className= "text-2xl p-2 mt-2 rounded w-full h-[5vh]">全卷總覽 </p> : 
            <div className= "p-2 my-2 w-auto inline-flex border-l-2 border-minor">
              <p className= "text-xl">{`${bookName} ${chapName} : `}</p>
              <p className= "w-[20vw] ml-4 text-lg self-end">{`${hisP[0]}位傳主 , ${hisP[1]}字已比對 / 共${hisP[2]}字`}</p>
            </div>
          }
          
          <Tabs defaultValue = "juan" className = "w-full block">
              <TabsList className = "bg-sec/0 w-[12vw] mt-2 justify-around text-least">
                  <TabsTrigger value="juan" className = "bg-minor/20 w-[6vw] m-1">{isTz ? "傳主分布" : "全卷比對概況"}</TabsTrigger>
                  <TabsTrigger value="dyn" className = "bg-minor/20 w-[6vw] m-1">{isTz ? "比對結果分布": "章節比對分布"}</TabsTrigger>
              </TabsList>
              <TabsContent value="juan" className = "overflow-auto border-t-2 border-minor w-[75vw] max-h-[77vh] ">
                <div className = "block px-4 w-[74vw]">{isTz ? "tzblyat!" : Object.values(hisGene).map(val => (
                  <div className="justify-between inline-flex w-full mt-2 p-2 border-b-2 border-sec hover:bg-minor/20">
                    <p key = {val['name']} className="w-[50vw] text-lg">{val['name']}</p>
                    <div key = {val['name']+'1'} className="w-[18vw] justify-between inline-flex">
                      <p className="w-[4vw] text-start text-base">{`${val['peoCntCut']}位傳主`}</p>
                      <p className="w-[14vw] text-end text-base">{`比對到${val['mCntCut']}字 / 共${val['wCnt']}字`}</p>
                    </div>
                  </div>                
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="dyn">456</TabsContent>                
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  )

}