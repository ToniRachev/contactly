export type CountType = { count: number }[];
export type LikesType = { user: string }[];

export type AuthorDBType = {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    created_at: string;
}

export type AuthorType = {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    createdAt: string;
    fullName: string;
}

export type CommentDBType = {
    id: string;
    created_at: string;
    author_id: string;
    author: AuthorDBType;
    post_id: string;
    body: string;
    likesCount: CountType;
    likes: LikesType;
}

export type CommentType = {
    id: string;
    createdAt: string;
    authorId: string;
    author: AuthorType;
    postId: string;
    body: string;
    likes: string[];
    likesCount: number;
}

export type PostDBType = {
    id: string;
    created_at: string;
    author: AuthorDBType;
    body: string;
    commentsCount: CountType;
    likesCount: CountType;
    likes: LikesType;
}

export type PostType = {
    postId: string;
    createdAt: string;
    author: AuthorType;
    body: string;
    commentsCount: number;
    likesCount: number;
    likes: string[];
    postOwner: boolean;
}