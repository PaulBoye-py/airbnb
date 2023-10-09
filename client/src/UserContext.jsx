import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const UserContext = createContext({});

export function UserContextProvider({children}) {
    //  state for user
    const [user, setUser] = useState(null);

    // To know if the data request is ready or not
    const [ready, setReady] = useState(false);

    useEffect(() => {
        if(!user) {
            axios.get('/profile').then(({data}) => {
                setUser(data);
                setReady(true);
            });
        }
    }, []);

    return (
        <UserContext.Provider value={{user, setUser, ready}}>
            {children}
        </UserContext.Provider>
    )
}