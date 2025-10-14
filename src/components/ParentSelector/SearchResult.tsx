import { PersonModel } from "@/api/dtos";

export function SearchResult({ person }: { person: PersonModel }) {

    return (
        <div className="flex w-full flex-col hover:bg-purple-200 p-2 rounded-sm hover:cursor-pointer">
            <p className="text-gray-500">{person.firstname} {person.lastname}</p>
            <p className="text-gray-500 text-sm">{person.dateOfBirth ? person.dateOfBirth.toString() : 'unknown'} - {person.dateOfDeath ? person.dateOfDeath.toString() : 'unknown'}</p>
        </div>
    )
}