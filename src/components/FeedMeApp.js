import React from "react";
import Boop from "./animations/Boop";

export default function FeedMeApp() {
  return (
    <div className="flex flex-col space-y-10 px-10 md:px-20 lg:px-52 pt-10 space-y-5">
      <img
        src={require("../assets/fda/fdalogo.png")}
        className="self-center h-80"
      ></img>
      <Boop scale={1.05}>
        <a href={require("../assets/fda/fdahome.PNG")} target="_blank">
          <img
            src={require("../assets/fda/fdahome.PNG")}
            className="rounded-xl hover:scale-105 hover:cursor-pointer transition ease-in-out"
          />
        </a>
      </Boop>
      <div className="flex space-x-3">
        <a
          href={require("../assets/fda/fdacrud.PNG")}
          target="_blank"
          className="w-4/12"
        >
          <img
            src={require("../assets/fda/fdacrud.PNG")}
            className="rounded-xl hover:scale-105 hover:cursor-pointer transition ease-in-out"
          />
        </a>
        <a
          href={require("../assets/fda/fdalogin.PNG")}
          target="_blank"
          className="w-4/12"
        >
          <img
            src={require("../assets/fda/fdalogin.PNG")}
            className="rounded-xl hover:scale-105 hover:cursor-pointer transition ease-in-out"
          />
        </a>
        <a
          href={require("../assets/fda/fdaorders.PNG")}
          target="_blank"
          className="w-4/12"
        >
          <img
            src={require("../assets/fda/fdaorders.PNG")}
            className="rounded-xl h-full hover:scale-105 hover:cursor-pointer transition ease-in-out"
          />
        </a>
      </div>
      <p className="text-white" style={{ fontFamily: "Poppins" }}>
        Feed Me App was one of the first fully functional webpages I developed.
        It is a fast food restaurant administration app, made with .NET,
        Knockout.js and SQL technologies
      </p>
    </div>
  );
}
