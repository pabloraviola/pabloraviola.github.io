import React from "react";

export default function Job({ period, position, company }) {
  return (
    <div
      className="flex space-x-2 md:space-x-5 hover:scale-105 hover:cursor-pointer transition ease-in-out"
      style={{ fontFamily: "Poppins" }}
    >
      <p className="w-4/12 sm:w-3/12 text-gray-800 text-md md:text-xl font-bold">
        {period}
      </p>
      <div className="flex flex-col w-8/12 sm:w-9/12">
        <p className="text-gray-300 text-md md:text-xl font-bold italic">
          {position}
        </p>
        <p className="text-gray-300 text-md md:text-lg">{company}</p>
      </div>
    </div>
  );
}
