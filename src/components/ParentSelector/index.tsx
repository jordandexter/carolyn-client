import { getPersons } from "@/api/client_api";
import { PersonModel } from "@/api/dtos";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { SearchResult } from "./SearchResult";
import { LoadingBalls } from "../LoadingBalls";
import { Check, X } from "lucide-react";

export function ParentSelect({ mother, father, setFather, setMother }: { mother: PersonModel | null, father: PersonModel | null, setFather: Dispatch<SetStateAction<PersonModel | null>>, setMother: Dispatch<SetStateAction<PersonModel | null>> }) {
    const [selectedOption, setSelectedOption] = useState<'Father' | 'Mother'>('Mother')
    const [query, setQuery] = useState<string>('')
    const [searchResults, setSearchResults] = useState<PersonModel[] | null>(null)
    const [totalResults, setTotalResults] = useState<number>(0)
    const [fetching, setFetching] = useState(false)

    const search = async (query: string) => {
        if (query.length < 1) {
            setTotalResults(0)
            return null;
        }

        try {
            setFetching(true)
            const result = await getPersons({
                search: query,
                limit: 5,
            })

            setTotalResults(result.total_rows)
            return result.data;
        } catch (error) {
            console.log(error)
        }

        return null;
    }

    useEffect(() => {
        const getSearchResults = async () => {
            const result = await search(query)
            setSearchResults(result)
            setFetching(false)
        }
        getSearchResults()
    }, [query])


    useEffect(() => {
        setQuery('')

    }, [selectedOption])



    return (
        <div>
            <div className="flex flex-col w-full bg-purple-200 p-2">
                <div className="relative flex flex-row">
                    <button className={`flex w-full justify-center items-center gap-1 py-1 rounded-t-lg ${selectedOption === 'Mother' ? 'bg-white font-bold text-primary' : 'bg-gradient-to-t from-gray-500 to-gray-400/90'}`}
                        onClick={() => setSelectedOption('Mother')}>
                        Mother
                        <div className={`flex justify-center items-center h-4 w-4 rounded-full bg-green-200 p-1 ${selectedOption === 'Mother' ? '' : 'opacity-50'} ${mother ? '' : 'hidden'}`}>
                            <Check className="text-green-700 h-3 w-3" />
                        </div>
                    </button>
                    <button className={`flex w-full justify-center items-center gap-1 py-1 rounded-t-lg ${selectedOption === 'Father' ? 'bg-white text-primary font-bold' : 'bg-gradient-to-t from-gray-500 to-gray-400/90'}`}
                        onClick={() => { setSelectedOption('Father') }}>
                        Father
                        <div className={`flex justify-center items-center h-4 w-4 rounded-full bg-green-200 p-1 ${selectedOption === 'Father' ? '' : 'opacity-50'} ${father ? '' : 'hidden'}`}>
                            <Check className="text-green-700 h-3 w-3" />
                        </div>
                    </button>
                </div>

                <div className="flex flex-col bg-white py-4 px-2 gap-2 rounded-b-lg">


                    <p className="text-xs italic text-gray-500">Don't worry if you cant find who you're looking for. You can always add them separately later.</p>
                    <div className="flex flex-col w-full h-[34px] bg-white py-1 px-4 fade-in transition-all rounded-[20px] duration-300 border-1 border-transparent "
                        style={{
                            boxShadow: '0 10px 10px 0 rgba(0,0,0,0.2)'
                        }}>

                        <input
                            className="flex bg-transparent outline-none w-full text-black "
                            type="text"
                            disabled={selectedOption === 'Mother' ? (mother !== null) : selectedOption === 'Father' ? (father !== null) : false}
                            value={query}
                            onChange={(e) => { setQuery(e.target.value) }}
                            placeholder={`Search ${selectedOption.toLowerCase()}...`}
                        />
                    </div>

                    <div className={`flex w-full justify-center items-center pt-2 ${fetching ? '' : 'opacity-0'}`}>
                        <LoadingBalls />
                    </div>

                    {mother && selectedOption === 'Mother' &&
                        < div className="flex w-full justify-between items-center bg-purple-200 p-2 rounded-lg">
                            <p className="text-primary font-bold">{mother.firstname} {mother.lastname}</p>
                            <div className="flex justify-center items-center p-1 hover:bg-red-400/20 rounded-full hover:cursor-pointer"
                                onClick={() => { setMother(null) }}>
                                <X className="w-4 h-4 text-red-400" />
                            </div>
                        </div>
                    }
                    {father && selectedOption === 'Father' &&
                        < div className="flex w-full justify-between items-center bg-purple-200 p-2 rounded-lg">
                            <p className="text-primary font-bold">{father.firstname} {father.lastname}</p>
                            <div className="flex justify-center items-center p-1 hover:bg-red-400/20 rounded-full hover:cursor-pointer"
                                onClick={() => { setFather(null) }}>
                                <X className="w-4 h-4 text-red-400" />
                            </div>
                        </div>
                    }

                    {searchResults?.map((person) => {
                        return (
                            <div className="flex"
                                onClick={() => {
                                    if (!person.id) return;

                                    if (selectedOption === "Mother") {
                                        setMother(person)
                                    } else {
                                        setFather(person)
                                    }

                                    setSearchResults(null)
                                    setTotalResults(0)
                                    setQuery('')
                                }}>
                                <SearchResult person={person} />
                            </div>
                        )
                    })}


                    {!fetching && query.length > 0 && searchResults?.length == 0 &&
                        < div className={`flex w-full justify-center items-center`}>
                            <p className="text-gray-500">No results found</p>
                        </div>
                    }

                </div>
            </div>
        </div >
    )
}