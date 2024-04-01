import Image from 'next/image'

const footer = () => {
     return (
      <div className = "inline-flex w-screen fixed bottom-0 border-t-2 border-minor/20 bg-sec font-bold place-items-center justify-center">        
        <Image
            className = "rounded pr-4"
            src = "/logo.png"
            width = {60}
            height = {60}
            alt = "jcnBCL.jpg"
          />2024 國立臺灣大學 數位典藏與自動推論研究室
          <p className = 'text-sm ml-8'>請使用1920*1080以上解析度以獲得較佳使用體驗</p>
      </div>
    );
}

export default footer;
