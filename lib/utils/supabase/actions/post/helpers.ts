import { commentSchema, postSchema } from "../../validations/postSchema";


export const parseAndValidateSubmitPostData = (formData: FormData) => {
    const data = {
        body: formData.get('body'),
    }

    const result = postSchema.safeParse(data);

    return { data, result };
}

export const parseAndValidateSubmitCommentData = (formData: FormData) => {
    const data = {
        body: formData.get('body'),
    }

    const result = commentSchema.safeParse(data);

    return { data, result };
}