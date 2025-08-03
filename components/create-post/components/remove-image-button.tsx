import { Button } from "@/components/ui/button";
import { CustomPhoto, PostImageType } from "../types";
import { X } from "lucide-react";

type RemoveImageButtonProps = {
    removeImage: (image: CustomPhoto | PostImageType) => void;
    image: CustomPhoto | PostImageType;
}

export default function RemoveImageButton({ removeImage, image }: Readonly<RemoveImageButtonProps>) {
    return (
        <Button variant={'secondary'} size="icon" onClick={() => removeImage(image)}>
            <X />
        </Button>
    )
}