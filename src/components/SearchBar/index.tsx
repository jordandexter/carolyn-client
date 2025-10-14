"use client"
import { useState, useEffect } from "react";
import { LoaderCircle } from "lucide-react";
import { GeneralSearchResponsePayload } from "@/api/dtos";
import { generalSearch } from "@/api/client_api";
import { SearchResult } from "./searchResult";
import { PersonModel } from "@/api/dtos";

export default function SearchBar() {
    const [search, setSearch] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const [searchResult, setSearchResult] = useState<GeneralSearchResponsePayload | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchDocuments = async () => {
        setLoading(true);
        const response = await generalSearch({ search: search })
        setSearchResult(response);
        setLoading(false);
    }

    const handleSubmit = () => {
        if (search === "") {
            return
        }
        window.location.href = `/search?query=${search}`
    }

    useEffect(() => {
        if (search === "") {
            setSearchResult(null);
            return;
        }
        fetchDocuments();
    }, [search]);

    return (
        <div className="relative w-full md:max-w-[500px]">
            <div className={`flex flex-col w-full h-[34px] bg-white py-1 px-4 fade-in transition-all rounded-[20px] duration-300 ${isFocused ? "border-1 border-purple-800" : "border-1 border-transparent"}`}
                style={{
                    boxShadow: `0 5px 10px 0 rgba(0, 0, 0, 0.3)`
                }}>
                <input type="text" placeholder="Search" className="flex bg-transparent outline-none w-full text-black"
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => {
                        setIsFocused(false);
                        setSearch("");
                    }}
                    onKeyDown={(e) => {
                        if (e.key == 'Enter') {
                            handleSubmit()
                        }
                    }}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <div className="translate-y-2">
                    {loading && (
                        <div className="flex rounded-lg w-full p-2 bg-white border-t-1 border-gray-300 justify-center items-center">
                            <LoaderCircle className="w-5 h-5 animate-spin text-purple-800" />
                        </div>
                    )}
                    {searchResult && searchResult.data.length > 0 && (
                        <div className="flex flex-col rounded-lg w-full p-2 bg-white border-t-1 border-gray-300 justify-center items-center">
                            {searchResult.data.map((object) => {
                                return (
                                    <SearchResult key={`${object.id}`} searchResult={object} />
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}