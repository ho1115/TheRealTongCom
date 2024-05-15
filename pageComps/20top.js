import * as React from "react"
import Link from "next/link"
import Image from "next/image";
import '@/app/globals.css'
import { useRouter} from "next/router";

 
const Topnav = () => {
    return (
      <div className = "inline-flex justify-between w-screen max-w-[100vw] bg-sec sticky top-0 border-b-2 border-minor h-16  font-bold place-items-center">        
        <div className="inline-flex pl-4 min-w-[30vw] justify-between">
          <Link className = "text-center text-3xl truncate inline-flex"  href ='/20s/略-氏族略'>
            <Image
              className = "rounded pr-4"
              src = "/logo.png"
              width = {60}
              height = {60}
              alt = "jcnBCL.jpg"
            /><p className="self-center text-[2vw]">通志二十略比對結果</p>
          </Link>
        </div>
      </div>
    );
}

export default Topnav;
