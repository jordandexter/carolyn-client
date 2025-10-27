'use client'
import { DocumentModel } from "@/api/dtos";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { COLUMN_WIDTH } from "./constants";
import { Download, Ellipsis, EllipsisVertical, Headphones, Heart, Play, Share } from "lucide-react";

interface Mp3Gradient {
    primary: string,
    accent: string,
}

export default function ImageCard({ document }: { document: DocumentModel }) {
    const menuBtnRef = useRef<HTMLButtonElement | null>(null)
    const [liked, setLiked] = useState(false)
    const [heartHovered, setHeartHovered] = useState(false)
    const [hovered, setHovered] = useState(false)
    const [showMenu, setShowMenu] = useState(false)
    const [docUrl, setDocUrl] = useState<string>('')
    const [mp3Gradient, setMp3Gradient] = useState<Mp3Gradient | null>(null)
    const [docFormat, setDocFormat] = useState<string | null>(null)
    const [scale, setScale] = useState(1)

    useEffect(() => {
        setDocFormat(document.filename.split('.')[1])
        if (document.blob)
            setDocUrl(URL.createObjectURL(document.blob))
    }, [document])

    useEffect(() => {
        const getGradient = () => {
            const primaries = [
                '#df0000ff',
                '#dfdf00ff',
                '#0d00c5ff',
            ]

            const accenties = [
                '#df00ffff',
            ]

            const primary = primaries[Math.floor(Math.random() * primaries.length)]
            const accent = accenties[Math.floor(Math.random() * accenties.length)]
            setMp3Gradient({ primary: primary, accent: accent })
        }

        if (docFormat === "mp3") {
            getGradient()
        }
    }, [docFormat])

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
                    setShowMenu(false)
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

                <div key={document.id}>
                    {docFormat === 'mp4' ? (
                        <video
                            src={docUrl}
                            className="flex object-fit transition-all duration-1000 rounded-md h-full"
                            muted
                            autoPlay={false} />
                    ) : docFormat === "mp3" && mp3Gradient ? (
                        <div className="flex h-80 justify-center items-center"
                            style={{
                                backgroundImage: `linear-gradient(0deg, ${mp3Gradient.primary}, ${mp3Gradient.accent})`
                            }}>
                            <Headphones className="h-10 w-10" />
                        </div>

                    ) : docUrl && (
                        <Image
                            src={docUrl}
                            className="object-fit transition-all duration-1000 rounded-md"
                            style={{
                                filter: scale !== 1 ? 'blur(50px)' : ''
                            }}
                            alt={document.filename}
                            height={1000}
                            width={1000}
                        />
                    )}
                </div>


                <div className={`absolute transition-all duration-300 ease-in-out flex h-[30%] pointer-events-none w-full bg-gradient-to-b from-black/60 to-blue-500/0 ${hovered ? 'opacity-100' : 'opacity-0'}`}>
                    <p className={`absolute top-2 left-2 ${hovered ? 'opacity-100' : 'opacity-0'} text-white z-120 italic text-xs`}>Uploaded on: {new Date(document.uploaded_date).toLocaleDateString()}</p>
                    <p className={`absolute top-6 left-2 ${hovered ? 'opacity-100' : 'opacity-0'} text-white z-120 italic text-xs`}>Filename: {document.filename}</p>
                </div>
                <div className={`absolute flex transition-all duration-300 w-full h-full justify-end flex-col bg-transparent z-10 ${hovered ? 'opacity-100' : 'opacity-0'}`}>
                    {docFormat === "mp4" &&
                        <div className="absolute flex w-full h-full justify-center items-center z-1 pointer-events-none">
                            <Play fill='white' className="h-10 w-10" />
                        </div>
                    }

                    <div className={` transition-all duration-300 z-100 ease-in-out flex h-[40%] pointer-events-none w-full bg-gradient-to-t from-black to-blue-500/0 ${hovered ? 'opacity-40' : 'opacity-0'}`}></div>
                    <div className="w-full bg-black/40 p-4 ">
                        <div className="flex flex-row justify-between">
                            <h1 className="text-white font-bold">{document.title || "Untitled Document"}</h1>
                        </div>
                        <div className="flex flex-row justify-between">
                            <p className="text-gray-100">{document.description || "No description"}</p>


                            <div className="flex flex-row gap-3 items-center">
                                <button className="flex justify-center items-center rounded-full h-7 w-7 relative"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        e.preventDefault()
                                        setLiked(!liked)
                                    }}
                                    onMouseEnter={() => { setHeartHovered(true) }}
                                    onMouseLeave={() => { setHeartHovered(false) }}>
                                    <Heart strokeWidth={liked ? '0px' : heartHovered ? '0px' : '2px'} fill={liked ? 'red' : heartHovered ? 'white' : 'none'} />
                                </button>
                                <button className="flex px-4 py-1 bg-primary rounded-full text-sm hover:bg-white hover:text-primary"
                                    style={{
                                        boxShadow: '0 5px 10px 0 rgba(0,0,0,0.8)'
                                    }}>
                                    View
                                </button>
                                <button ref={menuBtnRef} className="flex justify-center items-center hover:bg-gray-500/50 rounded-full h-7 w-7 relative"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        e.preventDefault()
                                        setShowMenu(!showMenu)
                                    }}
                                >
                                    <EllipsisVertical />
                                    <div className={`absolute top-0 left-0 z-100 -translate-y-[115%] -translate-x-[100%] flex flex-col w-32 bg-white rounded-lg overflow-hidden ${showMenu ? '' : 'hidden'}`}
                                        style={{
                                            boxShadow: '0 10px 10px 0 rgba(0,0,0,0.4)'
                                        }}>
                                        <div className="flex justify-between h-8 text-primary p-2 items-center hover:bg-primary hover:text-white w-full transition-all duration-300">
                                            Share
                                            <Share className="h-3" />
                                        </div>
                                        <div className="flex h-8 justify-between text-primary p-2 items-center hover:bg-primary hover:text-white w-full transition-all duration-300">
                                            Download
                                            <Download className="h-3" />
                                        </div>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={`absolute bottom-0 left-0 transition-all duration-300 ease-in-out flex h-[40%] pointer-events-none w-full bg-gradient-to-t from-black to-blue-500/0 ${hovered ? 'opacity-40' : 'opacity-0'}`}></div>
            </Link>
        </div>
    )
}