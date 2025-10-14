"use client"
import { useState, useEffect } from "react"
import { FileDrop } from "@/components/FileDrop"
import { PersonModel } from "@/api/dtos"
import { addPerson } from "@/api/client_api"
import { ParentSelect } from "@/components/ParentSelector"

export function AddPersonModal({ onClose }: { onClose: () => void }) {
    const [submitted, setSubmitted] = useState(false)
    const [keyPhoto, setKeyPhoto] = useState<File | null>(null)
    const [firstname, setFirstName] = useState('')
    const [lastname, setLastName] = useState('')
    const [dob, setDob] = useState<Date | null>(null)
    const [dod, setDod] = useState<Date | null>(null)
    const [mother, setMother] = useState<PersonModel | null>(null)
    const [father, setFather] = useState<PersonModel | null>(null)

    const reset = () => {
        setFirstName('')
        setLastName('')
        setDob(null)
        setFather(null)
        setMother(null)
        setDod(null)
        setKeyPhoto(null)
    }

    const handleSubmit = async () => {
        const newPerson: PersonModel = {
            firstname: firstname,
            lastname: lastname
        }

        if (dob)
            newPerson.dateOfBirth = dob;
        if (dod)
            newPerson.dateOfDeath = dod;
        if (mother)
            newPerson.mother_id = mother.id;
        if (father)
            newPerson.father_id = father.id;

        try {
            const result = await addPerson({
                person: newPerson
            })

            if (result.success) {
                setSubmitted(true)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleClose = () => {
        if (onClose)
            onClose()

        setTimeout(() => {
            reset()
        }, 3000)
    }

    useEffect(() => {
        if (!submitted) return;
        setTimeout(() => {
            setSubmitted(false)
            reset()
        }, 5000)
    }, [submitted])

    return (
        <div className="flex flex-col bg-white transition-all duration-1000 ease-in-out rounded-lg relative pt-9 pb-3 px-4 gap-2 overflow-hidden border-1 border-purple-500 "
            style={{
                boxShadow: `0px 20px 25px 0px rgba(0,0,0,0.4)`,
                maxWidth: '400px',
                maxHeight: '700px'
            }}>

            <div className="flex justify-center items-center gap-0.5">
                <h1 className="text-center text-2xl font-bold bg-gradient-to-r from-purple-700/70 to-orange-200 to-pink-500 bg-clip-text text-transparent">
                    Add a family member
                </h1>
            </div>

            <div className="flex flex-col w-full justify-center items-center ">

                <span className="text-xs text-gray-500 italic text-center">Add a memorable photo of the person below</span>
                <span className="text-xs text-gray-500 italic text-center mb-2">Bonus points for a smile!</span>
                <FileDrop file={keyPhoto} setFiles={setKeyPhoto} />
            </div>

            <p className="text-xs  text-gray-500">
                Please fill out the fields below. Although not all fields are required, try to provide as much information as possible.
                <br></br>
                <br></br>
                <span className="font-bold">Note:</span> These fields can be changed or updated at anytime.
            </p>

            <div className="flex flex-col py-4 px-2 max-h-[300px] overflow-scroll rounded-lg bg-purple-200 scrollbar-hide relative">
                <div className="absolute  z-999 w-full top-0 h-10 left-0 bg-gradient-to-b from-black/20 to-black/0"></div>

                <>
                    <p className="text-purple-500 text-md px-2 font-bold">
                        First name<span className="text-red-400">*</span><span className="text-gray-500"> - What is their first name?</span></p>
                    <input
                        type="text"
                        value={firstname}
                        spellCheck={false}
                        onChange={(e) => { setFirstName(e.target.value) }}
                        className="text-black bg-white border-1 text-sm border-gray-300 rounded-full px-2 py-1 focus:outline-none border-2 border-gray-200 focus:ring-0 focus:border-purple-500 focus:border-2"
                        placeholder="Enter first name"
                    />
                </>

                <>
                    <p className="text-purple-500 text-md px-2 font-bold">
                        Last name<span className="text-red-400">*</span><span className="text-gray-500"> - What is their last name?</span></p>
                    <input
                        type="text"
                        value={lastname}
                        spellCheck={false}
                        onChange={(e) => { setLastName(e.target.value) }}
                        className="text-black bg-white border-1 text-sm border-gray-300 rounded-full px-2 py-1 focus:outline-none border-2 border-gray-200 focus:ring-0 focus:border-purple-500 focus:border-2"
                        placeholder="Enter last name"
                    />
                </>

                <ParentSelect mother={mother} father={father} setMother={setMother} setFather={setFather} />

                <>
                    <p className="text-purple-500 text-md px-2 font-bold">
                        Date of birth<span className="text-gray-500"> - When is their birthday?</span></p>
                    <p className="text-gray-500 text-xs px-2">
                        Optional
                    </p>
                    <input
                        type="date"
                        value={String(dob)}
                        onChange={(e) => { setDob(new Date(e.target.value)) }}
                        className="text-black bg-white w-full border-1 text-sm border-gray-300 rounded-full px-2 py-1 focus:outline-none border-2 border-gray-200 focus:ring-0 focus:border-purple-500 focus:border-2"
                        placeholder="Enter first name"
                    />
                </>
                <>
                    <p className="text-purple-500 text-md px-2 font-bold">
                        Date of death <span className="text-gray-500"> - When did they pass?</span>
                    </p>
                    <p className="text-gray-500 text-xs px-2">
                        Optional
                    </p>
                    <input
                        type="date"
                        value={String(dod)}
                        onChange={(e) => { setDod(new Date(e.target.value)) }}
                        className="text-black bg-white w-full border-1 text-sm border-gray-300 rounded-full px-2 py-1 focus:outline-none border-2 border-gray-200 focus:ring-0 focus:border-purple-500 focus:border-2"
                        placeholder="Enter first name"
                    />
                </>
            </div>


            <button
                className={`flex w-full justify-center items-center ${!submitted ? 'hover:-translate-y-[2px]' : ''} transition-all relative duration-300 ease-in-out bg-gray-400 rounded-full min-h-10 overflow-hidden`}
                disabled={submitted || !firstname || !lastname}
                onClick={() => {
                    handleSubmit()
                }}
            >
                <div className={`absolute flex z-10 h-[500px] transition-all duration-2000 justify-center items-center w-[500px] rounded-full bg-green-500 ${submitted ? 'translate-y-0' : '-translate-y-85 -translate-x-85'}`}>
                    <p className="text-white">Submitted successfully!</p>
                </div>
                <div className={`absolute flex z-9 h-[500px] transition-all duration-2000 justify-center items-center w-[500px] rounded-full bg-purple-500 ${firstname && lastname ? 'translate-y-0' : 'translate-y-85 translate-x-85'}`}>
                    Add Person
                </div>

                <p className="text-white">Add some information to begin</p>

            </button>
            <button
                className={`flex w-full justify-center items-center transition-all  bg-red-400/70 hover:bg-red-400 text-white border-1 border-red-500 relative duration-300 ease-in-out rounded-full min-h-10 overflow-hidden`}
                onClick={handleClose}
            >
                Cancel
            </button>
        </div >
    )
}