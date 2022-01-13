import React from "react";
import { ReactComponent as Logo } from "../assets/cencosud/logo.png";

export default function Cencosud() {
  return (
    <div className="flex flex-col space-y-10 px-10 md:px-20 lg:px-52 pt-10 space-y-5">
      <img src={require("../assets/cencosud/logo.png")} className="mb-10" />
      <p className="text-white" style={{ fontFamily: "Poppins" }}>
        I am currently working as a fullstack web developer in Cencosud, leading
        the Search and Recommendations team. In just a few months in this
        position, I got to learn a lot about search engines logical behaviour,
        and I'm really excited to grow professionally in that area. We work with
        top notch technologies on a daily basis, such as Kubernettes, docker and
        AWS
      </p>
    </div>
  );
}
