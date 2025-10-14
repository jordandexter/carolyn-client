"use_client"
import { api_get, api_post } from "./api";
import {
    AddConnectionRequestPayload,
    AddConnectionResponsePayload,
    AddPersonRequestPayload,
    AddPersonResponsePayload,
    GetCommentsByDocumentIdRequestPayload,
    GetCommentsByDocumentIdResponsePayload,
    GetConnectionsByDocumentIdRequestPayload,
    GetConnectionsByDocumentIdResponsePayload,
    GetConnectionsByPersonIdRequestPayload,
    GetConnectionsByPersonIdResponsePayload,
    GetDocumentsRequestPayload,
    GetDocumentsResponsePayload,
    GetPersonByIdRequestPayload,
    GetPersonByIdResponsePayload,
    GetPersonsRequestPayload,
    GetPersonsResponsePayload,
    PostCommentRequestPayload,
    PostCommentResponsePayload,
    GetDocumentRequestPayload,
    GetDocumentResponsePayload,
    UploadDocumentRequestPayload,
    UploadDocumentResponsePayload,
    GeneralSearchRequestPayload,
    GeneralSearchResponsePayload,
    EditDocumentRequestPayload,
    EditDocumentResponsePayload
} from "./dtos";

export const getPersons =
    async (payload: GetPersonsRequestPayload): Promise<GetPersonsResponsePayload> => {
        return await api_get("/persons", payload)
    }

export const getPersonById =
    async (payload: GetPersonByIdRequestPayload): Promise<GetPersonByIdResponsePayload> => {
        return await api_get(`/persons/${payload.id}`)
    }

export const addPerson =
    async (payload: AddPersonRequestPayload): Promise<AddPersonResponsePayload> => {
        const newPayload = {
            ...payload.person
        }
        return await api_post("/persons/add", newPayload)
    }

export const uploadDocument =
    async (payload: UploadDocumentRequestPayload): Promise<UploadDocumentResponsePayload> => {
        const { file, backside_file, ...otherData } = payload
        const formData = new FormData()

        formData.append("file", payload.file);
        if (payload.backside_file)
            formData.append("backside_file", payload.backside_file)

        const formattedPayload = {
            data: otherData,
            formData: formData
        }

        return await api_post("/documents/upload", formattedPayload, true)
    }

export const editDocument =
    async (payload: EditDocumentRequestPayload): Promise<EditDocumentResponsePayload> => {
        const docId = payload.document.id;
        if (docId === null)
            throw new Error('Doc id cannot be null')

        return await api_post(`/documents/${docId}`, payload, true)
    }

export const getDocuments =
    async (payload: GetDocumentsRequestPayload): Promise<GetDocumentsResponsePayload> => {
        return await api_get("/documents", payload)
    }

export const getDocument =
    async (payload: GetDocumentRequestPayload): Promise<GetDocumentResponsePayload> => {
        return await api_get(`/documents/${payload.id}`)
    }

export const getCommentsByDocumentId =
    async (payload: GetCommentsByDocumentIdRequestPayload): Promise<GetCommentsByDocumentIdResponsePayload> => {
        return await api_get("/comments", payload)
    }

export const postComment =
    async (payload: PostCommentRequestPayload): Promise<PostCommentResponsePayload> => {
        return await api_post("/comments", payload)
    }

export const addConnection =
    async (payload: AddConnectionRequestPayload): Promise<AddConnectionResponsePayload> => {
        return await api_post("/connections/add", payload)
    }

export const getConnectionsByDocumentId =
    async (payload: GetConnectionsByDocumentIdRequestPayload): Promise<GetConnectionsByDocumentIdResponsePayload> => {
        return await api_get("/connections/by-document", payload)
    }

export const getConnectionsByPersonId =
    async (payload: GetConnectionsByPersonIdRequestPayload): Promise<GetConnectionsByPersonIdResponsePayload> => {
        return await api_get("/connections/by-person", payload)
    }

export const generalSearch =
    async (payload: GeneralSearchRequestPayload): Promise<GeneralSearchResponsePayload> => {
        return await api_get("/search", payload)
    }