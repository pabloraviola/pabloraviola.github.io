import React from "react";
import { ReactComponent as Logo } from "../assets/whiteprompt/logo.svg";
import Boop from "./animations/Boop";

export default function WhitePrompt() {
  return (
    <div className="flex flex-col space-y-10 px-10 md:px-20 lg:px-52 pt-10 space-y-5">
      <Logo className="w-full" />
      <p style={{ fontFamily: "Poppins" }}>
        I am currently working as a Software Engineer in WhitePrompt, where I
        can contribute in a variaty of challenging projects that help me to
        improve my skills on a daily basis.
      </p>
      <p>Some of those projects are:</p>

      <div className="flex space-x-5">
        <Boop rotation={10}>
          <i
            className={`far fa-mobile text-2xl md:text-2xl text-cyan-500 mx-1 mt-1`}
          ></i>
        </Boop>
        <p>
          Social media mobile application built using React Native, NodeJs and
          PostgreSQL. This is a TikTok-like app where users can upload, like,
          comment and share videos, follow other users and see their feed, and
          more.
        </p>
      </div>
      <div className="flex space-x-5">
        <Boop rotation={10}>
          <i
            className={`far fa-gavel text-2xl md:text-2xl text-cyan-500 mt-1`}
          ></i>
        </Boop>
        <p>
          Online arbitration platform used to resolve legal disputes between 2
          parties. Before starting a legal process, a private arbitration is
          required - Every party is allowed to document their side of the story
          producing evidence, and later the arbitrator will decide who wins the
          dispute. All this is done asynchronously, through the platform. This
          is a full-stack project built using React, Next, NodeJs, Nest, GraphQL
          and MongoDB.
        </p>
      </div>
      <div className="flex space-x-5">
        <Boop rotation={10}>
          <i
            className={`far fa-graduation-cap text-2xl md:text-2xl text-cyan-500 mt-1`}
          ></i>
        </Boop>
        <p>
          American massive open e-learning platform that provides open online
          university-level courses in a wide range of disciplines to a worldwide
          student community. Technologies: React, Gatsby, GraphQL, NodeJs,
          Algolia, Contentful, Django.
        </p>
      </div>
    </div>
  );
}
