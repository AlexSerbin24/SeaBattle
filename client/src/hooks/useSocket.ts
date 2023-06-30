import { useState } from "react";
import socket from "../sockets/socket";

const useSocket = () => {
    const [webSocket] = useState(socket);

    const sendMessage = (event: string, ...data: any[]) => {
        webSocket.emit(event, ...data);
    };

    const onMessage = (event: string, callback: (...data:any[]) => void) => {
        webSocket.on(event, callback);
    };

    return { sendMessage, onMessage };

}

export default useSocket;