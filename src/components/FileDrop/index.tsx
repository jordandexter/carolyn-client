import { Dispatch, SetStateAction, useRef, useState } from "react";
import { UploadIcon } from "lucide-react";

export function FileDrop({
    file,
    setFiles
}: {
    file: File | null,
    setFiles: Dispatch<SetStateAction<File | null>>

}) {
    const fileDropRef = useRef<HTMLInputElement | null>(null)
    const [isDragging, setIsDragging] = useState<boolean>(false);

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)

        if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
            setFiles(e.dataTransfer.files[0])
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFiles(e.target.files[0]);
        }
        e.target.value = ''
    };

    return (
        <div className={`flex flex-col w-full justify-center items-center border-2 border-dashed h-30 rounded-lg border-purple-500 p-2 min-h-[120px]`}
            onClick={() => {
                if (fileDropRef && fileDropRef.current) {
                    fileDropRef?.current.click()
                }
            }}>
            <div className={`flex w-full h-full rounded-lg justify-center items-center flex-col transition-all duration-200  ease-in-out hover:bg-purple-500/20 hover:cursor-pointer ${isDragging ? 'bg-gradient-to-r from-purple-500/80 to-pink-500/80 -translate-y-0.5 shadow-sm' : 'bg-gradient-to-r from-purple-500/50 to-pink-500/50'}`}
                onDragEnter={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setIsDragging(true)

                }}
                onDragOver={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                }}
                onDragLeave={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setIsDragging(false)
                }}
                onDrop={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleDrop(e)
                }}
            >
                {
                    file ? (
                        <div className="flex gap-2 flex-col justify-center items-center h-full w-full">
                            <UploadIcon className="text-purple-500" />
                            <p className="text-white text-sm px-2 py-1 bg-black/30 rounded-full ">{file.name}</p>
                        </div>
                    ) : (
                        <>
                            <p className="text-purple-700 font-semibold pointer-events-none">Drag and Drop</p>
                            <p className="text-gray-100 text-sm pointer-events-none">Maximum size: 100 MB </p>
                            <p className="text-gray-100 text-xs pointer-events-none">(see supported filetypes here)</p>
                        </>
                    )
                }
                <input type="file" ref={fileDropRef} className="hidden" multiple={false}
                    onChange={(e) => {
                        handleFileSelect(e)
                    }} />


            </div>
        </div>
    )
}