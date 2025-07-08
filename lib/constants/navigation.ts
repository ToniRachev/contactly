import { Compass, LogOut, MessageCircle, UserRound, UsersRound } from "lucide-react";
import { signout } from "../actions/auth/auth.actions";

export const NAVIGATION = {
    HOME: {
        title: 'News feed',
        url: '/',
        icon: Compass,
    },
    MESSAGES: {
        title: 'Messages',
        url: '/messages',
        icon: MessageCircle,
    },
    FRIENDS: {
        title: 'Friends',
        url: '/friends',
        icon: UsersRound,
    },
    PROFILE: {
        title: 'Profile',
        url: '/profile',
        icon: UserRound,
    },
    LOGOUT: {
        title: 'Logout',
        onClick: signout,
        icon: LogOut,
    },
}