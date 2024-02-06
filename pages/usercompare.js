'use client';
import React from "react";
import Topnav from "@/pages/pageComps/topnav"
import Footer from "@/pages/pageComps/footer"
import textCompare from "./api/startCompare";
import Head from "next/head";
import { useState } from "react";

export default  function Home() {
  const [LText, setLT] = useState('請貼上比對文字')
  const [RText, setRT] = useState('請貼上比對文字')
  const [LTlen, setLlen] = useState(7)
  const [RTlen, setRlen] = useState(7)
  const [matchResult, setMatch] = useState('notYet')

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
    if (matchJs === "noRes") {return "無比對結果"}
    if (matchJs === "error:tooLong") {return "字數超過上限，請減少字數"}
    if (matchJs === "error:tooShort") {return "字數過短，請增加字數"}
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

  const setCompText = (ele) => {
    if (ele.target.id === "LBox") {
      setLT(ele.target.value)
      setLlen(ele.target.value.length)
    }
    else {
      setRT(ele.target.value)
      setRlen(ele.target.value.length)
    }
  }

  const refresh = () => {
    setMatch("notYet"); 
    setLlen(7); 
    setRlen(7)
    setLT('請貼上比對文字')
    setRT('請貼上比對文字')
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
        <div className = "inline-flex flex-col justify-around w-1/5 m-2 p-2 bg-sec text-lg self-center rounded overflow-auto">
            <p className="border-b-2 border-minor text-center text-2xl py-2">使用說明</p>
            <div className="self-center">
                <p className="pl-2 pt-4">1. 目前僅開放單段文字間的比對</p>
                <p className="pl-2 pt-4">2. 單段字數下限為10字，上限為30000字(含標點)</p>
                <p className="pl-2 pt-4">3. 請將比對文字分別貼到左右區域內後，按下開始比對</p>
                <p className="pl-2 pt-4">4. 比對時請勿關閉分頁，否則該次比對將會中斷</p>
                <p className="pl-2 pt-4">5. 比對等候時間視伺服器擁塞程度可能會有所不同，感謝使用者們的耐心等候</p>
                <p className="pl-2 pt-4">6. 比對完成後，若欲重新比對請先按下重新比對</p>
            </div>
            <div className = "inline-flex justify-around">
              <button className = "bg-minor/30 p-2 mt-4 rounded border-2 border-minor hover:bg-minor/60 self-center" 
                      onClick = {() => {setMatch(textCompare(LText, RText))}}>開始比對
              </button>
              <button className = "bg-minor/30 p-2 mt-4 rounded border-2 border-minor hover:bg-minor/60 self-center"
                      onClick = {refresh}>重新比對
              </button>
            </div>
        </div>
        <div className="w-full block">
            <div className="inline-flex justify-between pt-16 w-full h-[81vh]">
              <div className="bg-sec rounded ml-8 w-[35vw] h-[77vh]">
                <div className="bg-minor/80 inline-flex justify-between w-full h-12 rounded text-xl px-4 pt-2">
                  <p>比對文字(一)</p>
                  <p>{`共${LTlen}字(含標點)`}</p>
                </div>
                { matchResult === "notYet" ?
                  <textarea className="p-2 overflow-auto max-h-[72vh] w-full h-full text-lg bg-main/0" value = {LText} id = "LBox" onChange = {setCompText}/>
                  :
                  <div className="p-2 overflow-auto max-h-[72vh] text-lg" id = "LBox">{alignBuilder(matchResult, 'tong', 'L')}</div>
                }
              </div>
              <div className="bg-sec rounded mr-32 w-[35vw] h-[77vh]">
                <div className="bg-minor/80 inline-flex justify-between w-full h-12 rounded text-xl px-4 pt-2">
                  <p>比對文字(二)</p>
                  <p>{`共${RTlen}字(含標點)`}</p>
                </div>
                { matchResult === "notYet" ?
                  <textarea className="p-2 overflow-auto max-h-[72vh] w-full h-full text-lg bg-main/0" value = {RText} id = "RBox" onChange = {setCompText}/>
                  : 
                  <div className="p-2 overflow-auto max-h-[72vh] text-lg" id = "RBox">{alignBuilder(matchResult, 'his', 'R')}</div>
                }
              </div>
            </div>
        </div>
      </div>
      <Footer />
    </div>
  )

}