// Portfolio projects shown after the experience timeline.
// Images and descriptions come from the old site components
// (src/components/Siblings.js, Greenqueen.js, FeedMeApp.js, Ceibo.js, Rentx.js, ChatApp.js)

import sibhome from "../../../../assets/siblings/sibhome.PNG";
import sibcontact from "../../../../assets/siblings/sibcontact.PNG";
import sibstore from "../../../../assets/siblings/sibstore.PNG";
import sibstoremens from "../../../../assets/siblings/sibstoremens.PNG";
import sibstorewomens from "../../../../assets/siblings/sibstorewomens.PNG";

import gqhome from "../../../../assets/greenqueen/gqhome.PNG";
import gqadmin from "../../../../assets/greenqueen/gqadmin.PNG";
import gqcategories from "../../../../assets/greenqueen/gqcategories.PNG";
import gqfeatures from "../../../../assets/greenqueen/gqfeatures.PNG";
import gqproducts from "../../../../assets/greenqueen/gqproducts.PNG";

import fdahome from "../../../../assets/fda/fdahome.PNG";
import fdacrud from "../../../../assets/fda/fdacrud.PNG";
import fdalogin from "../../../../assets/fda/fdalogin.PNG";
import fdaorders from "../../../../assets/fda/fdaorders.PNG";

import ceibologin from "../../../../assets/ceibo/ceibologin.PNG";

import rentxLogin from "../../../../assets/rentx/login.PNG";
import rentxHome from "../../../../assets/rentx/home.PNG";
import rentxHome2 from "../../../../assets/rentx/home2.PNG";
import rentxFeatures from "../../../../assets/rentx/features.PNG";
import rentxFeatures2 from "../../../../assets/rentx/features2.PNG";
import rentxProperties from "../../../../assets/rentx/properties.PNG";
import rentxRequest from "../../../../assets/rentx/request.PNG";
import rentxComplaints from "../../../../assets/rentx/complaints.PNG";
import rentxComplaints2 from "../../../../assets/rentx/complaints2.PNG";

import chatOnboarding from "../../../../assets/chatapp/chat-onboarding-screen.png";
import chatRoom1 from "../../../../assets/chatapp/chat-chatroom-1.png";
import chatRoom2 from "../../../../assets/chatapp/chat-chatroom-2.png";
import chatRoom3 from "../../../../assets/chatapp/chat-chatroom-3.png";

export const projects = [
  {
    id: "siblings",
    name: "SIBLINGS!",
    tagline: "CLOTHING BRAND E-COMMERCE",
    tech: ["Vue.js", "Vuetify", "Firebase"],
    mainImage: sibhome,
    images: [sibcontact, sibstore, sibstoremens, sibstorewomens],
    description:
      'After getting started on Vue Js frontend framework through some crash courses and bootcamps, I found it very interesting and decided to build a project from scratch. "Siblings" was a startup clothing brand I once had running with my brothers, and since we needed a webpage in order to promote and sell the products, I figured it was a good opportunity to get hands on what I\'d been learning. This is an only frontend project, I developed the web using Vue js and the Vuetify component library. The front makes direct queries to the firebase realtime database in order to hydrate the views and show the data to the users.',
  },
  {
    id: "greenqueen",
    name: "GREENQUEEN",
    tagline: "GROW STORE - FULLSTACK MERN",
    tech: ["React", "Node.js", "Express", "MongoDB"],
    mainImage: gqhome,
    images: [gqadmin, gqcategories, gqfeatures, gqproducts],
    description:
      'When I finished my "Siblings" Vue project, I decided to start digging on React, since it is known to be one of the most popular and powerful frontend frameworks/libraries out there. GreenQueen is a local grow store owned by a friend of mine, he didn\'t had a webpage for the business, so again, I figured that I could try and do something that could be useful while learning. This project was born as a frontend project, but turned out to be a fullstack MERN one, including user authentication for the web administration, as well as payment gateway to finish the purchases.',
  },
  {
    id: "feedme",
    name: "FEED ME APP",
    tagline: "RESTAURANT ADMINISTRATION",
    tech: [".NET", "Knockout.js", "SQL"],
    mainImage: fdahome,
    images: [fdacrud, fdalogin, fdaorders],
    description:
      "Feed Me App was one of the first fully functional webpages I developed. It is a fast food restaurant administration app, made with .NET, Knockout.js and SQL technologies.",
  },
  {
    id: "ceibo",
    name: "CEIBO",
    tagline: "SANCOR SEGUROS INSURANCE PLATFORM",
    tech: [".NET", "JavaScript", "SQL"],
    mainImage: ceibologin,
    images: [],
    description:
      'I got to work for several years in the maintenance and improvement of a Sancor Seguros web platform called "Ceibo". It is a huge project that is used mainly for insurance policies administration, among a great deal of other insurance agency related things. This project is built with .NET, Javascript and SQL technologies.',
  },
  {
    id: "rentx",
    name: "RENTX",
    tagline: "REAL ESTATE PLATFORM - FINAL PROJECT",
    tech: ["React", "Tailwind", "React Native", "Node.js"],
    mainImage: rentxLogin,
    images: [
      rentxHome,
      rentxHome2,
      rentxFeatures,
      rentxFeatures2,
      rentxProperties,
      rentxRequest,
      rentxComplaints,
      rentxComplaints2,
    ],
    description:
      "RentX is the project that got me my engineering degree. My college teammates and I built this web app for it to be presented as our Final Project (thesis). It is addressed to Real Estate agencies as well as to people looking for a place to rent (tenants). We learned a lot building it, not only about web development but also about mobile, since it has its own react-native App. It is made using React.js and Tailwind on the Web frontend side, React Native for the mobile App, and Node.js on the backend.",
  },
  {
    id: "chatapp",
    name: "CHAT APP",
    tagline: "BUN / REACT REALTIME CHAT",
    tech: ["Bun", "WebSockets", "React"],
    mainImage: chatOnboarding,
    images: [chatRoom1, chatRoom2, chatRoom3],
    description:
      "Small and simple chat app built with Bun WebSockets and React. Bun's native WebSocket server handles the realtime messaging between the connected clients, while the React frontend renders the chat rooms.",
    link: "https://bun.sh/docs/api/websockets",
  },
];
