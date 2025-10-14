import { create } from "zustand"

interface TagImageProps {
    open: boolean,
    documentId: string | null,
}

interface EditDocumentProps {
    open: boolean,
    documentId: string | null
}

interface ModalStore {
    uploadDocumentOpen: boolean,
    imageTagOpen: TagImageProps,
    addPersonModalOpen: boolean,
    editDocumentModalOpen: EditDocumentProps,
    setAddPersonOpen: (open: boolean) => void;
    setEditDocumentModalOpen: (props: EditDocumentProps) => void;
    setImageTagOpen: (props: TagImageProps) => void;
    setUploadDocumentOpen: (open: boolean) => void;
}

export const useModalStore = create<ModalStore>((set) => ({
    uploadDocumentOpen: false,
    imageTagOpen: { open: false, documentId: null },
    addPersonModalOpen: false,
    editDocumentModalOpen: { open: false, documentId: null },
    setAddPersonOpen: (open: boolean) => set({ addPersonModalOpen: open }),
    setEditDocumentModalOpen: (props: EditDocumentProps) => set({ editDocumentModalOpen: { open: props.open, documentId: props.documentId } }),
    setImageTagOpen: (props: TagImageProps) => set({ imageTagOpen: { open: props.open, documentId: props.documentId } }),
    setUploadDocumentOpen: (open: boolean) => set({ uploadDocumentOpen: open })
}))