import React from "react";
import { Link } from "react-router-dom";

export default function Bento(){
    return( 
        <div className=" absolute z-10 w-[75%] h-[70%] top-[20%] left-1/2 transform -translate-x-1/2 pixelated-icon">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 h-full">
  <div className="bg-black/15 rounded-xl p-6 col-span-2 row-span-2 flex items-center justify-center text-center hover:scale-105 transition ">
  <p className="font-pixel text-3xl font-bold bg-gradient-to-r from-violet-400 to-orange-500 bg-clip-text text-transparent">
  <Link to="/ava">Ask-Ava</Link>
  </p>
  </div>
  <div className="bg-black/15 rounded-xl p-6 flex items-center justify-center hover:scale-105 transition font-pixel text-md">
  <p className="font-pixel font-bold bg-gradient-to-r from-violet-400 to-orange-500 bg-clip-text text-transparent">
  <Link to="/penny">Penny-Path</Link>
  </p>
  </div>
  <div className="bg-black/15 rounded-xl p-6 flex items-center justify-center hover:scale-105 transition font-pixel text-md">
  <p className="font-pixel font-bold bg-gradient-to-r from-violet-400 to-orange-500 bg-clip-text text-transparent">
  <Link to="/hop">Heritage-Hop</Link>
  </p>  </div>
  <div className="bg-black/15 rounded-xl p-6 col-span-2 flex items-center justify-center hover:scale-105 transition font-pixel">
  <p className="font-pixel font-bold text-xl bg-gradient-to-r from-violet-400 to-orange-500 bg-clip-text text-transparent">
  <Link to="/voyage">Voyage-Vibes</Link>
  </p>
  </div>
</div>

        </div>);
}
