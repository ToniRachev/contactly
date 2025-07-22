import Search from "@/components/search";
import MessageCard from "./components/message-card";
import Conversation from "./components/conversation";

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
                <Conversation />
            </div>
        </div>
    )
}