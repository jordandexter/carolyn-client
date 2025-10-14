'use client'
import { DocumentModel } from "@/api/dtos";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { COLUMN_WIDTH } from "./constants";

export default function ImageCard({ document }: { document: DocumentModel }) {
    const [hovered, setHovered] = useState(false)
    const [scale, setScale] = useState(1)

    if (!document.id || !document.blob) return null;

    return (
        <div className="relative p-2 min-w-[325px] max-w-[400px]">
            <Link
                href={`/document/${document.id}`}
                target="_blank"
                className={`flex flex-col bg-gray-100 max-w-[${COLUMN_WIDTH}px] rounded-lg hover:border-purple-400 gap-2 transition-all duration-200 ease-in-out overflow-hidden relative`}
                onMouseEnter={() => {
                    setHovered(true)
                }}
                onMouseLeave={() => {
                    setHovered(false)
                }}
                onClick={() => {
                    setScale(0.98)

                    setTimeout(() => {
                        setScale(1)
                    }, 3000)
                }}
                style={{
                    boxShadow: '0px 5px 20px 0px rgba(0,0,0,0.4)',
                    scale: scale

                }}>
                <Image
                    src={URL.createObjectURL(document.blob)}
                    className="object-fit transition-all duration-1000 rounded-md"
                    style={{
                        filter: scale !== 1 ? 'blur(50px)' : ''
                    }}
                    alt={document.filename}
                    height={1000}
                    width={1000}
                />


                <div className={`absolute transition-all duration-300 ease-in-out flex h-[40%] pointer-events-none w-full bg-gradient-to-b from-black to-blue-500/0 ${hovered ? 'opacity-40' : 'opacity-0'}`}>
                    <p className={`absolute top-2 left-2 ${hovered ? 'opacity-100' : 'opacity-0'} text-white z-120 italic text-xs`}>Uploaded on: {document.uploadedDate?.toLocaleDateString() || "No date"}</p>
                </div>
                <div className={`absolute flex transition-all duration-300 w-full h-full justify-end flex-col bg-transparent z-10 ${hovered ? 'opacity-100' : 'opacity-0'}`}>


                    <div className={` transition-all duration-300 ease-in-out flex h-[40%] pointer-events-none w-full bg-gradient-to-t from-black to-blue-500/0 ${hovered ? 'opacity-40' : 'opacity-0'}`}></div>
                    <div className="w-full bg-black/40 p-4 ">
                        <div className="flex flex-row justify-between">
                            <h1 className="text-white font-bold">{document.title || "Untitled Document"}</h1>
                        </div>
                        <div className="flex flex-row justify-between">
                            <p className="text-gray-100">{document.description || "No description"}</p>
                            <button className="flex px-4 py-1 bg-purple-500 rounded-full text-sm hover:bg-white hover:text-purple-500"
                                style={{
                                    boxShadow: '0 5px 10px 0 rgba(0,0,0,0.8)'
                                }}>
                                View
                            </button>
                        </div>
                    </div>
                </div>

                <div className={`absolute bottom-0 left-0 transition-all duration-300 ease-in-out flex h-[40%] pointer-events-none w-full bg-gradient-to-t from-black to-blue-500/0 ${hovered ? 'opacity-40' : 'opacity-0'}`}></div>
            </Link>
        </div>
    )
}