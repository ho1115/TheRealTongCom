import Topnav from "../../../pageComps/topnav"
import Hislist from "../../../pageComps/hislist"


export default function Home() {
  return  (
    <div className = "inline-flex flex-wrap bg-black text-white">
      <Topnav />
      <Hislist />
      <div><h1>比對頁面</h1></div>
    </div>
  )

}