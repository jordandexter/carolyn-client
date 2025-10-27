import { PlusCircleIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { getDocument, uploadDocument } from "@/api/client_api";
import { FileDrop } from "@/components/FileDrop";
import { useModalStore } from "@/hooks/useModalStore";
import { DocumentModel, EditDocumentRequestPayload } from "@/api/dtos";
import { getDocuments, editDocument } from "@/api/client_api";

export function EditDocumentModal({ onClose }: { onClose?: () => void }) {
    const [doc, setDoc] = useState<DocumentModel | null>(null)
    const [uploading, setUploading] = useState(false)
    const [frontFile, setFrontFile] = useState<File | null>(null)
    const [backsideFile, setBacksideFile] = useState<File | null>(null)
    const [newBacksideFile, setNewBacksideFile] = useState<File | null>(null)
    const [newFrontFile, setNewFrontFile] = useState<File | null>(null)
    const [title, setTitle] = useState<string>("")
    const [createdDate, setCreatedDate] = useState(null)
    const { editDocumentModalOpen } = useModalStore()
    const [description, setDescription] = useState<string>("")
    const [submitted, setSubmitted] = useState<boolean>(false)

    const handleSubmit = async () => {
        if (!doc || !doc.id) return;

        const payload: EditDocumentRequestPayload = {
            id: doc.id,
            document: {
                id: doc.id,
                uploaded_date: doc.uploaded_date,
                is_partial: doc.is_partial,
                filename: doc.filename,
                title: title,
                description: description,
                backside_id: doc.backside_id,
            }
        }

        if (createdDate)
            payload.document.createdDate = createdDate
        if (newFrontFile)
            payload.file = newFrontFile
        if (newBacksideFile)
            payload.backside_file = newBacksideFile;

        try {
            const response = await editDocument(payload)
            if (response.success) {
                setSubmitted(true)
                setTimeout(() => {
                    onClose?.()
                }, 3000)
            }
            else {
                setSubmitted(false)
            }
        } catch (error) {
            console.log(error)

        }
    }

    const handleClose = () => {
        if (onClose)
            onClose()
    }

    useEffect(() => {
        const getDocumentById = async () => {
            if (!editDocumentModalOpen.documentId) return;

            const docId = editDocumentModalOpen.documentId;
            try {
                // Fetch the original document data
                const result = await getDocuments({
                    search: docId,
                    search_by: 'id'
                })

                const documentData = result.data[0]
                setDoc(documentData)

                // Download and set front file
                const frontFileBlob = await getDocument({
                    id: docId
                })
                const file = new File([frontFileBlob], documentData.filename)
                setFrontFile(file)

                // Download and set backside file if applicable
                if (documentData.backside_id) {
                    const backsideResult = await getDocuments({
                        search: documentData.backside_id,
                        search_by: 'id'
                    })
                    const backsideData = backsideResult.data[0];

                    const backsideFileBlob = await getDocument({
                        id: documentData.backside_id
                    })

                    const backside_file = new File([backsideFileBlob], backsideData.filename)
                    setBacksideFile(backside_file)
                }

                setTitle(documentData.title || '')
                setDescription(documentData.description || '')
            } catch (error) {
                console.log(error)
            }
        }

        getDocumentById()
    }, [editDocumentModalOpen])

    useEffect(() => {
        if (doc) {
            setTitle(doc.title || '')
            setDescription(doc.description || '')
            setBacksideFile(null)
            setFrontFile(null)
        }
    }, [doc])

    return (
        <div className="flex flex-col bg-white transition-all duration-1000 ease-in-out rounded-lg relative pt-9 pb-3 px-4 gap-2 overflow-hidden border-1 border-primary "
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
                    Edit document
                </h1>
            </div>

            <p className="text-gray-500 text-xs">Documents can be pictures, music, videos, or anything in between. (ex. a scan of the front and back of a physical picture).</p>
            <p className="text-gray-500 text-xs"><span className="font-bold">Note:</span> Although it isn't required, you can also provide some basic details about the document, such as a descriptive title, or an explaination of the documents significance</p>

            <div className={`flex flex-col items-center max-h-[400px] p-2 overflow-scroll gap-2 scrollbar-hide bg-gray-200 ${frontFile ? 'border-1 rounded-lg border-gray-400' : ''}`}>
                <div className={`transition-all w-full duration-1000`}>
                    <p className="text-primary font-semibold px-2">Frontside</p>
                    <FileDrop
                        file={newFrontFile ? newFrontFile : frontFile}
                        setFiles={setNewFrontFile} />
                </div>


                <button className={`flex flex-col justify-center items-center gap-2 ${frontFile ? '' : 'hidden'}`}>
                    <PlusCircleIcon className="text-pink-500 hover:bg-pink-500 hover:text-white rounded-full" />
                    <div className="flex h-[20px] border-l-2 border-gray-500"></div>
                </button>

                <div className={`transition-all w-full duration-1000 ${frontFile ? '' : 'pointer-events-none opacity-0 absolute h-0'}`}>
                    <p className="text-primary font-semibold px-2">Backside <span className="text-gray-400 italic text-sm font-normal">(optional)</span></p>
                    <FileDrop file={newBacksideFile ? newBacksideFile : backsideFile} setFiles={setNewBacksideFile} />
                </div>

                {!frontFile &&
                    <div className="flex w-full justify-center px-6">
                        <p className="text-gray-500 text-xs italic">When you upload at least one document, you'll be able to attach more here</p>
                    </div>
                }
            </div>

            <>
                <p className="text-primary text-md px-2 font-bold">
                    Title<span className="text-gray-500"> - Give the document a title</span></p>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => { setTitle(e.target.value) }}
                    className="text-black border-1 text-sm border-gray-300 rounded-full px-2 py-1 focus:outline-none border-2 border-gray-200 focus:ring-0 focus:border-primary focus:border-2"
                    placeholder="Title"
                />
            </>

            <>
                <p className="text-primary text-md px-2 font-bold">
                    Description<span className="text-gray-500"> - Give the document a description</span></p>
                <textarea
                    value={description}
                    onChange={(e) => { setDescription(e.target.value) }}
                    className="text-black border-1 text-sm border-gray-300 rounded-[10px] px-2 py-1 focus:outline-none border-2 border-gray-200 focus:ring-0 focus:border-primary focus:border-2 scrollbar-hide"
                    placeholder="Description"
                />
            </>

            <button
                className={`flex w-full justify-center items-center ${!frontFile || !uploading || submitted ? 'hover:-translate-y-[2px]' : ''} transition-all relative duration-300 ease-in-out bg-gray-400 rounded-full min-h-10 overflow-hidden`}
                disabled={!frontFile || uploading || submitted}
                onClick={() => {
                    handleSubmit()
                }}
            >
                <div className={`absolute flex z-10 h-[500px] transition-all duration-2000 justify-center items-center w-[500px] rounded-full bg-green-500 ${submitted ? 'translate-y-0' : '-translate-y-85 -translate-x-85'}`}>
                    <p className="text-white">Submitted successfully!</p>
                </div>
                <div className={`absolute flex z-9 h-[500px] transition-all duration-2000 justify-center items-center w-[500px] rounded-full bg-primary 
                    ${newFrontFile || newBacksideFile || title !== doc?.title || description !== doc.description ? 'translate-y-0' : 'translate-y-85 translate-x-85'}`}>
                    Submit Changes
                </div>

                <p className="text-white">Make some changes first!</p>

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