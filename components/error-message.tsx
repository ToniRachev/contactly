import clsx from "clsx";
import { ReactNode } from "react";

type ErrorMessageProps = {
    children: ReactNode;
    className?: string;
}

export default function ErrorMessage({ children, className }: Readonly<ErrorMessageProps>) {
    return (
        <p className={clsx('text-red-300', className)}>{children}</p>
    )
}