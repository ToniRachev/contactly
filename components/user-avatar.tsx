import Image from "next/image";
import { cva } from "class-variance-authority";
import { resolveAvatarUrl } from "@/lib/utils";

type AvatarProps = {
    avatar: string | null;
    size?: 'sm' | 'md' | 'lg';
}

const avatarSize = cva('rounded-full bg-white object-cover object-center', {
    variants: {
        size: {
            sm: 'w-[40px] h-[40px]',
            md: 'w-[80px] h-[80px]',
            lg: 'w-[120px] h-[120px]'
        }
    },
    defaultVariants: {
        size: 'md'
    }
})

export default function Avatar(
    {
        avatar,
        size = 'md'
    }: Readonly<AvatarProps>) {
    return (
        <div className="flex items-center justify-center">
            <Image
                src={resolveAvatarUrl(avatar)}
                alt="User avatar"
                width={120}
                height={120}
                className={avatarSize({ size })}
            />
        </div>
    )
}