import * as React from "react"
import Link from "next/link"
import Image from "next/image";
import '@/app/globals.css'
import { useRouter} from "next/router";

 
const Topnav = () => {
    const pathName = useRouter().pathname;
    
    const usual = 'text-center text-least hover:text-zinc-400';
    const current = 'text-center text-minor hover:text-zinc-400';
    const version = pathName.startsWith('/not-filtered') ? '過濾版本' : '未過濾版本';
    const reVersion = pathName.startsWith('/not-filtered') ? '未過濾版本' : '過濾版本';
    const pathPre = pathName.startsWith('/not-filtered') ? '/not-filtered' : '/filtered';
    const [searchTarget, setSearchTar] = React.useState("請輸入搜尋對象");

    return (
      <div className = "inline-flex justify-between w-screen max-w-[100vw] bg-sec sticky top-0 border-b-2 border-minor h-16  font-bold place-items-center">        
        <div className="inline-flex pl-4 min-w-[30vw] justify-between">
          <Link className = "text-center text-3xl truncate inline-flex"  href ='/filtered/compRes/tongchi/本紀 第一'>
            <Image
              className = "rounded pr-4"
              src = "/logo.png"
              width = {100}
              height = {100}
              alt = "jcnBCL.jpg"
            /><p className="self-center">通志史料比對系統</p>
          </Link>
          <p className = "text-base text-least self-end truncate ml-4">{pathName.startsWith('/us') || pathName.startsWith('/tut')  || pathName.startsWith('/af') ? '' : `目前檢視版本 : ${reVersion}`}</p>
        </div>
        <div className = "inline-flex">   
          <div>
            <input type = 'text' id = 'peoSer' className = "ml-2 rounded p-1 border-2 border-gray-600/50 bg-gray-400/40" 
                    onChange = {(ele) => {setSearchTar(ele.target.value)}}></input>
            <Link className = "ml-2 rounded hover:bg-minor/60 p-1 bg-minor/30" 
                  href = {searchTarget === '' ? pathPre + '/searchresult/請輸入搜尋對象' : pathPre + '/searchresult/' + searchTarget} target="_blank">搜尋通志傳主</Link>
          </div>
          <nav className = "inline-flex pl-4 mr-10 min-w-[30vw] place-items-center justify-around gap-6 text-lg">
            <Link className= {pathName.includes('compRes')? current + ' truncate' : usual + ' truncate'} href = {pathPre + '/compRes/tongchi/本紀 第一'} target="_blank">比對結果</Link>
            <Link className= {pathName.includes('stats')? current + ' truncate' : usual + ' truncate'} href = {pathPre + '/stats/tongchi/本紀 第一'} target="_blank">數據分布</Link>
            <Link className= {pathName.includes('tutorial')? current + ' truncate' : usual + ' truncate'} href = '/tutorial' target="_blank">使用說明</Link>
            <Link className= {usual + ' truncate'}
                href = {pathName.startsWith('/not-filtered') ? '/filtered/compRes/tongchi/本紀 第一' : '/not-filtered/compRes/tongchi/本紀 第一'}>
                {version}
            </Link>
            <Link className= {pathName.includes('usercompare')? current + ' truncate' : usual + ' truncate'} href = '/usercompare' target="_blank">自行比對文字</Link>
          </nav>
        </div>  
      </div>
    );
}

export default Topnav;
