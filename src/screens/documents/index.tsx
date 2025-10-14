"use client"
import { useEffect, useState, useRef } from "react"
import { ConnectionModel, DocumentModel } from "@/api/dtos"
import { getConnectionsByDocumentId, getDocument, getDocuments } from "@/api/client_api"
import Link from "next/link"
import { Edit, Tags } from "lucide-react"
import { useModalStore } from "@/hooks/useModalStore"
import { TagMap } from "@/components/TagMap"
import { ToolbarItem } from "@/components/ToolbarItem"

export default function DocumentPage({ id }: { id: string }) {
    const [doc, setDoc] = useState<DocumentModel | null>(null)
    const imageRef = useRef<HTMLImageElement | null>(null)
    const [scaleX, setScaleX] = useState(1)
    const [tags, setTags] = useState<ConnectionModel[] | null>(null)
    const [viewing, setViewing] = useState("frontside")
    const { setImageTagOpen, setEditDocumentModalOpen } = useModalStore()
    const [imageSize, setImageSize] = useState<{ height: number, width: number } | null>(null)

    const fetchDocumentBlob = async () => {
        try {
            const result = await getDocuments({
                search: id,
                search_by: "id"
            })

            if (result.data.length > 0) {
                const document = result.data[0]
                let backsideBlob = undefined;

                const imageBlob = await getDocument({
                    id: id
                })

                if (document.backside_id) {
                    backsideBlob = await getDocument({
                        id: document.backside_id
                    })
                }

                setDoc({ ...document, blob: imageBlob, backside_blob: backsideBlob })
            }
        } catch (error) {
            console.log(error)
        }
    }

    const fetchConnections = async () => {
        try {
            const result = await getConnectionsByDocumentId({
                document_id: id
            })

            setTags(result.data)
        } catch (error) {
            console.log(error)
        }
    }


    useEffect(() => {
        if (!doc || !doc.blob) return;

        const img = document.createElement('img')
        img.onload = (e) => {
            const target = e.currentTarget as HTMLImageElement;
            const width = target.naturalWidth;
            const height = target.naturalHeight;

            console.log(height)
            console.log(width)

            setImageSize({
                height: height,
                width: width
            })
        }
        img.src = URL.createObjectURL(doc.blob)

        return () => {
            img.onload = null;
        }
    }, [doc])

    useEffect(() => {
        fetchDocumentBlob()
        fetchConnections()
    }, [])

    return (
        <div className={`flex flex-col w-full justify-center items-center p-2 relative`}>
            <Link
                href={'/gallery'}
                className="flex w-full justify-center bg-purple-500 p-2 m-4 rounded-lg text-center font-semibold"
                style={{
                    boxShadow: '0px 5px 5px 0px rgba(0,0,0,0.4)'
                }}>
                Back
            </Link>
            <div className="flex flex-row gap-4">
                <div className="flex flex-col gap-2">
                    <ToolbarItem
                        icon={<Tags />}
                        onClick={() => {
                            if (doc && doc.id) {
                                if (viewing === "frontside")
                                    setImageTagOpen({ open: true, documentId: doc.id })
                                else {
                                    if (doc.backside_id)
                                        setImageTagOpen({ open: true, documentId: doc.backside_id })
                                }
                            }
                        }} />
                    <ToolbarItem
                        icon={<Edit />}
                        onClick={() => { setEditDocumentModalOpen({ open: true, documentId: doc?.id || null }) }}
                    />
                </div>
                <div className="flex flex-col justify-center items-center md:items-start md:flex-row bg-white rounded-lg rounded-lg max-w-[1700px] relative"
                    style={{
                        boxShadow: "0px 5px 5px 0px rgba(0,0,0,0.4)"
                    }}>
                    <div className="flex flex-col gap-4 p-4 relative">
                        {doc &&
                            <div
                                id={doc.id}
                                className={`bg-black relative md:max-w-[600px] rounded-lg transition-all duration-300`}
                                style={{
                                    transform: `scaleX(${scaleX})`
                                }}>
                                {viewing === "frontside" && doc && doc.blob && doc.id &&
                                    <div className="relative">
                                        <TagMap
                                            tags={tags}
                                            imageRef={imageRef}
                                            height={imageSize?.height || 0}
                                            width={imageSize?.width || 0}
                                        />
                                        <img
                                            ref={imageRef}
                                            src={URL.createObjectURL(doc.blob)}
                                            alt={doc.filename}
                                            className="flex w-full object-contain border-purple-500 rounded-lg border-1"
                                        />
                                    </div>
                                }
                                {
                                    viewing === "backside" && doc?.backside_blob &&
                                    <img
                                        src={URL.createObjectURL(doc.backside_blob)}
                                        alt={doc.filename + "_back"}
                                    />
                                }
                            </div>
                        }


                        {doc?.backside_blob &&
                            <button className="bg-purple-500 font-semibold rounded-lg py-3"
                                style={{
                                    boxShadow: "0px 5px 5px 0px rgba(0,0,0,0.4)"
                                }}
                                onClick={() => {
                                    if (viewing === "frontside") {
                                        setScaleX(-1)
                                        setViewing("backside")
                                    }
                                    else if (viewing === "backside") {
                                        setScaleX(1)
                                        setViewing("frontside")
                                    }
                                }}>
                                Flip
                            </button>
                        }
                    </div>

                    <div className="hidden md:flex flex-col justify-center items-center w-full p-2 gap-4 min-w-[375px] max-w-[400px] relative">
                        <div className="flex flex-col justify-center items-center">
                            <h1 className="text-black font-bold text-center text-2xl">{doc?.title || "Untitled Document"}</h1>
                            <p className="text-xs text-gray-500">{doc?.filename}</p>
                        </div>
                        <hr className="w-full bg-gray-300 h-0.5 rounded-full" />
                        <div className="flex w-full">
                            <p className="text-gray-500 font-bold"><span className="text-black">Description </span>{doc?.description}</p>
                        </div>
                    </div>

                    <div className="flex md:hidden flex-col items-center w-full p-2 gap-4 min-w-[375px] max-w-[400px]">
                        <div className="flex flex-col justify-center">
                            <h1 className="text-black font-bold text-center text-2xl">{doc?.title || "Untitled Document"}</h1>
                            <p className="text-xs text-gray-300">{doc?.filename}</p>
                        </div>
                        <div className="flex w-full">
                            <p className="text-black">{doc?.description}</p>
                        </div>
                    </div>
                </div>
            </div>

            <p className="text-purple-500 font-bold text-center">Comments</p>

            <div className="flex flex-col md:flex-row bg-white rounded-lg m-4 rounded-lg max-w-[1700px]"
                style={{
                    boxShadow: "0px 5px 5px 0px rgba(0,0,0,0.4)"
                }}>

            </div>


        </div >
    )
}