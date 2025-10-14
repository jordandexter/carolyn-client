import { UploadDocumentRequestPayload } from "@/api/dtos";
import { PlusCircleIcon, UploadIcon, XIcon } from "lucide-react";
import { use, useEffect, useRef, useState } from "react";
import { uploadDocument } from "@/api/client_api";
import { FileDrop } from "@/components/FileDrop";

export function UploadDocumentModal({ onClose }: { onClose?: () => void }) {
    const [uploading, setUploading] = useState(false)
    const [frontFile, setFrontFile] = useState<File | null>(null)
    const [backsideFile, setBacksideFile] = useState<File | null>(null)
    const [title, setTitle] = useState<string>("")
    const [description, setDescription] = useState<string>("")
    const [submitted, setSubmitted] = useState<boolean>(false)

    const uploadDocuments = async (file: File, backsideFile?: File | null) => {
        try {
            setUploading(true)
            let result = null;
            if (backsideFile) {
                result = await uploadDocument({
                    title: title,
                    description: description,
                    createdDate: new Date(),
                    file: file,
                    backside_file: backsideFile
                })
            } else {
                result = await uploadDocument({
                    title: title,
                    description: description,
                    createdDate: new Date(),
                    file: file
                })
            }
            console.log('Upload Result:', result)

            setSubmitted(true)
        } catch (error) {
            console.log("Error uploading file: ", error)
        }

        reset()
    }

    const handleAddExtraPage = () => {

    }

    const reset = () => {
        setUploading(false)
        setFrontFile(null);
        setBacksideFile(null)
        setTitle('')
        setDescription('')
    }

    const handleClose = () => {
        if (onClose)
            onClose()

        setTimeout(() => {
            reset()

        }, 4000)

    }

    useEffect(() => {
        if (!submitted) return;
        setTimeout(() => {
            setSubmitted(false)
        }, 5000)
    }, [submitted])

    return (
        <div className="flex flex-col bg-white transition-all duration-1000 ease-in-out rounded-lg relative pt-9 pb-3 px-4 gap-2 overflow-hidden border-1 border-purple-500 "
            style={{
                boxShadow: `0px 20px 25px 0px rgba(0,0,0,0.4)`,
                maxWidth: '400px',
                maxHeight: '700px'
            }}>
            <button className="absolute top-2 right-2"
                onClick={handleClose}>
                <XIcon className="text-black h-5" />
            </button>

            <div className="flex justify-center items-center gap-0.5">
                <h1 className="text-center text-2xl font-bold bg-gradient-to-r from-purple-700/70 to-orange-200 to-pink-500 bg-clip-text text-transparent">
                    Upload a new document
                </h1>
            </div>

            <p className="text-gray-500 text-xs">Documents can be pictures, music, videos, or anything in between. (ex. a scan of the front and back of a physical picture).</p>
            <p className="text-gray-500 text-xs"><span className="font-bold">Note:</span> Although it isn't required, you can also provide some basic details about the document, such as a descriptive title, or an explaination of the documents significance</p>

            <div className={`flex flex-col items-center max-h-[400px] p-2 overflow-scroll gap-2 scrollbar-hide bg-gray-200 ${frontFile ? 'border-1 rounded-lg border-gray-400' : ''}`}>
                <div className={`transition-all w-full duration-1000`}>
                    <p className="text-purple-500 font-semibold px-2">Frontside</p>
                    <FileDrop
                        file={frontFile}
                        setFiles={setFrontFile} />
                </div>


                <button className={`flex flex-col justify-center items-center gap-2 ${frontFile ? '' : 'hidden'}`}
                    onClick={handleAddExtraPage}>
                    <PlusCircleIcon className="text-pink-500 hover:bg-pink-500 hover:text-white rounded-full" />
                    <div className="flex h-[20px] border-l-2 border-gray-500"></div>
                </button>

                <div className={`transition-all w-full duration-1000 ${frontFile ? '' : 'pointer-events-none opacity-0 absolute h-0'}`}>
                    <p className="text-purple-500 font-semibold px-2">Backside <span className="text-gray-400 italic text-sm font-normal">(optional)</span></p>
                    <FileDrop file={backsideFile} setFiles={setBacksideFile} />
                </div>

                {!frontFile &&
                    <div className="flex w-full justify-center px-6">
                        <p className="text-gray-500 text-xs italic">When you upload at least one document, you'll be able to attach more here</p>
                    </div>
                }
            </div>

            <>
                <p className="text-purple-500 text-md px-2 font-bold">
                    Title<span className="text-gray-500"> - Give the document a title</span></p>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => { setTitle(e.target.value) }}
                    className="text-black border-1 text-sm border-gray-300 rounded-full px-2 py-1 focus:outline-none border-2 border-gray-200 focus:ring-0 focus:border-purple-500 focus:border-2"
                    placeholder="Title"
                />
            </>

            <>
                <p className="text-purple-500 text-md px-2 font-bold">
                    Description<span className="text-gray-500"> - Give the document a description</span></p>
                <textarea
                    value={description}
                    onChange={(e) => { setDescription(e.target.value) }}
                    className="text-black border-1 text-sm border-gray-300 rounded-[10px] px-2 py-1 focus:outline-none border-2 border-gray-200 focus:ring-0 focus:border-purple-500 focus:border-2 scrollbar-hide"
                    placeholder="Description"
                />
            </>

            <button
                className={`flex w-full justify-center items-center ${!frontFile || !uploading || submitted ? 'hover:-translate-y-[2px]' : ''} transition-all relative duration-300 ease-in-out bg-gray-400 rounded-full min-h-10 overflow-hidden`}
                disabled={!frontFile || uploading || submitted}
                onClick={() => {
                    if (frontFile)
                        uploadDocuments(frontFile, backsideFile)
                }}
            >

                <div className={`absolute flex z-9 h-[500px] transition-all duration-2000 justify-center items-center w-[500px] rounded-full bg-green-500 ${submitted ? 'translate-y-0' : '-translate-y-85 -translate-x-85'}`}>
                    <p className="text-white">Submitted successfully!</p>
                </div>
                <div className={`absolute flex z-9 h-[500px] transition-all duration-2000 justify-center items-center w-[500px] rounded-full bg-purple-500 ${frontFile ? 'translate-y-0' : 'translate-y-85 translate-x-85'}`}>
                    Upload
                </div>

                <p className="text-white">Upload file to begin</p>

            </button>
            <button
                className={`flex w-full justify-center items-center transition-all  bg-red-400/70 hover:bg-red-400 text-white border-1 border-red-500 relative duration-300 ease-in-out rounded-full h-10 overflow-hidden`}
                onClick={handleClose}
            >
                Cancel
            </button>
        </div >
    )
}