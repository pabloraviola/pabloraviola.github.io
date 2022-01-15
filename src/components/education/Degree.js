import React from "react";
import Boop from "../animations/Boop";

export default function Degree({ title, institution, year, icon }) {
  return (
    <Boop scale={1.08}>
      <div className="flex space-x-5 items-center">
        <Boop rotation={10}>
          <i
            className={`fas fa-${icon} text-3xl md:text-5xl text-emerald-600`}
          ></i>
        </Boop>
        <div className="flex flex-col text-gray-300">
          <h1 className="text-sm md:text-lg font-bold italic">{title}</h1>
          <p className="text-sm md:text-lg">{institution}</p>
          <p className="text-sm md:text-lg">{year}</p>
        </div>
      </div>
    </Boop>
  );
}
