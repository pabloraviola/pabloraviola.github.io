import React from "react";

export default function AboutMe() {
  return (
    <div className="px-10 md:px-20 lg:px-52 pt-10">
      <h1 className="text-gray-300 text-2xl font-bold italic">ABOUT ME</h1>

      <p
        className="text-gray-300 text-sm sm:text-base"
        style={{ fontFamily: "Poppins" }}
      >
        I'm a fullstack web developer and a systems engineering student from San
        Francisco, Córdoba - ARG. My main goal right now is to get my
        engineering degree, which will hopefully be next year. In the meantime,
        I'm building my career as a developer learning as much as I can about
        the new technologies that come across. I consider myself as a proactive
        person who's always willing to take new challenges in order to improve
        his skills. On my spare time, I like listening to music and playing
        drums, I also love travelling whenever I have the chance, whether it is
        going on a short trip or taking a journey abroad for a couple of months
      </p>
      <div className="lg:hidden flex flex-col md:flex-row md:justify-center border-t-2 p-4 mt-3 space-y-2 md:space-x-5">
        <div className="flex items-center text-white space-x-2">
          <i className="fas fa-envelope"></i>
          <p className="text-lg md:text-sm">pablo.raviola@gmail.com</p>
        </div>
        <div className="flex items-center text-white space-x-2">
          <i className="fas fa-birthday-cake"></i>
          <p className="text-lg md:text-sm">30/04/1992</p>
        </div>
        <div className="flex items-center text-white space-x-2">
          <i className="fas fa-phone"></i>
          <p className="text-lg md:text-sm">+54 3564561315</p>
        </div>
        <div className="flex items-center text-white space-x-2">
          <i className="fas fa-map-marker-alt"></i>
          <p className="text-lg md:text-sm">San francisco, CBA - ARG</p>
        </div>
      </div>
    </div>
  );
}
