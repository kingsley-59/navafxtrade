
import React, { useContext, useState } from 'react'

const UserContext = React.createContext();
const ThemeUpdateContext = React.createContext();

export function useUser() {
    return useContext(UserContext);
}

export function useThemeUpdate() {
    return useContext(ThemeUpdateContext);
}

export const UserProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    function toggleLogin() {
        setIsLoggedIn(!isLoggedIn)
    }

    return (
        <UserContext.Provider value={isLoggedIn}>
            <ThemeUpdateContext.Provider value={toggleLogin}>
                {children}
            </ThemeUpdateContext.Provider>
        </UserContext.Provider>
    )
}
