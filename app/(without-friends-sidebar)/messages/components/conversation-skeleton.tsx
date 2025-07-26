import { Skeleton } from "@/components/ui/skeleton";
import clsx from "clsx";

const ColoredSkeleton = ({ className }: { className: string }) => {
    return (
        <Skeleton className={clsx(className, 'bg-stone-600')} />
    )
}

export default function ConversationSkeleton() {
    return (
        <div>
            <div className="flex items-center gap-4">
                <ColoredSkeleton className="w-[80px] h-[80px] rounded-full" />
                <div className="space-y-2">
                    <ColoredSkeleton className="w-48 h-5" />
                    <ColoredSkeleton className="w-24 h-5" />
                </div>
            </div>

            <div className="max-h-[70vh] h-[70vh] flex mt-6 mb-6 justify-end overflow-hidden">
                <div className="flex flex-col-reverse gap-4 w-full h-full">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className={clsx('flex items-center gap-4', index % 2 === 0 && 'justify-end')}>
                            <ColoredSkeleton className={clsx('w-80 h-20')} />
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-end">
                <ColoredSkeleton className="w-[30vw] h-12" />
            </div>
        </div >
    )
}