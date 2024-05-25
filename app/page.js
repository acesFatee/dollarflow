import Authorization from "@/components/Authorization";
import { SignOutButton, UserButton } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import Image from "next/image";

export default async function Home() {
  const { userId } = auth();

  if (userId) {
    // Query DB for user specific information or display assets only to signed in users
  }

  // Get the Backend API User object when you need access to the user's information
  const user = await currentUser();

  return <>{user ? <div>
    <UserButton />
    <div className="sign-out-button">
    <button className="bg-red-500 hover:bg-red-600 text-white p-2 m-2 rounded-xl">
      <SignOutButton />
    </button>
    </div>
  </div> : <Authorization />}</>;
}
