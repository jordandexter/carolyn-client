
export interface PersonModel {
    id?: string,
    firstname: string,
    lastname: string,
    mother_id?: string,
    father_id?: string,
    dateOfBirth?: Date,
    dateOfDeath?: Date
    primaryProfileUrl?: string
}

export interface DocumentModel {
    id?: string,
    backside_id?: string,
    title?: string,
    filename: string,
    description?: string,
    createdDate?: Date,
    uploaded_date: Date,
    is_partial: boolean
    blob?: Blob,
    backside_blob?: Blob
}

export interface ConnectionModel {
    document_id: string,
    persons_id: string,
    type: 'name' | 'location' | 'item',
    x?: number,
    y?: number,
}

export interface CommentModel {
    id?: string,
    text: string,
    documentId: string,
    postedDate: Date
}

export interface SearchResultModel {
    id: string,
    title?: string,
    subtitle: string
}

// Payloads
export interface AddConnectionRequestPayload {
    document_id: string,
    persons_id: string,
    type: 'name' | 'location' | 'item',
    x?: number,
    y?: number,
}

export interface AddConnectionResponsePayload {
    document_id: string | null,
    persons_id: string | null,
    success: boolean
}

export interface GetPersonsRequestPayload {
    search?: string,
    start?: number,
    limit?: number,
    searchBy?: "firstname" | "lastname"
}

export interface GetPersonsResponsePayload {
    data: PersonModel[],
    returned_rows: number,
    total_rows: number
}

export interface GetPersonByIdRequestPayload {
    id: string
}

export interface GetPersonByIdResponsePayload {
    id: string,
    firstname: string,
    lastname: string,
    mother_id: string,
    father_id: string,
    date_of_birth: string,
    date_of_death: string
}

export interface AddPersonRequestPayload {
    person: PersonModel
}

export interface AddPersonResponsePayload {
    id: string,
    success: boolean
}

export interface UploadDocumentRequestPayload {
    title?: string,
    createdDate?: Date,
    description?: string,
    file: File,
    backside_file?: File
}

export interface EditDocumentRequestPayload {
    id: string
    document: DocumentModel,
    file?: File,
    backside_file?: File
}

export interface EditDocumentResponsePayload {
    document: DocumentModel
    success: boolean
}

export interface UploadDocumentResponsePayload {
    id: string,
    filename: string,
    success: boolean
}

export interface GetDocumentRequestPayload {
    id: string
}

export type GetDocumentResponsePayload = Blob

export interface GetDocumentsRequestPayload {
    search?: string,
    start?: number,
    limit?: number,
    search_by: "filename" | "persons_firstname" | "persons_lastname" | "id"
}

export interface GetDocumentsResponsePayload {
    data: DocumentModel[],
    returned_rows: number,
    total_rows: number
}

export interface GetCommentsByDocumentIdRequestPayload {
    documentId: string
}

export interface GetCommentsByDocumentIdResponsePayload {
    document_id: string,
    data: CommentModel[],
    returned_rows: number,
    total_rows: number
}

export interface PostCommentRequestPayload {
    comment: CommentModel
}

export interface PostCommentResponsePayload {
    id: number,
    success: boolean
}

export interface GetConnectionsByDocumentIdRequestPayload {
    document_id: string
}

export interface GetConnectionsByDocumentIdResponsePayload {
    document_id: string,
    data: ConnectionModel[],
    returned_rows: number,
    total_rows: number
}

export interface GetConnectionsByPersonIdRequestPayload {
    personsId: string
}

export interface GetConnectionsByPersonIdResponsePayload {
    persons_id: string,
    data: ConnectionModel[],
    returned_rows: number,
    total_rows: number
}

export interface GeneralSearchRequestPayload {
    search: string
}

export interface GeneralSearchResponsePayload {
    data: SearchResultModel[]
}

export interface PingRootRequestPayload {
}