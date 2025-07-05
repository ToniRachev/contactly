'use client';

import Avatar from "@/components/user-avatar";
import { SectionWrapper } from ".";
import { Camera } from "lucide-react";
import ImageUploadWrapper from "@/components/image-upload-wrapper";
import { useUser } from "@/lib/context/user.context";
import { useActionState, useEffect, useRef, useState } from "react";
import { updateUserAvatarAction } from "@/lib/actions/user/user.actions";
import { UpdateUserAvatarSchemaErrorType, updateUserAvatarSchema } from "@/lib/validations/userSchema";

export default function EditProfilePicture() {
    const { user, updateUserAvatar } = useUser();
    const formRef = useRef<HTMLFormElement>(null);
    const [validateError, setValidateError] = useState<string | null>(null);

    const updateUserAvatarActionWithUserId = updateUserAvatarAction.bind(null, user.id);

    const [state, formAction, isPending] = useActionState(updateUserAvatarActionWithUserId, {
        success: false,
        errors: {} as UpdateUserAvatarSchemaErrorType,
        avatarUrl: null
    });

    const [image, setImage] = useState<string | null>(user.avatarUrl);
    const error = validateError ?? state.errors?.fieldErrors?.avatar?.[0] ?? state.errors?.formErrors?.[0];

    const handleImageChange = (file: File) => {
        const validateFile = updateUserAvatarSchema.safeParse({
            avatar: file,
        })

        if (!validateFile.success) {
            setValidateError(validateFile.error?.formErrors?.fieldErrors?.avatar?.[0] ?? null);
            return;
        }

        if (formRef.current) {
            setValidateError(null);
            setImage(URL.createObjectURL(file));
            formRef.current.requestSubmit();
        }
    }

    useEffect(() => {
        if (state.success && state.avatarUrl) {
            updateUserAvatar(state.avatarUrl);
        }
    }, [state.success, state.avatarUrl, updateUserAvatar])



    return (
        <SectionWrapper title="Edit profile picture" className="justify-center">
            <div className="">
                <form ref={formRef} action={formAction}>
                    <ImageUploadWrapper
                        name="avatar"
                        onImageChange={handleImageChange}
                        error={error}
                        disabled={isPending}
                    >
                        <div className="relative">
                            <Avatar
                                avatar={image}
                                size={'lg'}
                            />
                            <div className="absolute bottom-0 right-0 bg-stone-600 p-1 rounded-full">
                                <Camera />
                            </div>
                        </div>
                    </ImageUploadWrapper>
                </form>
            </div>
        </SectionWrapper>
    )
}