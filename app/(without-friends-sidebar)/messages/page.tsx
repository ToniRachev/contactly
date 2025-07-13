import Search from "@/components/search";
import MessageCard from "./components/message-card";
import Conversation from "./components/conversation";
import MessageInput from "../../../components/message-input";
import { PresenceStatusType } from "@/lib/types/user";

const messages = [
    {
        avatar: '/user_avatar.webp',
        username: 'Lena Hartwell',
        lastMessage: "Are we still meeting tomorrow?",
        date: '08:12',
        newMessagesCount: 3,
        id: 4,
    },
    {
        avatar: '/user_avatar_2.png',
        username: 'Marcus Rios',
        lastMessage: "Got the files you sent. Looks good!",
        date: '14:27',
        newMessagesCount: 7,
        id: 5,
    },
    {
        avatar: '/user_avatar_3.png',
        username: 'Zara Patel',
        lastMessage: "Let's catch up soon. It's been forever!",
        date: '19:03',
        newMessagesCount: 0,
        id: 6,
    }
];

const conversation = {
    friend: {
        avatar: '/user_avatar.webp',
        name: 'Elias Monroe',
        status: 'online' as PresenceStatusType
    },
    messages: [
        {
            id: '1',
            senderId: 'user_1',
            message: 'Just posted a new piece — it’s an abstract inspired by last week’s storm.  Would love your honest thoughts ⚡🖤',
            sendedAt: '15:05',
        },
        {
            id: '2',
            senderId: 'user_2',
            message: 'I saw it — the textures are wild Feels like movement trapped on canvas',
            sendedAt: '15:06',
        },
        {
            id: '3',
            senderId: 'user_2',
            message: 'What did you use for the base?',
            sendedAt: '15:06',
        },
        {
            id: '4',
            senderId: 'user_1',
            message: 'Acrylic and charcoal',
            sendedAt: '15:06',
        },
        {
            id: '5',
            senderId: 'user_1',
            message: 'I layered it with a palette knife, then scratched it back with a fork 😅',
            sendedAt: '15:07'
        },
        {
            id: '6',
            senderId: 'user_2',
            message: 'That’s genius — the fork lines add so much raw energy to it 🔥',
            sendedAt: '15:08'
        },
        {
            id: '7',
            senderId: 'user_1',
            message: 'Thanks 🙏 I wasn’t sure it’d work, but it felt right in the moment.',
            sendedAt: '15:08'
        },
        {
            id: '8',
            senderId: 'user_2',
            message: 'It *really* does. Have you thought about showing it in the fall exhibit?',
            sendedAt: '15:09'
        },
        {
            id: '9',
            senderId: 'user_1',
            message: 'I’m tempted... just nervous it might be too raw for that crowd.',
            sendedAt: '15:09'
        },
        {
            id: '10',
            senderId: 'user_2',
            message: 'Raw *is* the point though. It’s honest. That’s what hits people.',
            sendedAt: '15:10'
        }
    ]
}

export default function Messages() {
    return (
        <div className="flex gap-24">
            <div className="w-[18vw]">
                <Search />

                <div className="pt-12">
                    {messages.map((message) => (
                        <MessageCard key={message.id} {...message} />
                    ))}
                </div>
            </div>

            <div className="flex flex-col w-full justify-between max-w-[55vw]">
                <Conversation conversation={conversation} />
                <div className="flex justify-end w-full">
                    <div>
                        <MessageInput
                            placeholder="Type a message..."
                            name="message"
                            className="w-[30vw]"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}