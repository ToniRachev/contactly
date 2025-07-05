'use client';

import { createContext, useContext, ReactNode, useMemo, useState, useCallback } from "react";
import { UserType } from "../types/user";

type UserContextType = {
    user: UserType | null;
    updateUserAvatar: (avatarUrl: string) => void;
}

type UserProviderProps = {
    children: ReactNode;
    userData: UserType | null;
}

const UserContext = createContext<UserContextType | null>(null);

export default function UserProvider({ children, userData }: Readonly<UserProviderProps>) {
    const [user, setUser] = useState(userData);

    const updateUserAvatar = useCallback((avatarUrl: string) => {
        setUser((prevState) => {
            if (!prevState) return null;

            return {
                ...prevState,
                avatarUrl
            }
        })
    }, [setUser]);

    const contextValue = useMemo(() => ({
        user,
        updateUserAvatar
    }), [user, updateUserAvatar]);

    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    )
}

export function useUser() {
    const context = useContext(UserContext);

    if (!context) {
        throw new Error('useUser must be used inside a UserProvider');
    }

    if (!context.user) {
        throw new Error('User is not authenticated');
    }

    return {
        user: context.user,
        updateUserAvatar: context.updateUserAvatar
    };
}