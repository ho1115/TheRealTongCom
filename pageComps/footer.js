import Image from 'next/image'

const footer = () => {
     return (
      <div className = "inline-flex w-screen h-[2.5vh] ft bottom-0 border-minor/20 bg-sec font-bold place-items-center justify-center">        
        <Image
            className = "rounded pr-4"
            src = "/logo.png"
            width = {50}
            height = {50}
            alt = "jcnBCL.jpg"
          />2024 國立臺灣大學 數位典藏與自動推論研究室
          <p className = 'text-sm px-8'>請使用1920*1080解析度以獲得較佳使用體驗</p>
          <a href="https://www.flaticon.com/free-icons/book" title="book icons">icons created by Freepik - Flaticon</a>
      </div>
    );
}

export default footer;
