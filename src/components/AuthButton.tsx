"use client";

import { Button } from "@nextui-org/react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { signIn } from "next-auth/react";

const AuthButton = () => {
  const { data: session } = useSession();

  return (
    <div className="flex items-center gap-2">
      {session && session.user ? (
        <>
          <Link
            href="/profile"
            className="font-bold underline underline-offset-2 decoration-2 hover:decoration-sky-500"
          >
            {session.user.name}
          </Link>
          <Button
            className="text-sky-500 hover:text-sky-600 transition-colors"
            onClick={() => signOut()}
          >
            SignOut
          </Button>
        </>
      ) : (
        <>
          <Button onClick={() => signIn()}>Sign In</Button>
          <Button as={Link} href="/auth/signup">
            Sign Up
          </Button>
        </>
      )}
    </div>
  );
};

export default AuthButton;
