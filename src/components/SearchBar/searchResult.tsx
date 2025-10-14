import { SearchResultModel } from "@/api/dtos"

export const SearchResult = ({
    searchResult
}:{
    searchResult : SearchResultModel
}) => {

    return (
        <div key={searchResult.id} className="flex w-full justify-start flex-col hover:bg-gray-100 rounded-lg p-2 hover:cursor-pointer">
            <p className="text-black">{searchResult.title || "Untitled"}</p>
            <p className="text-sm text-gray-500">{searchResult.subtitle || null}</p>
        </div>
    )
}