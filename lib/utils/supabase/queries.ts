export const baseUserQuery = 'id, firstName:first_name, lastName:last_name, avatarUrl:avatar_url, createdAt:created_at, email';

const biographyQuery = 'id, school, userId:user_id, hometown, birthDate:birth_date, createdAt:created_at, currentCity:current_city';

export const userQueryWithPresenceStatus = `${baseUserQuery}, presenceStatus:presence_status, lastSeen:last_seen`;

export const userQueryWithBiography = `${baseUserQuery}, biography(${biographyQuery}), coverUrl:cover_url`;

export const photoQuery = `*, likes:likes_photos(userId:user_id)`;

export const albumQuery = `*, author:author_id(${baseUserQuery}), photos(${photoQuery})`

export const postQuery = `
  *,
  commentsCount:comments(count), 
  likesCount:likes_posts(count),
  likes:likes_posts(user:user_id),
  author:author_id(
    ${baseUserQuery}
  ),
  album:album_id(
    ${albumQuery}
  )
`;