import React from "react";
import { ReactComponent as Logo } from "../assets/rentx/logo.svg";
import Boop from "./animations/Boop";

export default function Rentx() {
  return (
    <div className="flex flex-col space-y-10 px-10 md:px-20 lg:px-52 pt-10 space-y-5">
      <div className="w-80 h-52 self-center">
        <p className="text-6xl text-white font-bold italic text-center">
          Bun / React Chat App
        </p>
      </div>
      <p className="text-white" style={{ fontFamily: "Poppins" }}>
        Small and simple chat app built with{" "}
        <a
          href="https://bun.sh/docs/api/websockets"
          target="_blank"
          className="italic underline"
        >
          Bun WebSockets
        </a>{" "}
        and React.
      </p>
      <Boop scale={1.05}>
        <a
          href={require("../assets/chatapp/chat-onboarding-screen.png")}
          target="_blank"
        >
          <img
            src={require("../assets/chatapp/chat-onboarding-screen.png")}
            className="rounded-xl hover:scale-105 hover:cursor-pointer transition ease-in-out"
          />
        </a>
      </Boop>
      <div className="flex space-x-3">
        <a
          href={require("../assets/chatapp/chat-chatroom-1.png")}
          target="_blank"
          className="w-4/12"
        >
          <img
            src={require("../assets/chatapp/chat-chatroom-1.png")}
            className="rounded-xl hover:scale-105 hover:cursor-pointer transition ease-in-out"
          />
        </a>
        <a
          href={require("../assets/chatapp/chat-chatroom-2.png")}
          target="_blank"
          className="w-4/12"
        >
          <img
            src={require("../assets/chatapp/chat-chatroom-2.png")}
            className="rounded-xl hover:scale-105 hover:cursor-pointer transition ease-in-out"
          />
        </a>
        <a
          href={require("../assets/chatapp/chat-chatroom-3.png")}
          target="_blank"
          className="w-4/12"
        >
          <img
            src={require("../assets/chatapp/chat-chatroom-3.png")}
            className="rounded-xl hover:scale-105 hover:cursor-pointer transition ease-in-out"
          />
        </a>
      </div>
    </div>
  );
}
