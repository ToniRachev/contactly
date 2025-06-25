import { login, signout } from "@/lib/utils/supabase/actions/auth";

export default async function Home() {
  return (
    <div className="flex justify-between p-4">
      <h1>Home Page</h1>

      <form>
        <button formAction={signout}>Signout</button>
      </form>
    </div>
  )
}
