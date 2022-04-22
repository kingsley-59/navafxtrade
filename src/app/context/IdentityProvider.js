import { createContext, useState } from "react";

const IdentityContext = createContext({});

export const IdentityProvider = ({ children }) => {
    // const identity = useNetlifyIdentity(url) ?
    // console.log({ identity, url })

    return (
        {children}
        // <IdentityContext.Provider value={identity}>
        //     {children}
        // </IdentityContext.Provider>
    )
}

export default IdentityContext;