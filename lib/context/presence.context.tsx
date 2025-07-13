'use client';

import { createContext, useCallback, useEffect, useRef, useState } from "react";
import { useAuthenticatedUser } from "./user.context";
import { PresenceStatusType } from "../types/user";
import { createClient } from "../utils/supabase/client";

const PresenceContext = createContext(null);

const IDLE_TIME = 1000 * 60 * 5;
const POLL_INTERVAL = 1000 * 60;

const events = ['mousemove', 'keydown', 'scroll', 'click', 'touchstart', 'mousedown', 'touchmove'];

export default function PresenceProvider({ children }: Readonly<{ children: React.ReactNode }>) {
    const { user } = useAuthenticatedUser();
    const idleTimer = useRef<NodeJS.Timeout | null>(null);
    const [status, setStatus] = useState<PresenceStatusType | null>(null);

    const updateStatus = useCallback(async (newStatus: PresenceStatusType) => {
        const supabase = createClient();
        if (newStatus === status) return;
        setStatus(newStatus);

        try {
            await supabase.from('users').update({
                presence_status: newStatus,
                last_seen: new Date()
            }).eq('id', user.id);
        } catch (error) {
            console.error('Error updating presence status:', error);
        }
    }, [user, status])

    const handleActivity = useCallback(() => {
        if (idleTimer.current) {
            clearTimeout(idleTimer.current);
        }
        updateStatus('online');

        idleTimer.current = setTimeout(() => {
            updateStatus('idle');
        }, IDLE_TIME);
    }, [updateStatus])

    const handleBeforeUnload = useCallback(() => {
        updateStatus('offline');
    }, [updateStatus])

    useEffect(() => {
        updateStatus('online');

        const heartbeat = setInterval(async () => {
            updateStatus('online');
        }, POLL_INTERVAL);

        events.forEach(event => {
            window.addEventListener(event, handleActivity);
        });

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            clearInterval(heartbeat);
            events.forEach(event => {
                window.removeEventListener(event, handleActivity);
            });
        }
    }, [user, updateStatus, handleActivity, handleBeforeUnload])

    return (
        <PresenceContext.Provider value={null}>
            {children}
        </PresenceContext.Provider>
    )
}
