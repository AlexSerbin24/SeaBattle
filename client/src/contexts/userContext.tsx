import React, { createContext, useState, useContext, ReactNode } from 'react'
import User from '../types/User'



interface UserContextValue {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
}


const UserContext = createContext<UserContextValue>({ user: null, setUser: () => { } });


type Props = {
    children: ReactNode
}

const UserProvider = ({ children }: Props) => {
    const [user, setUser] = useState<User | null>(null)
    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    )
}

const useUserContext = ()=> useContext(UserContext);

export {UserProvider, useUserContext}