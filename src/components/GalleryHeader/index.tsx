import { useModalStore } from '@/hooks/useModalStore';
import { Search } from 'lucide-react';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'

const sortByOptions = [
    "Newest",
    "Oldest",
    "Relevant"
]

export function GalleryHeader({
    filter,
    setFilter
}: {
    filter: string,
    setFilter: Dispatch<SetStateAction<string>>
}) {
    const selectRef = useRef<HTMLSelectElement | null>(null)
    const { setUploadDocumentOpen, setAddPersonOpen } = useModalStore()
    const [showFilterInput, setShowFilterInput] = useState(false)
    const [showBorder, setShowBorder] = useState(false)
    const inputRef = useRef<HTMLInputElement | null>(null)

    return (
        <div className='flex flex-row gap-2 w-full justify-between'>
            <div className='flex flex-row gap-2'>
                <button className='flex bg-white px-4 border-1 border-white rounded-full justify-center items-center text-gray-500 hover:text-primary hover:border-1 hover:border-primary'
                    onClick={() => setAddPersonOpen(true)}
                    style={{
                        boxShadow: '0px 5px 5px 0px rgba(0,0,0,0.2)'
                    }}>
                    Add New Person
                </button>
                <button className='flex bg-white px-4 border-1 border-white rounded-full justify-center items-center text-gray-500 hover:text-primary hover:border-1 hover:border-primary'
                    onClick={() => setUploadDocumentOpen(true)}
                    style={{
                        boxShadow: '0px 5px 5px 0px rgba(0,0,0,0.2)'
                    }}>
                    Upload New Document
                </button>


            </div>
            <div className='flex flex-row gap-2'>
                <button className={`flex px-4 bg-gradient-to-t border-1 border-white from-red-100/10 to-red-500/0 rounded-full text-red-500 justify-center items-center ${filter !== '' ? '' : 'hidden'}`}
                    onClick={() => {
                        setFilter('')
                    }}
                    style={{
                        boxShadow: '0px 5px 5px 0px rgba(0,0,0,0.2)'
                    }}>
                    Clear
                </button>
                <div className='flex transition-all duration-3000 bg-white text-gray-400 hover:text-primary min-h-8 hover:border-1 hover:border-primary rounded-full justify-center items-center hover:scale-102'
                    style={{
                        boxShadow: '0px 5px 5px 0px rgba(0,0,0,0.2)'
                    }}>
                    <input type='text'
                        ref={inputRef}
                        placeholder="Filter..."
                        value={filter}
                        className={`flex transition-all text-gray-400 duration-1000 outline-none ${showFilterInput ? 'w-100 px-4' : 'h-0 w-0'}`}
                        onBlur={() => {
                            setShowFilterInput(false)
                        }}
                        onChange={(e) => { setFilter(e.target.value) }}

                    />
                    <button className='flex h-full min-w-8 justify-center items-center'
                        onClick={() => {
                            if (!showFilterInput) {
                                inputRef?.current?.focus()
                            }
                            setShowFilterInput(!showFilterInput)
                        }}>
                        <Search className=' h-3 w-3' />
                    </button>
                </div>
                <div
                    className={`flex rounded-full border px-2 py-1 bg-white gap-4 ${showBorder ? 'border-1 border-primary/80' : ''}`}
                    onMouseEnter={() => {
                        setShowBorder(true)
                    }}
                    onMouseLeave={() => {
                        setShowBorder(false)
                    }}
                    style={{
                        boxShadow: '0px 5px 5px 0px rgba(0,0,0,0.2)'
                    }}
                    onClick={() => {
                        if (!selectRef.current) return;

                        selectRef.current.focus()
                        selectRef.current.click()
                    }}>
                    <p className='text-gray-400 border-r px-3 '>Sort by</p>
                    <select
                        ref={selectRef}
                        className="bg-white rounded-full outline-none text-black"
                        defaultValue="Newest">
                        {sortByOptions.map((opt) => {
                            return (
                                <option id={opt} key={opt} value={opt} className='flex bg-white hover:text-primary hover:bg-gray-400'>
                                    {opt}
                                </option>
                            )
                        })}
                    </select>
                </div>
            </div>
        </div >
    )
}