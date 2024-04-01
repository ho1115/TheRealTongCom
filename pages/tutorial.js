'use client';
import React from "react";
import Topnav from "@/pages/pageComps/topnav"
import Footer from "@/pages/pageComps/footer"
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";


export default  function Home() {

  return  (
    <div className = "inline-flex flex-wrap bg-main text-least " id = "whole">
      <Head>
        <title>通志史料比對系統</title>
      </Head>
      <div className = "w-screen sticky top-0 h-16">
        <Topnav />
      </div>
      <div className = "inline-flex w-screen min-h-[calc(100vh-5.5rem)]">
        <div className = "inline-flex flex-col w-1/5 m-2 p-2 top-16 self-center h-[calc(83vh-5.5rem)] bg-sec overflow-auto rounded">
          <p className = "border-b-2 border-minor p-2 text-2xl text-center">章節轉跳連結</p>
          <Link className = "text-lg m-2 decoration-minor underline-offset-4 decoration-2 hover:underline " href = "#比對方法"><br />文字比對方法說明</Link>
          <Link className = "text-lg m-2 decoration-minor underline-offset-4 decoration-2 hover:underline " href = "#比對範圍"><br />比對史料清單</Link>
          <Link className = "text-xl m-2 decoration-minor underline-offset-4 decoration-2 hover:underline " href = "#文字比對說明"><br />比對結果頁面</Link>
          <Link className = "text-lg m-2 decoration-minor underline-offset-4 decoration-2 hover:underline " href = "#文比1">- 比對結果頁面 / 史料及傳主選擇</Link>
          <Link className = "text-lg m-2 decoration-minor underline-offset-4 decoration-2 hover:underline " href = "#文比2"> - 比對結果頁面 / 文字比對結果</Link>
          <Link className = "text-xl m-2 decoration-minor underline-offset-4 decoration-2 hover:underline " href = "#數據分布頁面"><br />數據分布頁面</Link>
          <Link className = "text-lg m-2 decoration-minor underline-offset-4 decoration-2 hover:underline " href = "#數據1"> - 數據分布頁面 / 介面說明</Link>
          <Link className = "text-lg m-2 decoration-minor underline-offset-4 decoration-2 hover:underline " href = "#文比2"> - 數據分布頁面 / 其他史料介面說明</Link>
          <Link className = "text-xl m-2 decoration-minor underline-offset-4 decoration-2 hover:underline " href = "#版本切換說明"><br /><br />版本切換說明</Link>
          <Link className = "text-xl m-2 decoration-minor underline-offset-4 decoration-2 hover:underline " href = "#自行比對說明"><br /><br />自行比對說明</Link>
        </div>
        <div className="w-full block">
          <p className = "pb-2 text-2xl my-4 ml-2 border-b-2 border-minor">網站使用說明</p>
          <div className = "max-h-[80vh] overflow-auto">
          <div className = "mb-2" id = "比對方法">
              <p className = "border-b-2 border-minor/40 text-2xl pl-4 py-2">文字比對方法說明</p>
              <div className = "pl-6 inline-flex flex-col flex-wrap justify-center w-full">
                <p className = "my-4 text-xl">文字比對之意義：</p>
                <p className = "text-start w-full bg-sec/80 rounded p-2 text-lg">
                  在寫史參考史料時，因為個人主觀判斷、當時政治氛圍等等不同的多方因素影響，<br />
                  通常不會將參照的史料內容原封不動的抄寫過來，作者做出一定程度刪減/新增/修改都是很合理的現象。<br /><br />
                  將通志進行文字比對的意義即在於將兩段文字的異同處顯現出來，讓使用者能夠看見並推論分析鄭樵是出於甚麼原因，<br />
                  或是受了甚麼影響才在撰寫通志時做出了改動，並由此窺見鄭樵在撰寫通志背後的想法。
                </p>
                <p className = "my-4 text-xl">Levenshtein distance：</p>
                <p className = "text-start w-full bg-sec/80 rounded p-2 text-lg">
                   此為後續比對時會使用到的重要概念，可理解為"文字編輯距離"，計算的是將一段文字改為另一段文字需要做多少次的編輯。<br />
                   可接受的編輯方式有 1. 新增一個字 、 2. 刪除一個字 、 3. 替換一個字。<br />
                   每次的動作皆會被計算為 "1編輯距離"，兩段文字的編輯距離越長則代表相異的程度越高。
                </p>
                <p className = "my-4 text-xl">比對說明：</p>
                <p className = "text-start w-full bg-sec/80 rounded p-2 text-lg">
                   1. 萃取出A、B兩段比對文字的所有 "4-gram" 起點 ("4-gram" 即4字詞，如 "示範文字一" 有 "示範文字" 、 "範文字一" 兩個 "4-gram")<br />
                   2. 以A文本的所有 "4-gram" 為主，至B文本中的 "所有相同的4-gram起點" 開始進行第3至第4步的比對，直到A文本中的所有 "4-gram" 都已被比對過<br />
                   3-1. 比對前，會先檢查目前的"4-gram"在兩段文字中是否有被涵蓋在先前的比對結果內，若有則跳過不比，以避免重疊現象。<br />
                   3-2. 進入比對時，會從相同的四個字開始，每次皆在兩邊的比對文字多新增一個字計算相似度，相似度的計算方式為 1 - (Levenshtein distance / 目前長度)<br />
                   3-3. 當相似度連續下降6次、連續3次不達70%時，則捨去後段的6字或3字並中斷第3步的比對。 A、B文本已被比對到結尾時則直接中斷。<br />
                   3-4. 若本次比對結果不達10字則直接捨棄比對結果，略過第4步。<br />
                   4. 由於兩段文字的最佳比對結果不一定會出現在兩邊字數相同時 (因為增減的關係。) ，將會利用相似度以及編輯距離微調B文字的比對結果 (即刪去或多加入幾個字。)<br />
                   5. 最後會檢查所有比對結果是否有重疊的部分，若有則將其合併。<br />
                   *備註 : 比對時將會無視標點符號，計算相似度時會自動略過並將標點符號納入比對結果內。
                </p>
              </div>
            </div>
          <div className = "mb-2" id = "比對範圍">
              <p className = "border-b-2 border-minor/40 text-2xl pl-4 py-2">本系統比對史料清單</p>
              <div className = "pl-6 inline-flex flex-col flex-wrap justify-center w-full">
                <p className = "my-4 text-xl">正史：</p>
                <div className="inline-flex flex-wrap justify-around w-full bg-sec/80 rounded p-2 text-lg">
                  <p>史記</p><p>漢書</p><p>後漢書</p><p>三國志</p><p>晉書</p><p>宋書</p>
                  <p>南史</p><p>南齊書</p><p>梁書</p><p>陳書</p><p>北史</p><p>北齊書</p>
                  <p>周書</p><p>魏書</p><p>隋書</p>
                </div>
                <p className = "my-4 text-xl">其他史料：</p>
                <div className="inline-flex flex-wrap justify-around w-full bg-sec/80 rounded p-2 text-lg">
                  <p>帝王世紀</p><p>春秋公羊傳</p><p>春秋左傳</p><p>春秋穀梁傳</p>
                  <p>國語</p><p>戰國策</p><p>孔子家語</p><p>通典-邊防篇</p>
                </div>
              </div>
            </div>
            <div className = "mb-2" id = "文字比對說明">
              <p className = "border-b-2 border-minor/40 text-2xl pl-4 py-2">比對結果頁面</p>
              <div className = "pl-6 pt-4 inline-flex flex-col flex-wrap justify-center w-full" id = "文字比對">
                <p className = "border-l-2 border-minor pl-2 text-xl mb-4" id = "文比1">比對結果頁面-史料及傳主選擇</p>
                <Image className = "rounded p-4 self-center bg-minor/20"
                    src = "/tut1-1.jpg"
                    width = {1200}
                    height = {1200}
                    alt = "jcnBCL.jpg"/>
                <div className = "pl-2 text-lg bg-sec/60 rounded p-2 mt-2 ml-2 mr-16">
                  <p className = "text-center mb-4 text-base">上圖為比對結果的史料及傳主選擇頁面。</p>
                  <p className = "mb-4 pl-2 border-l-2 border-red-500">左側紅框的A區域可讓使用者選擇欲檢視的史料及章節。<br />選擇的史料為通志時將看到 "通志比對其他所有史料的結果"；
                    選擇的史料為其他史料時將看到 "該史料比對通志的結果"</p>
                  <p className = "mb-4 pl-2 border-l-2 border-green-500">中間綠框的B區域可讓使用者選擇傳主，點選底下的任一結果即可前往查看比對內容。<br />
                    本區除了提供該傳主的 "總比對字數/原文全部字數" 外，也提供各個比對結果的比對字數。<br />傳主的總比對字數不會重複統計重疊到的比對部分。</p>
                  <p className = "mb-4 pl-2 border-l-2 border-yellow-400">右側黃框的C區域提供本章節涵蓋的朝代、所有傳主的數量及名稱。</p>
                </div>
                <p className = "border-l-2 border-minor pl-2 text-xl my-4" id = "文比2">比對結果頁面-文字比對結果頁面</p>
                <Image className = "rounded p-4 self-center bg-minor/20"
                    src = "/tut1-2.jpg"
                    width = {1200}
                    height = {1200}
                    alt = "jcnBCL.jpg"/>
                <div className = "pl-2 text-lg bg-sec/60 rounded p-2 mt-2 ml-2 mr-16">
                  <p className = "text-center mb-4 text-base">上圖為文字比對結果頁面。</p>
                  <p className = "mb-4 pl-2 border-l-2 border-red-500">左側紅框的A區域可讓使用者選擇該傳主其他的比對結果。</p>
                  <p className = "mb-4 pl-2 border-l-2 border-green-500">上方綠框的B區域點擊後可以回到該傳主所屬的章節傳主列表</p>
                  <p className = "mb-4 pl-2 border-l-2 border-yellow-400">中間黃框的C區域則是比對內容。<br />藍底的文字為有比對到的段落。將滑鼠移到上方則兩邊的對應段落便會反紅；點擊則會將另一邊的文字位置移動到對應段落</p>
                </div>
              </div>
            </div>
            <div className = "mb-2" id = "數據分布頁面">
              <p className = "border-b-2 border-minor/40 text-2xl pl-4 py-2">數據分布頁面</p>
              <div className = "pl-6 pt-4 inline-flex flex-col flex-wrap justify-center w-full" id = "數據1">
                <p className = "border-l-2 border-minor pl-2 text-xl mb-4">數據分布頁面-介面說明</p>
                <Image className = "rounded p-4 self-center bg-minor/20"
                    src = "/tut1-3.jpg"
                    width = {1200}
                    height = {1200}
                    alt = "jcnBCL.jpg"/>
                <div className = "pl-2 text-lg bg-sec/60 rounded p-2 mt-2 ml-2 mr-16">
                  <p className = "text-center mb-4 text-base">上圖為數據分布頁面，此處可讓使用者以數據的方式掌握史料的比對狀況。</p>
                  <p className = "mb-4 pl-2 border-l-2 border-red-500">左側紅框的A區域可讓使用者選擇欲檢視的史料及章節。<br />選擇的史料為通志時可額外選擇想要以卷或是朝代做區分。</p>
                  <p className = "mb-4 pl-2 border-l-2 border-green-500">中間綠框的B區域為數據檢視-傳主分布區域，左上方的兩個按鈕可用於切換顯示B區域或C區域，右上則可切換排序方式。<br />使用者選擇以章節區分時，此處會提供以朝代做區分的傳主分布數據；<br />以朝代區分時，則會提供以卷區分的傳主分布數據。</p>
                  <p className = "mb-4 pl-2 border-l-2 border-yellow-400">下面黃框的C區域則提供本章節的比對結果在比對史料中的分布狀況。</p>
                </div>
                <p className = "border-l-2 border-minor pl-2 text-xl my-4" id = "數據2">數據分布頁面-其他史料介面說明</p>
                <Image className = "rounded p-4 self-center bg-minor/20"
                    src = "/tut1-4.jpg"
                    width = {1200}
                    height = {1200}
                    alt = "jcnBCL.jpg"/>
                <div className = "pl-2 text-lg bg-sec/60 rounded p-2 mt-2 ml-2 mr-16">
                  <p className = "text-center mb-4 text-base">上圖為數據分布的其他史料頁面。</p>
                  <p className = "mb-4 pl-2 border-l-2 border-red-500">左側紅框的A區域選擇的是非通志的其他史料時，則呈現內容會有些許不同。</p>
                  <p className = "mb-4 pl-2 border-l-2 border-green-500">中間綠框的B區域可檢視選擇的史料的"全書比對到的通志傳主概況"，比對結果的分布則可檢視所選章節的"通志比對詳細狀況"。
                  </p>
                </div>
              </div>
            </div>
            <div className = "mb-2" id = "版本切換說明">
              <p className = "border-b-2 border-minor/40 text-2xl pl-4 py-2">比對過濾版本說明</p>
              <div className = "pl-6 pt-4 inline-flex flex-col flex-wrap justify-center w-full" id = "過濾">
                <p className = "border-l-2 border-minor pl-2 text-xl mb-4">比對過濾說明</p>
                <Image className = "rounded p-4 self-center bg-minor/20"
                    src = "/tut1-5.jpg"
                    width = {1200}
                    height = {1200}
                    alt = "jcnBCL.jpg"/>
                <div className = "pl-2 text-lg bg-sec/60 rounded p-2 mt-2 ml-2 mr-16">
                  <p className = "text-center mb-4 text-base">在頁面最上方的紅框處會顯示使用者目前檢視的過濾版本，右側的綠框處則可做版本的切換。</p>
                  <p className = "mb-4 pl-2">由於本系統史料間比對時，最低比對字數為10字，因此會出現許多兩個史料間僅有10字左右的少字數比對結果 (如 : "段落一" 在 "段落二" 中 全部只比對到15字。)。<br />
                    因為本系統的比對方式主要是進行大段落的相似比對，在設計上有容忍段落間一定比例的不同處。<br />
                    但上述的少字數比對將因此多為不準確的比對結果 (如比對到10字，但實際上只有零散的7字相似。)。<br />
                    因應此現象，本系統預設呈現給使用者的是過濾後的版本。過濾條件為 "字數為15字以下(含) 且 比對字數比例低於該通志段落的總字數50%" 的比對結果將被屏除。
                    <br /> 使用者依然可依自身需求切換至未過濾的版本進行使用。
                  </p>
                </div>
              </div>
            </div>
            <div className = "mb-2" id = "自行比對說明">
              <p className = "border-b-2 border-minor/40 text-2xl pl-4 py-2">自行比對說明</p>
              <div className = "pl-6 pt-4 inline-flex flex-col flex-wrap justify-center w-full" id = "自比">
                <p className = "border-l-2 border-minor pl-2 text-xl mb-4">使用者自行比對</p>
                <Image className = "rounded p-4 self-center bg-minor/20"
                    src = "/tut1-6.jpg"
                    width = {1200}
                    height = {1200}
                    alt = "jcnBCL.jpg"/>
                <div className = "pl-2 text-lg bg-sec/60 rounded p-2 mt-2 ml-2 mr-16">
                  <p className = "my-4">本系統除了預設提供的比對外，也開放使用者自行比對感興趣的文字，可由右上角的連結進入比對頁面。<br />
                    目前的使用限制為僅開放單段文字vs單段文字間的比對。另在字數上限的部分為避免使用者的使用體驗卡頓，最多僅支援30000字(含標點)的比對。
                  </p>
                </div>
              </div>
            </div>
         </div>
        </div>
      </div>
      <Footer />
    </div>
  )

}