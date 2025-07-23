import { formatFullName } from "@/lib/utils"
import { CommentDBType, CommentType, PostDBType, PostType, CountType, LikesType } from "@/lib/types/post"
import { ConversationDBType, MessageDBType } from "../types/conversation"
import { BaseUserDBType, BaseUserType, UserBiographyDBType, UserProfileDBType, UserProfileType, UserWithPresenceStatusDBType, UserWithPresenceStatusType } from "../types/user"

const extractCount = (item: CountType) => {
    return item?.[0]?.count ?? 0
}

const extractLikes = (likes: LikesType) => {
    return likes.map((like) => like.user)
}

const extractBiography = (biography: UserBiographyDBType[]) => {
    return {
        birthDate: biography[0].birth_date,
        hometown: biography[0].hometown,
        currentCity: biography[0].current_city,
        school: biography[0].school,
    }
}

export const transformBaseUser = (user: BaseUserDBType): BaseUserType => ({
    id: user.id,
    email: user.email,
    firstName: user.first_name,
    lastName: user.last_name,
    createdAt: user.created_at,
    fullName: formatFullName(user.first_name, user.last_name),
    avatarUrl: user.avatar_url,
})

export const transformUserWithPresenceStatus = (user: UserWithPresenceStatusDBType): UserWithPresenceStatusType => ({
    ...transformBaseUser(user),
    presenceStatus: user.presence_status,
    lastSeen: user.last_seen,
})

export const transformUserProfile = (user: UserProfileDBType): UserProfileType => ({
    ...transformUserWithPresenceStatus(user),
    biography: extractBiography(user.biography),
    coverUrl: user.cover_url,
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

export const transformFriendRequestsUsers = (users: { user: BaseUserDBType }[]) => {
    return users.map((user) => transformBaseUser(user.user));
}

export const transformFriends = (friends: { friend: UserWithPresenceStatusDBType }[]) => {
    return friends.map((friend) => transformUserWithPresenceStatus(friend.friend));
}

export const transformMessage = (message: MessageDBType) => {
    return {
        id: message.id,
        conversationId: message.conversation_id,
        senderId: message.sender_id,
        content: message.content,
        createdAt: message.created_at,
        sended: true,
    }
}

export const transformConversation = (conversation: ConversationDBType) => {
    return {
        id: conversation.id,
        user1Id: conversation.user1_id,
        user2Id: conversation.user2_id,
        createdAt: conversation.created_at,
        messages: conversation.messages.map((message) => transformMessage(message))
    }
}