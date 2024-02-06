import Link from 'next/link'
import Image from 'next/image'
import Footer from '@/pages/pageComps/footer'

export default function Home() {
  return  (
    <div className = "bg-main inline-flex justify-center min-w-[100vw] min-h-[100vh] text-least">
      <div className = " bg-sec/50 p-8 rounded self-center w-3/4 inline-flex">
        <div className = "h-full">
          <Image
            className = "rounded"
            src = "/welcome.jpg"
            width = {650}
            height = {400}
            alt = "jcnBCL.jpg"
          />
          <div className = "inline-flex">
            <Image
              className = "rounded pr-4 h-[80px] self-center"
              src = "/doro.png"
              width = {100}
              height = {30}
              alt = "jcnBCL.jpg"
            />
            <p className = 'w-full text-[3.5rem] text-center pt-2 mt-2 inline-flex'>通志史料比對系統</p>
          </div>
        </div>
        <div className = 'h-[70vh] inline-flex flex-col justify-around ml-4'>
          <ul className = 'w-[40vw] h-[55vh] bg-minor/10 rounded m-4 text-2xl p-4 justify-around inline-flex flex-col'>
            <li className = 'py-4'>通志史料比對系統是將宋代鄭樵所著的通志，針對其他史料如史記、晉書、春秋三傳等，進行文字比對，讓使用者可以清楚檢視通志各段文字的可能出處。</li>
            <li className = 'py-4'>除了將通志做為檢視主體外，使用者也可以將其他史料做為檢視主體，檢視該史料有多少部分的文字被多少部分的通志段落使用到。</li>
            <li className = 'py-4'>本系統在提供文字比對結果的同時，也提供比對的相關數據給使用者檢視。</li>
            <li className = 'py-4'>另外，本系統也開放使用者自行貼上任意兩段文字進行比對，系統將會利用和比對史料相同的方式替使用者比對貼上的兩段文字。</li>
          </ul>
          <div className = "w-full inline-flex justify-end">
            <Link className = "bg-minor/40 border-2 rounded border-minor hover:bg-minor/60 text-3xl p-2 m-4" href = "tutorial">使用說明</Link>
            <Link className = "bg-minor/40 border-2 rounded border-minor hover:bg-minor/60 text-3xl p-2 m-4" href="filtered/compRes/tongchi/本紀 第一">進入系統</Link>
          </div>
          
        </div>
        
      </div>
      <Footer />
    </div>
    
  )
}