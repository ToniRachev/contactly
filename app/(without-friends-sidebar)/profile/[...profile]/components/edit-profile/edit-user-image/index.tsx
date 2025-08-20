'use client';
import ImageUploadWrapper from "@/components/image-upload-wrapper";
import { updateUserImageAction } from "@/lib/actions/user/user.actions";
import { useAuthenticatedUser } from "@/lib/context/user.context";
import { updateUserImageSchema, UpdateUserImageSchemaErrorType, UpdateUserImageSchemaType } from "@/lib/validations/userSchema";
import { ReactNode, useActionState, useEffect, useRef, useState } from "react";

type EditUserImageProps = {
    imageType: 'avatar' | 'cover';
    onImageChange: (imageUrl: string) => void;
    onSuccess: (imageUrl: string) => void;
    children: (args: { isPending: boolean }) => ReactNode;
}

export default function EditUserImage({ imageType, onImageChange, onSuccess, children }: Readonly<EditUserImageProps>) {
    const { user } = useAuthenticatedUser();
    const formRef = useRef<HTMLFormElement>(null);
    const [validateError, setValidateError] = useState<string | null>(null);

    const updateUserImageActionWithUserId = updateUserImageAction.bind(null, user.id, imageType);

    const [state, formAction, isPending] = useActionState(updateUserImageActionWithUserId, {
        data: {
            image: null as unknown as File
        } as UpdateUserImageSchemaType,
        success: false,
        errors: {} as UpdateUserImageSchemaErrorType,
        imageUrl: null
    });

    const error = validateError ?? state.errors?.fieldErrors?.image?.[0] ?? state.errors?.formErrors?.[0];

    const handleImageChange = (file: File[]) => {
        const validateFile = updateUserImageSchema.safeParse({
            image: file[0],
        })

        if (!validateFile.success) {
            setValidateError(validateFile.error?.formErrors?.fieldErrors?.image?.[0] ?? null);
            return;
        }

        if (formRef.current) {
            setValidateError(null);
            onImageChange(URL.createObjectURL(file[0]));
            formRef.current.requestSubmit();
        }
    }

    useEffect(() => {
        if (state.success && state.imageUrl) {
            onSuccess(state.imageUrl);
        }
    }, [state.success, state.imageUrl, onSuccess])

    return (
        <form ref={formRef} action={formAction} className="w-full">
            <ImageUploadWrapper
                name="image"
                onImageChange={handleImageChange}
                error={error}
                disabled={isPending}
            >
                {children({ isPending })}
            </ImageUploadWrapper>
        </form>
    )
}
