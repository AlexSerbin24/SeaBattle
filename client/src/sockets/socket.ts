import { ManagerOptions, SocketOptions, io } from "socket.io-client";


export default function getSocket(opt?: Partial<ManagerOptions & SocketOptions>) {
    const socket = io("http://localhost:5000", opt);
    return socket;
}
