import TextForm, { TextFormHandle } from "@/components/text-form";
import { Button } from "@/components/ui/button";
import { EditPhotoDescriptionType } from "../lib/types";
import { useRef } from "react";

type EditPhotoDescriptionProps = {
    value: string;
    closeEditing: () => void;
    editPhotoDescription: EditPhotoDescriptionType;
    photoId: string;
}

export default function EditPhotoDescription({ value, closeEditing, editPhotoDescription, photoId }: Readonly<EditPhotoDescriptionProps>) {
    const formRef = useRef<TextFormHandle>(null);

    const onSubmit = async (description: string) => {
        editPhotoDescription(photoId, description);
        closeEditing();
    }

    return (
        <div>
            <TextForm
                onSubmit={onSubmit}
                name="body"
                placeholder="Edit description"
                value={value}
                ref={formRef}
            />

            <div className="pt-4 space-x-2">
                <Button
                    variant={'secondary'}
                    className="text-sm w-fit"
                    onClick={() => formRef.current?.triggerSubmit()}
                    type="button"
                >
                    Save
                </Button>

                <Button
                    variant={'destructive'}
                    className="text-sm w-fit"
                    onClick={closeEditing}
                >
                    Cancel
                </Button>
            </div>
        </div>
    )
}