import React from "react";
import Job from "./Job";
import Boop from "../animations/Boop";

export default function Experience() {
  return (
    <div className="flex flex-col px-10 md:px-20 lg:px-52 space-y-5">
      <Boop scale={1.05}>
        <h1 className="text-gray-300 text-2xl mb-5 font-bold italic cursor-pointer hover:text-gray-800">
          EXPERIENCE
        </h1>
      </Boop>
      <Job
        period="[2012-2017]"
        position="CHIEF OF PRODUCTION"
        company="PIONERA S.A"
      />
      <Job
        period="[2017-2018]"
        position="WORK AND TRAVEL USA (KEYSTONE, COLORADO)"
        company="VAIL RESORTS"
      />
      <Job
        period="[2019-2021]"
        position="FULLSTACK WEB DEVELOPER"
        company="E-PARTNERS S.R.L"
      />
      <Job
        period="[2021-NOW]"
        position="FULLSTACK WEB DEVELOPER"
        company="SIMTLIX S.R.L"
      />
    </div>
  );
}
