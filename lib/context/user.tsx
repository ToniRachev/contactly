'use client';

import { createContext, useContext, ReactNode, useState, useMemo, useEffect, useCallback, useOptimistic, use } from "react";
import { UserType } from "../utils/supabase/types/user";

type UserContextType = {
    user: UserType | null;
}

type UserProviderProps = {
    children: ReactNode;
    userData: Promise<UserType | null>;
}

const UserContext = createContext<UserContextType | null>(null);

export default function UserProvider({ children, userData }: UserProviderProps) {
    const user = userData ? use(userData) : null;

    const contextValue = useMemo(() => ({
        user,
    }), [user]);

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

    return context;
}