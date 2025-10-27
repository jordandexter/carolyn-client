import { getPersonById } from "@/api/client_api";
import { ConnectionModel } from "@/api/dtos";
import { useEffect, useState } from "react";

export function Tag({ tag, x, y }: { tag: ConnectionModel, x: number, y: number }) {
    const [name, setName] = useState<string | null>(null)
    const [showDetails, setShowDetails] = useState<boolean>(false)
    const [lockDetails, setLockDetails] = useState<boolean>(false)

    const fetchPerson = async () => {
        try {
            const result = await getPersonById({
                id: tag.persons_id
            })
            setName(`${result.firstname} ${result.lastname}`)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        console.log(tag)
        if (!tag.persons_id) return;

        fetchPerson();
    }, [tag])

    useEffect(() => {
        console.log(lockDetails)

    }, [lockDetails])

    return (
        <div
            key={`${tag.document_id + tag.persons_id}`}
            className={`absolute h-3 w-3 ${showDetails || lockDetails ? 'bg-primary' : 'bg-white'} border-2 border-primary z-10 rounded-full hover:cursor-pointer relative`}
            style={{
                boxShadow: '0 5px 10px 0 rgba(0,0,0,0.8)',
                left: `${x}px`,
                top: `${y}px`
            }}
            onClick={() => {
                setLockDetails(!lockDetails)
                setShowDetails(false)
            }}
            onMouseEnter={() => setShowDetails(true)}
            onMouseLeave={() => {
                setShowDetails(false)
            }}
        >
            <div className={` ${showDetails || lockDetails ? '' : 'hidden'} absolute translate-x-4 -translate-y-6 flex flex-row bg-white border-primary border-2 flex text-black rounded-lg whitespace-nowrap opacity-80`}
                style={{
                    boxShadow: '0 5px 10px 0 rgba(0,0,0,0.8)',
                }}>
                <p className={`line-clamp-1 px-4 ${showDetails || lockDetails ? '' : 'hidden'}`}>{name}</p>
            </div>
        </div>
    )
}