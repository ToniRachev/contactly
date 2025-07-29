'use client';

import { createContext, useCallback, useContext, useMemo, useState } from "react";

type ConversationContextType = {
    activeConversationUserId: string | null;
    handleSetActiveConversationUserId: (userId: string) => void;
}

type ConversationProviderProps = {
    children: React.ReactNode;
}

const ConversationContext = createContext<ConversationContextType | null>(null);

export default function ConversationProvider({ children }: Readonly<ConversationProviderProps>) {
    const [activeConversationUserId, setActiveConversationUserId] = useState<string | null>(null);

    const handleSetActiveConversationUserId = useCallback((userId: string) => {
        setActiveConversationUserId(userId);
    }, []);

    const contextValue = useMemo(() => ({
        activeConversationUserId,
        handleSetActiveConversationUserId,
    }), [
        activeConversationUserId,
        handleSetActiveConversationUserId,
    ]);

    return (
        <ConversationContext.Provider value={contextValue}>
            {children}
        </ConversationContext.Provider>
    )
}

export function useConversationContext() {
    const context = useContext(ConversationContext);
    if (!context) {
        throw new Error('useConversationContext must be used within a ConversationProvider');
    }
    return context;
}