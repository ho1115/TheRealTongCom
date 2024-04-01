'use client';

import Topnav from "@/pages/pageComps/topnav"
import Footer from "@/pages/pageComps/footer"
import Statlist from "@/pages/pageComps/statlist"
import hisStat from "@/pages/api/hisStat"
import tzDynStat from "@/pages/api/tzDynStat"
import tzJuanStat from "@/pages/api/tzJuanStat"
import Statgeneral from "@/pages/pageComps/statgene";
import Statdetail from "@/pages/pageComps/statdetail";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import entoch from "@/jsonBase/entoch.json"
import chapStruct from "@/jsonBase/chapStruct.json"

export async function getServerSideProps(context) {
  const bookName = entoch[context.params.books]
  const BList = ["通志", "春秋公羊傳", "春秋左傳", "春秋穀梁傳", "通典-邊防篇", "戰國策"]
  var chapName = context.params.chaps
  if (!BList.includes(bookName) && Object.keys(chapStruct).includes(bookName) && chapName != 'allChaps') {chapName = chapStruct[bookName][chapName - 1]}
  const isTz = bookName == "通志"  ? true : false;
  
  var tzData = chapName.startsWith("dyn") ? await tzDynStat(chapName.split('-')[1], "all") : await tzJuanStat(chapName, "all")
  const posts = isTz ? tzData : await hisStat(bookName, chapName, "all");
  
  return { props: { posts } }
  
}

