import React from "react";
import Blob from "./Blob";
import Boop from "./animations/Boop";

export default function PersonalInfo() {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap"
        rel="stylesheet"
      ></link>

      <link
        href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300&display=swap"
        rel="stylesheet"
      ></link>

      <div className="flex flex-col items-center justify-end space-y-5">
        <div className="flex flex-col items-center space-y-2">
          <Boop rotation={-5} timing={200} scale={1.05}>
            <h1
              style={{ fontFamily: "Bebas Neue" }}
              className="tracking-wider text-7xl lg:text-4xl text-white hover:text-emerald-600 transition ease-in-out"
            >
              PABLO RAVIOLA
            </h1>
          </Boop>

          <h1
            className="text-xl lg:text-sm text-white italic"
            style={{ fontFamily: "Open Sans" }}
          >
            FULLSTACK WEB DEVELOPER
          </h1>

          <div className="flex text-white space-x-3 text-xl">
            <Boop rotation={20}>
              <a
                href="https://www.facebook.com/pablo.raviola/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-600 transition ease-in-out"
              >
                <i className="fab fa-facebook"></i>
              </a>
            </Boop>
            <Boop rotation={20}>
              <a
                href="https://www.instagram.com/pabloraviola/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-600 transition ease-in-out"
              >
                <i className="fab fa-instagram"></i>
              </a>
            </Boop>
            <Boop rotation={20}>
              <a
                href="https://www.linkedin.com/in/pablo-raviola-9a833b164/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-600 transition ease-in-out"
              >
                <i className="fab fa-linkedin"></i>
              </a>
            </Boop>
            <Boop rotation={20}>
              <a
                href="https://github.com/pabloraviola"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-600 transition ease-in-out"
              >
                <i className="fab fa-github"></i>
              </a>
            </Boop>
            <Boop rotation={20}>
              <a
                href="https://gitlab.com/pablo.raviola"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-600 transition ease-in-out"
              >
                <i className="fab fa-gitlab"></i>
              </a>
            </Boop>
          </div>
        </div>

        <div className="hidden lg:flex lg:flex-col lg:border-t-2 lg:p-4 lg:mt-3 lg:space-y-2">
          <div className="flex items-center text-white space-x-2">
            <i className="fas fa-envelope"></i>
            <p className="text-sm">pablo.raviola@gmail.com</p>
          </div>
          <div className="flex items-center text-white space-x-2">
            <i className="fas fa-birthday-cake"></i>
            <p className="text-sm">30/04/1992</p>
          </div>
          <div className="flex items-center text-white space-x-2">
            <i className="fas fa-phone"></i>
            <p className="text-sm">+54 3564561315</p>
          </div>
          <div className="flex items-center text-white space-x-2">
            <i className="fas fa-map-marker-alt"></i>
            <p className="text-sm">San francisco, CBA - ARG</p>
          </div>
        </div>
      </div>
    </>
  );
}
