import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react'
import { Socket } from 'socket.io-client';
import getSocket from '../sockets/socket';
import { useUserContext } from './userContext';

type Props = {
    children: ReactNode
}
const SocketContext = React.createContext<Socket | null>(null);

const SocketProvider = ({ children }:Props) => {
  const [webSocket, setWebSocket] = useState<Socket | null>(null);
  const user = useUserContext()

  useEffect(() => {
    const authToken = localStorage.getItem("token");
    const opt = authToken ? { extraHeaders: { "Authorization": `Bearer ${authToken}` } } : undefined;
    const socket = getSocket(opt);
    setWebSocket(socket);

    return () => {
      socket.disconnect();
    };
  }, [user]);

  return <SocketContext.Provider value={webSocket}>{children}</SocketContext.Provider>;
};

const useSocketContext = ()=> useContext(SocketContext);

export {useSocketContext,SocketProvider}