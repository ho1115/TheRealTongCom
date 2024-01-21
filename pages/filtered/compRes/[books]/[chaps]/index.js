import Topnav from "@/pages/pageComps/topnav"
import Hislist from "@/pages/pageComps/hislist"


import pgData from "@/pages/pgData.json"



// export async function getServerSideProps(context) {
  
  // const bookName = pgData.engToCh[context.params.books]
  // const chapName = pgData.booksNchaps[bookName][context.params.chaps - 1]
  // const posts = await subChaps(bookName, chapName, 'cut')
  // return { props: { posts } }
// }

export default function Home({ posts }) {
  
  return  (
    <div className = "inline-flex flex-wrap bg-black text-white">
      <Topnav />
      <Hislist />
      <div className = "inline-flex pl-1/6 bg-orange"><h1>fuck</h1></div>
    </div>
  )

}