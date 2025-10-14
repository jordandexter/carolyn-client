import { ConnectionModel } from "@/api/dtos"
import { RefObject, useEffect, useState } from "react";
import { Tag } from "./Tag";

interface Dimensions {
    height: number,
    width: number
}

export function TagMap({
    tags,
    imageRef,
    height,
    width
}: {
    tags: ConnectionModel[] | null,
    imageRef: RefObject<HTMLImageElement | null>,
    height: number,
    width: number

}) {
    const [renderedDimensions, setRenderedDimensions] = useState<Dimensions>({
        height: 0,
        width: 0
    })

    useEffect(() => {
        if (!imageRef.current) return;
        setRenderedDimensions({
            height: imageRef.current.clientHeight,
            width: imageRef.current.clientWidth
        })
    }, [imageRef, tags])

    if (!tags) return null;
    return (
        <>
            {tags.map((tag) => {
                if (!tag.x || !tag.y) return null;
                return (
                    <Tag
                        tag={tag}
                        x={tag.x * (renderedDimensions.height / height) + 6}
                        y={tag.y * (renderedDimensions.width / width) + 6}
                    />
                )
            })}
        </>
    )
}