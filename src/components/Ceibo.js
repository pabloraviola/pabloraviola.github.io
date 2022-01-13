import React from "react";

export default function Ceibo() {
  return (
    <div className="flex flex-col space-y-10 px-10 md:px-20 lg:px-52 pt-10 space-y-5">
      <img
        src={require("../assets/ceibo/sslogo.png")}
        className="self-center"
      ></img>
      <p className="text-white" style={{ fontFamily: "Poppins" }}>
        I got to work for several years in the maintenance and improvement of a
        Sancor Seguros web platform called "Ceibo". It is a huge project that is
        used mainly for insurance policies administration, among a great deal of
        other insurance agency related things. This project is built with .NET,
        Javascript and SQL technologies
      </p>
      <a href={require("../assets/ceibo/ceibologin.PNG")} target="_blank">
        <img
          src={require("../assets/ceibo/ceibologin.PNG")}
          className="rounded-xl hover:scale-105 hover:cursor-pointer transition ease-in-out"
        />
      </a>
    </div>
  );
}
