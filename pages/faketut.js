'use client';
import React from "react";
import Topnav from "@/pageComps/topnav"
import Footer from "@/pageComps/footer"
import Head from "next/head";
import Image from "next/image";


export default  function Home() {

  return  (
    <div className = "inline-flex flex-wrap bg-main text-least" id = "whole">
      <Head>
        <title>通志史料比對系統</title>
      </Head>
      <div className = "w-screen sticky top-0 h-16">
        <Topnav />
      </div>
        <div className = "w-[100vw] h-[100vh]">
            才不要教你怎麼用哩，笑死
            <Image
                src = "/bigBCL.png" 
                width = {650}
                height = {400}
                alt = "速度與激情9"
            />
        </div>
      <Footer />
    </div>
  )

}