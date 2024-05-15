import * as React from "react"
import '@/app/globals.css'
import Link from "next/link"


import { useRouter } from "next/router";

const chapList = ["略-氏族略", "略-六書略", "略-諡略", "略-禮略", "略-器服略", "略-樂略",
                    "略-職官略", "略-選舉略", "略-刑法略", "略-食貨略", "略-昆蟲草木略"]

const Sidelist = () => {
    
    const router = useRouter()
   
    const collaConstruct = (chaps) => {
        return (
            <div key = {`${chaps}00`} className = "block w-full py-2 overflow-auto border-b-2 border-sec">
                <Link key = {chaps} className = "w-auto block py-1 pl-2 hover:bg-neutral-600 " 
                    href = {{
                        pathname : "./[chaps]",
                        query :{chaps: chaps},
                    }}>{chaps}
                </Link>
            </div>
        )
    }

    const preNextBTN = () => {
        
        const tarCh = router.query.chaps
        var thisIdx = chapList.indexOf(tarCh)
    
        return (
            <div className = "inline-flex justify-around w-full border-b-2 border-minor pb-2">
                <Link key = {tarCh} className = "text-[1vw] w-auto block p-2 hover:bg-neutral-600 rounded" 
                    href = {{
                    pathname : "./[chaps]",
                    query :{ chaps: thisIdx == 0 ? chapList[9] :  chapList[thisIdx-1]},
                    }}>＜- 前往上一卷
                </Link>
                <Link key = {tarCh} className = "text-[1vw] w-auto block p-2 hover:bg-neutral-600 rounded" 
                    href = {{
                    pathname : "./[chaps]",
                    query :{ chaps: thisIdx == 9 ? chapList[0] : chapList[thisIdx+1]},
                    }}>前往下一卷 -＞
                </Link>
            </div>
        )
    }
    
    return (
    
    <div className = "inline-flex flex-col w-1/5 m-2 p-2 top-16 h-[calc(100vh-5.5rem)] bg-main">
        <div>{preNextBTN()}</div>
        <div className = "w-auto overflow-auto max-h-screen text-least pb-2 px-2 border-l-2 border-minor">
            {
             chapList.map(chaps => collaConstruct(chaps))
            }
        </div>
    </div>
    );
}

export default Sidelist;
