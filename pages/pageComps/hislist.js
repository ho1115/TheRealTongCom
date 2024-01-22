import * as React from "react"
import 'tailwindcss/tailwind.css';
import entoch from "../entoch.json"
import chapStruct from "../chapStruct.json"
import Link from "next/link"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
  } from "@/components/ui/collapsible"


import { useRouter } from "next/router";
import { useEffect } from "react";
import subChaps from "../api/subChaps";

 
const sidelist = () => {
    const collaTarget = ["tongchi", "gonyang", "zuo", "guliang", "zhanguo", "tongbian"]
    const router = useRouter()
    const [book, setBook] = React.useState("tongchi");
    const [chapList, setchapList] = React.useState(["empty"]);

    function changeBTN(index) {
        if (typeof document !== 'undefined') {
            const ele = document.getElementById(index);
            ele.innerText = ele.innerText == String.fromCharCode(0x25B2) ? String.fromCharCode(0x25BC) : String.fromCharCode(0x25B2);
        }
    }
    const collaConstruct = (chaps) => {
        return (
            chapList[chaps].length > 1 ?
                <Collapsible>
                    <div className = "block text-black w-full py-2 overflow-auto border-b-2 border-gray-500">
                    <CollapsibleTrigger asChild>
                        <button onClick = {() => changeBTN('BTN'+chaps)} 
                            className="inline-flex rounded justify-center border-1 bg-neutral-500 hover:bg-neutral-600 w-6 h-6 text-center" 
                            id = {'BTN'+chaps}>&#9660;</button>
                    </CollapsibleTrigger>
                    <p className="inline-flex pl-2">{chaps}</p>
                    <CollapsibleContent className="overflow-auto border-2 border-gray-500 bg-gray-300">
                        {Object.values(chapList[chaps]).map(subs =>(
                        <Link key = {subs} className = "w-auto block py-1 pl-8 text-sm text-black hover:bg-neutral-500 " 
                            href = {{
                                pathname : "./[chaps]",
                                query :{ books: book, chaps: subs },
                            }}>{subs}
                        </Link>
                        ))}
                    </CollapsibleContent>
                    </div>
                </Collapsible> :
                <div className = "block text-black w-full py-2 overflow-auto border-b-2 border-gray-500">
                    <Link key = {chaps} className = "w-auto block py-1 pl-2  text-black hover:bg-neutral-500 " 
                        href = {{
                            pathname : "./[chaps]",
                            query :{ books: book, chaps: Object.values(chapList[chaps])[0] },
                        }}>{ '- ' + chaps}
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
    }, [router.isReady, router.asPath]);
    
    return (
    
    <div className = "inline-flex flex-col w-1/6 border-r-2 border-black top-16 h-[calc(100vh-5.5rem)] bg-gray-400">
        <div className = "inline-flex flex-row w-auto border-b-2 border-black bg-neutral-700 min-h-16 font-bold place-items-center justify-around">        
            <p className = "truncate">選擇史料</p>        
            <select className = "text-black border-2 max-w-[10vw] rounded border-black" id = "hisBook" name = "hisBook"
                    onChange = {(ele) => {setBook(ele.target.value); setchapList(chapStruct[entoch[ele.target.value]])}}>
                {
                    Object.keys(entoch).map(item => (
                        item === router.query.books ? 
                        <option key = {item} value = {item} selected>{entoch[item]}</option> :
                        <option key = {item} value = {item}>{entoch[item]}</option> 
                    ))
                }
            </select>
        </div>
        <div className = "w-auto overflow-auto max-h-screen pb-2 px-2">
            {
            !collaTarget.includes(book) ?
                chapList.map(chaps => ( 
                    <Link key = {chaps} className = "w-auto block p-2 text-black hover:bg-neutral-500 " 
                        href = {{
                        pathname : "./[chaps]",
                        query :{ books: book, chaps: chapList.indexOf(chaps) + 1 },
                        }}>{chaps}
                    </Link>
                    )
                ) : Object.keys(chapList).map(chaps => collaConstruct(chaps))}
        </div>
    </div>
    );
}

export default sidelist;
