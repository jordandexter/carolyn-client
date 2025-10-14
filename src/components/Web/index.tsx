"use client"
import { useState, useEffect } from "react";
import { PersonModel } from "@/api/dtos";
import { getPersons } from "@/api/client_api";
import Grid from "@/components/Grid";
import { GRID_HEIGHT, GRID_WIDTH } from "@/app/utils";
import FocusedNode from "../PersonIcon";

export const Web = () => {
    const [person, setPerson] = useState<PersonModel | null>(null);

    const fetchPerson = async () => {
        const response = await getPersons({ search: "Jordan" });
        setPerson(response.data[0]);
    }

    useEffect(() => {
        fetchPerson();
    }, []);

    return (
        <div className={`absolute block top-0 left-0 relative bg-black`}
            style={{
                height: `${GRID_HEIGHT}px`,
                width: `${GRID_WIDTH}px`
            }}>
            <Grid
                height={GRID_HEIGHT}
                width={GRID_WIDTH}
            />
            <FocusedNode
                person={person}  
                x={0}
                y={0}
            />
        </div>
    )
}