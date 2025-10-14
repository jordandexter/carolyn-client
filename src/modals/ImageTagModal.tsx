import { useModalStore } from "@/hooks/useModalStore"
import { DocumentModel, PersonModel } from "@/api/dtos"
import { ChangeEvent, use, useEffect, useRef, useState } from "react"
import { addConnection, getDocument, getPersons } from "@/api/client_api"
import { X } from "lucide-react"

export function ImageTagModal({ onClose }: { onClose: () => void }) {
    const { imageTagOpen } = useModalStore()
    const [imageBlob, setImageBlob] = useState<Blob | null>(null)
    const [blobUrl, setBlobUrl] = useState<string | null>(null)
    const tagInputRef = useRef<HTMLInputElement | null>(null)
    const imageRef = useRef<HTMLImageElement | null>(null)
    const [tagInputFocused, setTagInputFocused] = useState(false)
    const [tagPoint, setTagPoint] = useState<{ x: number, y: number }>()
    const [actualPoint, setActualPoint] = useState<{ x: number, y: number }>()
    const [tagValue, setTagValue] = useState('')
    const [submittedResult, setSubmittedResult] = useState<boolean | null>(null)
    const [personId, setPersonId] = useState<string | null>(null)
    const [submitting, setSubmitting] = useState(false)
    const [personResults, setPersonResults] = useState<PersonModel[]>([])
    const [tagType, setTagType] = useState<string>('Name')
    const [imageSize, setImageSize] = useState<{ height: number, width: number } | null>(null)

    const fetchDocumentBlob = async (documentId: string) => {
        try {
            const imageBlob = await getDocument({
                id: documentId
            })

            setImageBlob(imageBlob)
        } catch (error) {
            console.log(error)
        }
    }

    const handleTagClick = (x: number, y: number) => {
        if (!imageTagOpen.documentId || !imageSize || !imageRef.current) return;


        const downscaleRatioX = imageSize.width / imageRef.current.clientWidth
        const downscaleRatioY = imageSize.height / imageRef.current.clientHeight

        const actualX = Math.round(x * downscaleRatioX);
        const actualY = Math.round(y * downscaleRatioY);

        setActualPoint({ x: actualX, y: actualY })
        setTagPoint({ x: x, y: y })
    }

    const handleTagInputFocused = () => {
        setTagInputFocused(false)
        setPersonResults([])
        setTimeout(() => {
            setTagInputFocused(true)
        }, 300)
    }

    const handleSubmitTag = async () => {
        if (!personId || !imageTagOpen.documentId || !actualPoint) return;

        setSubmitting(true)
        try {
            const result = await addConnection({
                document_id: imageTagOpen.documentId,
                persons_id: personId,
                type: 'name',
                x: actualPoint.x,
                y: actualPoint.y
            })

            setSubmittedResult(result.success)
        } catch (error) {
            console.log(error)
        }


        setSubmitting(false)
    }

    const handleTagChange = async (e: ChangeEvent<HTMLInputElement>) => {
        setTagValue(e.target.value)
        try {
            const result = await getPersons({
                search: e.target.value,
                limit: 5
            })

            setPersonResults(result.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (imageTagOpen.documentId) {
            fetchDocumentBlob(imageTagOpen.documentId)
        }
    }, [imageTagOpen])

    useEffect(() => {
        if (!tagInputRef) return;
        tagInputRef.current?.focus()
    }, [tagPoint])


    useEffect(() => {
        console.log(submittedResult)
        setTagInputFocused(false)
        setTagPoint(undefined)
        setTagValue('')
        setPersonId(null)
        setActualPoint(undefined)

        setTimeout(() => {
            setSubmittedResult(null)
        }, 5000)
    }, [submittedResult])

    useEffect(() => {
        if (imageBlob) {
            const blobUrl = URL.createObjectURL(imageBlob)
            setBlobUrl(blobUrl)

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
            img.src = URL.createObjectURL(imageBlob)

            return () => {
                img.onload = null;
            }
        }
    }, [imageBlob])


    if (!imageTagOpen.documentId) return null;

    return (
        <div className={`flex flex-col bg-white transition-all duration-1000 ease-in-out rounded-lg relative pt-9 pb-3 px-4 gap-2  border-1 border-purple-500 relative ${personResults.length > 0 ? '' : 'cursor-crosshair'}`}
            style={{
                boxShadow: `0px 20px 25px 0px rgba(0,0,0,0.4)`,
                maxWidth: '800px',
            }}>
            <button onClick={() => {
                onClose()
            }}>
                <X className="absolute top-1 right-2 h-6 w-6 text-gray-500" />

            </button>
            <p className="text-gray-500 w-full text-center italic">Click anywhere on the image to drop a tag</p>
            <div
                className="relative"
                onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left - 6;
                    const y = e.clientY - rect.top - 6;
                    handleTagClick(x, y)
                }}>
                {tagPoint &&
                    <div className="absolute flex h-3 w-3 bg-white border-gray-500 rounded-full z-10"
                        style={{
                            top: `${tagPoint.y}px`,
                            left: `${tagPoint.x}px`,
                            boxShadow: '0px 5px 5px 0px rgba(0,0,0,0.8)',
                        }}>
                        <div className={`flex flex-row translate-x-6 gap-2 -translate-y-11 h-11 p-2 bg-white rounded-lg text-black relative`}
                            onClick={(e) => {
                                e.stopPropagation()
                                e.preventDefault()
                            }}
                            style={{
                                boxShadow: '0px 10px 10px 0px rgba(0,0,0,0.4)',
                            }}>
                            <select
                                onChange={(e) => { setTagType(e.target.value) }}>
                                <option value={'Name'}>Name</option>
                                <option value={'Item'}>Item</option>
                                <option value={'Location'}>Location</option>
                            </select>

                            <div>
                                <input
                                    ref={tagInputRef}
                                    type="text"
                                    value={tagValue}
                                    onFocus={(e) => {
                                        handleTagInputFocused()
                                    }}
                                    onChange={(e) => { handleTagChange(e) }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Escape') {
                                            setTagPoint(undefined)
                                            setTagValue('')
                                            setTagType('Name')
                                        }
                                    }}
                                    className={`flex transition-all duration-200 ${tagInputFocused && !submitting ? 'w-50' : 'w-0'} p-3 bg-white rounded-lg text-black outline-none border-2 h-5 border-white focus:border-purple-500`} />

                                <div className={`bg-white p-2 rounded-lg ${personResults.length > 0 ? '' : 'hidden'}`}
                                    style={{
                                        boxShadow: '0 10px 10px 0 rgba(0,0,0,0.4)'
                                    }}>
                                    {personResults.length > 0 && personResults.map((person) => {
                                        return (
                                            <div className="hover:bg-gray-300 hover:cursor-pointer p-1"
                                                onClick={() => {
                                                    if (person.id) {
                                                        setPersonId(person.id)
                                                        setTagValue(`${person.firstname} ${person.lastname}`)
                                                        setPersonResults([])
                                                        tagInputRef.current?.focus()
                                                    }
                                                }}>{person.firstname} {person.lastname}</div>
                                        )

                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                }
                {blobUrl &&
                    <img
                        ref={imageRef}
                        className="opacity-60"
                        src={blobUrl || ''}
                    />
                }
            </div>


            <button
                className={`flex w-full justify-center items-center ${!personId || !imageTagOpen.documentId || !actualPoint ? 'hover:-translate-y-[2px]' : ''} transition-all relative duration-300 ease-in-out bg-gray-400 rounded-full min-h-10 overflow-hidden`}
                disabled={!personId || !imageTagOpen.documentId || !actualPoint}
                onClick={() => {
                    handleSubmitTag()
                }}
            >
                <div className={`absolute flex z-10 h-[500px] transition-all duration-2000 justify-center items-center w-[500px] rounded-full bg-green-500 ${submittedResult === true ? 'translate-y-0' : '-translate-y-85 -translate-x-85'}`}>
                    <p className="text-white">Submitted successfully!</p>
                </div>
                <div className={`absolute flex z-10 h-[500px] transition-all duration-2000 justify-center items-center w-[500px] rounded-full bg-red-400 ${submittedResult === false ? 'translate-y-0' : '-translate-y-85 translate-x-85'}`}>
                    <p className="text-white">This connection already exists!</p>
                </div>
                <div className={`absolute flex z-9 h-[500px] transition-all duration-2000 justify-center items-center w-[500px] rounded-full bg-purple-500 ${personId && imageTagOpen.documentId && actualPoint ? 'translate-y-0' : 'translate-y-85 translate-x-85'}`}>
                    Submit
                </div>

                <p className="text-white">Click anywhere to place a tag</p>

            </button>
            <button
                className={`flex w-full justify-center items-center transition-all  bg-red-400/70 hover:bg-red-400 text-white border-1 border-red-500 relative duration-300 ease-in-out rounded-full min-h-10 overflow-hidden`}
                onClick={onClose}
            >
                Cancel
            </button>



        </div>
    )
}