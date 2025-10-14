import { ReactNode, useEffect, useState } from "react";

export function ModalWrapper({ children, isOpen, persistant }: { children?: ReactNode, isOpen: boolean, persistant: boolean }) {

    useEffect(() => {
        const body = document.querySelector('body');

        if (!isOpen && body) {
            body.style.overflow = 'auto'
            return;
        }

        if (body) {
            body.style.overflow = 'hidden'
        }

    }, [isOpen])

    if (persistant) {
        return (
            <div className={`absolute top-0 left-0 h-screen sticky flex justify-center z-9999 items-center inset-0 w-full bg-black/70 transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100' : 'pointer-events-none opacity-0 overflow-hidden'}`}
                style={{
                    backdropFilter: 'blur(3px)',
                }}>
                {children}
            </div>
        )
    }

    if (!isOpen) return null;

    return (
        <div className="absolute flex justify-center z-9999 items-center inset-0 w-full bg-black/70"
            style={{
                backdropFilter: 'blur(3px)',
            }}>
            {children}
        </div>
    )
}