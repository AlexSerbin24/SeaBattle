import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { UserProvider } from "./contexts/userContext";
import { SocketProvider } from "./contexts/socketContext";
const root = ReactDOM.createRoot(document.querySelector("#root") as HTMLElement);

root.render(
    <UserProvider >
        <SocketProvider>
            <App />
        </SocketProvider>
    </UserProvider >
);
