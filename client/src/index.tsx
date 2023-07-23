import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { UserProvider } from "./contexts/userContext";

const root = ReactDOM.createRoot(document.querySelector("#root") as HTMLElement);

root.render(
    <UserProvider >
        <App />
    </UserProvider >
);
