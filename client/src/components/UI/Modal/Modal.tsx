import React, { ReactNode, useState } from 'react'
import css from "./Modal.module.css";

type Props = {
    title: string,
    children: ReactNode,
    isVisible: boolean,
    setModal: React.Dispatch<React.SetStateAction<boolean>>
}
export default function Modal({ title, isVisible, setModal, children }: Props) {
    const modalClass = isVisible ? css["modal"] : css["invisible"];

    const closeButtonClickHandler = (event: React.MouseEvent) => {
        setModal(false);
    }

    return (
        <div className={modalClass}>
            <div className={css["modal-body"]}>
                <div className={css["modal-header"]}>
                    <h2>{title}</h2>
                    <button onClick={closeButtonClickHandler} className={css["modal-close-button"]}></button>
                </div>
                <div>
                    {children}
                </div>
            </div>
        </div>
    )
}
