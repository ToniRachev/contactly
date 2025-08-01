'use client';

import { createContext, useContext, ReactNode, useMemo, useCallback, useOptimistic, startTransition } from "react";
import { UserProfileType } from "../types/user";

type UserContextType = {
    user: UserProfileType | null;
    isAuthenticated: boolean;
    updateUserAvatar: (avatarUrl: string) => void;
    updateUserCover: (coverUrl: string) => void;
    updateUserBioField: (field: string, value: string) => void;
}

type UserProviderProps = {
    children: ReactNode;
    userData: UserProfileType | null;
}

const UserContext = createContext<UserContextType | null>(null);

export default function UserProvider({ children, userData }: Readonly<UserProviderProps>) {
    const [user, setUser] = useOptimistic(userData);

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

    const updateUserBioField = useCallback((field: string, value: string) => {
        startTransition(() => {
            setUser((prevState) => {
                if (!prevState) return null;

                return {
                    ...prevState,
                    biography: {
                        ...prevState.biography,
                        [field]: value
                    }
                }
            })
        })
    }, [setUser]);

    const contextValue = useMemo(() => ({
        user,
        isAuthenticated: !!user,
        updateUserAvatar,
        updateUserCover,
        updateUserBioField
    }), [user, updateUserAvatar, updateUserCover, updateUserBioField]);

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