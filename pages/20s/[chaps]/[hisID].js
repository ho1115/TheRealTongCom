'use client';

import * as React from "react"
import Topnav from "@/pageComps/20top"
import Footer from "@/pageComps/footer"
import allMatches from "@/pages/api/20compMat"
import contentMatches from "@/pages/api/20Detail"
import emptyMatches from "@/pages/api/20empty";
import Link from "next/link"
import Head
 from "next/head";
import { useRouter } from "next/router";


export async function getServerSideProps(context) {
  const IDs = context.params.hisID.split('##')
  const posts = IDs[1] != "zeroMatch" ? await allMatches(IDs[0]) : {"zeroMatch" : {"mLen" : 0, "name" : "無比對結果"}}
  var conts;
  
  if (IDs[1] != "zeroMatch" && IDs[1] != "plzSelect") {conts = await contentMatches(IDs[0], IDs[1])} 
  else {conts = await emptyMatches(IDs[0], 'tz', IDs[1])}
  
  return { props: { posts, conts } }
}

export default function Home({ posts, conts }) {
  const router = useRouter()
  const lenBool = router.query.hisID.split('##')[1] == "plzSelect"
  var chapName = router.query.chaps
  const bothID = router.query.hisID.split('##')

 
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
        <title>通志二十略比對結果</title>
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
                        query :{chaps: router.query.chaps, hisID: `${bothID[0]}##${key}`},
                        }}>{`${posts[key]['name']} (比對到${posts[key]['mLen']}字)`}
                    </Link>
                    )
                )
              }
            </div>
          </div>
          <div className="block w-full h-full pt-2">            
            <Link className = "block w-auto h-16 p-2 text-xl underline-offset-8 decoration-minor hover:underline hover:text-zinc-400" 
                  href = {{
                  pathname : "./",
                  query :{chaps: router.query.chaps},
                  }}>{`回到：${chapName}`}
            </Link>
            <div className="inline-flex justify-between w-full max-h-[80vh] pb-[5vh]">
              <div className="bg-sec rounded ml-8 w-[35vw] max-h-[72vh]">
                <div className="bg-minor/80 inline-flex justify-between w-full h-12 rounded text-[1.1vw] px-4 pt-2">
                  <p>{`${conts['tongName']} `}</p>
                  <p>{`總比對字數 : ${conts['tmLen']}字 / 總字數 : ${conts['tongLen']}字`}</p>
                </div>
                <div className="p-2 overflow-auto max-h-[66vh] text-[1.1vw] readSn" id = "LBox">
                  {alignBuilder(conts, 'tong', 'L')}                  
                </div >
              </div>
              <div className="bg-sec rounded mr-32 w-[35vw] max-h-[72vh]">
                <div className="bg-minor/80 inline-flex justify-between w-full h-12 rounded text-[1.1vw] px-4 pt-2">
                  <p>{`${conts['hisName']} `}</p>
                  <p>{`比對${lenBool ? 0 : posts[router.query.hisID.split('##')[1]]['mLen']}字 / 共${conts['hisLen']}字`}</p>
                </div>
                <div className="p-2 overflow-auto max-h-[66vh] text-[1.1vw] readSn" id = "RBox">
                  {alignBuilder(conts, 'his', 'R')}
                </div>
              </div>
            </div>
          </div>
        </div>
      <Footer />
    </div>
  )

}