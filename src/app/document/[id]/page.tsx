import DocumentPage from "@/screens/documents" 

export default async function Document(context : any){
    const {id} = context.params


    return (
        <DocumentPage id={id} />
    )
}