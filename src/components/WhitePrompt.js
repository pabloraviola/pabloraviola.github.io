import React from "react";
import { ReactComponent as Logo } from "../assets/whiteprompt/logo.svg";

export default function Cencosud() {
  return (
    <div className="flex flex-col space-y-10 px-10 md:px-20 lg:px-52 pt-10 space-y-5">
      <Logo className="w-full" />
      <p style={{ fontFamily: "Poppins" }}>
        I am currently working as a Software Engineer in WhitePrompt.
      </p>
    </div>
  );
}
