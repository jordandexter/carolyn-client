"use client"
import { useEffect, useState, useRef } from "react";
import { Web } from "@/components/Web"; 

export default function HomePage() {
    const ref = useRef<HTMLDivElement | null>(null)
    const contentRef = useRef<HTMLDivElement | null>(null)
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        const container = ref.current;
        const content = contentRef.current;

        if (container && content) {
            const scrollLeft = content.scrollWidth / 2 - container.clientWidth / 2;
            const scrollTop = content.scrollHeight / 2 - container.clientHeight / 2;

            container.scrollTo({ left: scrollLeft, top: scrollTop, behavior: "instant" });
            setLoaded(true)
        }
    }, []);

    return (
        <div 
        ref={ref}
        className="flex flex-col h-[calc(100vh-49px)] relative overflow-scroll">
            <div ref={contentRef} className={ `transition-all duration-2000 ease-in-out ${!loaded ? `opacity-0` : ''}`}>
                <Web />
            </div>
        </div>
    )
}