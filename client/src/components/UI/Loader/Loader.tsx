import React from 'react';
import css from "./Loader.module.css";

type Props = {
    loading: boolean,
}

export default function Loader({ loading }: Props) {
    const loaderOverlayClasses = [css["loader-overlay"]];
    if(!loading){
        loaderOverlayClasses.push(css["invisible"]);
    }

    return (
        <div className={loaderOverlayClasses.join(' ')}>
            <div className={css["loader"]}></div>
        </div>
    )
}
