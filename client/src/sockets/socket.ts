import { ManagerOptions, SocketOptions, io } from "socket.io-client";


export default function getSocket(opt?: Partial<ManagerOptions & SocketOptions>) {
    const socket = io("http://sea-battle4308.eu-north-1.elasticbeanstalk.com", opt);
    return socket;
}
