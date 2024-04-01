import * as React from "react"
import '@/app/globals.css'
import entoch from "@/jsonBase/entoch.json"
import chapStruct from "@/jsonBase/chapStruct.json"
import tVol from "@/jsonBase/tzVol.json"
import tDyn from "@/jsonBase/tzVolDyn.json"
import Link from "next/link"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
  } from "@/components/ui/collapsible"


import { useRouter } from "next/router";
import { useEffect } from "react";

 
const Sidelist = () => {
    const collaTarget = ["tongchi", "gonyang", "zuo", "guliang", "zhanguo", "tongbian"]
    const router = useRouter()
    const [book, setBook] = React.useState("tongchi");
    const [chapList, setchapList] = React.useState(["empty"]);

    function changeBTN(index) {
        if (typeof document !== 'undefined') {
            const ele = document.getElementById(index).children[0];
            ele.innerText = ele.innerText == String.fromCharCode(0x25B2) ? String.fromCharCode(0x25BC) : String.fromCharCode(0x25B2);
        }
    }
    const collaConstruct = (chaps, tzBool) => {
        return (
            chapList[chaps].length > 1 ?
                <Collapsible key = {`${chaps}00`}>
                    <div key = {`${chaps}0`} className = "block w-full py-2 justify-between overflow-auto border-b-2 border-sec">
                    <div key = {`${chaps}1`} className = "justify-between w-full">
                        <CollapsibleTrigger asChild key = {chaps}>
                            <button onClick = {() => changeBTN('BTN'+chaps) } key = {`${chaps}2`} 
                                className="w-full inline-flex h-full text-start pl-2 py-1 hover:bg-neutral-600 outline-none" 
                                id = {'BTN'+chaps}>{chaps} <p className="pl-2 text-minor">&#9660;</p></button>
                        </CollapsibleTrigger>
                    </div>
                    <CollapsibleContent key = {`${chaps}3`} className="overflow-auto border-2 rounded mt-2 border-minor bg-sec">
                        {Object.values(chapList[chaps]).map(subs =>(
                        <Link key = {subs} className = "w-auto block py-1 pl-8 text-sm hover:bg-neutral-600 " 
                            href = {{
                                pathname : "./[chaps]",
                                query :{ books: book, chaps: subs },
                            }}>{tzBool ? `${subs} (第${tVol[subs]}卷, ${tDyn[tVol[subs]]})` : subs}
                        </Link>
                        ))}
                    </CollapsibleContent>
                    </div>
                </Collapsible> :
                <div key = {`${chaps}00`} className = "block w-full py-2 overflow-auto border-b-2 border-sec">
                    <Link key = {chaps} className = "w-auto block py-1 pl-2 hover:bg-neutral-600 " 
                        href = {{
                            pathname : "./[chaps]",
                            query :{ books: book, chaps: Object.values(chapList[chaps])[0] },
                        }}>{chaps}
                    </Link>
                </div>
        )
    }

    const preNextBTN = () => {
        
        const tarCh = router.query.chaps
        const bk = router.query.books
        var mergedArr = []
        var thisIdx = -1
        if (collaTarget.includes(bk)) {
            let bkCh = entoch[bk]
            Object.values(chapStruct[bkCh]).map((chaps) => (mergedArr = mergedArr.concat(chaps)));
            thisIdx = mergedArr.indexOf(tarCh);
        }
        return (
            !collaTarget.includes(bk) ?
                <div className = "inline-flex justify-around w-full border-b-2 border-minor pb-2">
                    <Link key = {tarCh} className = "w-auto block p-2 hover:bg-neutral-600 rounded" 
                        href = {{
                        pathname : "./[chaps]",
                        query :{ books: bk, chaps: tarCh == 1 ? 1 : tarCh - 1},
                        }}>＜- 前往上一卷
                    </Link>
                    <Link key = {tarCh} className = "w-auto block p-2 hover:bg-neutral-600 rounded" 
                        href = {{
                        pathname : "./[chaps]",
                        query :{ books: bk, chaps: tarCh == chapList.length ? tarCh : parseInt(tarCh) + 1},
                        }}>前往下一卷 -＞
                    </Link>
                </div>
                 :
                 <div className = "inline-flex justify-around w-full border-b-2 border-minor pb-2">
                    <Link key = {tarCh} className = "w-auto block p-2 hover:bg-neutral-600 rounded" 
                        href = {{
                        pathname : "./[chaps]",
                        query :{ books: bk, chaps: thisIdx == 0 ? mergedArr[thisIdx] :  mergedArr[thisIdx-1]},
                        }}>＜- 前往上一卷
                    </Link>
                    <Link key = {tarCh} className = "w-auto block p-2 hover:bg-neutral-600 rounded" 
                        href = {{
                        pathname : "./[chaps]",
                        query :{ books: bk, chaps: thisIdx == mergedArr.length-1 ?  mergedArr[thisIdx] :  mergedArr[thisIdx+1]},
                        }}>前往下一卷 -＞
                    </Link>
             </div>
        )
    }

    useEffect(()=>{
        if(!router.isReady) {return};  
        const bookName = entoch[router.query.books]
        setBook(router.query.books)
        setchapList(chapStruct[bookName])
        if(!(router.query.books in entoch)) {
            setchapList(["網址錯誤，無對應史料，請重新查詢，或點擊此處。"])
            setBook("tongchi")
        }
    }, [router.isReady, router.asPath, router.query.books]);
    
    return (
    
    <div className = "inline-flex flex-col w-1/5 m-2 p-2 top-16 h-[calc(100vh-5.5rem)] bg-main">
        <div className = "inline-flex flex-row w-auto min-h-12 border-b-2 mb-2 border-sec font-bold place-items-center justify-around">             
            <select className = "w-full h-full text-xl p-2 rounded text-least mb-2 bg-sec outline-none" id = "hisBook" name = "hisBook"
                    onChange = {(ele) => {setBook(ele.target.value); setchapList(chapStruct[entoch[ele.target.value]])}} defaultValue={router.query.books}>
                {
                    Object.keys(entoch).map(item => (<option key = {item} value = {item}>{entoch[item]}</option> ))
                }
            </select>
        </div>
        <div>{preNextBTN()}</div>
        <div className = "w-auto overflow-auto max-h-screen text-least pb-2 px-2 border-l-2 border-minor">
            {
            !collaTarget.includes(book) ?
                chapList.map(chaps => ( 
                    <Link key = {chaps} className = "w-auto block p-2 hover:bg-neutral-600 border-b-2 border-sec" 
                        href = {{
                        pathname : "./[chaps]",
                        query :{ books: book, chaps: chapList.indexOf(chaps) + 1 },
                        }}>{chaps}
                    </Link>
                    )
                ) : Object.keys(chapList).map(chaps => collaConstruct(chaps, book == "tongchi"))}
        </div>
    </div>
    );
}

export default Sidelist;
