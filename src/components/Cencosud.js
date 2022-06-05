import React from "react";
import { ReactComponent as Logo } from "../assets/cencosud/logo.png";

export default function Cencosud() {
  return (
    <div className="flex flex-col space-y-10 px-10 md:px-20 lg:px-52 pt-10 space-y-5">
      <img src={require("../assets/cencosud/logo.png")} className="mb-10" />
      <p className="text-white" style={{ fontFamily: "Poppins" }}>
        I worked as a full stack developer and technical leader of the Search
        and Recommendations team. In just a few months in this position, I got
        to learn a lot about search engines logical behaviour and helped me to
        grow professionally improving my skills in top notch technologies, such
        as Kubernettes, docker and AWS
      </p>
    </div>
  );
}
