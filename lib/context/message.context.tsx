'use client';

import { createContext, useCallback, useContext, useMemo, useState } from "react";

type MessageContextType = {
    activeConversationUserId: string | null;
    handleSetActiveConversationUserId: (userId: string) => void;
}

type MessageProviderProps = {
    children: React.ReactNode;
}

const MessageContext = createContext<MessageContextType | null>(null);

export default function MessageProvider({ children }: Readonly<MessageProviderProps>) {
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
        <MessageContext.Provider value={contextValue}>
            {children}
        </MessageContext.Provider>
    )
}

export function useMessageContext() {
    const context = useContext(MessageContext);
    if (!context) {
        throw new Error('useMessageContext must be used within a MessageProvider');
    }
    return context;
}