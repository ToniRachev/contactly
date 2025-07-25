import Search from "@/components/search";
import Conversation from "./components/conversation";
import ConversationsList from "./components/conversations/conversations-list";

export default function Messages() {
    return (
        <div className="flex gap-24">
            <div className="w-[18vw]">
                <Search />
                <ConversationsList />
            </div>

            <div className="flex flex-col w-full justify-between max-w-[55vw]">
                <Conversation />
            </div>
        </div>
    )
}