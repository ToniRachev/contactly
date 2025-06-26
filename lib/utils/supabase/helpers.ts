import { PostgrestBuilder } from '@supabase/postgrest-js'


export const baseFetcher = async <T>(query: PostgrestBuilder<any, false>): Promise<T> => {
    const { data, error } = await query;

    if (error) {
        console.error(error);
        throw error
    }

    return data;
}