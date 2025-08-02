import Avatar from "../user-avatar";

type TriggerProps = {
    avatarUrl: string | null;
}

export default function Trigger({ avatarUrl }: Readonly<TriggerProps>) {
    return (
        <div className="flex items-center gap-4">
            <Avatar
                avatar={avatarUrl}
                size={'sm'}
            />

            <div className="bg-surface w-full p-4 text-left rounded-lg">
                <p>Share something with your friends...</p>
            </div>
        </div>
    )
}