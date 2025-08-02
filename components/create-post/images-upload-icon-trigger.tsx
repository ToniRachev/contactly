import { Paperclip } from "lucide-react";
import ImageUploadWrapper from "../image-upload-wrapper";

type ImagesProps = {
    onImageChange: (images: FileList) => void;
}

export default function ImagesUploadIconTrigger({ onImageChange }: Readonly<ImagesProps>) {
    return (
        <ImageUploadWrapper
            name="images"
            onImageChange={onImageChange}
            multiple
        >
            <div className="flex justify-end pr-1">
                <Paperclip />
            </div>
        </ImageUploadWrapper>
    )
}