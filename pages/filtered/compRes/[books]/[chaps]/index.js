import Topnav from "@/pages/pageComps/topnav"
import Hislist from "@/pages/pageComps/hislist"
import Footer from "@/pages/pageComps/footer"

// export async function getServerSideProps(context) {
  
  // const bookName = pgData.engToCh[context.params.books]
  // const chapName = pgData.booksNchaps[bookName][context.params.chaps - 1]
  // const posts = await subChaps(bookName, chapName, 'cut')
  // return { props: { posts } }
// }

export default function Home({ posts }) {
  
  return  (
    <div className = "inline-flex flex-wrap bg-black text-white" id = "whole">
      <div className = "w-screen sticky top-0 h-16">
        <Topnav />
      </div>
      <div className = "inline-flex w-screen h-[calc(100vh-5.5rem)] bg-orange-400">
        <Hislist />
        <div className = "inline-flex start-96 w-screen h-full bg-orange-400" >fuck</div>
      </div>
      <Footer />
    </div>
    
  )

}