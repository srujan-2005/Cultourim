import React from "react";
import bg2 from "../assets/bg2.png";
import gif from "../assets/gif.gif";
import Header from "../components/header";
import Bento from "../components/bento";
import gif2 from "../assets/gif2.gif";

export default function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-[#FDB99B] via-[#CF8BF3] to-[#A770EF]">     
               <div className="bg-pixel-gradient h-screen w-full" style={{imageRendering: "pixelated"}}>
                <div className="absolute inset-0 bg-white/10 backdrop-blur-md">
                </div>
                <Header/>
                <Bento/>
                <img src={bg2} alt="bg" className="w-full h-full object-cover" />
                <div>
                    <div className="absolute bottom-2 right-4 ">
                    <img src={gif} alt="gif" className="w-24 h-24" />
                    </div>
                </div>
               </div>
               
      </div>

    );
}