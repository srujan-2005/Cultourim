import React from "react";
import intro from "../assets/dp.png";
import bg from "../assets/bg.webp";

export default function Landing() {
    return (
        <div className="w-screen h-screen flex items-center justify-center flex-col ">
            <div
                className="w-screen h-screen bg-no-repeat rounded-xl bg-cover bg-center flex items-center justify-center"
                style={{ backgroundImage: `url(${bg})` }}>
                <div className="absolute inset-0 bg-white/2 backdrop-blur flex items-center justify-center">
                    <div className="w-[90%] sm:w-4/5 md:w-3/4 lg:w-2/3 xl:w-1/2 border-black border-[3px] rounded-xl overflow-hidden hover:shadow-[14px_14px_0px_rgba(75,57,146,1)] bg-black mt-8">
                        <a href="/home" className="block cursor-pointer">
                            <article className="w-full h-1/2">
                                <figure className="h-[250px] md:h-[300px] overflow-hidden">
                                    <img
                                        src={intro}
                                        alt="thumbnail"
                                        className="w-full h-full lg:object-none sm:object-none"
                                    />
                                </figure>

                                <div className="px-6 py-5 text-left h-full BORDER BLACK BORDER-3">
                                    <h1 className="text-3xl mb-4 text-white font-pixel">CULTOURIUM</h1>
                                    <p className="mb-4  text-xs text-white font-pixel break-all hyphens-auto">
                                    Tourists and culture seekers often face incomplete experiences due to scattered resources. 
                                    There is a need for a unified digital companion that seamlessly blends cultural insights, 
                                    tourist assistance, and interactive features to provide an immersive and enriching 
                                    exploration experience.
                                    </p>
                                    <p className="hover:text-blue-500 text-[10px] text-white font-pixel mt-10">click on this to dive in</p>
                                </div>
                            </article>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}