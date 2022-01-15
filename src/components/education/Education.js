import React from "react";
import Degree from "./Degree";
import fce from "../../assets/fce.pdf";
import cae from "../../assets/cae.pdf";
import Boop from "../animations/Boop";

export default function Education() {
  return (
    <div className="flex flex-col space-y-10 px-10 md:px-20 lg:px-52 pt-10 space-y-5">
      <Boop scale={1.05}>
        <h1 className="text-gray-300 text-2xl font-bold italic mb-10 cursor-pointer hover:text-emerald-500">
          EDUCATION
        </h1>
      </Boop>
      <div
        className="flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-5"
        style={{ fontFamily: "Poppins" }}
      >
        <a href={fce} target="_blank">
          <Degree
            title="FIRST CERTIFICATE IN ENGLISH (FCE)"
            institution="British language school"
            year="2015"
            icon="file-contract"
          />
        </a>
        <a href={cae} target="_blank">
          <Degree
            title="CERTIFICATE IN ADVANCED ENGLISH (CAE)"
            institution="British language school"
            year="2017"
            icon="file-contract"
          />
        </a>
        <div className="md:hidden">
          <Degree
            title="SYSTEMS ENGINEERING (5TH YEAR)"
            institution="U.T.N Facultad regional San Francisco"
            year="2010 - Present"
            icon="graduation-cap"
          />
        </div>
      </div>

      <div
        className="hidden md:flex self-center"
        style={{ fontFamily: "Poppins" }}
      >
        <Degree
          title="SYSTEMS ENGINEERING (5TH YEAR)"
          institution="U.T.N Facultad regional San Francisco"
          year="2010 - Present"
          icon="graduation-cap"
        />
      </div>
    </div>
  );
}
