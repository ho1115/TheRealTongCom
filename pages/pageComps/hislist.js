import * as React from "react"
import 'tailwindcss/tailwind.css';
import pgData from "../pgData.json"
import Link from "next/link"

import { useRouter } from "next/router";
import { useEffect } from "react";


 
const sidelist = () => {
    const router = useRouter()
    const [book, setBook] = React.useState("tongchi");
    const [chapList, setchapList] = React.useState(["empty"]);
    

    useEffect(()=>{
        if(!router.isReady) {return};    
        const bookName = pgData.engToCh[router.query.books]
        setBook(router.query.books)
        setchapList(pgData.booksNchaps[bookName])
    }, [router.isReady, router.asPath]);
    
    return (
    <div className = "inline-flex flex-col w-1/6 fixed border-r-2 border-black top-16 h-screen bg-gray-300">
        <div className = "inline-flex flex-row w-auto border-b-2 border-black bg-neutral-700 h-16 justify font-bold place-items-center justify-around">        
            <p>選擇史料</p>        
            <select className = "text-black border-2 rounded border-black" id = "hisBook" name = "hisBook"
                    onChange = {(ele) => {setBook(ele.target.value);}}>
                {
                    Object.keys(pgData.engToCh).map(item => (
                        item === router.query.books ? 
                        <option key = {item} value = {item} selected>{pgData.engToCh[item]}</option> :
                        <option key = {item} value = {item}>{pgData.engToCh[item]}</option> 
                    ))
                }
            </select>
            <Link className = "w-12 rounded bg-neutral-500 text-center border-2 border-black hover:bg-neutral-400 " 
                  href = {{
                    pathname : "./[chaps]",
                    query :{ books: book, chaps: '1' },
                }}>查詢</Link>
        </div>
        <div className = "w-auto overflow-auto pb-2 px-2">
            {chapList.map(chaps => (
                <Link key = {chaps} className = "w-auto block p-3 text-black hover:bg-neutral-400 " 
                href = {{
                  pathname : "./[chaps]",
                  query :{ books: book, chaps: chapList.indexOf(chaps) + 1 },
              }}>{chaps}</Link>
            ))}
        </div>
    </div>
    );
}

export default sidelist;
