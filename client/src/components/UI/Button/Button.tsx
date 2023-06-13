import React from 'react';
import css from "./Button.module.css";

type Props = {
    children: string,
    className?: string,
    onClick?: () => void;

}

export default function Button({ children, className, onClick }: Props) {
    const classes = [css["app-button"]];
    
    if(className){
        classes.push(className);
    }

    return (
        <button className={classes.join(' ')} onClick={onClick}>{children}</button>
    )
}
