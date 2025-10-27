import SearchBar from "@/components/SearchBar";
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
                    className="text-primary text-2xl italic font-bold h-10">
                    <img src="/logo.png" alt="logo.png" className="object-fit flex h-11" />
                </Link>

                <div className="flex gap-5 flex-row justify-center items-center">
                    <Link
                        href={'/gallery'}
                        className="text-gray-500 hover:text-primary rounded-sm">
                        Gallery
                    </Link>
                </div>
            </div>

            <div className="flex flex-row justify-end w-full gap-2">
                <SearchBar />
            </div>

            <div>
            </div>
        </div>
    )
}