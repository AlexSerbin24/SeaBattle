import React from 'react'
import css from "./Modal.module.css";

export default function Modal() {
    return (
        <div className={css["modal"]}>
            <div className={css["modal-body"]}>
                <div className={css["modal-header"]}>
                    <h2>Test</h2>
                    <button className={css["modal-close-button"]}></button>
                </div>
                <div >
                    <p>This is test</p>
                </div>
            </div>
        </div>
    )
}
