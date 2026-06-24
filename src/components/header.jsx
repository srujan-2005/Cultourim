import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import gif3 from "../assets/gif3.gif";

export default function Header() {
    const [dinoPosition, setDinoPosition] = useState(-50); // Start offscreen
    const [direction, setDirection] = useState(1); // 1 = right, -1 = left

    useEffect(() => {
        const animationInterval = setInterval(() => {
            setDinoPosition(prevPos => {
                // If dino reaches right side, change direction to left
                if (prevPos > window.innerWidth - 100) {
                    setDirection(-1);
                    return prevPos - 5;
                }
                // If dino reaches left side, change direction to right
                else if (prevPos < -50) {
                    setDirection(1);
                    return prevPos + 5;
                }
                // Otherwise keep moving in current direction
                return prevPos + (5 * direction);
            });
        }, 50); // Update every 50ms for smooth animation

        return () => clearInterval(animationInterval);
    }, [direction]);

    return (
        <div className="fixed top-4 w-[98%] h-[10%] ml-4 z-30 bg-black/20 rounded-lg border-gray-200 dark:border-gray-700 shadow-lg flex items-center overflow-hidden">
            <h1 className="text-3xl ml-6 font-pixel bg-gradient-to-r from-violet-400 to-orange-500 bg-clip-text text-transparent">
                <Link to={"/home"}>CULTOURIUM</Link>
            </h1>
            
            {/* Animated Dino */}
            <div 
                className="absolute"
                style={{ 
                    left: `${dinoPosition}px`,
                    top: '50%',
                    transform: `translateY(-50%) scaleX(${direction})`,
                    width: '250px',
                    height: '200px',
                    mixBlendMode:"darken",
                }}
            >
<img src={gif3}/>
            </div>
        </div>
    );
}