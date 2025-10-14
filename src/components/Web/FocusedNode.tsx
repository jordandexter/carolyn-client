import { PersonModel } from "@/api/dtos";
import { useState } from "react";
import Image from "next/image";
import { normalize } from "@/app/utils";

export function PersonDetails({person} : {person : PersonModel}){
    const [mother, setMother] = useState<PersonModel | null>(null);
    const [father, setFather] = useState<PersonModel | null>(null);
    const [scale, setScale] = useState<number>(1)

    return (
        <div style={{
            top: `${normalize('x', 0)}px`,
            left: `${normalize('y', 0)}px`
        }}>
            <div className="relative">
                <Image
                    className="flex justify-center items-center rounded-full border-2 border-purple-900 relative"
                    src={`${person.primaryProfileUrl || "/default-profile.png"}`}
                    style={{
                        scale: `${scale}`
                    }}
                    width={100}
                    height={100}
                    alt={`${person.firstname}-${person.lastname}-${person.id}`}
                    onClick={() => {
                        setScale(0.90);
                        setTimeout(() => {
                            setScale(1);
                        }, 200)}}
                />
                <div className="absolute top-1/2 left-1/2 -translate-x-[682px] rotate-45 h-[2px] w-[800px] bg-white"></div>
            </div>


            <p className="text-sm font-bold text-white text-center">{person.firstname} {person.lastname}</p>
            <div>
                <div className="flex justify-between w-full text-sm font-normal text-left text-gray-400">
                    <span>Birth:</span><span className={`ml-2 ${!person.dateOfBirth ? 'italic opacity-80' : ''}`}>{person.dateOfBirth ? person.dateOfBirth.toString() : 'unknown' }</span>
                </div>
                <div className={`flex justify-between w-full text-sm font-normal text-left text-gray-400`}>
                    <span>Death:</span><span className={`ml-2 ${!person.dateOfDeath ? 'italic opacity-80' : ''}`}>{person.dateOfDeath ? person.dateOfDeath.toString() : 'unknown' }</span>
                </div>
            </div>
        </div>
    )
}