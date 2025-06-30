import { formatFullName } from "@/lib/utils"
import { AuthorDBType, CommentDBType, CommentType, FeedDBType, FeedType, CountType, LikesType } from "../types/post"
import { UserDBType } from "../types/user"

const extractCount = (item: CountType) => {
    return item?.[0]?.count ?? 0
}

const extractLikes = (likes: LikesType) => {
    return likes.map((like) => like.user)
}

export const transformAuthor = (author: AuthorDBType) => ({
    id: author.id,
    email: author.email,
    firstName: author.first_name,
    lastName: author.last_name,
    createdAt: author.created_at,
    fullName: formatFullName(author.first_name, author.last_name)
})

export const transformFeed = (feed: FeedDBType[]): FeedType[] => {
    return feed.map((item: FeedDBType) => ({
        postId: item.id,
        createdAt: item.created_at,
        author: transformAuthor(item.author),
        body: item.body,
        commentsCount: extractCount(item.commentsCount),
        likesCount: extractCount(item.likesCount),
        likes: extractLikes(item.likes),
    }))
}

export const transformUserData = (user: UserDBType) => {
    const biography = user.biography[0]

    return {
        id: user.id,
        created_at: user.created_at,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        biography: {
            birthDate: biography?.birth_date ?? '',
            hometown: biography?.hometown ?? '',
            currentCity: biography?.current_city ?? '',
            school: biography?.school ?? ''
        }
    }
}

export const transformPostComments = (comments: CommentDBType[]): CommentType[] => {
    return comments.map((comment) => ({
        id: comment.id,
        createdAt: comment.created_at,
        authorId: comment.author_id,
        author: transformAuthor(comment.author),
        postId: comment.post_id,
        body: comment.body,
        likes: extractLikes(comment.likes),
        likesCount: extractCount(comment.likesCount)
    }))
}