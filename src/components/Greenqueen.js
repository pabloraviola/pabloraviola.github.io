import React from "react";
import { ReactComponent as Logo } from "../assets/greenqueen/gqlogo.svg";

export default function Greenqueen() {
  return (
    <div className="flex flex-col space-y-10 px-10 md:px-20 lg:px-52 pt-10 space-y-5">
      <Logo className="h-80 self-center fill-white" />
      <p className="text-white" style={{ fontFamily: "Poppins" }}>
        When I finished my "Siblings" Vue project, I decided to start digging on
        React, since it is known to be one of the most popular and powerful
        frontend frameworks/libraries out there. GreenQueen is a local grow
        store owned by a friend of mine, he didn't had a webpage for the
        bussiness, so again, I figured that I could try and do something that
        could be useful while learning. This project was born as a frontend
        project, but turned out to be a fullstack MERN one, including user
        authentication for the web administration, as well as payment gateway to
        finish the purchases
      </p>
      <a href={require("../assets/greenqueen/gqhome.PNG")} target="_blank">
        <img
          src={require("../assets/greenqueen/gqhome.PNG")}
          className="rounded-xl hover:scale-105 hover:cursor-pointer transition ease-in-out"
        />
      </a>
      <div className="flex space-x-3">
        <a
          href={require("../assets/greenqueen/gqadmin.PNG")}
          target="_blank"
          className="w-3/12"
        >
          <img
            src={require("../assets/greenqueen/gqadmin.PNG")}
            className="rounded-xl hover:scale-105 hover:cursor-pointer transition ease-in-out"
          />
        </a>
        <a
          href={require("../assets/greenqueen/gqcategories.PNG")}
          target="_blank"
          className="w-3/12"
        >
          <img
            src={require("../assets/greenqueen/gqcategories.PNG")}
            className="rounded-xl h-full hover:scale-105 hover:cursor-pointer transition ease-in-out"
          />
        </a>
        <a
          href={require("../assets/greenqueen/gqfeatures.PNG")}
          target="_blank"
          className="w-3/12"
        >
          <img
            src={require("../assets/greenqueen/gqfeatures.PNG")}
            className="rounded-xl h-full hover:scale-105 hover:cursor-pointer transition ease-in-out"
          />
        </a>
        <a
          href={require("../assets/greenqueen/gqproducts.PNG")}
          target="_blank"
          className="w-3/12"
        >
          <img
            src={require("../assets/greenqueen/gqproducts.PNG")}
            className="rounded-xl h-full hover:scale-105 hover:cursor-pointer transition ease-in-out"
          />
        </a>
      </div>
    </div>
  );
}
