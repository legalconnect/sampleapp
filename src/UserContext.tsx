import { User } from "oidc-client-ts";
import { createContext, useContext, useEffect, useState } from "react";
import { userManager } from "./AuthManager";

export interface IUserContext{
    user: User
}
export const UserContext = createContext<IUserContext>(null as any);

export function UserContextProvider(props: any)
{
    const [user, setUser] = useState(null as any);

    useEffect(()=>{
        userManager.getUser().then(response=> setUser(response));
    },[]);
    // if(!user)
    //     return null;
    console.log("User: ",user);
    return <UserContext.Provider value={{user}}>
        {props.children}
    </UserContext.Provider>
}
export function useUser(){

    var context =  useContext(UserContext)
    return context.user;
}