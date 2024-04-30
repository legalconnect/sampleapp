import { User } from "oidc-client-ts";
import { createContext, useContext, useEffect, useState } from "react";
import { userManager } from "./AuthManager";
import { ClientsService, LegalConnect_Common_Dtos_ClientDto } from "./services";

export interface IUserContext{
    user: User,
    client: LegalConnect_Common_Dtos_ClientDto
}
export const UserContext = createContext<IUserContext>(null as any);

export function UserContextProvider(props: any)
{
    const [user, setUser] = useState(null as any);
    const [client, setClient] = useState(null as any);

    useEffect(()=>{
        userManager.getUser().then( async response=> {
            setUser(response)
            const res = await ClientsService.getApiV1ClientsMe()
            setClient(res.result);
        });
    },[]);
    // if(!user)
    //     return null;
    
    return <UserContext.Provider value={{user,client}}>
        {props.children}
    </UserContext.Provider>
}
export function useUser(){

    var context =  useContext(UserContext)
    return {user: context.user, client: context.client};
}