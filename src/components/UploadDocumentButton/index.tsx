"use client"
import { useModalStore } from "@/hooks/useModalStore"
import { PlusIcon, UploadIcon } from "lucide-react"

export function UploadDocumentButton() {
    const { setUploadDocumentOpen } = useModalStore()

    return (
        <button className="flex justify-center text-gray-400 hover:text-purple-500 items-center w-[34px] h-[34px] bg-white rounded-full"
            title={"Upload Document"}
            style={{
                boxShadow: `0 5px 10px 0 rgba(0, 0, 0, 0.3)`
            }}
            onClick={() => setUploadDocumentOpen(true)}>
            <UploadIcon className="" strokeWidth={2} />
        </button>
    )
}