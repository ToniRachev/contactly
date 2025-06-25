import { AuthDataType, UserDBType } from "@/lib/utils/supabase/types/user";

export const transformUserData = (authData: AuthDataType, userData: UserDBType[]) => {
    const user = userData[0];
    const biography = user.biography[0];

    return {
        id: authData.user.id,
        created_at: authData.user.created_at,
        email: authData.user.email,
        phone: authData.user.phone,
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