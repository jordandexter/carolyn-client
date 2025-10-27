import { Edit } from "lucide-react"
import { JSX, useState } from "react"

export function ToolbarItem({
    icon,
    title,
    onClick
}: {
    icon: JSX.Element,
    title?: string,
    onClick: () => void
}) {
    const [hovered, setHovered] = useState(false)

    return (
        <button className="flex justify-center relative text-gray-400 hover:text-white hover:bg-primary items-center bg-white min-h-10 min-w-10 max-h-10 min-h-10 rounded-full"
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => { setHovered(false) }}
            style={{
                boxShadow: '0px 5px 5px 0px rgba(0,0,0,0.4)'
            }}>
            {icon}
            <div className={`absolute top-0 right-0 translate-x-[110%] translate-y-[25%] z-100 ${hovered ? '' : 'hidden'}`}>
                <p className="flex whitespace-nowrap bg-white text-gray-500 rounded-sm px-4"
                    style={{
                        boxShadow: '0px 5px 5px 0px rgba(0,0,0,0.4)'
                    }}>{title}</p>
            </div>
        </button>
    )
}