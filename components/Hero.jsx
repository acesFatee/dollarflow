import { SignInButton, SignUpButton } from "@clerk/nextjs";
import React from "react";

export default function Hero() {
  return (
    <>
     <div className="container mx-auto p-5 grid grid-cols-2 gap-4 w-full">
     <span className="">
        <SignInButton />
      </span>

      <span className="">
        <SignUpButton />
      </span>
     </div>
    </>
  );
}
