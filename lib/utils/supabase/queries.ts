export const baseUserQuery = 'id, first_name, last_name, avatar_url, created_at, email';

export const userQueryWithPresenceStatus = `${baseUserQuery}, presence_status, last_seen`;

export const userQueryWithBiography = `${baseUserQuery}, biography(*), cover_url`;

export const photoQuery = `*, likes:likes_photos(userId:user_id)`;

export const albumQuery = `*, author:author_id(id, first_name, last_name, avatar_url), photos(${photoQuery})`

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