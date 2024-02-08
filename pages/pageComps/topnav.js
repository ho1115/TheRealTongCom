import * as React from "react"
import Link from "next/link"
import Image from "next/image";
import '@/app/globals.css'
import { useRouter } from "next/router";

 
const Topnav = () => {
    const pathName = useRouter().pathname;
    
    const usual = 'text-center text-least hover:text-zinc-400';
    const current = 'text-center text-minor hover:text-zinc-400';
    const version = pathName.startsWith('/not-filtered') ? '過濾版本' : '未過濾版本';
    const reVersion = pathName.startsWith('/not-filtered') ? '未過濾版本' : '過濾版本';
    const pathPre = pathName.startsWith('/not-filtered') ? '/not-filtered' : '/filtered';
    

    return (
      <div className = "inline-flex justify-between w-screen max-w-[100vw] bg-sec sticky top-0 border-b-2 border-minor h-16  font-bold place-items-center">        
        <div className="inline-flex pl-4 w-[30vw] justify-between">
          <Link className = "text-center text-3xl truncate inline-flex"  href ='/'>
            <Image
              className = "rounded pr-4"
              src = "/logo.png"
              width = {100}
              height = {100}
              alt = "jcnBCL.jpg"
            /><p className=" self-center">通志史料比對系統</p>
          </Link>
          <p className = "text-base text-least self-end truncate">{pathName.startsWith('/us') || pathName.startsWith('/tut')  || pathName.startsWith('/af') ? '' : `目前檢視版本 : ${reVersion}`}</p>
        </div>
        <div>   
          <nav className = "inline-flex pl-4 mr-10 w-[30vw] place-items-center justify-around gap-6 text-lg">
            <Link className= {pathName.includes('compRes')? current + ' truncate' : usual + ' truncate'} href = {pathPre + '/compRes/tongchi/本紀 第一'} >比對結果</Link>
            <Link className= {pathName.includes('stats')? current + ' truncate' : usual + ' truncate'} href = {pathPre + '/stats/tongchi/本紀 第一'}>數據分布</Link>
            <Link className= {pathName.includes('tutorial')? current + ' truncate' : usual + ' truncate'} href = '/tutorial'>使用說明</Link>
            <Link className= {usual + ' truncate'}
                href = {pathName.startsWith('/not-filtered') ? '/filtered/compRes/tongchi/本紀 第一' : '/not-filtered/compRes/tongchi/本紀 第一'}>
                {version}
            </Link>
            <Link className= {pathName.includes('usercompare')? current + ' truncate' : usual + ' truncate'} href = '/usercompare'>自行比對文字</Link>
          </nav>
        </div>  
      </div>
    );
}

export default Topnav;
