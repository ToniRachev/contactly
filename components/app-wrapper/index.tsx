import { createClient } from "@/lib/utils/supabase/server";
import { ReactNode } from "react";
import NonAuthenticatedWrapper from "./non-authenticated-wrapper";
import AuthenticatedWrapper from "./authenticated-wrapper";

const getUserAuth = async () => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}

export default async function AppWrapper({ children }: Readonly<{ children: ReactNode }>) {
    const user = await getUserAuth();

    if (!user) {
        return <NonAuthenticatedWrapper>{children}</NonAuthenticatedWrapper>
    }

    return <AuthenticatedWrapper userId={user.id}>{children}</AuthenticatedWrapper>
}