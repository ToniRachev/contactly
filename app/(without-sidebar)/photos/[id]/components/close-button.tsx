import { X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CloseButton() {
    const router = useRouter();

    return (
        <button
            onClick={() => router.back()}
            className="absolute top-4 left-6 p-2 rounded-full bg-white/30 backdrop-blur-sm hover:bg-white/50 transition-all duration-300 cursor-pointer z-50"
        >
            <X />
        </button>
    )
}
