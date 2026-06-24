import React from "react";
import TravelJournal from "../components/voyage_vibe";
import Header from "../components/header";
import Sidebar from "../components/sidebar";
import bg2 from "../assets/bg2.png"

export default function Voyage(){
    return(
        <div className="bg-pixel-gradient h-screen w-full" style={{ imageRendering: "pixelated" }}>
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-md">
                    </div>
                    <Header />
                    <Sidebar />
                    <img src={bg2} alt="bg" className="w-full h-full object-cover" />
                    <TravelJournal/>
                </div>
    );
}