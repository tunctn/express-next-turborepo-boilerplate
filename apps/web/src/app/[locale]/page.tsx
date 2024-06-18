import Link from "next/link";

export default async function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div>
        {/* {!isLoggedIn && ( */}
        <>
          <Link href="/auth/login">Log In</Link>
          <Link href="/auth/signup">Sign Up</Link>
        </>
        {/* )} */}
      </div>
    </main>
  );
}
