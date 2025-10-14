

export default function Grid({height, width} : {height: number, width:number}) {
    const spacing = 50
    const verticalLines = Array.from({ length: Math.floor(width / spacing) + 1 }, (_, i) => i * spacing);
    const horizontalLines = Array.from({ length: Math.floor(height / spacing) + 1 }, (_, i) => i * spacing);

    return (
        <div className={"bg-black"}
            style={{
                height: `${height}px`,
                width: `${width}px`
            }}>
            {
                verticalLines.map((x) => (
                    <div
                        key={`Y-${x}`}
                        className="absolute bg-black opacity-10"
                        style={{
                            left: `${x}px`,
                            width: `1px`,
                            minHeight: `${height}px`
                        }} />
                ))
            }
            {
                horizontalLines.map((y) => (
                    <div
                        key={`X-${y}`}
                        className="absolute bg-black opacity-10"
                        style={{
                            top: `${y}px`,
                            width: `${width}px`,
                            minHeight: `1px`
                        }} />
                ))
            }


        </div>
    )
}