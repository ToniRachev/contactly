export const baseUserQuery = 'id, first_name, last_name, avatar_url, created_at, email';

export const userQueryWithPresenceStatus = `${baseUserQuery}, presence_status, last_seen`;

export const userQueryWithBiography = `${baseUserQuery}, biography(*), cover_url`;