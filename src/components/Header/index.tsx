import SearchBar from "@/components/SearchBar";
import { UploadDocumentButton } from "../UploadDocumentButton";
import Link from "next/link";

export default function Header() {
    return (
        <div className="absolute sticky top-0 z-1 flex w-full justify-center md:justify-between items-center px-5 py-2 gap-2"
            style={{
                backdropFilter: 'blur(5px)'
            }}>
            <div className="hidden md:flex flex-row gap-5">
                <Link
                    href="/"
                    className="text-purple-500 text-2xl italic font-bold border-r-2 pr-5">
                    Carolyn
                </Link>

                <div className="flex gap-5 flex-row justify-center items-center">
                    <Link
                        href={'/gallery'}
                        className="text-gray-500 hover:text-purple-500 rounded-sm">
                        Gallery
                    </Link>
                </div>
            </div>

            <div className="flex flex-row justify-end w-full gap-2">
                <SearchBar />
                <UploadDocumentButton />
            </div>

            <div>
            </div>
        </div>
    )
}