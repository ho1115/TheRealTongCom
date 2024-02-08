import Link from "next/link";
import Footer from "@/pages/pageComps/footer";
export default function notFound() {
  return  (
 
    <div className = "bg-main inline-flex justify-center min-w-[100vw] min-h-[100vh] text-least">
      <div className = " bg-sec/50 p-8 rounded block self-center w-3/4">
        <p className = "w-full text-3xl text-center">oops! 您似乎存取到了不存在的頁面！請點下面連結回到首頁。</p>
        <div className = "w-full justify-center inline-flex mt-4">
          <Link className = "text-center text-xl truncate border-2 border-minor rounded bg-minor/30 p-2 hover:bg-minor/60"  href ='/'>回到首頁</Link> 
        </div>       
      </div>
      <Footer />
    </div>
  )

}