'use client';

import * as React from "react"
import Topnav from "@/pages/pageComps/topnav"
import Footer from "@/pages/pageComps/footer"
import allMatches from "@/pages/api/compMatches"
import contentMatches from "@/pages/api/contentDetail"
import Link from "next/link"
import Head from "next/head";
import { useRouter } from "next/router";

import entoch from "@/jsonBase/entoch"
import chapStruct from "@/jsonBase/chapStruct.json"


export async function getServerSideProps(context) {
  const bookName = entoch[context.params.books]
  const IDs = context.params.hisID.split('##')
  const posts = await allMatches(bookName, IDs[0], 'all')
  const conts = bookName == "通志" ? await contentMatches(IDs[0], IDs[1], 'all') : await contentMatches(IDs[1], IDs[0], 'all')
  return { props: { posts, conts } }
}

export default function Home({ posts, conts }) {
  const BList = ["通志", "春秋公羊傳", "春秋左傳", "春秋穀梁傳", "通典-邊防篇", "戰國策"]
  const router = useRouter()
  const bookName = entoch[router.query.books]
  var chapName = router.query.chaps
  if (!BList.includes(bookName) && Object.keys(chapStruct).includes(bookName)) {chapName = chapStruct[bookName][chapName - 1]}
  const tzOnLeft = bookName == "通志" ? true : false;  
  const postKeys = Object.keys(posts).sort(function (a, b) {return posts[b]['mLen'] - posts[a]['mLen'];})
  
  function lightUp (numb) {
    var paras = document.getElementsByClassName(numb);
    
    Array.from(paras).forEach(element => {
      element.classList.remove('bg-minor/50')
      element.classList.add('bg-red-500/50');
    });
  } 

  function lightDown (numb) {
    var paras = document.getElementsByClassName(numb);
    Array.from(paras).forEach(element => {
      element.classList.remove('bg-red-500/50')
      element.classList.add('bg-minor/50');
    });
  }

  function adjView (numb) {
    const text = document.getElementById(numb);
    text.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest"});
  }

  const alignBuilder = (matchJs, prefix, pos) => {
    const reversPos = pos == 'R' ? 'L' : 'R'
    return (
      <>
      {Object.entries(matchJs[`${prefix}TextN`]).map(([key, value]) => (
        <React.Fragment key = {`${prefix}${key}#0`}><span key = {`${prefix}${key}#0`}>{value}</span>
        <span key = {`${prefix}${key}#1`} 
              className = {`rounded bg-minor/50 cuts${matchJs[`${prefix}TextY`][key]['spanID']}`} onMouseOver = { () => lightUp(`cuts${matchJs[`${prefix}TextY`][key]['spanID']}`)} 
              onMouseOut = {() => lightDown(`cuts${matchJs[`${prefix}TextY`][key]['spanID']}`)} onClick = {() => adjView(`${reversPos}cuts${matchJs[`${prefix}TextY`][key]['spanID']}`)} id = {`${pos}cuts${matchJs[`${prefix}TextY`][key]['spanID']}`}> 
              {matchJs[`${prefix}TextY`][key]['para']}
        </span></React.Fragment>
      ))}<span key = {`${prefix}#2`}>{matchJs[`${prefix}TextTail`]}</span></>
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
        <div className = "inline-flex w-screen min-h-[calc(100vh-5.5rem)]">
          <div className = "inline-flex flex-col w-1/5 m-2 p-2 top-16 h-[calc(100vh-5.5rem)] bg-main">
            <div className = "inline-flex flex-row w-auto min-h-12 border-b-2 mb-2 border-sec font-bold place-items-center justify-around">             
              <p className = "w-full h-full text-xl p-2 rounded text-least mb-2 bg-sec outline-none">
                比對結果列表
              </p>
            </div>
            <div className = "w-auto overflow-auto max-h-screen text-least pb-2 px-2 border-l-2 border-minor">
              {
                postKeys.map(key => ( 
                    <Link key = {key} className = "w-auto block p-2 hover:bg-neutral-600 border-b-2 border-sec" 
                        href = {{
                        pathname : "./[hisID]",
                        query :{ books: router.query.books, chaps: router.query.chaps, hisID: `${router.query.hisID.split('##')[0]}##${key}`},
                        }}>{`${posts[key]['name']} (${posts[key]['mLen']}字已比對)`}
                    </Link>
                    )
                )
              }
              
            </div>
            
          </div>
          <div className="block w-full h-full pt-2">            
            <Link className = "block w-auto h-16 p-2 text-3xl underline-offset-8 decoration-minor hover:underline hover:text-zinc-400" 
                  href = {{
                  pathname : "./",
                  query :{ books: router.query.books, chaps: router.query.chaps},
                  }}>{`回到： ${bookName} / ${chapName}`}
            </Link>
            <div className="inline-flex justify-between pt-8 w-full h-[81vh]">
              <div className="bg-sec rounded ml-8 w-[35vw] h-[77vh]">
                <div className="bg-minor/80 inline-flex justify-between w-full h-12 rounded text-xl px-4 pt-2">
                  <p>{tzOnLeft ? `${conts['tongName']} `: `${conts['hisName']}`}</p>
                  <p>{tzOnLeft ? `總字數 : ${conts['tongLen']}字`: `總字數 : ${conts['hisLen']}字`}</p>
                </div>
                <div className="p-2 overflow-auto max-h-[72vh] text-lg" id = "LBox">
                  {
                    tzOnLeft ? alignBuilder(conts, 'tong', 'L'): alignBuilder(conts, 'his', 'L')
                  }                  
                </div >
              </div>
              <div className="bg-sec rounded mr-32 w-[35vw] h-[77vh]">
                <div className="bg-minor/80 inline-flex justify-between w-full h-12 rounded text-xl px-4 pt-2">
                  <p>{!tzOnLeft ? `${conts['tongName']} `: `${conts['hisName']}`}</p>
                  <p>{!tzOnLeft ? `比對${posts[router.query.hisID.split('##')[1]]['mLen']}字 / 共${conts['tongLen']}字`: 
                                  `比對${posts[router.query.hisID.split('##')[1]]['mLen']}字 / 共${conts['hisLen']}字`}</p>
                </div>
                <div className="p-2 overflow-auto max-h-[72vh] text-lg" id = "RBox">
                  
                  {!tzOnLeft ? alignBuilder(conts, 'tong', 'R'): alignBuilder(conts, 'his', 'R')}
                </div>
              </div>
            </div>
          </div>
        </div>
      <Footer />
    </div>
  )

}