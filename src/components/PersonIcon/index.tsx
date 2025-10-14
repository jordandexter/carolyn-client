"use client"
import { PersonModel } from "@/api/dtos";
import Link from "next/link";
import { normalize } from "@/app/utils";
import { PersonDetails } from "../Web/FocusedNode";

export default function FocusedNode({ person, x, y }: { person: PersonModel | null, x: number, y: number }) {

    if (!person) return null
    return (
        <Link href={`/person/${person.id}`}
            className="flex flex-col gap-2 items-center justify-center items-center cursor-pointer transition-all duration-100 absolute"
            style={{ 
                top: `${normalize('x', x)}px`,
                left: `${normalize('y', y)}px`
            }}>
                <PersonDetails person={person} />
        </Link>
    )
}