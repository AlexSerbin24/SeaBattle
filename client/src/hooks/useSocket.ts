import { useState, useEffect } from "react";
import getSocket from "../sockets/socket";
import { Socket } from "socket.io-client";
import { useUserContext } from "../contexts/userContext";

const useSocket = () => {
    const [webSocket, setWebSocket] = useState<Socket | null>(null);
    const {user} = useUserContext();
    useEffect(() => {
      console.log("test")

      
    }, [user])
    

    useEffect(() => {

        const authToken = localStorage.getItem("token");
        console.log(authToken)
        const opt = authToken ? { extraHeaders: { "Authorization": `Bearer ${authToken}` } } : undefined;
        const socket = getSocket(opt);
        setWebSocket(socket);

        return () => {
            socket.disconnect()
        }


    }, [user])


    const sendMessage = (event: string, ...data: any[]) => {
        if (webSocket)
            webSocket.emit(event, ...data);
    };

    const onMessage = (event: string, callback: (...data: any[]) => void) => {
        if (webSocket)
            webSocket.on(event, callback);
    };

    const offMessage = (event: string, callback: (...data: any[]) => void) => {
        if (webSocket)
            webSocket.off(event, callback)
    }

    return { sendMessage, onMessage, offMessage };

}

export default useSocket;