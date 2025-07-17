'use client';

import { createContext, useCallback, useEffect, useRef } from "react";
import { PresenceStatusType } from "../types/user";
import { useAuthenticatedUser } from "./user.context";
import { updateUserStatus } from "../client/user.client";
import { USER_PRESENCE_STATUS } from "../constants/user";

const moveEvents = ['mousemove', 'keydown', 'scroll', 'click', 'touchstart', 'mousedown', 'touchmove'];

const IDLE_TIME = 1000 * 60 * 5;

const PresenceContext = createContext(null);

export default function PresenceProvider({ children }: Readonly<{ children: React.ReactNode }>) {
    const { user } = useAuthenticatedUser();
    const statusRef = useRef<PresenceStatusType | null>(null);
    const idleTimer = useRef<NodeJS.Timeout | null>(null);

    const updateStatus = useCallback(async (newStatus: PresenceStatusType) => {
        if (statusRef.current === newStatus) return;

        try {
            await updateUserStatus(newStatus, user.id);
            statusRef.current = newStatus;
        } catch (error) {
            console.error(error);
        }
    }, [user.id])

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
            if (idleTimer.current) {
                clearTimeout(idleTimer.current);
            }
        }
    }, [handleActivity, setUserOffline, updateStatus])

    return (
        <PresenceContext.Provider value={null}>
            {children}
        </PresenceContext.Provider>
    )
}
