'use client';

import { createContext, useContext, useState } from "react";

const MessagesContext = createContext(null);

type MessagesProviderProps = {
    children: React.ReactNode;
    initialConversations?: [];
}

export default function MessagesProvider({ children, initialConversations = [] }: Readonly<MessagesProviderProps>) {
    const [conversations, setConversations] = useState(initialConversations);

    return (
        <MessagesContext.Provider value={null}>
            {children}
        </MessagesContext.Provider>
    )
}

export function useMessages() {
    return useContext(MessagesContext);
}