export default function Home({ posts }) {
  const router = useRouter()
  const BList = ["通志", "春秋公羊傳", "春秋左傳", "春秋穀梁傳", "通典-邊防篇", "戰國策"]
  const bookName = entoch[router.query.books]
  const isTz = bookName == "通志"  ? true : false;
  var chapName = router.query.chaps;
  const hisGene = (isTz || router.query.books == undefined) ? 'tz' : require(`@/jsonBase/${router.query.books}.json`);
  const tclBool = chapName.startsWith('dyn')
  if (chapName != undefined && chapName.startsWith('dyn')) {chapName = chapName.split('-')[1]}
  else if (!BList.includes(bookName) && Object.keys(chapStruct).includes(bookName) && chapName != 'allChaps') {chapName = chapStruct[bookName][chapName - 1];}
  
  const getHisname = (chName, hisJs) => {
    var res ; 
    Object.values(hisJs).forEach(v => {
      if (v['name'] == chName) {res = [v['peoCntAll'], v['mCntAll'], v['wCnt']];}
    })
    return res;
  }
  var hisP = (isTz || router.query.books == undefined) ? [0, 0, 0] : getHisname(chapName, hisGene);

  var generalData = {}
  if (!isTz) {
    Object.entries(posts).forEach(([key, value]) => {
      if (!generalData[key]) {
        generalData[key] = {
          "mCnt" : 0,
          "tCnt" : value["tLen"],
          "pCnt" : 0,
          "npCnt" : value["noMatch"].length,
        };
      }
      generalData[key]["pCnt"] += Object.keys(value[["pInfo"]]).length
      Object.values(value["pInfo"]).forEach(subV => {generalData[key]["mCnt"] += subV["mCnt"]})
    })
  } else {
    var peoSets = {}
    Object.entries(posts["subInfo"]).forEach(([chKey, value]) => {
        Object.entries(value["hisMatches"]).forEach(([subKey, subValue]) => {
          if (!generalData[subKey]) {generalData[subKey] = { "hisSubChaps" : {}, "pCnt" : 0, "mCnt" : 0};}
          if (!peoSets[subKey]) {peoSets[subKey] = []}
          Object.entries(subValue["chapInfo"]).forEach(([chapKey, chapValue]) => {
            if (!generalData[subKey]["hisSubChaps"][chapKey]) {generalData[subKey]["hisSubChaps"][chapKey] = {"mCnt" : 0, "peoInfo" : {}}}
            generalData[subKey]["hisSubChaps"][chapKey]["mCnt"] += chapValue["mCnt"];
            generalData[subKey]["mCnt"] += chapValue["mCnt"];
            Object.entries(chapValue["peoInfo"]).forEach(([peoName, peoMcnt]) => {
              if (!generalData[subKey]["hisSubChaps"][chapKey]["peoInfo"][peoName]) {
                generalData[subKey]["hisSubChaps"][chapKey]["peoInfo"][peoName] = 
                  {
                    "mCnt" : 0, 
                    "tCnt" : peoMcnt["tCnt"], 
                    "peoID" : peoMcnt["peoID"], 
                    "hisID" : peoMcnt["hisID"],
                    "tzCh" : chKey
                  }}
              generalData[subKey]["hisSubChaps"][chapKey]["peoInfo"][peoName]["mCnt"] += peoMcnt["mCnt"];
              if (!peoSets[subKey].includes(peoName)) {
                peoSets[subKey].push(peoName);
                generalData[subKey]["pCnt"] += 1;
              }
            })
          })

        })

    })
  }
  const [sortList, setStatList] = useState("def")
  const [sortDetail, setStatDetail] = useState("def")
 
  return  (
    <div className = "inline-flex flex-wrap bg-main text-least" id = "whole">
      <Head>
        <title>通志史料比對系統</title>
      </Head>
      <div className = "w-screen sticky top-0 h-16">
        <Topnav />
      </div>
      <div className = "inline-flex w-screen min-h-[calc(100vh-5.5rem)]">
        <Statlist />
        <div className="w-full block">
          {
            isTz ? 
            <div className= "p-2 my-2 w-auto inline-flex border-l-2 border-minor">
              <p className= "text-xl">{`${bookName} - ${chapName} : `}</p>
              <p className= "w-[20vw] ml-4 text-lg self-end">{`${posts['peoCnt']}位傳主 , 比對到${posts['mCnt']}字 / 共${posts['wCnt']}字`}</p>
              <p className = "text-sm text-red-400 self-end">(比對字數不重複計算重疊的比對部分)</p>
            </div> :
            chapName == 'allChaps' ?
              <div className= "p-2 my-2 w-full inline-flex border-l-2 border-minor">
                <p className= "text-2xl p-2 mt-2 rounded w-auto min-w-[10vw]">{`${bookName} - 全卷總覽`}</p> 
                <p className= "text-sm p-2 mt-2 rounded w-auto text-red-400 self-end">( * 注意：全書總覽 之 通志比對分布，會將比對字數重疊部分相加，若超過總字數為正常現象 )</p>
              </div>
             : 
              <div className= "p-2 my-2 w-auto inline-flex border-l-2 border-minor">
                <p className= "text-xl">{`${bookName} - ${chapName} : `}</p>
                <p className= "w-[20vw] ml-4 text-lg self-end">{`${hisP[0]}位傳主 , 比對到${hisP[1]}字 / 共${hisP[2]}字`}</p>
                <p className = "text-sm text-red-400 self-end">(比對字數不重複計算重疊的比對部分)</p>
              </div>
          }
          
          <Tabs defaultValue = "juan" className = "w-full block">
              <TabsList className = "bg-sec/0 w-[75vw] mt-2 inline-flex justify-between text-least">
                  <div>
                    <TabsTrigger value="juan" className = "bg-minor/20 m-1">{isTz ? "傳主分布" : "全書比對概況"}</TabsTrigger>
                    <TabsTrigger value="dyn" className = "bg-minor/20 m-1">{isTz ? "比對結果分布": "通志比對分布"}</TabsTrigger>
                  </div>
                  <select className = "bg-sec m-1 p-2 text-base text-least rounded outline-none" defaultValue = "def"
                          onChange={(ele) => {
                            setStatList(ele.target.value);
                            setStatDetail(ele.target.value);
                          }}>
                    <option value = "def" className = "bg-sec">預設排序</option>
                    <option value = "peo" className = "bg-sec">傳主數排序</option>
                    <option value = "word" className = "bg-sec">比對字數排序</option>
                  </select>
              </TabsList>
              <TabsContent value="juan" className = "overflow-auto border-t-2 border-minor w-[75vw] max-h-[77vh] ">
                <Statgeneral tzbool = {isTz} data = {isTz ? posts : hisGene} method = {sortList} tzChLink = {tclBool ? "dyn" : chapName}
                            books = {router.query.books} linkBool = {BList.includes(bookName)} chBkName = {bookName}
                            version = "All"></Statgeneral>
              </TabsContent>
              <TabsContent value="dyn" className = "overflow-auto border-t-2 border-minor w-[75vw] max-h-[77vh]">
                <Statdetail tzbool = {isTz} data = {generalData} postdata = {posts} tzChLink = {tclBool ? "dyn" : chapName}
                method = {sortDetail}></Statdetail>
              </TabsContent>                
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  )

}