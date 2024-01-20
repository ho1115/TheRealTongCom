import * as React from "react"
import Link from "next/link"
import 'tailwindcss/tailwind.css';
import { useRouter } from "next/router";

 
const topnav = () => {
    const pathName = useRouter().pathname;
    console.log(pathName)
    const usual = 'text-center text-zinc-400 hover:text-zinc-200';
    const current = 'text-center text-zinc-100 hover:text-zinc-200';
    const version = pathName.startsWith('/not-filtered') ? '過濾版本' : '未過濾版本';
    const reVersion = pathName.startsWith('/not-filtered') ? '未過濾版本' : '過濾版本';
    const pathPre = pathName.startsWith('/not-filtered') ? '/not-filtered' : '/filtered';
    

    return (
      <div className = "inline-flex w-screen sticky top-0 border-b-2 border-gray-600 h-16 justify font-bold place-items-center">        
        <div className="inline-flex pl-8 w-1/6"><Link className = "text-center text-3xl truncate"  href ='/welcome'>通志史料比對系統</Link></div>        
        <nav className = "inline-flex pl-8 place-items-center gap-6 text-lg">
          <Link className= {pathName.includes('compRes')? current : usual} href = {pathPre + '/compRes/tongchi/1'} >比對結果</Link>
          <Link className= {pathName.includes('dataStat')? current : usual} href = {pathPre + '/dataStat/tongchi/1'}>數據分布</Link>
          <Link className= {pathName.includes('tutorial')? current : usual} href = '/tutorial'>使用說明</Link>
          <Link className= {usual} href = {pathName.startsWith('/not-filtered') ? '/filtered/compRes/tongchi/1' : '/not-filtered/compRes/tongchi/1'}>{version}</Link>
          <Link className= {pathName.includes('usercompare')? current : usual} href = {pathPre + '/usercompare'}>自行比對文字</Link>
        </nav>
        <div className="inline-flex pl-8 place-items-center w-auto"><p className = "text-sm text-orange-200 truncate">(目前檢視版本 : {reVersion})</p></div>
      </div>
    );
}

export default topnav;
