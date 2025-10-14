import { Edit } from "lucide-react"
import { JSX } from "react"

export function ToolbarItem({
    icon,
    onClick
}: {
    icon: JSX.Element
    onClick: () => void
}) {

    return (
        <button className="flex justify-center text-gray-400 hover:text-white hover:bg-purple-500 items-center bg-white min-h-10 min-w-10 max-h-10 min-h-10 rounded-full"
            onClick={onClick}
            style={{
                boxShadow: '0px 5px 5px 0px rgba(0,0,0,0.4)'
            }}>
            {icon}
        </button>
    )
}