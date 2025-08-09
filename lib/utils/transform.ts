import { formatFullName } from "@/lib/utils"
import { CommentDBType, CommentType, PostDBType, PostType, CountType, LikesType } from "@/lib/types/post"
import { BaseConversationOverviewDBType, ConversationDBType, ConversationOverviewDBType, ConversationOverviewType, ConversationParticipantDBType, MessageDBType } from "../types/conversation"
import { BaseUserDBType, BaseUserType, UserBiographyDBType, UserProfileDBType, UserProfileType, UserWithPresenceStatusDBType, UserWithPresenceStatusType } from "../types/user"
import { AlbumDBType, AlbumType, PhotoDBType, PhotoType } from "../types/photos"

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
        album: transformAlbum(post.album),
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

export const transformConversationParticipant = (participant: ConversationParticipantDBType) => {
    return {
        conversationId: participant.conversation_id,
        lastReadAt: participant.last_read_at,
        lastReadMessageId: participant.last_read_message_id,
        userId: participant.user_id
    }
}

export const transformBaseConversationOverview = (overview: BaseConversationOverviewDBType) => {
    return {
        id: overview.id,
        userId: overview.user_id,
        conversationId: overview.conversation_id,
        lastMessageId: overview.last_message_id,
        lastMessagePreview: overview.last_message_preview,
        lastMessageAt: overview.last_message_at,
        unreadCount: overview.unread_count,
    }
}

export const transformConversation = (conversation: ConversationDBType) => {
    return {
        id: conversation.id,
        user1Id: conversation.user1_id,
        user2Id: conversation.user2_id,
        createdAt: conversation.created_at,
        messages: conversation.messages.map((message) => transformMessage(message)),
        participants: conversation.conversation_participants.map((participant) => transformConversationParticipant(participant))
    }
}

export const transformConversationOverview = (overview: ConversationOverviewDBType, userId: string): ConversationOverviewType => {
    const participant = overview.conversation_participants.user1.id !== userId ? overview.conversation_participants.user1 : overview.conversation_participants.user2;

    return {
        ...transformBaseConversationOverview(overview),
        participant: transformUserWithPresenceStatus(participant),
    }
}

export const transformAlbum = (album: AlbumDBType): AlbumType => {
    return {
        id: album.id,
        authorId: album.author_id,
        type: album.type,
        createdAt: album.created_at,
        photos: album.photos.map((photo) => transformPhoto(photo)),
    }
}

export const transformPhoto = (photo: PhotoDBType): PhotoType => {
    return {
        id: photo.id,
        albumId: photo.album_id,
        authorId: photo.author_id,
        url: photo.url,
        caption: photo.caption,
        createdAt: photo.created_at,
    }
}