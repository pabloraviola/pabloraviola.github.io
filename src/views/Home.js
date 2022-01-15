import React from "react";
import PersonalInfo from "../components/PersonalInfo";
import Wave from "../components/Wave";
import Blob from "../components/Blob";
import AboutMe from "../components/AboutMe";
import Education from "../components/education/Education";
import Experience from "../components/experience/Experience";
import Siblings from "../components/Siblings";
import Greenqueen from "../components/Greenqueen";
import Ceibo from "../components/Ceibo";
import FeedMeApp from "../components/FeedMeApp";
import Rentx from "../components/Rentx";
import Cencosud from "../components/Cencosud";
import Picture from "../assets/desktop-profile.jpg";
import Boop from "../components/animations/Boop";
import { ReactComponent as Kubernettes } from "../assets/kubernettes-logo.svg";
import { ReactComponent as Tailwind } from "../assets/tailwind-logo.svg";

export default function Home() {
  return (
    <div className="overflow-x-hidden px-auto">
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins&display=swap"
        rel="stylesheet"
      ></link>

      <link
        rel="stylesheet"
        href="https://pro.fontawesome.com/releases/v5.10.0/css/all.css"
        integrity="sha384-AYmEC3Yw5cVb3ZcuHtOA93w35dYTsvhLPVnYs9eStHfGJvOvKxVfELGroGkvsg+p"
        crossOrigin="anonymous"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Yellowtail&display=swap"
        rel="stylesheet"
      />
      <div className="flex flex-col lg:flex-row">
        <div className="flex flex-col py-10 space-y-2 items-center lg:hidden h-96 bg-cover bg-[url('https://images.unsplash.com/photo-1547954575-855750c57bd3?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')]">
          <PersonalInfo />
          <img
            className="border-4 border-black relative top-10 rounded-full h-64 w-64"
            src={require("../assets/picture.jpeg")}
            alt="profile"
          />
        </div>

        <div className="hidden lg:block w-4/12"></div>
        <div
          className="hidden lg:block w-4/12 fixed bg-right bg-no-repeat bg-cover h-screen shadow-2xl hover:scale-105 transition ease-in-out"
          style={{
            backgroundImage: `url(${Picture})`,
          }}
        >
          <div
            className="flex flex-col rounded-full w-64 h-96 shadow-2xl bg-gradient-to-b from-zinc-900 to-zinc-600 justify-center relative z-10 hover:scale-105 hover:cursor-pointer transition ease-in-out"
            style={{ top: "20%", left: "75%" }}
          >
            <Boop scale={1.02}>
              <PersonalInfo />
            </Boop>
          </div>
          <Blob
            size="medium"
            color="#383231"
            opacity="0.4"
            class="left-1/2 top-32"
          />
        </div>
        <div className="w-full lg:w-8/12 h-full">
          <section className="pt-28 lg:pt-0 bg-gradient-to-b from-zinc-900 to-zinc-700">
            <AboutMe />
            <Wave fromColor="#3f3f46" toColor="#1f2937" />
          </section>
          <section className="bg-gradient-to-b  from-gray-800 to-gray-900">
            <Education />
            <Wave fromColor="#064e3b" toColor="#065f46" />
          </section>
          <section className="bg-gradient-to-b from-emerald-800 to-emerald-600">
            <Experience />
            <div className="flex w-full flex-col p-20 px-10 md:px-20 lg:px-52 space-y-5">
              <Boop scale={1.05}>
                <h1 className="text-gray-300 text-2xl mb-5 font-bold italic cursor-pointer hover:text-gray-800">
                  TECHNOLOGIES
                </h1>
              </Boop>
              <div className="flex self-center space-x-3 sm:space-x-8 text-4xl sm:text-7xl">
                <Boop scale={1.08} rotation={10} timing={200}>
                  <i className="fab fa-js-square text-yellow-500 cursor-pointer"></i>
                </Boop>
                <Boop scale={1.08} rotation={10} timing={200}>
                  <i className="fab fa-vuejs text-green-500 cursor-pointer"></i>
                </Boop>
                <Boop scale={1.08} rotation={10} timing={200}>
                  <i className="fab fa-react text-sky-500 cursor-pointer"></i>
                </Boop>
                <Boop scale={1.08} rotation={10} timing={200}>
                  <i className="fab fa-node-js text-green-600 cursor-pointer"></i>
                </Boop>
                <Boop scale={1.08} rotation={10} timing={200}>
                  <i className="fab fa-html5 text-orange-600 cursor-pointer"></i>
                </Boop>
                <Boop scale={1.08} rotation={10} timing={200}>
                  <i className="fab fa-css3-alt text-blue-600 cursor-pointer"></i>
                </Boop>
                <Boop scale={1.08} rotation={10} timing={200}>
                  <i className="fab fa-bootstrap text-violet-600 cursor-pointer"></i>
                </Boop>
              </div>
              <div className="flex self-center space-x-3 sm:space-x-8 text-4xl sm:text-7xl">
                <Boop scale={1.08} rotation={10} timing={200}>
                  <Tailwind className="cursor-pointer w-10 h-10 sm:w-20 sm:h-20" />
                </Boop>
                <Boop scale={1.08} rotation={10} timing={200}>
                  <i className="fab fa-aws text-amber-400 cursor-pointer"></i>
                </Boop>
                <Boop scale={1.08} rotation={10} timing={200}>
                  <i className="fab fa-docker text-blue-600 cursor-pointer"></i>
                </Boop>
                <Boop scale={1.08} rotation={10} timing={200}>
                  <Kubernettes className="cursor-pointer w-10 h-10 sm:w-20 sm:h-20" />
                </Boop>
              </div>
            </div>
            <Wave fromColor="#3f3f46" toColor="#18181b" />
          </section>
          <section className="bg-gradient-to-b from-zinc-900 to-zinc-700">
            <Siblings />
            <Wave fromColor="#16a34a" toColor="#166534" />
          </section>
          <section className="bg-gradient-to-b from-green-800 to-green-600">
            <Greenqueen />
            <Wave fromColor="#ef4444" toColor="#b91c1c" />
          </section>
          <section className="bg-gradient-to-b from-red-700 to-red-500">
            <FeedMeApp />
            <Wave fromColor="#f1f5f9" toColor="#94a3b8" />
          </section>
          <section className="bg-gradient-to-b from-slate-400 to-slate-500">
            <Ceibo />
            <Wave fromColor="#3b82f6" toColor="#2563eb" />
          </section>
          <section className="bg-gradient-to-b from-blue-600 to-blue-800">
            <Rentx />
            <Wave fromColor="#1e40af" toColor="#1e3a8a" />
          </section>
          <section className="bg-gradient-to-b from-blue-900 to-blue-600 pb-20">
            <Cencosud />
          </section>
        </div>
      </div>
    </div>
  );
}
