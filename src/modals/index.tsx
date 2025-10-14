"use client"
import { useModalStore } from "@/hooks/useModalStore"
import { ModalWrapper } from "./ModalWrapper"
import { UploadDocumentModal } from "./UploadDocumentModal"
import { ImageTagModal } from "./ImageTagModal"
import { AddPersonModal } from "./AddPersonModal"
import { EditDocumentModal } from "./EditDocumentModal"

export function ModalManager() {
    const {
        uploadDocumentOpen,
        setUploadDocumentOpen,
        imageTagOpen,
        addPersonModalOpen,
        setAddPersonOpen,
        editDocumentModalOpen,
        setEditDocumentModalOpen,
        setImageTagOpen } = useModalStore()

    return (
        <>

            <ModalWrapper
                isOpen={uploadDocumentOpen}
                persistant={true}
            >
                <UploadDocumentModal onClose={() => setUploadDocumentOpen(false)} />
            </ModalWrapper>


            <ModalWrapper
                isOpen={imageTagOpen.open}
                persistant={false}
            >
                <ImageTagModal onClose={() => setImageTagOpen({ open: false, documentId: null })} />
            </ModalWrapper>


            <ModalWrapper
                isOpen={addPersonModalOpen}
                persistant={true}
            >
                <AddPersonModal onClose={() => setAddPersonOpen(false)} />
            </ModalWrapper>

            <ModalWrapper
                isOpen={editDocumentModalOpen.open}
                persistant={false}
            >
                <EditDocumentModal onClose={() => setEditDocumentModalOpen({ open: false, documentId: null })} />
            </ModalWrapper>

        </>
    )
}