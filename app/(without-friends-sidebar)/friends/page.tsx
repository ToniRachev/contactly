import FriendRequests from "./components/friend-requests/friend-requests";
import FriendsList from "./components/friends-list";

export default function Friends() {
    return (
        <div className="flex flex-col gap-8">
            <FriendRequests />
            <FriendsList />
        </div>
    )
}