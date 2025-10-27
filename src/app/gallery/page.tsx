"use client"
import { getDocument, getDocuments } from "@/api/client_api"
import { DocumentModel } from "@/api/dtos"
import { useEffect, useState, useRef, RefObject } from "react"
import ImageCard from "@/components/ImageCard"
import { GalleryHeader } from "@/components/GalleryHeader"
import { COLUMN_WIDTH } from "@/components/ImageCard/constants"
import { LoadingBalls } from "@/components/LoadingBalls"

const ITEMS_PER_PAGE = 40

export default function Gallery() {
    const containerRef = useRef<HTMLDivElement | null>(null)
    const sentinalRef = useRef<HTMLDivElement | null>(null)
    const [isFetching, setIsFetching] = useState(false)
    const [hasInitialized, setHasInitialized] = useState(false)

    const [documents, setDocuments] = useState<DocumentModel[] | null>(null)
    const [columnedItems, setColumnedItems] = useState<Record<string, DocumentModel[]> | null>(null)
    const offsetRef = useRef(0)
    const totalDocumentsRef = useRef(0)

    const [filter, setFilter] = useState('')
    const [filteredDocuments, setFilteredDocuments] = useState<DocumentModel[] | null>(null)
    const [columnedFilteredItems, setFilteredColumnedItems] = useState<Record<string, DocumentModel[]> | null>(null)
    const filteredOffsetRef = useRef(0)
    const totalFilterdDocumentsRef = useRef(0)

    const fetchDocuments = async (totalDocsRef: RefObject<number>, offsetDocsRef: RefObject<number>, search?: string) => {
        setIsFetching(true)
        try {
            let result = null;
            if (search) {
                result = await getDocuments({
                    search: search,
                    start: offsetDocsRef.current,
                    limit: ITEMS_PER_PAGE,
                    search_by: 'persons_firstname',
                })
            } else {
                result = await getDocuments({
                    start: offsetDocsRef.current,
                    limit: ITEMS_PER_PAGE,
                    search_by: 'filename'
                })
            }

            const documentsWithBlobs = await Promise.all(
                result.data.map(async (document) => {
                    try {
                        const imageBlob: Blob = await getDocument({
                            id: document.id || ''
                        })

                        return { ...document, blob: imageBlob }
                    } catch (error) {
                        console.log("Error downloading document: ", document)
                    }
                })
            );

            totalDocsRef.current = result.total_rows
            offsetDocsRef.current = offsetDocsRef.current + result.returned_rows
            setIsFetching(false)
            return documentsWithBlobs.filter((doc) => !!doc);
        } catch (error) {
            console.log(error)
            setIsFetching(false)
            return null;
        }

    }

    const recalculateColumns = (docs: DocumentModel[], callback: (result: Record<string, DocumentModel[]>) => void) => {
        if (!containerRef?.current || !docs) {
            return;
        }

        const cols = Math.floor(containerRef.current.clientWidth / COLUMN_WIDTH)
        const result: any = []
        for (let i = 0; i < 4; i++) {
            result[`col${i + 1}`] = [];
        }

        docs.forEach((doc, index) => {
            const colIndex = index % 4;
            result[`col${colIndex + 1}`].push(doc);
        });

        callback(result)
    }

    const getMoreDocuments = async () => {
        const newDocuments = await fetchDocuments(totalDocumentsRef, offsetRef)
        if (newDocuments) {
            setDocuments(prev => [...(prev || []), ...newDocuments])

            if (columnedItems) {
                const newColumns = columnedItems;
                newDocuments.forEach((doc, index) => {
                    const colIndex = index % 4;
                    newColumns[`col${colIndex + 1}`].push(doc);
                });
                setColumnedItems(newColumns)
            }
        }
    }

    const getFilteredDocuments = async () => {
        const newDocuments = await fetchDocuments(totalFilterdDocumentsRef, filteredOffsetRef, filter)
        if (newDocuments) {
            setFilteredDocuments(prev => [...(prev || []), ...newDocuments])

            if (columnedFilteredItems) {

                const newColumns = columnedFilteredItems;
                newDocuments.forEach((doc, index) => {
                    const colIndex = index % 4;
                    newColumns[`col${colIndex + 1}`].push(doc);
                });

                console.log(newColumns)
                setFilteredColumnedItems(newColumns)
            } else {
                recalculateColumns(newDocuments, (result) => {
                    setFilteredColumnedItems(result)
                })
            }

        }
    }

    useEffect(() => {
        if (!sentinalRef || !sentinalRef.current || !containerRef || !hasInitialized) return;

        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(async (entry) => {
                    if (entry.isIntersecting && !isFetching) {
                        if (filter !== '' && filteredDocuments && totalFilterdDocumentsRef.current > filteredDocuments.length) {
                            getFilteredDocuments()
                        } else {
                            if (documents && totalDocumentsRef.current > documents.length)
                                getMoreDocuments()
                        }
                    }
                })
            }
        )

        observer.observe(sentinalRef.current)
        return () => {
            observer.disconnect()
        }
    }, [sentinalRef, containerRef, documents, filteredDocuments, isFetching, hasInitialized, filter])


    const handleRecalc = (result: Record<string, DocumentModel[]>) => {
        setColumnedItems(result)
    }

    useEffect(() => {
        const handleResize = () => {
            if (documents)
                recalculateColumns(documents, handleRecalc)
        }

        window.addEventListener('resize', handleResize)
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [documents])

    useEffect(() => {
        if (documents && !hasInitialized) {
            recalculateColumns(documents, handleRecalc)
            setHasInitialized(true)
        }
    }, [documents])

    useEffect(() => {
        getMoreDocuments()
    }, [])


    useEffect(() => {
        if (filteredDocuments === null && columnedFilteredItems === null && filter !== null) {
            getFilteredDocuments()
        }

    }, [filteredDocuments, columnedFilteredItems])

    useEffect(() => {
        if (filter !== '') {
            totalFilterdDocumentsRef.current = 0;
            filteredOffsetRef.current = 0
            setFilteredColumnedItems(null)
            setFilteredDocuments(null)
        }
    }, [filter])



    return (
        <div className="flex flex-col justify-center items-center p-4 w-full">
            <div
                ref={containerRef}
                className="flex flex-col w-full justify-center max-w-[1700px] gap-4">

                <GalleryHeader
                    filter={filter}
                    setFilter={setFilter}
                />

                {!hasInitialized ? (
                    <div className="flex flex-col justify-center items-center p-2 w-full gap-2">
                        <LoadingBalls />
                    </div>
                ) : (
                    <div className="flex relative justify-center">
                        {
                            filter !== '' ? (
                                <div className="flex flex-row filtered">
                                    {
                                        columnedFilteredItems &&
                                        Object.entries(columnedFilteredItems).map(([key, col]: [string, DocumentModel[]]) => (
                                            <div key={key + '-filtered'} className={`flex flex-col`}>
                                                {col.map((doc) => (
                                                    <ImageCard key={doc.id} document={doc} />
                                                ))}
                                            </div>
                                        ))}
                                    {
                                        !isFetching && filteredDocuments?.length === 0 &&
                                        <div className="flex text-black w-full justify-center font-bold text-primary">No results :/</div>
                                    }
                                </div>
                            ) : (
                                <div className="flex flex-row unfiltered">
                                    {
                                        columnedItems &&
                                        Object.entries(columnedItems).map(([key, col]: [string, DocumentModel[]]) => (
                                            <div key={key} className={`flex flex-col`}>
                                                {col.map((doc) => (
                                                    <ImageCard key={doc.id} document={doc} />
                                                ))}
                                            </div>
                                        ))}
                                </div>
                            )}
                    </div>
                )}
            </div>

            <div ref={sentinalRef} className="flex h-1 w-full bg-blue h-2 -translate-y-200"></div>
        </div>
    )
}