import React from 'react'
import css from "./Input.module.css";

type Props = {
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    type?: "email" | "password" | "text" | "tel";
    placeholder?: string;
};


export default function Input({ value, onChange, placeholder, type = "text" }: Props) {
    return (
        <input
            className={css["app-input"]}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
        />
    )
}
