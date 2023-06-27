import React from 'react';
import css from "./Button.module.css";

type Props = {
    children: string,
    className?: string,
    disabled?: boolean
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;

}

export default function Button({ children, disabled = false, className, onClick }: Props) {
    const classes = [css["app-button"]];

    if (className) {
        classes.push(className);
    }

    return (
        <button disabled={disabled} className={classes.join(' ')} onClick={onClick}>{children}</button>
    )
}
