import React from "react";
import { ReactComponent as Lightning } from "../assets/siblings/lightning.svg";

export default function Siblings() {
  return (
    <div className="flex flex-col space-y-10 px-10 md:px-20 lg:px-52 pt-10 space-y-5">
      <h1 className="text-gray-300 text-2xl mb-5 font-bold italic">
        PORTFOLIO
      </h1>
      <div
        className="text-white text-center tracking-wide text-7xl -rotate-6"
        style={{ fontFamily: "Yellowtail" }}
      >
        Siblings!
      </div>
      <Lightning className="w-8/12 sm:w-5/12 2xl:w-4/12 self-center relative bottom-4 -rotate-3" />
      <a href={require("../assets/siblings/sibhome.PNG")} target="_blank">
        <img
          src={require("../assets/siblings/sibhome.PNG")}
          className="rounded-xl hover:scale-105 hover:cursor-pointer transition ease-in-out"
        />
      </a>
      <div className="flex space-x-3">
        <a
          href={require("../assets/siblings/sibcontact.PNG")}
          target="_blank"
          className="w-3/12"
        >
          <img
            src={require("../assets/siblings/sibcontact.PNG")}
            className="rounded-xl hover:scale-105 hover:cursor-pointer transition ease-in-out"
          />
        </a>
        <a
          href={require("../assets/siblings/sibstore.PNG")}
          target="_blank"
          className="w-3/12"
        >
          <img
            src={require("../assets/siblings/sibstore.PNG")}
            className="rounded-xl hover:scale-105 hover:cursor-pointer transition ease-in-out"
          />
        </a>
        <a
          href={require("../assets/siblings/sibstoremens.PNG")}
          target="_blank"
          className="w-3/12"
        >
          <img
            src={require("../assets/siblings/sibstoremens.PNG")}
            className="rounded-xl h-full hover:scale-105 hover:cursor-pointer transition ease-in-out"
          />
        </a>
        <a
          href={require("../assets/siblings/sibstorewomens.PNG")}
          target="_blank"
          className="w-3/12"
        >
          <img
            src={require("../assets/siblings/sibstorewomens.PNG")}
            className="rounded-xl hover:scale-105 hover:cursor-pointer transition ease-in-out"
          />
        </a>
      </div>
      <p className="text-white" style={{ fontFamily: "Poppins" }}>
        After getting started on Vue Js frontend framework through some crash
        courses and bootcamps, I found it very interesting and decided to build
        a project from scratch. "Siblings" was a startup clothing brand I once
        had running with my brothers, and since we needed a webpage in order to
        promote and sell the products, I figured it was a good opportunity to
        get hands on what I'd been learning. This is an only frontend project, I
        developed the web using Vue js and the Vuetify component library. The
        front makes direct queries to the firebase realtime database in order to
        hydrate the views and show the data to the users.
      </p>
    </div>
  );
}
