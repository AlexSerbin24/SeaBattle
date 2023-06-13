import React, { ReactNode } from 'react'
import css from "./Container.module.css";

type Props = {
    className?:string,
    children: ReactNode
};

export default function Container({className, children }: Props) {
    const classes = [css["container"]];

    if(className){
        classes.push(className);
    }
    return (
        <div className={classes.join(' ')}>
            {children}
        </div>
    )
}
