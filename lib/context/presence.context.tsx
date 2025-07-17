'use client';

import { createContext, useCallback, useEffect, useRef, useState } from "react";
import { PresenceStatusType } from "../types/user";
import { useAuthenticatedUser } from "./user.context";
import { updateUserStatus } from "../client/user.client";
import { USER_PRESENCE_STATUS } from "../constants/user";

const moveEvents = ['mousemove', 'keydown', 'scroll', 'click', 'touchstart', 'mousedown', 'touchmove'];

const IDLE_TIME = 1000 * 60 * 0.1;

const PresenceContext = createContext(null);

export default function PresenceProvider({ children }: Readonly<{ children: React.ReactNode }>) {
    const { user } = useAuthenticatedUser();
    const [status, setStatus] = useState<PresenceStatusType | null>(null);
    const idleTimer = useRef<NodeJS.Timeout | null>(null);

    const updateStatus = useCallback(async (newStatus: PresenceStatusType) => {
        if (status === newStatus) return;
        console.log('updateStatus', newStatus);

        try {
            await updateUserStatus(newStatus, user.id);
            setStatus(newStatus);
        } catch (error) {
            console.error(error);
        }
    }, [status, user.id])

    const setUserOffline = useCallback(() => {
        updateStatus(USER_PRESENCE_STATUS.OFFLINE);
    }, [updateStatus])

    const setUserIdle = useCallback(() => {
        updateStatus(USER_PRESENCE_STATUS.IDLE);
    }, [updateStatus])

    const handleActivity = useCallback(() => {
        if (idleTimer.current) {
            clearTimeout(idleTimer.current);
        }

        updateStatus(USER_PRESENCE_STATUS.ONLINE);

        idleTimer.current = setTimeout(() => {
            setUserIdle();
        }, IDLE_TIME);
    }, [setUserIdle, updateStatus])

    useEffect(() => {
        updateStatus(USER_PRESENCE_STATUS.ONLINE);

        window.addEventListener('beforeunload', setUserOffline);
        moveEvents.forEach(event => {
            window.addEventListener(event, handleActivity);
        });

        return () => {
            window.removeEventListener('beforeunload', setUserOffline);
            moveEvents.forEach(event => {
                window.removeEventListener(event, handleActivity);
            });
        }
    }, [])

    return (
        <PresenceContext.Provider value={null}>
            {children}
        </PresenceContext.Provider>
    )
}
