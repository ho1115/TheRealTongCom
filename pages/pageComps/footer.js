import Image from 'next/image'

const footer = () => {
     return (
      <div className = "inline-flex w-screen fixed bottom-0 border-t-2 border-minor/20 h-8 justify bg-sec font-bold place-items-center justify-center">        
        <Image
            className = "rounded pr-4"
            src = "/doro.png"
            width = {40}
            height = {20}
            alt = "jcnBCL.jpg"
          />2024 國立臺灣大學 數位典藏與自動推論研究室
      </div>
    );
}

export default footer;
