import { UserDBType } from "@/lib/utils/supabase/types/user";

export const transformUserData = (user: UserDBType) => {
    const biography = user.biography[0]

    return {
        id: user.id,
        created_at: user.created_at,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        biography: {
            birthDate: biography.birth_date,
            hometown: biography.hometown,
            currentCity: biography.current_city,
            school: biography.school
        }
    }
}