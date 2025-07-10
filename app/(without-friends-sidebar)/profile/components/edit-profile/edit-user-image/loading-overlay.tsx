import { Loader2 } from "lucide-react";
import clsx from "clsx";

type LoadingOverlayProps = {
    className?: string;
}

export default function LoadingOverlay({ className }: Readonly<LoadingOverlayProps>) {
    return (
        <div className={clsx("absolute inset-0 w-full h-full bg-black/50 flex items-center justify-center", className)}>
            <Loader2 className="animate-spin" />
        </div>
    )
}