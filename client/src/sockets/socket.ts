import { ManagerOptions, SocketOptions, io } from "socket.io-client";
import { API_URL } from "../config/config";


export default function getSocket(opt?: Partial<ManagerOptions & SocketOptions>) {
    const socket = io(API_URL, opt);
    return socket;
}
