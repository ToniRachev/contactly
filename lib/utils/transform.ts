import { formatFullName } from "@/lib/utils"
import { BaseUserDBType, CommentDBType, CommentType, PostDBType, PostType, CountType, LikesType } from "@/lib/types/post"
import { FriendRequestUserDBType, UserDBType } from "@/lib/types/user"

const extractCount = (item: CountType) => {
    return item?.[0]?.count ?? 0
}

const extractLikes = (likes: LikesType) => {
    return likes.map((like) => like.user)
}

export const transformBaseUser = (author: BaseUserDBType) => ({
    id: author.id,
    email: author.email,
    firstName: author.first_name,
    lastName: author.last_name,
    createdAt: author.created_at,
    fullName: formatFullName(author.first_name, author.last_name),
    avatarUrl: author.avatar_url
})

export const transformPosts = (posts: PostDBType[], userId?: string): PostType[] => {
    return posts.map((post: PostDBType) => ({
        postId: post.id,
        createdAt: post.created_at,
        author: transformBaseUser(post.author),
        body: post.body,
        commentsCount: extractCount(post.commentsCount),
        likesCount: extractCount(post.likesCount),
        likes: extractLikes(post.likes),
        postOwner: userId ? userId === post.author.id : true,
    }))
}

export const transformUserData = (user: UserDBType) => {
    const biography = user.biography[0]

    return {
        id: user.id,
        createdAt: user.created_at,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        biography: {
            birthDate: biography?.birth_date ?? '',
            hometown: biography?.hometown ?? '',
            currentCity: biography?.current_city ?? '',
            school: biography?.school ?? ''
        },
        fullName: formatFullName(user.first_name, user.last_name),
        avatarUrl: user.avatar_url,
        coverUrl: user.cover_url,
    }
}

export const transformPostComments = (comments: CommentDBType[]): CommentType[] => {
    return comments.map((comment) => ({
        id: comment.id,
        createdAt: comment.created_at,
        authorId: comment.author_id,
        author: transformBaseUser(comment.author),
        postId: comment.post_id,
        body: comment.body,
        likes: extractLikes(comment.likes),
        likesCount: extractCount(comment.likesCount)
    }))
}



export const transformFriendRequestsUsers = (users: FriendRequestUserDBType[]) => {
    return users.map((user) => transformBaseUser(user.user));
}