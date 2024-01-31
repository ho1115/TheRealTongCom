'use client';

import * as React from "react"
import Topnav from "@/pages/pageComps/topnav"
import Footer from "@/pages/pageComps/footer"
import Statlist from "@/pages/pageComps/statlist"


export default function Home({ posts, conts }) {
 
  return  (
    <div className = "inline-flex flex-wrap bg-main text-least" id = "whole">
      <div className = "w-screen sticky top-0 h-16">
        <Topnav />
      </div>
      <div className = "inline-flex w-screen h-[calc(100vh-5.5rem)]">
        <Statlist />
      </div>
      <Footer />
    </div>
  )

}