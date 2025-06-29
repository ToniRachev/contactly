import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import UserAvatar from "./user-avatar"
import { Textarea } from "./ui/textarea"
import { Button } from "./ui/button"

export default function CreatePost() {
    return (
        <Dialog>
            <DialogTrigger className="w-full max-w-[50svw]">
                <div className="flex items-center gap-4">
                    <UserAvatar
                        avatar="/user_avatar.webp"
                        width={48}
                        height={48}
                    />

                    <div className="bg-surface w-full p-4 text-left rounded-lg">
                        <p>Share something with your friends...</p>
                    </div>
                </div>
            </DialogTrigger>
            <DialogContent className="border-none">
                <DialogHeader className="border-b-1 border-stone-500 pb-4">
                    <DialogTitle className="!text-lg">Create post</DialogTitle>
                </DialogHeader>

                <div>
                    <div className="flex items-center gap-2">
                        <UserAvatar
                            avatar="/user_avatar.webp"
                            width={48}
                            height={48}
                        />

                        <p>Traveler Jane</p>
                    </div>

                    <div className="pt-4">
                        <Textarea
                            className="resize-none min-h-[5vw]"
                            placeholder="What’s on your mind?"
                            name="postContent"
                        />

                        <div className="pt-4">
                            <Button className="w-full" variant={'secondary'}>Create post</Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}