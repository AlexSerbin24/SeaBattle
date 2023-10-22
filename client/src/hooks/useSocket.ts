import { useState, useEffect, useContext, ReactNode } from "react";
import getSocket from "../sockets/socket";
import { Socket } from "socket.io-client";
import React from "react";
import { useSocketContext } from "../contexts/socketContext";

const useSocket = () => {
    const socket = useSocketContext();

    const sendMessage = (event: string, ...data: any[]) => {
        if (socket)
            socket.emit(event, ...data);
    };

    const onMessage = (event: string, callback: (...data: any[]) => void) => {
        if (socket)
            socket.on(event, callback);
    };

    const offMessage = (event: string, callback: (...data: any[]) => void) => {
        if (socket)
            socket.off(event, callback);
    };

    return { sendMessage, onMessage, offMessage };
};

export default useSocket;