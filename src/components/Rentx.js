import React from "react";
import { ReactComponent as Logo } from "../assets/rentx/logo.svg";

export default function Rentx() {
  return (
    <div className="flex flex-col space-y-10 px-10 md:px-20 lg:px-52 pt-10 space-y-5">
      <Logo className="w-80 h-60 self-center" />
      <a href={require("../assets/rentx/login.PNG")} target="_blank">
        <img
          src={require("../assets/rentx/login.PNG")}
          className="rounded-xl hover:scale-105 hover:cursor-pointer transition ease-in-out"
        />
      </a>
      <div className="flex space-x-3">
        <a
          href={require("../assets/rentx/home.PNG")}
          target="_blank"
          className="w-3/12"
        >
          <img
            src={require("../assets/rentx/home.PNG")}
            className="rounded-xl hover:scale-105 hover:cursor-pointer transition ease-in-out"
          />
        </a>
        <a
          href={require("../assets/rentx/home2.PNG")}
          target="_blank"
          className="w-3/12"
        >
          <img
            src={require("../assets/rentx/home2.PNG")}
            className="rounded-xl hover:scale-105 hover:cursor-pointer transition ease-in-out"
          />
        </a>
        <a
          href={require("../assets/rentx/features.PNG")}
          target="_blank"
          className="w-3/12"
        >
          <img
            src={require("../assets/rentx/features.PNG")}
            className="rounded-xl h-full hover:scale-105 hover:cursor-pointer transition ease-in-out"
          />
        </a>
        <a
          href={require("../assets/rentx/features2.PNG")}
          target="_blank"
          className="w-3/12"
        >
          <img
            src={require("../assets/rentx/features2.PNG")}
            className="rounded-xl hover:scale-105 hover:cursor-pointer transition ease-in-out"
          />
        </a>
      </div>
      <div className="flex space-x-3">
        <a
          href={require("../assets/rentx/properties.PNG")}
          target="_blank"
          className="w-3/12"
        >
          <img
            src={require("../assets/rentx/properties.PNG")}
            className="rounded-xl hover:scale-105 hover:cursor-pointer transition ease-in-out"
          />
        </a>
        <a
          href={require("../assets/rentx/request.PNG")}
          target="_blank"
          className="w-3/12"
        >
          <img
            src={require("../assets/rentx/request.PNG")}
            className="rounded-xl hover:scale-105 hover:cursor-pointer transition ease-in-out"
          />
        </a>
        <a
          href={require("../assets/rentx/complaints.PNG")}
          target="_blank"
          className="w-3/12"
        >
          <img
            src={require("../assets/rentx/complaints.PNG")}
            className="rounded-xl h-full hover:scale-105 hover:cursor-pointer transition ease-in-out"
          />
        </a>
        <a
          href={require("../assets/rentx/complaints2.PNG")}
          target="_blank"
          className="w-3/12"
        >
          <img
            src={require("../assets/rentx/complaints2.PNG")}
            className="rounded-xl hover:scale-105 hover:cursor-pointer transition ease-in-out"
          />
        </a>
      </div>
      <p className="text-white" style={{ fontFamily: "Poppins" }}>
        RentX is the project that will eventually get me my engineering degree.
        My college teammates and I are currently building this web app for it to
        be presented as our Final Project (thesis). It is addressed to Real
        Estate agencies as well as to people looking for a place to rent
        (tenants). We are learning a lot while building it, not only about web
        development but also about mobile, since it will have its own
        react-native App. It is made using React.js and Tailwind on the Web
        frontend side, React Native for the mobile App, and Node.js on the
        backend.
      </p>
    </div>
  );
}
