export function LoadingBalls() {

    return (
        <div className="flex flex-row gap-1">
            <div className="flex h-2 w-2 bg-primary rounded-full animate-bounce1"
                style={{
                    boxShadow: '0 2px 2px 0 rgba(0,0,0,0.4)'
                }}></div>
            <div className="flex h-2 w-2 bg-primary rounded-full animate-bounce2"
                style={{
                    boxShadow: '0 2px 2px 0 rgba(0,0,0,0.4)'
                }}></div>
            <div className="flex h-2 w-2 bg-primary rounded-full animate-bounce3"
                style={{
                    boxShadow: '0 2px 2px 0 rgba(0,0,0,0.4)'
                }}></div>
        </div >
    )
}