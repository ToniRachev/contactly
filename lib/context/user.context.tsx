'use client';

import { createContext, useContext, ReactNode, useMemo, useCallback, useOptimistic, startTransition, useState } from "react";
import { UserProfileType } from "../types/user";

type UserContextType = {
    user: UserProfileType | null;
    isAuthenticated: boolean;
    updateUserAvatar: (avatarUrl: string) => void;
    updateUserCover: (coverUrl: string) => void;
    updateOptimisticBioField: (field: string, value: string) => void;
    updateUserBioField: (field: string, value: string) => void;
}

type UserProviderProps = {
    children: ReactNode;
    userData: UserProfileType | null;
}

const updateUserBioFieldState = (state: UserProfileType | null, field: string, value: string) => {
    if (!state) return null;

    return {
        ...state,
        biography: {
            ...state.biography,
            [field]: value
        }
    }
}

const UserContext = createContext<UserContextType | null>(null);

export default function UserProvider({ children, userData }: Readonly<UserProviderProps>) {
    const [user, setUser] = useState(userData);
    const [optimisticUser, updateOptimisticUser] = useOptimistic(user);

    const updateUserAvatar = useCallback((avatarUrl: string) => {
        startTransition(() => {
            setUser((prevState) => {
                if (!prevState) return null;

                return {
                    ...prevState,
                    avatarUrl
                }
            })
        })
    }, [setUser]);

    const updateUserCover = useCallback((coverUrl: string) => {
        startTransition(() => {
            setUser((prevState) => {
                if (!prevState) return null;

                return {
                    ...prevState,
                    coverUrl
                }
            })
        })
    }, [setUser]);

    const updateOptimisticBioField = useCallback((field: string, value: string) => {
        startTransition(() => {
            updateOptimisticUser((prevState) => updateUserBioFieldState(prevState, field, value));
        })
    }, [updateOptimisticUser]);

    const updateUserBioField = useCallback((field: string, value: string) => {
        setUser((prevState) => updateUserBioFieldState(prevState, field, value));
    }, [setUser]);

    const contextValue = useMemo(() => ({
        user: optimisticUser,
        isAuthenticated: !!user,
        updateUserAvatar,
        updateUserCover,
        updateOptimisticBioField,
        updateUserBioField
    }), [optimisticUser, user, updateUserAvatar, updateUserCover, updateOptimisticBioField, updateUserBioField]);

    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    )
}

export function useAuthenticatedUser() {
    const context = useContext(UserContext);

    if (!context) {
        throw new Error('useUser must be used inside a UserProvider');
    }

    if (!context.user) {
        throw new Error('User is not authenticated');
    }

    return {
        user: context.user,
        updateUserAvatar: context.updateUserAvatar,
        updateUserCover: context.updateUserCover,
        updateOptimisticBioField: context.updateOptimisticBioField,
        updateUserBioField: context.updateUserBioField
    };
}

export function useUser() {
    const context = useContext(UserContext);

    if (!context) {
        throw new Error('useUser must be used inside a UserProvider');
    }

    return context;
}