import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

export default function SendMessage() {
    return (
        <div className="relative w-[30svw]">
            <Textarea placeholder="Send message" className="border-none bg-surface resize-none max-h-[10vh] py-4 min-h-0
             [&::-webkit-scrollbar]:w-2 
            [&::-webkit-scrollbar-track]:bg-surface
            [&::-webkit-scrollbar-thumb]:bg-[#8C8C8C]
            [&::-webkit-scrollbar-button]:hidden
            " />
        </div>
    )
}