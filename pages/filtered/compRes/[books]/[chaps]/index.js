import Topnav from "@/pages/pageComps/topnav"
import Hislist from "@/pages/pageComps/hislist"
import Footer from "@/pages/pageComps/footer"
import subChapRoute from "@/pages/api/subChaps"
import { useRouter } from "next/router";

import entoch from "@/pages/entoch"
import chapStruct from "@/pages/chapStruct.json"

export async function getServerSideProps(context) {
  const BList = ["通志", "春秋公羊傳", "春秋左傳", "春秋穀梁傳", "通典-邊防篇", "戰國策"]
  const bookName = entoch[context.params.books]
  var chapName = context.params.chaps
  if (!BList.includes(bookName)) {chapName = chapStruct[bookName][chapName - 1]}
  
  const posts = await subChapRoute(bookName, chapName, 'cut')
    
  return { props: { posts } }
}

export default function Home({ posts }) {
  const BList = ["通志", "春秋公羊傳", "春秋左傳", "春秋穀梁傳", "通典-邊防篇", "戰國策"]
  const router = useRouter()
  const bookName = entoch[router.query.books]
  var chapName = router.query.chaps
  if (!BList.includes(bookName)) {chapName = chapStruct[bookName][chapName - 1]}
  const title = bookName + ' - ' + chapName

  return  (
    <div className = "inline-flex flex-wrap bg-black text-white" id = "whole">
      <div className = "w-screen sticky top-0 h-16">
        <Topnav />
      </div>
      <div className = "inline-flex w-screen h-[calc(100vh-5.5rem)] bg-orange-400">
        <Hislist />
        <div className = "block container start-96 w-screen h-full bg-orange-400" >
          <p className = "w-full h-12 bg-orange-700">{title}</p>
          <div className = "relative w-full mt-16  bg-orange-600">
            <p className = "w-full h-6">{posts['dynas'] +posts['peopleList']}</p>
            {
              Object.entries(posts['people']).map(([key, value]) => (
              
                <div className = "5646">{key + '-' + value['tongID']}</div>
  
              ))
            }
          </div>
        </div>
      </div>
      <Footer />
    </div>
    
  )

}